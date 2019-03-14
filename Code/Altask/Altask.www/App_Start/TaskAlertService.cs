using System;
using System.Data.Entity;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading;
using System.Transactions;
using Altask.Data.Model;
using Altask.www.Models;
using Altask.www.Properties;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;

namespace Altask.www {
    public enum TaskAlertLogType {
        SendEmailSuccess,
        SendEmailFailure,
        SendSmsSuccess,
        SendSmsFailure
    }

    [ServiceDescription("Altask Task Alert Service")]
    public class TaskAlertService : Service<TaskAlertService>, IService {
        private EmailService _emailService;
        private List<Task> _tasks;
        private List<Asset> _assets;
        private List<User> _users;
        private List<TaskInstance> _instances = new List<TaskInstance>();
        private int _lastCount = 0;
        private DateTime _lastDate = DateTime.Now;

        public void Run() {
            while (!Terminated) {
                _lastRun = DateTime.Now;

                if (!Settings.TaskAlertServiceActive) {
                    Thread.Sleep(5000);
                    continue;
                }

                try {
                    using (_context = new ApplicationDbContext("TaskAlertService")) {
                        var settings = _context.Settings.Where(s => s.Area == "System" && s.Classification == "Email").ToList();
                        _emailService = new EmailService(settings.Single(s => s.Name == "SmtpAddress").Value,
                            int.Parse(settings.Single(s => s.Name == "SmtpPort").Value),
                            settings.Single(s => s.Name == "UserName").Value,
                            settings.Single(s => s.Name == "Password").Value);

                        var count = 0;

                        using (var command = new SqlCommand("[dbo].[GetTaskAlertCount]", _context.Database.Connection as SqlConnection)) {
                            bool closeConnection = false;

                            if (command.Connection.State != ConnectionState.Open) {
                                command.Connection.Open();
                                closeConnection = true;
                            }

                            command.CommandTimeout = 300;
                            command.CommandType = System.Data.CommandType.StoredProcedure;
                            command.Parameters.Add(new SqlParameter("@LastDate", _lastDate));
                            command.Parameters.Add(new SqlParameter("@OffsetPast", Settings.TaskAlertServiceOffsetPast));
                            command.Parameters.Add(new SqlParameter("@OffsetFuture", Settings.TaskAlertServiceOffsetFuture));
                            count = Convert.ToInt32(command.ExecuteScalar());

                            if (closeConnection) {
                                command.Connection.Close();
                            }
                        }

                        if (count != _lastCount) {
                            _lastCount = count;
                            _lastDate = DateTime.Now;
                            _instances.Clear();
                            _tasks = _context.Tasks.AsNoTracking().Where(t => t.Alerts.Any(ta => ta.Active))
                                 .Include(e => e.Alerts)
                                 .Include(e => e.Schedules)
                                 .ToList();
                            _assets = _context.Assets.AsNoTracking().ToList();
                            _users = _context.Users.AsNoTracking().ToList();

                            foreach (var task in _tasks) {
                                foreach (var schedule in task.Schedules) {
                                    var dtoSchedule = schedule.ToDto();
                                    var dates = dtoSchedule.GetRunDates(DateTime.Now.AddDays(Settings.TaskAlertServiceOffsetPast), DateTime.Now.AddDays(Settings.TaskAlertServiceOffsetFuture));

                                    foreach (var date in dates) {
                                        if (dtoSchedule.Assets.Count > 0) {
                                            foreach (var asset in dtoSchedule.Assets) {
                                                if (dtoSchedule.Users.Count > 0) {
                                                    foreach (var user in dtoSchedule.Users) {
                                                        var instance = TaskInstance.FromSchedule(task, date, schedule);
                                                        var occurrence = _context.Occurrences.AsNoTracking().SingleOrDefault(o => o.ScheduleId == schedule.Id && o.AssetId == asset.AssetId && o.UserId == user.Id && o.Date == date);

                                                        if (occurrence != null) {
                                                            instance.MergeOccurrence(occurrence);
                                                        }
                                                        else {
                                                            instance.AssetId = asset.AssetId;
                                                            instance.Asset = asset.Asset;
                                                            instance.UserId = user.UserId;
                                                            instance.User = user.User;
                                                        }

                                                        _instances.Add(instance);
                                                    }
                                                }
                                                else {
                                                    var instance = TaskInstance.FromSchedule(task, date, schedule);
                                                    var occurrence = _context.Occurrences.AsNoTracking().SingleOrDefault(o => o.ScheduleId == schedule.Id && o.AssetId == asset.AssetId && o.Date == date);

                                                    if (occurrence != null) {
                                                        instance.MergeOccurrence(occurrence);
                                                    }
                                                    else {
                                                        instance.AssetId = asset.AssetId;
                                                        instance.Asset = asset.Asset;
                                                    }

                                                    _instances.Add(instance);
                                                }
                                            }
                                        }
                                        else {
                                            foreach (var user in dtoSchedule.Users) {
                                                var instance = TaskInstance.FromSchedule(task, date, schedule);
                                                var occurrence = _context.Occurrences.AsNoTracking().SingleOrDefault(o => o.ScheduleId == schedule.Id && o.UserId == user.UserId && o.Date == date);

                                                if (occurrence != null) {
                                                    instance.MergeOccurrence(occurrence);
                                                }
                                                else {
                                                    instance.UserId = user.UserId;
                                                    instance.User = user.User;
                                                }

                                                _instances.Add(instance);
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        foreach (var instance in _instances) {
                            var task = _tasks.FirstOrDefault(t => t.Id == instance.TaskId);
                            SendAlerts(instance, task.Alerts.ToArray());
                        }
                    }

                    if (Settings.TaskAlertServiceThrottle > 0) {
                        Thread.Sleep(1000 * Settings.TaskAlertServiceThrottle);
                    }
                }
                catch (Exception ex) {
                    EventLog.WriteEntry(Settings.EventLogSource, string.Format("The Task Alert Service encountered the following error: {0}\n\n{1}", ex.Message, ex.StackTrace), EventLogEntryType.Error);
                    _errorCount++;

                    if (_errorCount == 100) {
                        EventLog.WriteEntry(Settings.EventLogSource, "The Task Alert Service has encountered too many errors in succession.  It will be automatically shut down.", EventLogEntryType.Warning);
                        Terminated = true;
                        _errorCount = 0;
                    }
                }
            }
        }

        private bool DoesAlertExist(long taskAlertId, int userId, DateTime date, TaskAlertLogType type) {
            var exist = false;

            using (var command = new SqlCommand("SELECT [dbo].[DoesTaskAlertExist](@TaskAlertId, @UserId, @Date, @Type)", _context.Database.Connection as SqlConnection)) {
                bool closeConnection = false;

                if (command.Connection.State != ConnectionState.Open) {
                    command.Connection.Open();
                    closeConnection = true;
                }

                command.Parameters.Add(new SqlParameter("@TaskAlertId", taskAlertId));
                command.Parameters.Add(new SqlParameter("@UserId", userId));
                command.Parameters.Add(new SqlParameter("@Date", date));
                command.Parameters.Add(new SqlParameter("@Type", type.ToString()));
                exist = Convert.ToBoolean(command.ExecuteScalar());

                if (closeConnection) {
                    command.Connection.Close();
                }
            }

            return exist;
        }

        /// <summary>
        /// Validates the specified <see cref="Altask.Data.Dto.TaskAlert"/> collection against the given <see cref="Altask.www.Models.TaskInstance"/>
        /// determining if the alert should be sent and if so what the alert message will contain.
        /// </summary>
        /// <param name="instance"></param>
        /// <param name="alerts"></param>
        private void SendAlerts(TaskInstance instance, params TaskAlert[] alerts) {
            foreach (var alert in alerts) {
                var timeN = 60;

                switch (alert.TimeUnit) {
                    case "Hours(s)":
                        timeN = 60 * 60;
                        break;
                    case "Day(s)":
                        timeN = 60 * 60 * 24;
                        break;
                    case "Week(s)":
                        timeN = 60 * 60 * 24 * 7;
                        break;
                }

                if (alert.TimeN.HasValue && alert.TimeN > 0) {
                    timeN = timeN * alert.TimeN.Value;
                }
                else {
                    timeN = 0;
                }

                if (alert.When == "BeforeDueDate") {
                    timeN = -timeN;

                }

                var date = instance.Date.AddSeconds((double)timeN);

                if (date < alert.CreatedOn.ToLocalTime()) {
                    continue;
                }

                SendAlert(alert, date, instance.AssetId, instance.UserId);
            }
        }

        /// <summary>
        /// Sends email and SMS alerts to all of the <see cref="Altask.Data.Dto.User"/>'s associated with the <see cref="Altask.Data.Dto.TaskAlert"/>. 
        /// </summary>
        /// <param name="type"></param>
        /// <param name="alert"></param>
        /// <param name="date"></param>
        /// <param name="assetId">If present the <see cref="Altask.Data.Dto.Asset"/> the <see cref="Altask.Data.Dto.TaskAlert"/> pertains to.</param>
        /// <param name="userId">If present the <see cref="Altask.Data.Dto.User"/> the <see cref="Altask.Data.Dto.TaskAlert"/> pertains to.</param>
        private void SendAlert(TaskAlert alert, DateTime date, int? assetId, int? userId) {
            var task = _tasks.FirstOrDefault(t => t.Id == alert.TaskId);

            foreach (var user in alert.Users) {
                StringBuilder message = new StringBuilder(task.Name);
                message.Append(" ");

                if (alert.When == "AfterDueDate") {
                    message.AppendFormat(" due on {0} ", date.ToString("MM/dd/yyyy hh:mm tt"));

                    if (assetId.HasValue) {
                        var asset = _assets.FirstOrDefault(a => a.Id == assetId);

                        if (asset != null) {
                            message.AppendFormat("for {0} ", asset.Name);

                            if (!string.IsNullOrEmpty(asset.CustomId)) {
                                message.AppendFormat("- {0} ", asset.CustomId);
                            }
                        }
                    }

                    if (userId != null && userId != user.Id) {
                        var assignee = _users.FirstOrDefault(u => u.Id == userId);

                        if (assignee != null) {
                            message.AppendFormat("assigned to {0} ", assignee.FullName ?? assignee.UserName);
                        }
                    }

                    message.AppendFormat("is {0} {1} overdue!", alert.TimeN, alert.TimeUnit);
                }
                else {
                    message.AppendFormat("is due in {0} {1}.", alert.TimeN, alert.TimeUnit);
                }

                if (date <= DateTime.Now) {
                    if (user.User.ReceiveEmail && !DoesAlertExist(alert.Id, user.UserId, date, TaskAlertLogType.SendEmailSuccess)) {
                        var result = _emailService.Send(Settings.AlertEmailFrom, user.User.EmailAddress, Settings.AlertEmailSubject, message.ToString());

                        _context.TaskAlertLogs.Add(new TaskAlertLog() {
                            AlertDate = date,
                            Description = message.ToString(),
                            TaskAlertId = alert.Id,
                            Type = (result.Succeeded ? TaskAlertLogType.SendEmailSuccess : TaskAlertLogType.SendEmailFailure).ToString(),
                            UserId = user.UserId
                        });

                        _context.SaveChanges();
                    }

                    if (user.User.ReceiveText && !DoesAlertExist(alert.Id, user.UserId, date, TaskAlertLogType.SendSmsSuccess)) {
                        var result = _emailService.Send(Settings.AlertEmailFrom, user.User.SmsAddress, Settings.AlertEmailSubject, message.ToString());

                        _context.TaskAlertLogs.Add(new TaskAlertLog() {
                            AlertDate = date,
                            Description = message.ToString(),
                            TaskAlertId = alert.Id,
                            Type = (result.Succeeded ? TaskAlertLogType.SendSmsSuccess : TaskAlertLogType.SendSmsFailure).ToString(),
                            UserId = user.UserId
                        });

                        _context.SaveChanges();
                    }
                }
            }
        }
    }
}
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Transactions;
using Altask.Data;
using Altask.Data.Model;
using Altask.www.Models;
using Altask.www.Properties;
using System.Data.SqlClient;
using System.Data;

namespace Altask.www {
    [ServiceDescription("Altask Occurrence Service")]
    public class OccurrenceService : Service<OccurrenceService>, IService {
        private DateTime _lastDate = DateTime.Now;

        public void Run() {
            while (!Terminated) {
                _lastRun = DateTime.Now;

                if (!Settings.OccurrenceServiceActive) {
                    Thread.Sleep(5000);
                    continue;
                }

                try {
                    var instances = new List<TaskInstance>();

                    using (var _context = new ApplicationDbContext("OccurrenceService")) {

                        // Joe - Removing "count" check since it's not a very accurate way to determine
                        // if work needs to be done.
                        //using (var command = new SqlCommand("[dbo].[GetTaskOccurrenceCount]", _context.Database.Connection as SqlConnection)) {
                        //    bool closeConnection = false;

                        //    if (command.Connection.State != ConnectionState.Open) {
                        //        command.Connection.Open();
                        //        closeConnection = true;
                        //    }

                        //    command.CommandTimeout = 300;
                        //    command.CommandType = System.Data.CommandType.StoredProcedure;
                        //    command.Parameters.Add(new SqlParameter("@LastDate", _lastDate));
                        //    var count = Convert.ToInt32(command.ExecuteScalar());

                        //    if (closeConnection) {
                        //        command.Connection.Close();
                        //    }
                        //}

                        // Removing _tasks cache since it held a reference to (and mght have used) a dbcontext which was disposed.
                        var tasks = _context.Tasks.AsNoTracking().Where(t => t.Schedules.Any(s => s.Active))
                            .Include(e => e.Alerts)
                            .Include(e => e.Schedules)
                            .ToList();

                        foreach (var task in tasks) {
                            if (task.Id == 20097)
                            {
                                var s = "";
                                Debug.Print(s);
                            }

                            if (!task.Active) {
                                continue;
                            }

                            foreach (var schedule in task.Schedules) {
                                if (!schedule.Active) {
                                    continue;
                                }

                                var dtoSchedule = schedule.ToDto();
                                var dates = dtoSchedule.GetRunDates(DateTime.Now.AddDays(Settings.OccurrenceServiceOffset), DateTime.Now);

                                foreach (var date in dates) {
                                    if (dtoSchedule.Assets.Count > 0) {
                                        foreach (var asset in dtoSchedule.Assets) {
                                            if (dtoSchedule.Users.Count > 0) {
                                                foreach (var user in dtoSchedule.Users) {
                                                    var instance = TaskInstance.FromSchedule(task, date, schedule);

                                                    if (!DoesOccurrenceExist(schedule.Id, asset.AssetId, user.UserId, date)) {
                                                        instance.AssetId = asset.AssetId;
                                                        instance.Asset = asset.Asset;
                                                        instance.UserId = user.UserId;
                                                        instance.User = user.User;
                                                        instances.Add(instance);
                                                    }
                                                }
                                            }
                                            else {
                                                var instance = TaskInstance.FromSchedule(task, date, schedule);

                                                if (!DoesOccurrenceExist(schedule.Id, asset.AssetId, null, date)) {
                                                    instance.AssetId = asset.AssetId;
                                                    instance.Asset = asset.Asset;
                                                    instances.Add(instance);
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        foreach (var user in dtoSchedule.Users) {
                                            var instance = TaskInstance.FromSchedule(task, date, schedule);

                                            if (!DoesOccurrenceExist(schedule.Id, null, user.UserId, date)) {
                                                instance.UserId = user.UserId;
                                                instance.User = user.User;
                                                instances.Add(instance);
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        foreach (var instance in instances) {
                            CreateOccurrence(instance);
                        }

                        _errorCount = 0;

                        if (Settings.OccurrenceServiceThrottle > 0) {
                            Thread.Sleep(1000 * Settings.OccurrenceServiceThrottle);
                        }
                    }
                }
                catch (ThreadAbortException)
                {
                    Run();
                }
                catch (ObjectDisposedException) {
                    _errorCount++;

                    if (_errorCount == 100) {
                        throw;
                    }
                    else {
                        Run();
                    }
                }
                catch (Exception ex) {
                    EventLog.WriteEntry(Settings.EventLogSource, string.Format("The Occurrence Service encountered the following error: {0}\n\n{1}", ex.Message, ex.StackTrace), EventLogEntryType.Error);
                    _errorCount++;

                    if (_errorCount == 100) {
                        EventLog.WriteEntry(Settings.EventLogSource, "The Occurrence Service has encountered too many errors in succession.  It will be automatically shut down.", EventLogEntryType.Warning);
                        Terminated = true;
                        _errorCount = 0;
                    }
                }
            }
        }

        private EntityResult CreateOccurrence(TaskInstance instance) {
            Data.Model.Occurrence occurrence = new Occurrence() {
                AsEarlyAsDate = instance.AsEarlyAsDate,
                AssetId = instance.AssetId,
                Date = instance.Date,
                FormModel = instance.FormModel,
                ScheduleId = instance.ScheduleId,
                TaskId = instance.TaskId,
                UserId = instance.UserId,
                TimeSpent = 0
            };

            occurrence.Logs.Add(new OccurrenceLog() { Type = "Created" });
            _context.Occurrences.Add(occurrence);
            var result = _context.SaveChanges();

            if (!result.Succeeded) {
                _context.Entry(occurrence).Reference(o => o.Asset).Load();
                _context.Entry(occurrence).Reference(o => o.User).Load();
                SignalRHub.NotifyOccurrenceCreate(null, occurrence.ToDto());
                return EntityResult.Failed(result.Errors.ToArray());
            }

            return EntityResult.Succeded(1);
        }

        private bool DoesOccurrenceExist(long scheduleId, int? assetId, int? userId, DateTime date) {
            var exist = false;

            using (var command = new SqlCommand("SELECT [dbo].[DoesOccurrenceExist](@ScheduleId, @AssetId, @UserId, @Date)", _context.Database.Connection as SqlConnection)) {
                bool closeConnection = false;

                if (command.Connection.State != ConnectionState.Open) {
                    command.Connection.Open();
                    closeConnection = true;
                }

                command.Parameters.AddWithValue("@ScheduleId", scheduleId);

                if (assetId.HasValue) {
                    command.Parameters.AddWithValue("@AssetId", assetId.Value);
                }
                else {
                    command.Parameters.AddWithValue("@AssetId", DBNull.Value);
                }

                if (userId.HasValue) {
                    command.Parameters.AddWithValue("@UserId", userId.Value);
                }
                else {
                    command.Parameters.AddWithValue("@UserId", DBNull.Value);
                }

                command.Parameters.Add(new SqlParameter("@Date", date));
                exist = Convert.ToBoolean(command.ExecuteScalar());

                if (closeConnection) {
                    command.Connection.Close();
                }
            }

            return exist;
        }
    }
}
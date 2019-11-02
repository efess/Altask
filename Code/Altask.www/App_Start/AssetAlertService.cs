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

namespace Altask.www {
    public enum AssetAlertLogType {
        SendEmailSuccess,
        SendEmailFailure,
        SendSmsSuccess,
        SendSmsFailure,
        System
    }

    [ServiceDescription("Altask Asset Alert Service")]
    public class AssetAlertService : Service<AssetAlertService>, IService {
        private EmailService _emailService;

        public void Run() {
            while (!Terminated) {
                _lastRun = DateTime.Now;

                if (!Settings.AssetAlertServiceActive) {
                    Thread.Sleep(5000);
                    continue;
                }

                try {
                    using (_context = new ApplicationDbContext("AssetAlertService")) {
                        var settings = _context.Settings.Where(s => s.Area == "System" && s.Classification == "Email").ToList();
                        _emailService = new EmailService(settings.Single(s => s.Name == "SmtpAddress").Value,
                            int.Parse(settings.Single(s => s.Name == "SmtpPort").Value),
                            settings.Single(s => s.Name == "UserName").Value,
                            settings.Single(s => s.Name == "Password").Value);

                        var assetAlertLogs = _context.AssetAlertLogs.AsNoTracking().Where(aal => aal.Type == AssetAlertLogType.SendEmailFailure.ToString() || aal.Type == AssetAlertLogType.SendSmsFailure.ToString()).ToList();

                        foreach (var assetAlertLog in assetAlertLogs) {
                            var message = assetAlertLog.Description;

                            if (!string.IsNullOrEmpty(assetAlertLog.Comment)) {
                                message += string.Format("  Comment(s): {0}", assetAlertLog.Comment);
                            }

                            if (assetAlertLog.Type == AssetAlertLogType.SendEmailFailure.ToString()) {
                                var result = _emailService.Send(Settings.AlertEmailFrom, assetAlertLog.User.EmailAddress, Settings.AlertEmailSubject, message);

                                if (result.Succeeded) {
                                    assetAlertLog.Type = AssetAlertLogType.SendEmailSuccess.ToString();
                                    _context.Entry(assetAlertLog).State = EntityState.Modified;
                                    _context.SaveChanges();
                                }
                            }

                            if (assetAlertLog.Type == AssetAlertLogType.SendSmsFailure.ToString()) {
                                var result = _emailService.Send(Settings.AlertEmailFrom, assetAlertLog.User.SmsAddress, Settings.AlertEmailSubject, message);

                                if (result.Succeeded) {
                                    assetAlertLog.Type = AssetAlertLogType.SendSmsSuccess.ToString();
                                    _context.Entry(assetAlertLog).State = EntityState.Modified;
                                    _context.SaveChanges();
                                }
                            }
                        }
                    }

                    if (Settings.AssetAlertServiceThrottle > 0) {
                        Thread.Sleep(1000 * Settings.AssetAlertServiceThrottle);
                    }
                }
                catch (ThreadAbortException)
                {
                    Run();
                }
                catch (Exception ex) {
                    EventLog.WriteEntry(Settings.EventLogSource, string.Format("The Alert Service encountered the following error: {0}\n\n{1}", ex.Message, ex.StackTrace), EventLogEntryType.Error);
                    _errorCount++;

                    if (_errorCount == 100) {
                        EventLog.WriteEntry(Settings.EventLogSource, "The Alert Service has encountered too many errors in succession.  It will be automatically shut down.", EventLogEntryType.Warning);
                        Terminated = true;
                        _errorCount = 0;
                    }
                }
            }
        }
    }
}
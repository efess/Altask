using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Altask.Data;
using Altask.Data.Model;
using System.Data.Entity;
using System.Text;

namespace Altask.www.Controllers {
    public partial class AssetLogController {
        internal override async Task<EntityResult> AfterCreateAsync(AssetLog entity, bool notifyAll = false) {
            var assetAlerts = await Context.AssetAlerts.Where(aa => aa.AssetId == entity.AssetId && aa.AssetLogTypeId == entity.AssetLogTypeId).ToListAsync();
            var userEntity = await Context.Users.FirstOrDefaultAsync(u => u.UserName == entity.CreatedBy);
            var assetEntity = await Context.Assets.FirstOrDefaultAsync(a => a.Id == entity.AssetId);
            var assetLogTypeEntity = await Context.AssetLogTypes.FirstOrDefaultAsync(alt => alt.Id == entity.AssetLogTypeId);
            var userName = userEntity.FullName ?? userEntity.UserName;
            var assetName = assetEntity.Name + (assetEntity.CustomId != null ? string.Format(" - {0}", assetEntity.CustomId) : "");

            foreach (var assetAlert in assetAlerts) {
                var message = string.Format("{0} reported {1} for asset {2} on {3}.", userName, assetLogTypeEntity.Name, assetName, entity.CreatedOn.ToLocalTime().ToString("MM/dd/yyyy hh:mm tt"));

                if (!string.IsNullOrEmpty(entity.Comment)) {
                    message += string.Format(" Comment(s): {0}", entity.Comment);
                }

                foreach(var user in assetAlert.Users) {
                    var date = DateTime.Now;
                    var log = new AssetAlertLog() {
                        AlertDate = date,
                        AssetLogId = entity.Id,
                        AssetAlertId = assetAlert.Id,
                        Description = message,
                        Type = AssetAlertLogType.System.ToString(),
                        UserId = user.UserId
                    };

                    Context.AssetAlertLogs.Add(log);

                    if (Context.SaveChanges().Succeeded) {
                        if (!string.IsNullOrEmpty(HttpContext.Request.Headers["X-Altask-Client-Id"])) {
                            SignalRHub.NotifyAssetAlertLogCreate(Guid.Parse(HttpContext.Request.Headers["X-Altask-Client-Id"]), log.ToDto());
                        }
                    }

                    if (user.User.ReceiveEmail) {
                        var result = await UserManager.EmailService.SendAsync(Settings.AlertEmailFrom, user.User.EmailAddress, Settings.AlertEmailSubject, message.ToString());

                        Context.AssetAlertLogs.Add(new AssetAlertLog() {
                            AlertDate = date,
                            AssetLogId = entity.Id,
                            AssetAlertId = assetAlert.Id,
                            Description = message,
                            Type = (result.Succeeded ? AssetAlertLogType.SendEmailSuccess : AssetAlertLogType.SendEmailFailure).ToString(),
                            UserId = user.UserId
                        });

                        Context.SaveChanges();
                    }

                    if (user.User.ReceiveText) {
                        var result = await UserManager.EmailService.SendAsync(Settings.AlertEmailFrom, user.User.SmsAddress, Settings.AlertEmailSubject, message.ToString());

                        Context.AssetAlertLogs.Add(new AssetAlertLog() {
                            AlertDate = date,
                            AssetLogId = entity.Id,
                            AssetAlertId = assetAlert.Id,
                            Description = message,
                            Type = (result.Succeeded ? AssetAlertLogType.SendSmsSuccess : AssetAlertLogType.SendSmsFailure).ToString(),
                            UserId = user.UserId
                        });

                        Context.SaveChanges();
                    }
                }
            }

            return EntityResult.Succeded(1);
        }
    }
}
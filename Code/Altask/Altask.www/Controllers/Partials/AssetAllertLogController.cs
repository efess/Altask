namespace Altask.www.Controllers {
    using Altask.www.Models;
    using Data;
    using Data.Model;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Web.Mvc;

    public partial class AssetAlertLogController {
        internal override async Task<EntityResult> AfterCreateAsync(Data.Model.AssetAlertLog entity, bool notifyAll = false) {
            await Context.Entry(entity).Reference(e => e.User).LoadAsync();
            await Context.Entry(entity).Reference(e => e.AssetLog).LoadAsync();

            if (!string.IsNullOrEmpty(HttpContext.Request.Headers["X-Altask-Client-Id"])) {
                SignalRHub.NotifyAssetAlertLogCreate(Guid.Parse(HttpContext.Request.Headers["X-Altask-Client-Id"]), entity.ToDto());
            }

            return EntityResult.Succeded(0);
        }

        internal override async Task<EntityResult> AfterUpdateAsync(Data.Model.AssetAlertLog entity, bool notifyAll = false) {
            await Context.Entry(entity).Reference(e => e.User).LoadAsync();
            await Context.Entry(entity).Reference(e => e.AssetLog).LoadAsync();

            if (!string.IsNullOrEmpty(HttpContext.Request.Headers["X-Altask-Client-Id"])) {
                SignalRHub.NotifyAssetAlertLogUpdate(Guid.Parse(HttpContext.Request.Headers["X-Altask-Client-Id"]), entity.ToDto());
            }

            return EntityResult.Succeded(0);
        }
    }
}
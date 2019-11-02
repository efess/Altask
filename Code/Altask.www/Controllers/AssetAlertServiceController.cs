using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace Altask.www.Controllers
{
    [Authorize]
    public class AssetAlertServiceController : BaseController
    {
        public async Task<ActionResult> GetStatus() {
            return await Task.FromResult(Ok(new { running = !AssetAlertService.Instance.Terminated, lastRun = AssetAlertService.Instance.LastRun }, JsonRequestBehavior.AllowGet));
        }

        public async Task<ActionResult> Start() {
            AssetAlertService.Instance.Start();
            return await Task.FromResult(Ok(new { running = !AssetAlertService.Instance.Terminated, lastRun = AssetAlertService.Instance.LastRun }, JsonRequestBehavior.AllowGet));
        }

        public async Task<ActionResult> Stop() {
            AssetAlertService.Instance.Terminate();
            return await Task.FromResult(Ok(new { running = !AssetAlertService.Instance.Terminated, lastRun = AssetAlertService.Instance.LastRun }, JsonRequestBehavior.AllowGet));
        }
    }
}
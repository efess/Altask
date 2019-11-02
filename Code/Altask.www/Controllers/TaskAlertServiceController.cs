using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace Altask.www.Controllers
{
    [Authorize]
    public class TaskAlertServiceController : BaseController {
        public async Task<ActionResult> GetStatus() {
            return await Task.FromResult(Ok(new { running = !TaskAlertService.Instance.Terminated, lastRun = TaskAlertService.Instance.LastRun }, JsonRequestBehavior.AllowGet));
        }

        public async Task<ActionResult> Start() {
            TaskAlertService.Instance.Start();
            return await Task.FromResult(Ok(new { running = !TaskAlertService.Instance.Terminated, lastRun = TaskAlertService.Instance.LastRun }, JsonRequestBehavior.AllowGet));
        }

        public async Task<ActionResult> Stop() {
            TaskAlertService.Instance.Terminate();
            return await Task.FromResult(Ok(new { running = !TaskAlertService.Instance.Terminated, lastRun = TaskAlertService.Instance.LastRun }, JsonRequestBehavior.AllowGet));
        }
    }
}
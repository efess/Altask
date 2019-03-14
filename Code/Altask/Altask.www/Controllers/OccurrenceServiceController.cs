using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace Altask.www.Controllers
{
    [Authorize]
    public class OccurrenceServiceController : BaseController {
        public async Task<ActionResult> GetStatus() {
            return await Task.FromResult(Ok(new { running = !OccurrenceService.Instance.Terminated, lastRun = OccurrenceService.Instance.LastRun }, JsonRequestBehavior.AllowGet));
        }

        public async Task<ActionResult> Start() {
            OccurrenceService.Instance.Start();
            return await Task.FromResult(Ok(new { running = !OccurrenceService.Instance.Terminated, lastRun = OccurrenceService.Instance.LastRun }, JsonRequestBehavior.AllowGet));
        }

        public async Task<ActionResult> Stop() {
            OccurrenceService.Instance.Terminate();
            return await Task.FromResult(Ok(new { running = !OccurrenceService.Instance.Terminated, lastRun = OccurrenceService.Instance.LastRun }, JsonRequestBehavior.AllowGet));
        }
    }
}
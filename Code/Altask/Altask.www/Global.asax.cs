using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace Altask.www {
	public class MvcApplication : System.Web.HttpApplication {
		protected void Application_Start() {
			AreaRegistration.RegisterAllAreas();
			FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
			RouteConfig.RegisterRoutes(RouteTable.Routes);
			BundleConfig.RegisterBundles(BundleTable.Bundles);
            AssetAlertService.Instance.Start();
			TaskAlertService.Instance.Start();
			OccurrenceService.Instance.Start();
		}

		protected void Application_End(object sender, EventArgs e) {
            AssetAlertService.Instance.Terminate();
			TaskAlertService.Instance.Terminate();
			OccurrenceService.Instance.Terminate();
		}
	}
}

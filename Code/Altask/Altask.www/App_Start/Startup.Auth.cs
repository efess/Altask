using System;
using Altask.Data.Model;
using Microsoft.AspNet.Identity;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Owin;
using System.Net;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.AspNet.SignalR;

namespace Altask.www {
	public partial class Startup {
		public void ConfigAuth(IAppBuilder app) {
            app.MapSignalR();
            app.CreatePerOwinContext(ApplicationDbContext.Create);
			app.CreatePerOwinContext<ApplicationUserManager>(ApplicationUserManager.Create);
			app.CreatePerOwinContext<ApplicationSignInManager>(ApplicationSignInManager.Create);

			app.UseCookieAuthentication(new CookieAuthenticationOptions {
				AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
				LoginPath = new PathString("/Account/Login"),
				Provider = new CookieAuthenticationProvider() {
                    OnApplyRedirect = context => {
                        context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    }
                },
				CookieHttpOnly = true,
                CookieName = Guid.NewGuid().ToString(),
				ExpireTimeSpan = TimeSpan.FromHours(12),
			});
		}
    }
}
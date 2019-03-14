using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Altask.www.Startup))]
namespace Altask.www {
	public partial class Startup {
		public void Configuration(IAppBuilder app) {
            ConfigAuth(app);
		}
	}
}
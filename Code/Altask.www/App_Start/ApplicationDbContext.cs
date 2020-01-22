using System.Diagnostics;
using Altask.Data.Model;

namespace Altask.www {
	public class ApplicationDbContext : AltaskDbContext {
		public ApplicationDbContext(string user)
			: base(user, "Name=Default") {

			//this.Database.Log = l => Debug.Print(l);
		}

		public static ApplicationDbContext Create() {
			return new ApplicationDbContext("");
		}
	}
}
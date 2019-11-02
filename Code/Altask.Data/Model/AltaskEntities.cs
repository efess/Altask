using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Data.Entity.Validation;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Altask.Data.Model {
	public partial class AltaskEntities {
		public AltaskEntities(string nameOrConnectionString) : base(nameOrConnectionString) {

		}
	}
}

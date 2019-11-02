using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Altask.www {
	[AttributeUsage(AttributeTargets.Class)]
	public class ServiceDescriptionAttribute : Attribute {
		public ServiceDescriptionAttribute(string name) {
			Name = name;
		}

		public string Name { get; private set; }
	}
}
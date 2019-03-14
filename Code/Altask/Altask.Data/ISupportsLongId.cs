using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Altask.Data {
	/// <summary>
	/// Defines an object which has an ID property represented by an long.
	/// </summary>
	public interface ISupportsLongId {
		/// <summary>
		/// The ID of the object.
		/// </summary>
		long Id { get; set; }
	}
}

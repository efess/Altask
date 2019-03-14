using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Altask.Data {
	/// <summary>
	/// Defines an object which has an ID property represented by an int.
	/// </summary>
	public interface ISupportsIntId {
		/// <summary>
		/// The ID of the object.
		/// </summary>
		int Id { get; set; }
	}
}

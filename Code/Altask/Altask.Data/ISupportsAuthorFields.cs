using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Altask.Data {
	/// <summary>
	/// Defines an object which has properties indicating when the object was created or updated and the source entity.
	/// </summary>
	public interface ISupportsAuthorFields {
		/// <summary>
		/// Identifies the entity which created the object.
		/// </summary>
		string CreatedBy { get; set; }
		/// <summary>
		/// Identifies when the object was created.
		/// </summary>
		DateTime CreatedOn { get; set; }
		/// <summary>
		/// Identifies the entity which last updated the object.
		/// </summary>
		string UpdatedBy { get; set; }
		/// <summary>
		/// Identifies when the object was last updated.
		/// </summary>
		DateTime UpdatedOn { get; set; }
	}
}

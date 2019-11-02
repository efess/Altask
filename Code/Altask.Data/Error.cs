using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Altask.Data {
	/// <summary>
	/// Encapsulates an error from the data subsystem.
	/// </summary>
	public class Error {
		/// <summary>
		/// Gets or sets the code for this error.
		/// </summary>
		/// <value>
		/// The code for this error.
		/// </value>
		public string Code { get; set; }

		/// <summary>
		/// Gets or sets the description for this error.
		/// </summary>
		/// <value>
		/// The description for this error.
		/// </value>
		public string Description { get; set; }
	}

	public class ErrorCollection : List<Error> {
		public override string ToString() {
			StringBuilder message = new StringBuilder();

			foreach (var error in this) {
				message.AppendLine("Error:");
				message.Append("    Code: ");
				message.Append(error.Code);
				message.Append("; Description: ");
				message.AppendLine(error.Description);
				message.AppendLine();
			}

			return message.ToString();
		}
	}
}

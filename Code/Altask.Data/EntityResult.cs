using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Altask.Data {
    public class EntityResult<T> {
        private T _entity;
        protected static readonly EntityResult<T> _success = new EntityResult<T> { Succeeded = true, Count = 0 };
        protected List<Error> _errors = new List<Error>();

        public T Entity { get; protected set; }

        public int Count { get; protected set; }
        /// <summary>
        /// Flag indicating whether if the operation succeeded or not.
        /// </summary>
        /// <value>True if the operation succeeded, otherwise false.</value>
        public bool Succeeded { get; protected set; }

        /// <summary>
        /// An <see cref="IEnumerable{T}"/> of <see cref="IdentityError"/>s containing an errors
        /// that occurred during the identity operation.
        /// </summary>
        /// <value>An <see cref="IEnumerable{T}"/> of <see cref="IdentityError"/>s.</value>
        public IEnumerable<Error> Errors => _errors;

        /// <summary>
        /// Returns an <see cref="EntityResult<T>"/> indicating a successful identity operation.
        /// </summary>
        /// <returns>An <see cref="EntityResult<T>"/> indicating a successful operation.</returns>
        public static EntityResult<T> Success => _success;

        public static EntityResult<T> Succeded(T entity) {
            var result = _success;
            result.Entity = entity;
            return result;
        }

        public static EntityResult<T> Succeded(T entity, int count) {
            var result = _success;
            result.Entity = entity;
            result.Count = count;
            return result;
        }

        /// <summary>
        /// Creates an <see cref="EntityResult<T>"/> indicating a failed identity operation, with a list of <paramref name="errors"/> if applicable.
        /// </summary>
        /// <param name="errors">An optional array of <see cref="IdentityError"/>s which caused the operation to fail.</param>
        /// <returns>An <see cref="EntityResult<T>"/> indicating a failed identity operation, with a list of <paramref name="errors"/> if applicable.</returns>
        public static EntityResult<T> Failed(params Error[] errors) {
            var result = new EntityResult<T> { Succeeded = false };
            if (errors != null) {
                result._errors.AddRange(errors);
            }
            return result;
        }

        /// <summary>
        /// Creates an <see cref="EntityResult<T>"/> indicating a failed identity operation, with a list of <paramref name="errors"/> if applicable.
        /// </summary>
        /// <param name="errors">An optional array of <see cref="IdentityError"/>s which caused the operation to fail.</param>
        /// <returns>An <see cref="EntityResult<T>"/> indicating a failed identity operation, with a list of <paramref name="errors"/> if applicable.</returns>
        public static EntityResult<T> Failed(Exception ex, params Error[] errors) {
            try {
                // This source will need to be added to the Application EventLog manually
                // in order for IIS to write to the EventLog.
                // Powershell Command: [system.Diagnostics.EventLog]::CreateEventSource("Trading Tome", "Application")
                EventLog.WriteEntry("Altask", ex.ToString(), EventLogEntryType.Error);
            }
            catch (Exception) {

            }

            var result = new EntityResult<T> { Succeeded = false };
            if (errors != null) {
                result._errors.AddRange(errors);
            }
            return result;
        }

        /// <summary>
        /// Converts the value of the current <see cref="EntityResult<T>"/> object to its equivalent string representation.
        /// </summary>
        /// <returns>A string representation of the current <see cref="EntityResult<T>"/> object.</returns>
        /// <remarks>
        /// If the operation was successful the ToString() will return "Succeeded" otherwise it returned 
        /// "Failed : " followed by a comma delimited list of error codes from its <see cref="Errors"/> collection, if any.
        /// </remarks>
        public override string ToString() {
            return Succeeded ?
                   "Succeeded" :
                   string.Format("{0} : {1}", "Failed", string.Join(",", Errors.Select(x => x.Code).ToList()));
        }
    }


	/// <summary>
	/// Represents the
    /// result of an identity operation.
	/// </summary>
	public class EntityResult {
		protected static readonly EntityResult _success = new EntityResult { Succeeded = true, Count = 0 };
		protected List<Error> _errors = new List<Error>();

		public int Count { get; protected set; }
		/// <summary>
		/// Flag indicating whether if the operation succeeded or not.
		/// </summary>
		/// <value>True if the operation succeeded, otherwise false.</value>
		public bool Succeeded { get; protected set; }

		/// <summary>
		/// An <see cref="IEnumerable{T}"/> of <see cref="IdentityError"/>s containing an errors
		/// that occurred during the identity operation.
		/// </summary>
		/// <value>An <see cref="IEnumerable{T}"/> of <see cref="IdentityError"/>s.</value>
		public IEnumerable<Error> Errors => _errors;

		/// <summary>
		/// Returns an <see cref="EntityResult"/> indicating a successful identity operation.
		/// </summary>
		/// <returns>An <see cref="EntityResult"/> indicating a successful operation.</returns>
		public static EntityResult Success => _success;

		public static EntityResult Succeded(int count) {
			var result = _success;
			result.Count = count;
			return result;
		}

		/// <summary>
		/// Creates an <see cref="EntityResult"/> indicating a failed identity operation, with a list of <paramref name="errors"/> if applicable.
		/// </summary>
		/// <param name="errors">An optional array of <see cref="IdentityError"/>s which caused the operation to fail.</param>
		/// <returns>An <see cref="EntityResult"/> indicating a failed identity operation, with a list of <paramref name="errors"/> if applicable.</returns>
		public static EntityResult Failed(params Error[] errors) {
			var result = new EntityResult { Succeeded = false };
			if (errors != null) {
				result._errors.AddRange(errors);
			}
			return result;
		}

		/// <summary>
		/// Creates an <see cref="EntityResult"/> indicating a failed identity operation, with a list of <paramref name="errors"/> if applicable.
		/// </summary>
		/// <param name="errors">An optional array of <see cref="IdentityError"/>s which caused the operation to fail.</param>
		/// <returns>An <see cref="EntityResult"/> indicating a failed identity operation, with a list of <paramref name="errors"/> if applicable.</returns>
		public static EntityResult Failed(Exception ex, params Error[] errors) {
			try {
				// This source will need to be added to the Application EventLog manually
				// in order for IIS to write to the EventLog.
				// Powershell Command: [system.Diagnostics.EventLog]::CreateEventSource("Trading Tome", "Application")
				EventLog.WriteEntry("Altask", ex.ToString(), EventLogEntryType.Error);
			} catch (Exception) {

			}

			var result = new EntityResult { Succeeded = false };
			if (errors != null) {
				result._errors.AddRange(errors);
			}
			return result;
		}

		/// <summary>
		/// Converts the value of the current <see cref="EntityResult"/> object to its equivalent string representation.
		/// </summary>
		/// <returns>A string representation of the current <see cref="EntityResult"/> object.</returns>
		/// <remarks>
		/// If the operation was successful the ToString() will return "Succeeded" otherwise it returned 
		/// "Failed : " followed by a comma delimited list of error codes from its <see cref="Errors"/> collection, if any.
		/// </remarks>
		public override string ToString() {
			return Succeeded ?
				   "Succeeded" :
				   string.Format("{0} : {1}", "Failed", string.Join(",", Errors.Select(x => x.Code).ToList()));
		}
	}
}

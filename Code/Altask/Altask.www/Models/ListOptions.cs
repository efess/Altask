using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Web;

namespace Altask.www.Models {
    public class ListOptions<T> {
        /// <summary>
    	///	Creates a Predicate derived from custom properties when overriden.
    	/// </summary>
    	protected virtual Expression<Func<T, bool>> GetCustomPredicate() {
            return null;
        }
    }
}
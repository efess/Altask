using Altask.Data.Model;
using System;
using System.Linq.Expressions;

namespace Altask.www.Models {
    public partial class AssetAlertLogListOptions {
        /// <summary>
    	/// Indicates wheather to filter on the <see cref="Altask.Data.Dto.AssetAlertLog"/>.Type property.
    	/// </summary>
    	public string Type { get; set; }

        /// <summary>
        ///	Creates a Predicate derived from the filter's Type property.
        /// </summary>
        private Expression<Func<Altask.Data.Model.AssetAlertLog, bool>> GetTypePredicate() {
            if (!string.IsNullOrEmpty(Type)) {
                var predicate = PredicateBuilder.True<Altask.Data.Model.AssetAlertLog>();
                var value = Type;
                predicate = predicate.And(e => e.Type == value);
                return predicate;
            }

            return null;
        }

        protected override Expression<Func<AssetAlertLog, bool>> GetCustomPredicate() {
            var predicate = PredicateBuilder.True<Altask.Data.Model.AssetAlertLog>();
            var typePredicate = GetTypePredicate();

            if (typePredicate != null) {
                predicate = predicate.And(typePredicate);
                return predicate;
            }

            return null;            
        }
    }
}
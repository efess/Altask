//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Altask.www.Models
{
    using System;
    using System.Collections.Generic;
    using System.Linq.Expressions;
    /// <summary>
    ///	Represents a collection of properties on which you can filter a collection of <see cref="Altask.Data.Dto.AssetType"/> objects.
    /// </summary>
    public partial class AssetTypeListOptions : ListOptions<Altask.Data.Model.AssetType>
    {
    	/// <summary>
    	/// Indicates wheather to filter on the <see cref="Altask.Data.Dto.AssetType"/>.Active property.
    	/// </summary>
    	public bool? Active { get; set; }
    
    	/// <summary>
    	///	Creates a Predicate derived from the filter's Active property.
    	/// </summary>
    	private Expression<Func<Altask.Data.Model.AssetType, bool>> GetActivePredicate() {
    		if (Active.HasValue) {
    			var predicate = PredicateBuilder.True<Altask.Data.Model.AssetType>();
    			var value = Active.Value;
    			predicate = predicate.And(e => e.Active == value);
    			return predicate;
    		}
    		
    		return null;	
    	}
    		
    	/// <summary>
    	///	Creates a Predicate from the filter's specified properties which evaluates to true.
    	/// </summary>
    	public Expression<Func<Altask.Data.Model.AssetType, bool>> GetPredicate() {
    		var predicate = PredicateBuilder.True<Altask.Data.Model.AssetType>();
    		var custom = GetCustomPredicate();
    
            if (custom != null) {
                predicate = predicate.And(custom);
            }
    
    		var activePredicate = GetActivePredicate();
    
    		if (activePredicate != null) {
    			predicate = predicate.And(activePredicate);
    		}
    
    		return predicate;	
    	}
    }
}

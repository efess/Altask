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
    ///	Represents a collection of properties on which you can filter a collection of <see cref="Altask.Data.Dto.AssetAlertUser"/> objects.
    /// </summary>
    public partial class AssetAlertUserListOptions : ListOptions<Altask.Data.Model.AssetAlertUser>
    {
    	/// <summary>
    	///	A comma delimited string representing one or more <see cref="Altask.Data.Dto.AssetAlertUser"/>.UserId values to filter on.
    	/// </summary>
    	public string UserIds { get; set; }
    
    	/// <summary>
    	///	Parses the UserIds property and returns a <see cref="System.Collections.Generic.List{Int32}"/> containing any <see cref="Altask.Data.Dto.AssetAlertUser"/>.UserId values to filter on.
    	/// </summary>
    	public List<Int32> GetUserIds() {
    		var list = new List<Int32>();
    		
    		if (UserIds != null) {
    			var items = UserIds.Split(',');
    
    			foreach(var item in items) {
    				Int32 parsed;
    
    				if (Int32.TryParse(item, out parsed)) {
    					list.Add(parsed);
    				}
    			}
    		}
    
    		return list;
    	}
    
    	/// <summary>
    	///	Creates a Predicate derived from the filter's UserIds property.
    	/// </summary>
    	private Expression<Func<Altask.Data.Model.AssetAlertUser, bool>> GetUserIdsPredicate() {
    		var values = GetUserIds();
    
    		if (values.Count > 0) {
    			var predicate = PredicateBuilder.False<Altask.Data.Model.AssetAlertUser>();
    
    			foreach(var item in values) {
    				var value = item;
    				predicate = predicate.Or(e => e.UserId == value);
    			}
    
    			return predicate;
    		}
    		
    		return null;	
    	}
    
    	/// <summary>
    	///	Creates a Predicate from the filter's specified properties which evaluates to true.
    	/// </summary>
    	public Expression<Func<Altask.Data.Model.AssetAlertUser, bool>> GetPredicate() {
    		var predicate = PredicateBuilder.True<Altask.Data.Model.AssetAlertUser>();
    		var custom = GetCustomPredicate();
    
            if (custom != null) {
                predicate = predicate.And(custom);
            }
    
    		var userIdsPredicate = GetUserIdsPredicate();
    
    		if (userIdsPredicate != null) {
    			predicate = predicate.And(userIdsPredicate);
    		}
    
    		return predicate;	
    	}
    }
}

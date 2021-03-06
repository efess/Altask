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
    ///	Represents a collection of properties on which you can filter a collection of <see cref="Altask.Data.Dto.ScheduleAsset"/> objects.
    /// </summary>
    public partial class ScheduleAssetListOptions : ListOptions<Altask.Data.Model.ScheduleAsset>
    {
    	/// <summary>
    	///	A comma delimited string representing one or more <see cref="Altask.Data.Dto.ScheduleAsset"/>.AssetId values to filter on.
    	/// </summary>
    	public string AssetIds { get; set; }
    
    	/// <summary>
    	///	Parses the AssetIds property and returns a <see cref="System.Collections.Generic.List{Int32}"/> containing any <see cref="Altask.Data.Dto.ScheduleAsset"/>.AssetId values to filter on.
    	/// </summary>
    	public List<Int32> GetAssetIds() {
    		var list = new List<Int32>();
    		
    		if (AssetIds != null) {
    			var items = AssetIds.Split(',');
    
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
    	///	Creates a Predicate derived from the filter's AssetIds property.
    	/// </summary>
    	private Expression<Func<Altask.Data.Model.ScheduleAsset, bool>> GetAssetIdsPredicate() {
    		var values = GetAssetIds();
    
    		if (values.Count > 0) {
    			var predicate = PredicateBuilder.False<Altask.Data.Model.ScheduleAsset>();
    
    			foreach(var item in values) {
    				var value = item;
    				predicate = predicate.Or(e => e.AssetId == value);
    			}
    
    			return predicate;
    		}
    		
    		return null;	
    	}
    
    	/// <summary>
    	///	A comma delimited string representing one or more <see cref="Altask.Data.Dto.ScheduleAsset"/>.ScheduleAssetTypeId values to filter on.
    	/// </summary>
    	public string ScheduleAssetTypeIds { get; set; }
    
    	/// <summary>
    	///	Parses the ScheduleAssetTypeIds property and returns a <see cref="System.Collections.Generic.List{Int32}"/> containing any <see cref="Altask.Data.Dto.ScheduleAsset"/>.ScheduleAssetTypeId values to filter on.
    	/// </summary>
    	public List<Int32> GetScheduleAssetTypeIds() {
    		var list = new List<Int32>();
    		
    		if (ScheduleAssetTypeIds != null) {
    			var items = ScheduleAssetTypeIds.Split(',');
    
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
    	///	Creates a Predicate derived from the filter's ScheduleAssetTypeIds property.
    	/// </summary>
    	private Expression<Func<Altask.Data.Model.ScheduleAsset, bool>> GetScheduleAssetTypeIdsPredicate() {
    		var values = GetScheduleAssetTypeIds();
    
    		if (values.Count > 0) {
    			var predicate = PredicateBuilder.False<Altask.Data.Model.ScheduleAsset>();
    
    			foreach(var item in values) {
    				var value = item;
    				predicate = predicate.Or(e => e.ScheduleAssetTypeId == value);
    			}
    
    			return predicate;
    		}
    		
    		return null;	
    	}
    
    	/// <summary>
    	///	Creates a Predicate from the filter's specified properties which evaluates to true.
    	/// </summary>
    	public Expression<Func<Altask.Data.Model.ScheduleAsset, bool>> GetPredicate() {
    		var predicate = PredicateBuilder.True<Altask.Data.Model.ScheduleAsset>();
    		var custom = GetCustomPredicate();
    
            if (custom != null) {
                predicate = predicate.And(custom);
            }
    
    		var assetIdsPredicate = GetAssetIdsPredicate();
    
    		if (assetIdsPredicate != null) {
    			predicate = predicate.And(assetIdsPredicate);
    		}
    		var scheduleAssetTypeIdsPredicate = GetScheduleAssetTypeIdsPredicate();
    
    		if (scheduleAssetTypeIdsPredicate != null) {
    			predicate = predicate.And(scheduleAssetTypeIdsPredicate);
    		}
    
    		return predicate;	
    	}
    }
}

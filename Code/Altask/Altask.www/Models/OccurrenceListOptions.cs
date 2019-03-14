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
    ///	Represents a collection of properties on which you can filter a collection of <see cref="Altask.Data.Dto.Occurrence"/> objects.
    /// </summary>
    public partial class OccurrenceListOptions : ListOptions<Altask.Data.Model.Occurrence>
    {
    	/// <summary>
    	///	A comma delimited string representing one or more <see cref="Altask.Data.Dto.Occurrence"/>.AssetId values to filter on.
    	/// </summary>
    	public string AssetIds { get; set; }
    
    	/// <summary>
    	///	Parses the AssetIds property and returns a <see cref="System.Collections.Generic.List{Int32}"/> containing any <see cref="Altask.Data.Dto.Occurrence"/>.AssetId values to filter on.
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
    	private Expression<Func<Altask.Data.Model.Occurrence, bool>> GetAssetIdsPredicate() {
    		var values = GetAssetIds();
    
    		if (values.Count > 0) {
    			var predicate = PredicateBuilder.False<Altask.Data.Model.Occurrence>();
    
    			foreach(var item in values) {
    				var value = item;
    				predicate = predicate.Or(e => e.AssetId == value);
    			}
    
    			return predicate;
    		}
    		
    		return null;	
    	}
    
    	/// <summary>
    	///	A comma delimited string representing one or more <see cref="Altask.Data.Dto.Occurrence"/>.ScheduleId values to filter on.
    	/// </summary>
    	public string ScheduleIds { get; set; }
    
    	/// <summary>
    	///	Parses the ScheduleIds property and returns a <see cref="System.Collections.Generic.List{Int64}"/> containing any <see cref="Altask.Data.Dto.Occurrence"/>.ScheduleId values to filter on.
    	/// </summary>
    	public List<Int64> GetScheduleIds() {
    		var list = new List<Int64>();
    		
    		if (ScheduleIds != null) {
    			var items = ScheduleIds.Split(',');
    
    			foreach(var item in items) {
    				Int64 parsed;
    
    				if (Int64.TryParse(item, out parsed)) {
    					list.Add(parsed);
    				}
    			}
    		}
    
    		return list;
    	}
    
    	/// <summary>
    	///	Creates a Predicate derived from the filter's ScheduleIds property.
    	/// </summary>
    	private Expression<Func<Altask.Data.Model.Occurrence, bool>> GetScheduleIdsPredicate() {
    		var values = GetScheduleIds();
    
    		if (values.Count > 0) {
    			var predicate = PredicateBuilder.False<Altask.Data.Model.Occurrence>();
    
    			foreach(var item in values) {
    				var value = item;
    				predicate = predicate.Or(e => e.ScheduleId == value);
    			}
    
    			return predicate;
    		}
    		
    		return null;	
    	}
    
    	/// <summary>
    	///	A comma delimited string representing one or more <see cref="Altask.Data.Dto.Occurrence"/>.TaskId values to filter on.
    	/// </summary>
    	public string TaskIds { get; set; }
    
    	/// <summary>
    	///	Parses the TaskIds property and returns a <see cref="System.Collections.Generic.List{Int64}"/> containing any <see cref="Altask.Data.Dto.Occurrence"/>.TaskId values to filter on.
    	/// </summary>
    	public List<Int64> GetTaskIds() {
    		var list = new List<Int64>();
    		
    		if (TaskIds != null) {
    			var items = TaskIds.Split(',');
    
    			foreach(var item in items) {
    				Int64 parsed;
    
    				if (Int64.TryParse(item, out parsed)) {
    					list.Add(parsed);
    				}
    			}
    		}
    
    		return list;
    	}
    
    	/// <summary>
    	///	Creates a Predicate derived from the filter's TaskIds property.
    	/// </summary>
    	private Expression<Func<Altask.Data.Model.Occurrence, bool>> GetTaskIdsPredicate() {
    		var values = GetTaskIds();
    
    		if (values.Count > 0) {
    			var predicate = PredicateBuilder.False<Altask.Data.Model.Occurrence>();
    
    			foreach(var item in values) {
    				var value = item;
    				predicate = predicate.Or(e => e.TaskId == value);
    			}
    
    			return predicate;
    		}
    		
    		return null;	
    	}
    
    	/// <summary>
    	///	A comma delimited string representing one or more <see cref="Altask.Data.Dto.Occurrence"/>.UserId values to filter on.
    	/// </summary>
    	public string UserIds { get; set; }
    
    	/// <summary>
    	///	Parses the UserIds property and returns a <see cref="System.Collections.Generic.List{Int32}"/> containing any <see cref="Altask.Data.Dto.Occurrence"/>.UserId values to filter on.
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
    	private Expression<Func<Altask.Data.Model.Occurrence, bool>> GetUserIdsPredicate() {
    		var values = GetUserIds();
    
    		if (values.Count > 0) {
    			var predicate = PredicateBuilder.False<Altask.Data.Model.Occurrence>();
    
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
    	public Expression<Func<Altask.Data.Model.Occurrence, bool>> GetPredicate() {
    		var predicate = PredicateBuilder.True<Altask.Data.Model.Occurrence>();
    		var custom = GetCustomPredicate();
    
            if (custom != null) {
                predicate = predicate.And(custom);
            }
    
    		var assetIdsPredicate = GetAssetIdsPredicate();
    
    		if (assetIdsPredicate != null) {
    			predicate = predicate.And(assetIdsPredicate);
    		}
    		var scheduleIdsPredicate = GetScheduleIdsPredicate();
    
    		if (scheduleIdsPredicate != null) {
    			predicate = predicate.And(scheduleIdsPredicate);
    		}
    		var taskIdsPredicate = GetTaskIdsPredicate();
    
    		if (taskIdsPredicate != null) {
    			predicate = predicate.And(taskIdsPredicate);
    		}
    		var userIdsPredicate = GetUserIdsPredicate();
    
    		if (userIdsPredicate != null) {
    			predicate = predicate.And(userIdsPredicate);
    		}
    
    		return predicate;	
    	}
    }
}

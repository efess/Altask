//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Altask.Data.Model
{
    using Altask.Data;
    using Newtonsoft.Json;
    using System;
    using System.Xml;
    using System;
    using System.Collections.Generic;
    
    public partial class AssetLogResolution : ISupportsLongId, ISupportsAuthorFields
    {
    	/// <summary>
    	/// Gets or sets the Id of this <see cref='Altask.Data.Model.AssetLogResolution'/>.
    	/// </summary>
        public long Id { get; set; }
    	/// <summary>
    	/// Gets or sets the AssetLogId of this <see cref='Altask.Data.Model.AssetLogResolution'/>.
    	/// </summary>
        public long AssetLogId { get; set; }
    	/// <summary>
    	/// Gets or sets the TaskId of this <see cref='Altask.Data.Model.AssetLogResolution'/>.
    	/// </summary>
        public long TaskId { get; set; }
    	/// <summary>
    	/// Gets or sets the OccurrenceId of this <see cref='Altask.Data.Model.AssetLogResolution'/>.
    	/// </summary>
        public long OccurrenceId { get; set; }
    	/// <summary>
    	/// Gets or sets the CreatedBy of this <see cref='Altask.Data.Model.AssetLogResolution'/>.
    	/// </summary>
        public string CreatedBy { get; set; }
    	/// <summary>
    	/// Gets or sets the CreatedOn of this <see cref='Altask.Data.Model.AssetLogResolution'/>.
    	/// </summary>
        public System.DateTime CreatedOn { get; set; }
    	/// <summary>
    	/// Gets or sets the UpdatedBy of this <see cref='Altask.Data.Model.AssetLogResolution'/>.
    	/// </summary>
        public string UpdatedBy { get; set; }
    	/// <summary>
    	/// Gets or sets the UpdatedOn of this <see cref='Altask.Data.Model.AssetLogResolution'/>.
    	/// </summary>
        public System.DateTime UpdatedOn { get; set; }
    
        public virtual Occurrence Occurrence { get; set; }
        public virtual Task Task { get; set; }
    }
    
    public static partial class Mapper {
    	/// <summary>
    	/// Maps a <see cref='Altask.Data.Model.AssetLogResolution'/> object to a <see cref='Altask.Data.Dto.AssetLogResolution'/> object.
    	/// </summary>
    	public static Altask.Data.Dto.AssetLogResolution ToDto(this Altask.Data.Model.AssetLogResolution entity) {
    		var dto = new Altask.Data.Dto.AssetLogResolution();
    		dto.Id = entity.Id;
    		dto.AssetLogId = entity.AssetLogId;
    		dto.TaskId = entity.TaskId;
    		dto.OccurrenceId = entity.OccurrenceId;
    		dto.CreatedBy = entity.CreatedBy;
    		dto.CreatedOn = entity.CreatedOn;
    		dto.UpdatedBy = entity.UpdatedBy;
    		dto.UpdatedOn = entity.UpdatedOn;
    
    		if (entity.Occurrence != null) {
    			dto.Occurrence = entity.Occurrence.ToDto();
    		}
    
    		if (entity.Task != null) {
    			dto.Task = entity.Task.ToDto();
    		}
    
    		return dto;
    	}
    
    	/// <summary>
    	/// Maps all the non-primary key and tracking properties of a <see cref='Altask.Data.Dto.AssetLogResolution'/> object to a <see cref='Altask.Data.Model.AssetLogResolution'/> object.
    	/// </summary>
    	public static Altask.Data.Model.AssetLogResolution FromDto(this Altask.Data.Model.AssetLogResolution model, Altask.Data.Dto.AssetLogResolution entity) {
    		model.AssetLogId = entity.AssetLogId;
    		model.TaskId = entity.TaskId;
    		model.OccurrenceId = entity.OccurrenceId;
    		return model;
    	}
    }
}

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
    
    public partial class ScheduleAsset : ISupportsLongId, ISupportsAuthorFields
    {
    	/// <summary>
    	/// Gets or sets the Id of this <see cref='Altask.Data.Model.ScheduleAsset'/>.
    	/// </summary>
        public long Id { get; set; }
    	/// <summary>
    	/// Gets or sets the ScheduleId of this <see cref='Altask.Data.Model.ScheduleAsset'/>.
    	/// </summary>
        public long ScheduleId { get; set; }
    	/// <summary>
    	/// Gets or sets the AssetId of this <see cref='Altask.Data.Model.ScheduleAsset'/>.
    	/// </summary>
        public int AssetId { get; set; }
    	/// <summary>
    	/// Gets or sets the ScheduleAssetTypeId of this <see cref='Altask.Data.Model.ScheduleAsset'/>.
    	/// </summary>
        public int ScheduleAssetTypeId { get; set; }
    	/// <summary>
    	/// Gets or sets the CreatedBy of this <see cref='Altask.Data.Model.ScheduleAsset'/>.
    	/// </summary>
        public string CreatedBy { get; set; }
    	/// <summary>
    	/// Gets or sets the CreatedOn of this <see cref='Altask.Data.Model.ScheduleAsset'/>.
    	/// </summary>
        public System.DateTime CreatedOn { get; set; }
    	/// <summary>
    	/// Gets or sets the UpdatedBy of this <see cref='Altask.Data.Model.ScheduleAsset'/>.
    	/// </summary>
        public string UpdatedBy { get; set; }
    	/// <summary>
    	/// Gets or sets the UpdatedOn of this <see cref='Altask.Data.Model.ScheduleAsset'/>.
    	/// </summary>
        public System.DateTime UpdatedOn { get; set; }
    
        public virtual Asset Asset { get; set; }
        public virtual ScheduleAssetType Type { get; set; }
    }
    
    public static partial class Mapper {
    	/// <summary>
    	/// Maps a <see cref='Altask.Data.Model.ScheduleAsset'/> object to a <see cref='Altask.Data.Dto.ScheduleAsset'/> object.
    	/// </summary>
    	/// <param name="includeLogs">Indicates whether to load any logs associated with the object when mapping.</param>
    	public static Altask.Data.Dto.ScheduleAsset ToDto(this Altask.Data.Model.ScheduleAsset entity, bool includeLogs = false) {
    		var dto = new Altask.Data.Dto.ScheduleAsset();
    		dto.Id = entity.Id;
    		dto.ScheduleId = entity.ScheduleId;
    		dto.AssetId = entity.AssetId;
    		dto.ScheduleAssetTypeId = entity.ScheduleAssetTypeId;
    		dto.CreatedBy = entity.CreatedBy;
    		dto.CreatedOn = entity.CreatedOn;
    		dto.UpdatedBy = entity.UpdatedBy;
    		dto.UpdatedOn = entity.UpdatedOn;
    
    		if (entity.Asset != null) {
    			dto.Asset = entity.Asset.ToDto();
    		}
    
    		if (entity.Type != null) {
    			dto.Type = entity.Type.ToDto();
    		}
    
    		return dto;
    	}
    
    	/// <summary>
    	/// Maps all the non-primary key and tracking properties of a <see cref='Altask.Data.Dto.ScheduleAsset'/> object to a <see cref='Altask.Data.Model.ScheduleAsset'/> object.
    	/// </summary>
    	public static Altask.Data.Model.ScheduleAsset FromDto(this Altask.Data.Model.ScheduleAsset model, Altask.Data.Dto.ScheduleAsset entity) {
    		model.ScheduleId = entity.ScheduleId;
    		model.AssetId = entity.AssetId;
    		model.ScheduleAssetTypeId = entity.ScheduleAssetTypeId;
    		return model;
    	}
    }
}

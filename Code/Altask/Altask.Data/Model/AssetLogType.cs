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
    
    public partial class AssetLogType : ISupportsIntId
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public AssetLogType()
        {
            this.Assets = new HashSet<AssetLogTypeAsset>();
        }
    
    	/// <summary>
    	/// Gets or sets the Id of this <see cref='Altask.Data.Model.AssetLogType'/>.
    	/// </summary>
        public int Id { get; set; }
    	/// <summary>
    	/// Gets or sets the AssetLogTypeCategoryId of this <see cref='Altask.Data.Model.AssetLogType'/>.
    	/// </summary>
        public int AssetLogTypeCategoryId { get; set; }
    	/// <summary>
    	/// Gets or sets the Active of this <see cref='Altask.Data.Model.AssetLogType'/>.
    	/// </summary>
        public bool Active { get; set; }
    	/// <summary>
    	/// Gets or sets the CanComment of this <see cref='Altask.Data.Model.AssetLogType'/>.
    	/// </summary>
        public bool CanComment { get; set; }
    	/// <summary>
    	/// Gets or sets the CanResolve of this <see cref='Altask.Data.Model.AssetLogType'/>.
    	/// </summary>
        public bool CanResolve { get; set; }
    	/// <summary>
    	/// Gets or sets the Name of this <see cref='Altask.Data.Model.AssetLogType'/>.
    	/// </summary>
        public string Name { get; set; }
    	/// <summary>
    	/// Gets or sets the Description of this <see cref='Altask.Data.Model.AssetLogType'/>.
    	/// </summary>
        public string Description { get; set; }
    	/// <summary>
    	/// Gets or sets the Value of this <see cref='Altask.Data.Model.AssetLogType'/>.
    	/// </summary>
        public Nullable<int> Value { get; set; }
    	/// <summary>
    	/// Gets or sets the System of this <see cref='Altask.Data.Model.AssetLogType'/>.
    	/// </summary>
        public bool System { get; set; }
    
        public virtual AssetLogTypeCategory Category { get; set; }
        public virtual ICollection<AssetLogTypeAsset> Assets { get; set; }
    }
    
    public static partial class Mapper {
    	/// <summary>
    	/// Maps a <see cref='Altask.Data.Model.AssetLogType'/> object to a <see cref='Altask.Data.Dto.AssetLogType'/> object.
    	/// </summary>
    	public static Altask.Data.Dto.AssetLogType ToDto(this Altask.Data.Model.AssetLogType entity) {
    		var dto = new Altask.Data.Dto.AssetLogType();
    		dto.Id = entity.Id;
    		dto.AssetLogTypeCategoryId = entity.AssetLogTypeCategoryId;
    		dto.Active = entity.Active;
    		dto.CanComment = entity.CanComment;
    		dto.CanResolve = entity.CanResolve;
    		dto.Name = entity.Name;
    		dto.Description = entity.Description;
    		dto.Value = entity.Value;
    		dto.System = entity.System;
    
    		if (entity.Category != null) {
    			dto.Category = entity.Category.ToDto();
    		}
    
    		dto.Assets = new List<Altask.Data.Dto.AssetLogTypeAsset>();
    		
    		if (entity.Assets != null) {
    			foreach(var item in entity.Assets) {
    				dto.Assets.Add(item.ToDto());
    			}
    		}
    
    		return dto;
    	}
    
    	/// <summary>
    	/// Maps all the non-primary key and tracking properties of a <see cref='Altask.Data.Dto.AssetLogType'/> object to a <see cref='Altask.Data.Model.AssetLogType'/> object.
    	/// </summary>
    	public static Altask.Data.Model.AssetLogType FromDto(this Altask.Data.Model.AssetLogType model, Altask.Data.Dto.AssetLogType entity) {
    		model.AssetLogTypeCategoryId = entity.AssetLogTypeCategoryId;
    		model.Active = entity.Active;
    		model.CanComment = entity.CanComment;
    		model.CanResolve = entity.CanResolve;
    		model.Name = entity.Name;
    		model.Description = entity.Description;
    		model.Value = entity.Value;
    		model.System = entity.System;
    		return model;
    	}
    }
}

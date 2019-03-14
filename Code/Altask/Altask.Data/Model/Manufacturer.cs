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
    
    public partial class Manufacturer : ISupportsIntId
    {
    	/// <summary>
    	/// Gets or sets the Id of this <see cref='Altask.Data.Model.Manufacturer'/>.
    	/// </summary>
        public int Id { get; set; }
    	/// <summary>
    	/// Gets or sets the Active of this <see cref='Altask.Data.Model.Manufacturer'/>.
    	/// </summary>
        public bool Active { get; set; }
    	/// <summary>
    	/// Gets or sets the Name of this <see cref='Altask.Data.Model.Manufacturer'/>.
    	/// </summary>
        public string Name { get; set; }
    	/// <summary>
    	/// Gets or sets the Description of this <see cref='Altask.Data.Model.Manufacturer'/>.
    	/// </summary>
        public string Description { get; set; }
    }
    
    public static partial class Mapper {
    	/// <summary>
    	/// Maps a <see cref='Altask.Data.Model.Manufacturer'/> object to a <see cref='Altask.Data.Dto.Manufacturer'/> object.
    	/// </summary>
    	/// <param name="includeLogs">Indicates whether to load any logs associated with the object when mapping.</param>
    	public static Altask.Data.Dto.Manufacturer ToDto(this Altask.Data.Model.Manufacturer entity, bool includeLogs = false) {
    		var dto = new Altask.Data.Dto.Manufacturer();
    		dto.Id = entity.Id;
    		dto.Active = entity.Active;
    		dto.Name = entity.Name;
    		dto.Description = entity.Description;
    
    		return dto;
    	}
    
    	/// <summary>
    	/// Maps all the non-primary key and tracking properties of a <see cref='Altask.Data.Dto.Manufacturer'/> object to a <see cref='Altask.Data.Model.Manufacturer'/> object.
    	/// </summary>
    	public static Altask.Data.Model.Manufacturer FromDto(this Altask.Data.Model.Manufacturer model, Altask.Data.Dto.Manufacturer entity) {
    		model.Active = entity.Active;
    		model.Name = entity.Name;
    		model.Description = entity.Description;
    		return model;
    	}
    }
}

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
    
    public partial class ScheduleUserType : ISupportsIntId
    {
    	/// <summary>
    	/// Gets or sets the Id of this <see cref='Altask.Data.Model.ScheduleUserType'/>.
    	/// </summary>
        public int Id { get; set; }
    	/// <summary>
    	/// Gets or sets the Active of this <see cref='Altask.Data.Model.ScheduleUserType'/>.
    	/// </summary>
        public bool Active { get; set; }
    	/// <summary>
    	/// Gets or sets the Name of this <see cref='Altask.Data.Model.ScheduleUserType'/>.
    	/// </summary>
        public string Name { get; set; }
    	/// <summary>
    	/// Gets or sets the Description of this <see cref='Altask.Data.Model.ScheduleUserType'/>.
    	/// </summary>
        public string Description { get; set; }
    	/// <summary>
    	/// Gets or sets the Value of this <see cref='Altask.Data.Model.ScheduleUserType'/>.
    	/// </summary>
        public Nullable<int> Value { get; set; }
    	/// <summary>
    	/// Gets or sets the System of this <see cref='Altask.Data.Model.ScheduleUserType'/>.
    	/// </summary>
        public bool System { get; set; }
    }
    
    public static partial class Mapper {
    	/// <summary>
    	/// Maps a <see cref='Altask.Data.Model.ScheduleUserType'/> object to a <see cref='Altask.Data.Dto.ScheduleUserType'/> object.
    	/// </summary>
    	/// <param name="includeLogs">Indicates whether to load any logs associated with the object when mapping.</param>
    	public static Altask.Data.Dto.ScheduleUserType ToDto(this Altask.Data.Model.ScheduleUserType entity, bool includeLogs = false) {
    		var dto = new Altask.Data.Dto.ScheduleUserType();
    		dto.Id = entity.Id;
    		dto.Active = entity.Active;
    		dto.Name = entity.Name;
    		dto.Description = entity.Description;
    		dto.Value = entity.Value;
    		dto.System = entity.System;
    
    		return dto;
    	}
    
    	/// <summary>
    	/// Maps all the non-primary key and tracking properties of a <see cref='Altask.Data.Dto.ScheduleUserType'/> object to a <see cref='Altask.Data.Model.ScheduleUserType'/> object.
    	/// </summary>
    	public static Altask.Data.Model.ScheduleUserType FromDto(this Altask.Data.Model.ScheduleUserType model, Altask.Data.Dto.ScheduleUserType entity) {
    		model.Active = entity.Active;
    		model.Name = entity.Name;
    		model.Description = entity.Description;
    		model.Value = entity.Value;
    		model.System = entity.System;
    		return model;
    	}
    }
}

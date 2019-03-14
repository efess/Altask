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
    
    public partial class TaskAlertLog : ISupportsLongId, ISupportsAuthorFields
    {
    	/// <summary>
    	/// Gets or sets the Id of this <see cref='Altask.Data.Model.TaskAlertLog'/>.
    	/// </summary>
        public long Id { get; set; }
    	/// <summary>
    	/// Gets or sets the TaskAlertId of this <see cref='Altask.Data.Model.TaskAlertLog'/>.
    	/// </summary>
        public long TaskAlertId { get; set; }
    	/// <summary>
    	/// Gets or sets the UserId of this <see cref='Altask.Data.Model.TaskAlertLog'/>.
    	/// </summary>
        public int UserId { get; set; }
    	/// <summary>
    	/// Gets or sets the Type of this <see cref='Altask.Data.Model.TaskAlertLog'/>.
    	/// </summary>
        public string Type { get; set; }
    	/// <summary>
    	/// Gets or sets the Description of this <see cref='Altask.Data.Model.TaskAlertLog'/>.
    	/// </summary>
        public string Description { get; set; }
    	/// <summary>
    	/// Gets or sets the AlertDate of this <see cref='Altask.Data.Model.TaskAlertLog'/>.
    	/// </summary>
        public Nullable<System.DateTime> AlertDate { get; set; }
    	/// <summary>
    	/// Gets or sets the Metadata of this <see cref='Altask.Data.Model.TaskAlertLog'/>.
    	/// </summary>
        public string Metadata { get; set; }
    	/// <summary>
    	/// Gets or sets the CreatedBy of this <see cref='Altask.Data.Model.TaskAlertLog'/>.
    	/// </summary>
        public string CreatedBy { get; set; }
    	/// <summary>
    	/// Gets or sets the CreatedOn of this <see cref='Altask.Data.Model.TaskAlertLog'/>.
    	/// </summary>
        public System.DateTime CreatedOn { get; set; }
    	/// <summary>
    	/// Gets or sets the UpdatedBy of this <see cref='Altask.Data.Model.TaskAlertLog'/>.
    	/// </summary>
        public string UpdatedBy { get; set; }
    	/// <summary>
    	/// Gets or sets the UpdatedOn of this <see cref='Altask.Data.Model.TaskAlertLog'/>.
    	/// </summary>
        public System.DateTime UpdatedOn { get; set; }
    
        public virtual User User { get; set; }
    }
    
    public static partial class Mapper {
    	/// <summary>
    	/// Maps a <see cref='Altask.Data.Model.TaskAlertLog'/> object to a <see cref='Altask.Data.Dto.TaskAlertLog'/> object.
    	/// </summary>
    	/// <param name="includeLogs">Indicates whether to load any logs associated with the object when mapping.</param>
    	public static Altask.Data.Dto.TaskAlertLog ToDto(this Altask.Data.Model.TaskAlertLog entity, bool includeLogs = false) {
    		var dto = new Altask.Data.Dto.TaskAlertLog();
    		dto.Id = entity.Id;
    		dto.TaskAlertId = entity.TaskAlertId;
    		dto.UserId = entity.UserId;
    		dto.Type = entity.Type;
    		dto.Description = entity.Description;
    		dto.AlertDate = entity.AlertDate;
    		dto.Metadata = JsonConvert.DeserializeObject("{Properties: []}");
    
    		if (!string.IsNullOrEmpty(entity.Metadata)) {
    			try {
    				XmlDocument doc = new XmlDocument();
    				doc.LoadXml(entity.Metadata);
    				string json = Json.SerizlieXmlDocument(doc);
    				dto.Metadata = JsonConvert.DeserializeObject(json);
    			} catch(Exception) {}
    		}
    
    		dto.CreatedBy = entity.CreatedBy;
    		dto.CreatedOn = entity.CreatedOn;
    		dto.UpdatedBy = entity.UpdatedBy;
    		dto.UpdatedOn = entity.UpdatedOn;
    
    		if (entity.User != null) {
    			dto.User = entity.User.ToDto();
    		}
    
    		return dto;
    	}
    
    	/// <summary>
    	/// Maps all the non-primary key and tracking properties of a <see cref='Altask.Data.Dto.TaskAlertLog'/> object to a <see cref='Altask.Data.Model.TaskAlertLog'/> object.
    	/// </summary>
    	public static Altask.Data.Model.TaskAlertLog FromDto(this Altask.Data.Model.TaskAlertLog model, Altask.Data.Dto.TaskAlertLog entity) {
    		model.TaskAlertId = entity.TaskAlertId;
    		model.UserId = entity.UserId;
    		model.Type = entity.Type;
    		model.Description = entity.Description;
    		model.AlertDate = entity.AlertDate;
    		model.Metadata = string.Empty;
    
    		try {
    			model.Metadata = ((XmlDocument)JsonConvert.DeserializeXmlNode(entity.Metadata.ToString(), "Properties")).OuterXml;
    		} catch(Exception) {}
    
    		return model;
    	}
    }
}

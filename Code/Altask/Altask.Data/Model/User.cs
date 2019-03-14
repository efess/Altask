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
    
    public partial class User : ISupportsIntId, ISupportsAuthorFields
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public User()
        {
            this.Logs = new HashSet<UserLog>();
            this.Roles = new HashSet<UserRole>();
        }
    
    	/// <summary>
    	/// Gets or sets the Id of this <see cref='Altask.Data.Model.User'/>.
    	/// </summary>
        public int Id { get; set; }
    	/// <summary>
    	/// Gets or sets the Active of this <see cref='Altask.Data.Model.User'/>.
    	/// </summary>
        public bool Active { get; set; }
    	/// <summary>
    	/// Gets or sets the UserName of this <see cref='Altask.Data.Model.User'/>.
    	/// </summary>
        public string UserName { get; set; }
    	/// <summary>
    	/// Gets or sets the FullName of this <see cref='Altask.Data.Model.User'/>.
    	/// </summary>
        public string FullName { get; set; }
    	/// <summary>
    	/// Gets or sets the EmailAddress of this <see cref='Altask.Data.Model.User'/>.
    	/// </summary>
        public string EmailAddress { get; set; }
    	/// <summary>
    	/// Gets or sets the SmsAddress of this <see cref='Altask.Data.Model.User'/>.
    	/// </summary>
        public string SmsAddress { get; set; }
    	/// <summary>
    	/// Gets or sets the Metadata of this <see cref='Altask.Data.Model.User'/>.
    	/// </summary>
        public string Metadata { get; set; }
    	/// <summary>
    	/// Gets or sets the Settings of this <see cref='Altask.Data.Model.User'/>.
    	/// </summary>
        public string Settings { get; set; }
    	/// <summary>
    	/// Gets or sets the MobilePhone of this <see cref='Altask.Data.Model.User'/>.
    	/// </summary>
        public string MobilePhone { get; set; }
    	/// <summary>
    	/// Gets or sets the ReceiveEmail of this <see cref='Altask.Data.Model.User'/>.
    	/// </summary>
        public bool ReceiveEmail { get; set; }
    	/// <summary>
    	/// Gets or sets the ReceiveText of this <see cref='Altask.Data.Model.User'/>.
    	/// </summary>
        public bool ReceiveText { get; set; }
    	/// <summary>
    	/// Gets or sets the PasswordHash of this <see cref='Altask.Data.Model.User'/>.
    	/// </summary>
        public string PasswordHash { get; set; }
    	/// <summary>
    	/// Gets or sets the SecurityStamp of this <see cref='Altask.Data.Model.User'/>.
    	/// </summary>
        public string SecurityStamp { get; set; }
    	/// <summary>
    	/// Gets or sets the CreatedBy of this <see cref='Altask.Data.Model.User'/>.
    	/// </summary>
        public string CreatedBy { get; set; }
    	/// <summary>
    	/// Gets or sets the CreatedOn of this <see cref='Altask.Data.Model.User'/>.
    	/// </summary>
        public System.DateTime CreatedOn { get; set; }
    	/// <summary>
    	/// Gets or sets the UpdatedBy of this <see cref='Altask.Data.Model.User'/>.
    	/// </summary>
        public string UpdatedBy { get; set; }
    	/// <summary>
    	/// Gets or sets the UpdatedOn of this <see cref='Altask.Data.Model.User'/>.
    	/// </summary>
        public System.DateTime UpdatedOn { get; set; }
    
        public virtual ICollection<UserLog> Logs { get; set; }
        public virtual ICollection<UserRole> Roles { get; set; }
    }
    
    public static partial class Mapper {
    	/// <summary>
    	/// Maps a <see cref='Altask.Data.Model.User'/> object to a <see cref='Altask.Data.Dto.User'/> object.
    	/// </summary>
    	/// <param name="includeLogs">Indicates whether to load any logs associated with the object when mapping.</param>
    	public static Altask.Data.Dto.User ToDto(this Altask.Data.Model.User entity, bool includeLogs = false) {
    		var dto = new Altask.Data.Dto.User();
    		dto.Id = entity.Id;
    		dto.Active = entity.Active;
    		dto.UserName = entity.UserName;
    		dto.FullName = entity.FullName;
    		dto.EmailAddress = entity.EmailAddress;
    		dto.SmsAddress = entity.SmsAddress;
    		dto.Metadata = JsonConvert.DeserializeObject("{Properties: []}");
    
    		if (!string.IsNullOrEmpty(entity.Metadata)) {
    			try {
    				XmlDocument doc = new XmlDocument();
    				doc.LoadXml(entity.Metadata);
    				string json = Json.SerizlieXmlDocument(doc);
    				dto.Metadata = JsonConvert.DeserializeObject(json);
    			} catch(Exception) {}
    		}
    
    		dto.Settings = entity.Settings;
    		dto.MobilePhone = entity.MobilePhone;
    		dto.ReceiveEmail = entity.ReceiveEmail;
    		dto.ReceiveText = entity.ReceiveText;
    		dto.PasswordHash = entity.PasswordHash;
    		dto.SecurityStamp = entity.SecurityStamp;
    		dto.CreatedBy = entity.CreatedBy;
    		dto.CreatedOn = entity.CreatedOn;
    		dto.UpdatedBy = entity.UpdatedBy;
    		dto.UpdatedOn = entity.UpdatedOn;
    
    		dto.Roles = new List<Altask.Data.Dto.UserRole>();
    		
    		if (entity.Roles != null) {
    			foreach(var item in entity.Roles) {
    				dto.Roles.Add(item.ToDto());
    			}
    		}
    
    		return dto;
    	}
    
    	/// <summary>
    	/// Maps all the non-primary key and tracking properties of a <see cref='Altask.Data.Dto.User'/> object to a <see cref='Altask.Data.Model.User'/> object.
    	/// </summary>
    	public static Altask.Data.Model.User FromDto(this Altask.Data.Model.User model, Altask.Data.Dto.User entity) {
    		model.Active = entity.Active;
    		model.UserName = entity.UserName;
    		model.FullName = entity.FullName;
    		model.EmailAddress = entity.EmailAddress;
    		model.SmsAddress = entity.SmsAddress;
    		model.Metadata = string.Empty;
    
    		try {
    			model.Metadata = ((XmlDocument)JsonConvert.DeserializeXmlNode(entity.Metadata.ToString(), "Properties")).OuterXml;
    		} catch(Exception) {}
    
    		model.Settings = entity.Settings;
    		model.MobilePhone = entity.MobilePhone;
    		model.ReceiveEmail = entity.ReceiveEmail;
    		model.ReceiveText = entity.ReceiveText;
    		model.PasswordHash = entity.PasswordHash;
    		model.SecurityStamp = entity.SecurityStamp;
    		return model;
    	}
    }
}

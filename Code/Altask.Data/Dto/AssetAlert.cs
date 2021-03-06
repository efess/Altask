//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Altask.Data.Dto
{
    using Altask.Data;
    using System;
    using System.Collections.Generic;
    
    public partial class AssetAlert
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public AssetAlert()
        {
            this.Users = new HashSet<AssetAlertUser>();
        }
    
    	/// <summary>
    	/// Gets or sets the Id of this <see cref='Altask.Data.Dto.AssetAlert'/>.
    	/// </summary>
        public long Id { get; set; }
    	/// <summary>
    	/// Gets or sets the Active of this <see cref='Altask.Data.Dto.AssetAlert'/>.
    	/// </summary>
        public bool Active { get; set; }
    	/// <summary>
    	/// Gets or sets the AssetId of this <see cref='Altask.Data.Dto.AssetAlert'/>.
    	/// </summary>
        public int AssetId { get; set; }
    	/// <summary>
    	/// Gets or sets the AssetLogTypeId of this <see cref='Altask.Data.Dto.AssetAlert'/>.
    	/// </summary>
        public int AssetLogTypeId { get; set; }
    	/// <summary>
    	/// Gets or sets the Name of this <see cref='Altask.Data.Dto.AssetAlert'/>.
    	/// </summary>
        public string Name { get; set; }
    	/// <summary>
    	/// Gets or sets the Metadata of this <see cref='Altask.Data.Dto.AssetAlert'/>.
    	/// </summary>
        public object Metadata { get; set; }
    	/// <summary>
    	/// Gets or sets the CreatedBy of this <see cref='Altask.Data.Dto.AssetAlert'/>.
    	/// </summary>
        public string CreatedBy { get; set; }
    	/// <summary>
    	/// Gets or sets the CreatedOn of this <see cref='Altask.Data.Dto.AssetAlert'/>.
    	/// </summary>
        public System.DateTime CreatedOn { get; set; }
    	/// <summary>
    	/// Gets or sets the UpdatedBy of this <see cref='Altask.Data.Dto.AssetAlert'/>.
    	/// </summary>
        public string UpdatedBy { get; set; }
    	/// <summary>
    	/// Gets or sets the UpdatedOn of this <see cref='Altask.Data.Dto.AssetAlert'/>.
    	/// </summary>
        public System.DateTime UpdatedOn { get; set; }
    
        public virtual ICollection<AssetAlertUser> Users { get; set; }
        public virtual AssetLogType LogType { get; set; }
    }
}

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
    
    public partial class Asset
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Asset()
        {
            this.Alerts = new HashSet<AssetAlert>();
            this.Groups = new HashSet<AssetGrouping>();
        }
    
    	/// <summary>
    	/// Gets or sets the Id of this <see cref='Altask.Data.Dto.Asset'/>.
    	/// </summary>
        public int Id { get; set; }
    	/// <summary>
    	/// Gets or sets the Active of this <see cref='Altask.Data.Dto.Asset'/>.
    	/// </summary>
        public bool Active { get; set; }
    	/// <summary>
    	/// Gets or sets the AssetTypeId of this <see cref='Altask.Data.Dto.Asset'/>.
    	/// </summary>
        public int AssetTypeId { get; set; }
    	/// <summary>
    	/// Gets or sets the CustomId of this <see cref='Altask.Data.Dto.Asset'/>.
    	/// </summary>
        public string CustomId { get; set; }
    	/// <summary>
    	/// Gets or sets the Name of this <see cref='Altask.Data.Dto.Asset'/>.
    	/// </summary>
        public string Name { get; set; }
    	/// <summary>
    	/// Gets or sets the Description of this <see cref='Altask.Data.Dto.Asset'/>.
    	/// </summary>
        public string Description { get; set; }
    	/// <summary>
    	/// Gets or sets the DepartmentId of this <see cref='Altask.Data.Dto.Asset'/>.
    	/// </summary>
        public Nullable<int> DepartmentId { get; set; }
    	/// <summary>
    	/// Gets or sets the ManufacturerId of this <see cref='Altask.Data.Dto.Asset'/>.
    	/// </summary>
        public Nullable<int> ManufacturerId { get; set; }
    	/// <summary>
    	/// Gets or sets the Model of this <see cref='Altask.Data.Dto.Asset'/>.
    	/// </summary>
        public string Model { get; set; }
    	/// <summary>
    	/// Gets or sets the Serial of this <see cref='Altask.Data.Dto.Asset'/>.
    	/// </summary>
        public string Serial { get; set; }
    	/// <summary>
    	/// Gets or sets the Metadata of this <see cref='Altask.Data.Dto.Asset'/>.
    	/// </summary>
        public object Metadata { get; set; }
    	/// <summary>
    	/// Gets or sets the CreatedBy of this <see cref='Altask.Data.Dto.Asset'/>.
    	/// </summary>
        public string CreatedBy { get; set; }
    	/// <summary>
    	/// Gets or sets the CreatedOn of this <see cref='Altask.Data.Dto.Asset'/>.
    	/// </summary>
        public System.DateTime CreatedOn { get; set; }
    	/// <summary>
    	/// Gets or sets the UpdatedBy of this <see cref='Altask.Data.Dto.Asset'/>.
    	/// </summary>
        public string UpdatedBy { get; set; }
    	/// <summary>
    	/// Gets or sets the UpdatedOn of this <see cref='Altask.Data.Dto.Asset'/>.
    	/// </summary>
        public System.DateTime UpdatedOn { get; set; }
    
        public virtual AssetType Type { get; set; }
        public virtual Department Department { get; set; }
        public virtual Manufacturer Manufacturer { get; set; }
        public virtual ICollection<AssetAlert> Alerts { get; set; }
        public virtual ICollection<AssetGrouping> Groups { get; set; }
    }
}

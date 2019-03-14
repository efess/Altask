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
    
    public partial class AssetLogResolution
    {
    	/// <summary>
    	/// Gets or sets the Id of this <see cref='Altask.Data.Dto.AssetLogResolution'/>.
    	/// </summary>
        public long Id { get; set; }
    	/// <summary>
    	/// Gets or sets the AssetLogId of this <see cref='Altask.Data.Dto.AssetLogResolution'/>.
    	/// </summary>
        public long AssetLogId { get; set; }
    	/// <summary>
    	/// Gets or sets the TaskId of this <see cref='Altask.Data.Dto.AssetLogResolution'/>.
    	/// </summary>
        public long TaskId { get; set; }
    	/// <summary>
    	/// Gets or sets the OccurrenceId of this <see cref='Altask.Data.Dto.AssetLogResolution'/>.
    	/// </summary>
        public long OccurrenceId { get; set; }
    	/// <summary>
    	/// Gets or sets the CreatedBy of this <see cref='Altask.Data.Dto.AssetLogResolution'/>.
    	/// </summary>
        public string CreatedBy { get; set; }
    	/// <summary>
    	/// Gets or sets the CreatedOn of this <see cref='Altask.Data.Dto.AssetLogResolution'/>.
    	/// </summary>
        public System.DateTime CreatedOn { get; set; }
    	/// <summary>
    	/// Gets or sets the UpdatedBy of this <see cref='Altask.Data.Dto.AssetLogResolution'/>.
    	/// </summary>
        public string UpdatedBy { get; set; }
    	/// <summary>
    	/// Gets or sets the UpdatedOn of this <see cref='Altask.Data.Dto.AssetLogResolution'/>.
    	/// </summary>
        public System.DateTime UpdatedOn { get; set; }
    
        public virtual Occurrence Occurrence { get; set; }
        public virtual Task Task { get; set; }
    }
}
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
    
    public partial class FormLog
    {
    	/// <summary>
    	/// Gets or sets the Id of this <see cref='Altask.Data.Dto.FormLog'/>.
    	/// </summary>
        public long Id { get; set; }
    	/// <summary>
    	/// Gets or sets the FormId of this <see cref='Altask.Data.Dto.FormLog'/>.
    	/// </summary>
        public int FormId { get; set; }
    	/// <summary>
    	/// Gets or sets the Type of this <see cref='Altask.Data.Dto.FormLog'/>.
    	/// </summary>
        public string Type { get; set; }
    	/// <summary>
    	/// Gets or sets the Description of this <see cref='Altask.Data.Dto.FormLog'/>.
    	/// </summary>
        public string Description { get; set; }
    	/// <summary>
    	/// Gets or sets the BeforeModel of this <see cref='Altask.Data.Dto.FormLog'/>.
    	/// </summary>
        public string BeforeModel { get; set; }
    	/// <summary>
    	/// Gets or sets the BeforeVersion of this <see cref='Altask.Data.Dto.FormLog'/>.
    	/// </summary>
        public string BeforeVersion { get; set; }
    	/// <summary>
    	/// Gets or sets the AfterModel of this <see cref='Altask.Data.Dto.FormLog'/>.
    	/// </summary>
        public string AfterModel { get; set; }
    	/// <summary>
    	/// Gets or sets the AfterVersion of this <see cref='Altask.Data.Dto.FormLog'/>.
    	/// </summary>
        public string AfterVersion { get; set; }
    	/// <summary>
    	/// Gets or sets the CreatedBy of this <see cref='Altask.Data.Dto.FormLog'/>.
    	/// </summary>
        public string CreatedBy { get; set; }
    	/// <summary>
    	/// Gets or sets the CreatedOn of this <see cref='Altask.Data.Dto.FormLog'/>.
    	/// </summary>
        public System.DateTime CreatedOn { get; set; }
    	/// <summary>
    	/// Gets or sets the UpdatedBy of this <see cref='Altask.Data.Dto.FormLog'/>.
    	/// </summary>
        public string UpdatedBy { get; set; }
    	/// <summary>
    	/// Gets or sets the UpdatedOn of this <see cref='Altask.Data.Dto.FormLog'/>.
    	/// </summary>
        public System.DateTime UpdatedOn { get; set; }
    }
}

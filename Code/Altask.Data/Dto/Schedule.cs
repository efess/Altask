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
    
    public partial class Schedule
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Schedule()
        {
            this.Assets = new HashSet<ScheduleAsset>();
            this.Logs = new HashSet<ScheduleLog>();
            this.Users = new HashSet<ScheduleUser>();
        }
    
    	/// <summary>
    	/// Gets or sets the Id of this <see cref='Altask.Data.Dto.Schedule'/>.
    	/// </summary>
        public long Id { get; set; }
    	/// <summary>
    	/// Gets or sets the Active of this <see cref='Altask.Data.Dto.Schedule'/>.
    	/// </summary>
        public bool Active { get; set; }
    	/// <summary>
    	/// Gets or sets the TaskId of this <see cref='Altask.Data.Dto.Schedule'/>.
    	/// </summary>
        public long TaskId { get; set; }
    	/// <summary>
    	/// Gets or sets the Name of this <see cref='Altask.Data.Dto.Schedule'/>.
    	/// </summary>
        public string Name { get; set; }
    	/// <summary>
    	/// Gets or sets the Description of this <see cref='Altask.Data.Dto.Schedule'/>.
    	/// </summary>
        public string Description { get; set; }
    	/// <summary>
    	/// Gets or sets the Frequency of this <see cref='Altask.Data.Dto.Schedule'/>.
    	/// </summary>
        public string Frequency { get; set; }
    	/// <summary>
    	/// Gets or sets the EndsAfter of this <see cref='Altask.Data.Dto.Schedule'/>.
    	/// </summary>
        public Nullable<int> EndsAfter { get; set; }
    	/// <summary>
    	/// Gets or sets the EndsOn of this <see cref='Altask.Data.Dto.Schedule'/>.
    	/// </summary>
        public Nullable<System.DateTime> EndsOn { get; set; }
    	/// <summary>
    	/// Gets or sets the EveryN of this <see cref='Altask.Data.Dto.Schedule'/>.
    	/// </summary>
        public Nullable<int> EveryN { get; set; }
    	/// <summary>
    	/// Gets or sets the OnWeek of this <see cref='Altask.Data.Dto.Schedule'/>.
    	/// </summary>
        public Nullable<int> OnWeek { get; set; }
    	/// <summary>
    	/// Gets or sets the AnyTime of this <see cref='Altask.Data.Dto.Schedule'/>.
    	/// </summary>
        public Nullable<bool> AnyTime { get; set; }
    	/// <summary>
    	/// Gets or sets the AsEarlyAsN of this <see cref='Altask.Data.Dto.Schedule'/>.
    	/// </summary>
        public Nullable<int> AsEarlyAsN { get; set; }
    	/// <summary>
    	/// Gets or sets the AsEarlyAsFrequency of this <see cref='Altask.Data.Dto.Schedule'/>.
    	/// </summary>
        public string AsEarlyAsFrequency { get; set; }
    	/// <summary>
    	/// Gets or sets the OnMonday of this <see cref='Altask.Data.Dto.Schedule'/>.
    	/// </summary>
        public bool OnMonday { get; set; }
    	/// <summary>
    	/// Gets or sets the OnTuesday of this <see cref='Altask.Data.Dto.Schedule'/>.
    	/// </summary>
        public bool OnTuesday { get; set; }
    	/// <summary>
    	/// Gets or sets the OnWednesday of this <see cref='Altask.Data.Dto.Schedule'/>.
    	/// </summary>
        public bool OnWednesday { get; set; }
    	/// <summary>
    	/// Gets or sets the OnThursday of this <see cref='Altask.Data.Dto.Schedule'/>.
    	/// </summary>
        public bool OnThursday { get; set; }
    	/// <summary>
    	/// Gets or sets the OnFriday of this <see cref='Altask.Data.Dto.Schedule'/>.
    	/// </summary>
        public bool OnFriday { get; set; }
    	/// <summary>
    	/// Gets or sets the OnSaturday of this <see cref='Altask.Data.Dto.Schedule'/>.
    	/// </summary>
        public bool OnSaturday { get; set; }
    	/// <summary>
    	/// Gets or sets the OnSunday of this <see cref='Altask.Data.Dto.Schedule'/>.
    	/// </summary>
        public bool OnSunday { get; set; }
    	/// <summary>
    	/// Gets or sets the StartsOn of this <see cref='Altask.Data.Dto.Schedule'/>.
    	/// </summary>
        public System.DateTime StartsOn { get; set; }
    	/// <summary>
    	/// Gets or sets the CreatedBy of this <see cref='Altask.Data.Dto.Schedule'/>.
    	/// </summary>
        public string CreatedBy { get; set; }
    	/// <summary>
    	/// Gets or sets the CreatedOn of this <see cref='Altask.Data.Dto.Schedule'/>.
    	/// </summary>
        public System.DateTime CreatedOn { get; set; }
    	/// <summary>
    	/// Gets or sets the UpdatedBy of this <see cref='Altask.Data.Dto.Schedule'/>.
    	/// </summary>
        public string UpdatedBy { get; set; }
    	/// <summary>
    	/// Gets or sets the UpdatedOn of this <see cref='Altask.Data.Dto.Schedule'/>.
    	/// </summary>
        public System.DateTime UpdatedOn { get; set; }
    
        public virtual ICollection<ScheduleAsset> Assets { get; set; }
        public virtual ICollection<ScheduleLog> Logs { get; set; }
        public virtual ICollection<ScheduleUser> Users { get; set; }
    }
}

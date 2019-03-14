using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Altask.Data.Dto;
using Altask.Data.Model;

namespace Altask.www.Models {
	public class TaskInstance {
		/// <summary>
		/// Gets or sets the TaskId of this <see cref='Altask.www.Models.TaskInstance'/>.
		/// </summary>
		public long TaskId { get; set; }
		/// <summary>
		/// Gets or sets the Name of this <see cref='Altask.www.Models.TaskInstance'/>.
		/// </summary>
		public string Name { get; set; }
        /// <summary>
    	/// Gets or sets the AnyTime of this <see cref="Altask.www.Models.TaskInstance"/>.
    	/// </summary>
        public bool AnyTime { get; set; }
        /// <summary>
        /// The <see cref="Altask.Data.Dto.Asset"/> associated with the <see cref="Altask.www.Models.TaskInstance"/>.
        /// </summary>
        public int? AssetId { get; set; }
		/// <summary>
		/// The earliest date, if specified at which the <see cref='Altask.www.Models.TaskInstance'/> can be started.
		/// </summary>
		public DateTime? AsEarlyAsDate { get; set; }
		/// <summary>
		/// The date on which the <see cref='Altask.www.Models.TaskInstance'/> will or has occurred.
		/// </summary>
		public DateTime Date { get; set; }
		/// <summary>
		/// Gets or sets the Description of this <see cref='Altask.www.Models.TaskInstance'/>.
		/// </summary>
		public string Description { get; set; }
		/// <summary>
		/// The Id of the associated <see cref="Altask.www.Models.TaskInstance"/>.
		/// </summary>
		public long OccurrenceId { get; set; }
		/// <summary>
		/// Gets or sets the ScheduleId of this <see cref='Altask.www.Models.TaskInstance'/>.
		/// </summary>
		public long ScheduleId { get; set; }
		/// <summary>
		/// Gets or sets the FormModel of this <see cref='Altask.www.Models.TaskInstance'/>.
		/// </summary>
		public string FormModel { get; set; }
		/// <summary>
		/// Gets or sets the XmlResults of this <see cref='Altask.www.Models.TaskInstance'/>.
		/// </summary>
		public string XmlResults { get; set; }
		/// <summary>
		/// Gets or sets the Dismissed of this <see cref='Altask.www.Models.TaskInstance'/>.
		/// </summary>
		public Nullable<bool> Dismissed { get; set; }
		/// <summary>
		/// Gets or sets the DismissedBy of this <see cref='Altask.www.Models.TaskInstance'/>.
		/// </summary>
		public string DismissedBy { get; set; }
		/// <summary>
		/// Gets or sets the DismissedOn of this <see cref='Altask.www.Models.TaskInstance'/>.
		/// </summary>
		public Nullable<System.DateTime> DismissedOn { get; set; }
        /// <summary>
        /// Gets or sets the IdleTimeout of this <see cref='Altask.www.Models.TaskInstance'/>.
        /// </summary>
        public int IdleTimeout { get; set; }
		/// <summary>
		/// Gets or sets the Started of this <see cref='Altask.www.Models.TaskInstance'/>.
		/// </summary>
		public Nullable<bool> Started { get; set; }
		/// <summary>
		/// Gets or sets the StartedBy of this <see cref='Altask.www.Models.TaskInstance'/>.
		/// </summary>
		public string StartedBy { get; set; }
		/// <summary>
		/// Gets or sets the StartedOn of this <see cref='Altask.www.Models.TaskInstance'/>.
		/// </summary>
		public Nullable<System.DateTime> StartedOn { get; set; }
		/// <summary>
		/// Gets or sets the StoppedBy of this <see cref='Altask.www.Models.TaskInstance'/>.
		/// </summary>
		public string StoppedBy { get; set; }
		/// <summary>
		/// Gets or sets the StoppedOn of this <see cref='Altask.www.Models.TaskInstance'/>.
		/// </summary>
		public Nullable<System.DateTime> StoppedOn { get; set; }
		/// <summary>
		/// Gets or sets the ResumedBy of this <see cref='Altask.www.Models.TaskInstance'/>.
		/// </summary>
		public string ResumedBy { get; set; }
		/// <summary>
		/// Gets or sets the ResumedOn of this <see cref='Altask.www.Models.TaskInstance'/>.
		/// </summary>
		public Nullable<System.DateTime> ResumedOn { get; set; }
		/// <summary>
		/// Gets or sets the Completed of this <see cref='Altask.www.Models.TaskInstance'/>.
		/// </summary>
		public Nullable<bool> Completed { get; set; }
		/// <summary>
		/// Gets or sets the CompletedBy of this <see cref='Altask.www.Models.TaskInstance'/>.
		/// </summary>
		public string CompletedBy { get; set; }
		/// <summary>
		/// Gets or sets the CompletedOn of this <see cref='Altask.www.Models.TaskInstance'/>.
		/// </summary>
		public Nullable<System.DateTime> CompletedOn { get; set; }
		/// <summary>
		/// Gets or sets the TimeSpent of this <see cref='Altask.www.Models.TaskInstance'/>.
		/// </summary>
		public Nullable<int> TimeSpent { get; set; }
		/// <summary>
		/// Gets or sets the Metadata of this <see cref='Altask.www.Models.TaskInstance'/>.
		/// </summary>
		public object Metadata { get; set; }
		/// <summary>
		/// The <see cref="Altask.Data.Dto.User"/> associated with the <see cref="Altask.www.Models.TaskInstance"/>.
		/// </summary>
		public int? UserId { get; set; }
		public virtual Data.Dto.Asset Asset { get; set; }
		public virtual Data.Dto.TaskCategory Category { get; set; }
		public virtual Data.Dto.TaskType Type { get; set; }
		public virtual Data.Dto.User User { get; set; }

		/// <summary>
		/// Create a new <see cref="Altask.www.Models.TaskInstance"/>.
		/// </summary>
		/// <param name="task"></param>
		/// <param name="asset"></param>
		/// <param name="date"></param>
		/// <returns></returns>
		private static TaskInstance Create(Data.Dto.Task task, Data.Dto.Asset asset, DateTime date) {
			return Create(task, asset, null, date);
		}

		/// <summary>
		/// Create a new <see cref="Altask.www.Models.TaskInstance"/>.
		/// </summary>
		/// <param name="task"></param>
		/// <param name="user"></param>
		/// <param name="date"></param>
		/// <returns></returns>
		private static TaskInstance Create(Data.Dto.Task task, Data.Dto.User user, DateTime date) {
			return Create(task, null, user, date);
		}

		/// <summary>
		/// Create a new <see cref="Altask.www.Models.TaskInstance"/>.
		/// </summary>
		/// <param name="task"></param>
		/// <param name="asset"></param>
		/// <param name="user"></param>
		/// <param name="date"></param>
		/// <returns></returns>
		private static TaskInstance Create(Data.Dto.Task task, Data.Dto.Asset asset, Data.Dto.User user, DateTime date) {
			var instance = new TaskInstance() {
				Description = task.Description,
				Date = date,
                IdleTimeout = task.IdleTimeout,
				FormModel = task.Form.PublishedModel,
				TaskId = task.Id,
				Metadata = task.Metadata,
				Name = task.Name,
				Category = task.Category,
				Type = task.Type,
			};

			if (asset != null) {
				instance.AssetId = asset.Id;
				instance.Asset = asset;
			}

			if (user != null) {
				instance.UserId = user.Id;
				instance.User = user;
			}

			return instance;
		}
		/// <summary>
		/// Create a new <see cref="Altask.www.Models.TaskInstance"/> from a <see cref="Altask.Data.Dto.Schedule"/>.
		/// </summary>
		/// <param name="task"></param>
		/// <param name="date"></param>
		/// <param name="schedule"></param>
		/// <returns></returns>
		public static TaskInstance FromSchedule(Data.Dto.Task task, DateTime date, Data.Dto.Schedule schedule) {
			var instance = TaskInstance.Create(task, null, null, date);
            instance.AnyTime = schedule.AnyTime.GetValueOrDefault(false);

            if (!instance.AnyTime && schedule.AsEarlyAsN.HasValue) {
				switch (schedule.AsEarlyAsFrequency) {
					case "Minute(s)":
					instance.AsEarlyAsDate = date.AddMinutes(-(double)schedule.AsEarlyAsN);
					break;
					case "Hour(s)":
					instance.AsEarlyAsDate = date.AddHours(-(double)schedule.AsEarlyAsN);
					break;
					case "Day(s)":
					instance.AsEarlyAsDate = date.AddDays(-(double)schedule.AsEarlyAsN);
					break;
					case "Week(s)":
					instance.AsEarlyAsDate = date.AddDays(-(double)(schedule.AsEarlyAsN * 7));
					break;
					case "Month(s)":
					instance.AsEarlyAsDate = date.AddMonths(-schedule.AsEarlyAsN.Value);
					break;
				}
			}

			instance.ScheduleId = schedule.Id;
			return instance;
		}
		/// <summary>
		/// Create a new <see cref="Altask.www.Models.TaskInstance"/> from a <see cref="Altask.Data.Model.Schedule"/>.
		/// </summary>
		/// <param name="task"></param>
		/// <param name="date"></param>
		/// <param name="schedule"></param>
		/// <returns></returns>
		public static TaskInstance FromSchedule(Data.Model.Task task, DateTime date, Data.Model.Schedule schedule) {
			return FromSchedule(task.ToDto(), date, schedule.ToDto());
		}
		/// <summary>
		/// Create a new <see cref="Altask.www.Models.TaskInstance"/> from a <see cref="Altask.Data.Dto.Occurrence"/>.
		/// </summary>
		/// <param name="task"></param>
		/// <param name="date"></param>
		/// <param name="occurrence"></param>
		/// <returns></returns>
		public TaskInstance MergeOccurrence(Data.Dto.Occurrence occurrence) {
			AssetId = occurrence.AssetId;
			Asset = occurrence.Asset;
			AsEarlyAsDate = occurrence.AsEarlyAsDate;
			Completed = occurrence.Completed;
			CompletedBy = occurrence.CompletedBy;
			CompletedOn = occurrence.CompletedOn;
			Date = occurrence.Date;
			Dismissed = occurrence.Dismissed;
			DismissedBy = occurrence.DismissedBy;
			DismissedOn = occurrence.DismissedOn;
			FormModel = occurrence.FormModel;
			OccurrenceId = occurrence.Id;
			ResumedBy = occurrence.ResumedBy;
			ResumedOn = occurrence.ResumedOn;
			ScheduleId = occurrence.ScheduleId;
			Started = occurrence.Started;
			StartedBy = occurrence.StartedBy;
			StartedOn = occurrence.StartedOn;
			StoppedBy = occurrence.StoppedBy;
			StoppedOn = occurrence.StoppedOn;
			TimeSpent = occurrence.TimeSpent;
			UserId = occurrence.UserId;
			User = occurrence.User;
			return this;
		}
		/// <summary>
		/// Create a new <see cref="Altask.www.Models.TaskInstance"/> from a <see cref="Altask.www.Models.TaskInstance"/>.
		/// </summary>
		/// <param name="task"></param>
		/// <param name="date"></param>
		/// <param name="occurrence"></param>
		/// <returns></returns>
		public TaskInstance MergeOccurrence(Data.Model.Occurrence occurrence) {
            return MergeOccurrence(occurrence.ToDto());
		}
	}
}
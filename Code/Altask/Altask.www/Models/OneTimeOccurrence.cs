using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Altask.www.Models {
    public class AlertResolution {
        public int? AsEarlyAsN { get; set; }
        public string AsEarlyAsFrequency { get; set; }
        public string Name { get; set; }
        [Required]
        public int TaskCategoryId { get; set; }
        [Required]
        public DateTime Date { get; set; }
        public string Description { get; set; }
        [Required]
        public int FormId { get; set; }
        public int IdleTimeout { get; set; }
        [Required]
        public int AssetId { get; set; }
        [Required]
        public int UserId { get; set; }
        [Required]
        public long AssetLogId { get; set; }
    }

    public class OneTimeOccurrence {
        public int? AsEarlyAsN { get; set; }
        public string AsEarlyAsFrequency { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public int TaskCategoryId { get; set; }
        [Required]
        public DateTime Date { get; set; }
        public string Description { get; set; }
        [Required]
        public int FormId { get; set; }
        public int IdleTimeout { get; set; }
        public List<int> AssetIds { get; set; }
        public List<int> UserIds { get; set; }
    }
}
using Altask.Data.Model;
using Altask.www.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace Altask.www.Reports
{
    public class PastDueTasksReport : IReport
    {
        private Tuple<DateTime, DateTime> GetDateRange(string range)
        {
            var now = DateTime.Now;
            switch (range)
            {
                case "today":
                default:
                    return new Tuple<DateTime, DateTime>(now.Date, now.Date.AddDays(1));
                case "currentweek":
                    {
                        int diff = (7 + (int)now.DayOfWeek) % 7;
                        var from = now.AddDays(-1 * diff).Date;
                        var to = from.AddDays(7);
                        return new Tuple<DateTime, DateTime>(from, to);
                    }
                case "lastweek":
                    {
                        int diff = ((7 + (int)now.DayOfWeek) % 7) + 7;
                        var  from = now.AddDays(-1 * diff).Date;
                        var to = from.AddDays(7);
                        return new Tuple<DateTime, DateTime>(from, to);
                    }
                case "currentmonth":
                    {
                        var firstDayOfMonth = new DateTime(now.Year, now.Month, 1);
                        return new Tuple<DateTime, DateTime>(firstDayOfMonth, firstDayOfMonth.AddMonths(1));
                    }
                case "lastmonth":
                    { 

                        var firstDayOfMonth = new DateTime(now.Year, now.Month, 1).AddMonths(-1);
                        return new Tuple<DateTime, DateTime>(firstDayOfMonth, firstDayOfMonth.AddMonths(1));
                    }
            }

        }
        public async Task<ReportResults> RunReport(AltaskDbContext context, string[] parameters)
        {
            var range = GetDateRange(parameters[0]);
            var toDate = range.Item2 > DateTime.Now ? DateTime.Now : range.Item2;
            var options = new ProjectToOptions()
            {
                FromDate = range.Item1,
                ToDate = toDate
            };
            var tasks = await Helper.TaskInstance.Create(context, options);
            var records = tasks
                .Where(t => !t.Completed.HasValue || !t.Completed.Value)
                .Select(task => new
                {
                    Task = task.Name,
                    AssetId = task.Asset.Id,
                    Asset = task.Asset.Name,
                    CustomId = task.Asset.CustomId,
                    Serial = task.Asset.Serial,
                    Department = task.Asset.Department.Name,
                    DueDate = task.Date.ToString("MM/dd/yyyy"),
                    DueTime = task.Date.ToString("hh:mm tt")
                })
                .Cast<object>()
                .ToList();

            return new ReportResults() { Columns = new List<string> { "Task", "AssetId", "Asset", "CustomId", "Serial","Department", "DueDate", "DueTime" }, Records = records };
        }
    }
}
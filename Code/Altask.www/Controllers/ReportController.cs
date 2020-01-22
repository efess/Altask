using Altask.www.Reports;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace Altask.www.Controllers
{
    [Authorize]
    public class ReportController : BaseController
    {
        private Dictionary<string, IReport> reports = new Dictionary<string, IReport>(){
            {"ReportComplaints", new ComplaintsReport() },
            {"ReportNotes", new NotesReport() },
            {"ReportLastNTaskCompletions", new LastNTaskCompletionsReport() },
            {"ReportFormChanges", new FormChangesReport() },
            {"ReportPastDueTasks", new PastDueTasksReport() },
        };

        [HttpPost]
        [JsonNetFilter]
        public async Task<ActionResult> RunReport(string reportName, string[] parameters)
        {
            var storedProcedure = string.Empty;

            if (!reports.ContainsKey(reportName))
            {
                return await Task.FromResult(BadRequest(ErrorDescriber.DoesNotExist("Report")));
            }

            var report = reports[reportName];

            try
            {
                using (var command = new SqlCommand(storedProcedure, Context.Database.Connection as SqlConnection))
                {
                    var result = await report.RunReport(Context, parameters);
                    return Ok(new { columns = result.Columns, records = result.Records });
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(BadRequest(ErrorDescriber.DefaultError(ex.Message)));
            }
        }
    }
}
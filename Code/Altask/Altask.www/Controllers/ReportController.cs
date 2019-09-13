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
        [HttpPost]
        [JsonNetFilter]
        public async Task<ActionResult> RunReport(string reportName, string[] parameters)
        {
            var storedProcedure = string.Empty;
            switch (reportName)
            {
                case "ReportComplaints": storedProcedure = "[dbo].[ReportComplaints]"; break;
                case "ReportNotes": storedProcedure = "[dbo].[ReportNotes]"; break;
                case "ReportLastNTaskCompletions": storedProcedure = "[dbo].[ReportLastNTaskCompletions]"; break;
                case "ReportFormChanges": storedProcedure = "[dbo].[ReportFormChanges]"; break;
            }

            if (string.IsNullOrEmpty(storedProcedure))
            {
                return await Task.FromResult(BadRequest(ErrorDescriber.DoesNotExist("Report")));
            }

            try
            {
                using (var command = new SqlCommand(storedProcedure, Context.Database.Connection as SqlConnection))
                {
                    bool closeConnection = false;

                    if (command.Connection.State != ConnectionState.Open)
                    {
                        command.Connection.Open();
                        closeConnection = true;
                    }

                    command.CommandTimeout = 300;
                    command.CommandType = System.Data.CommandType.StoredProcedure;
                    var reader = await command.ExecuteReaderAsync();
                    var columns = new List<string>();
                    var records = new List<object>();

                    for (int index = 0; index < reader.FieldCount; index++)
                    {
                        columns.Add(reader.GetName(index));
                    }

                    while (await reader.ReadAsync())
                    {
                        var record = new ExpandoObject();
                        var dictionary = record as IDictionary<string, object>;

                        foreach (var column in columns)
                        {
                            dictionary.Add(column, reader[column].ToString());
                        }

                        records.Add(record);
                    }

                    if (closeConnection)
                    {
                        command.Connection.Close();
                    }

                    return Ok(new { columns = columns, records = records });
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(BadRequest(ErrorDescriber.DefaultError(ex.Message)));
            }
        }
    }
}
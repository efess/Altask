using Altask.Data.Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace Altask.www.Reports
{
    public abstract class StoredProcedureReport : IReport
    {
        public abstract Task<ReportResults> RunReport(AltaskDbContext context, string[] parameters);

        protected async Task<ReportResults> RunStoredProcedure(AltaskDbContext context, string storedProcedure)
        {
            using (var command = new SqlCommand(storedProcedure, context.Database.Connection as SqlConnection))
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

                return new ReportResults { Columns = columns, Records = records };
            }
        }
    }
}
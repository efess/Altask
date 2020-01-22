using Altask.Data.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace Altask.www.Reports
{
    public class FormChangesReport : StoredProcedureReport
    {
        public override Task<ReportResults> RunReport(AltaskDbContext context, string[] parameters)
        {
            return RunStoredProcedure(context, "[dbo].[ReportFormChanges]");
        }
    }
}
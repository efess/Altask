using Altask.Data.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace Altask.www.Reports
{
    public interface IReport
    {
        Task<ReportResults> RunReport(AltaskDbContext context, string[] parameters);
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Altask.www.Reports
{
    public class ReportResults
    {
        public List<string> Columns { get; set; }
        public List<object> Records { get; set; }
    }
}
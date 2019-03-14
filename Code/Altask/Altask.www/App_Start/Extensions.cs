using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Altask.www
{
    public static class Extensions
    {
        public static DateTime LessSeconds(this DateTime date)
        {
            return new DateTime(date.Year, date.Month, date.Day, date.Hour, date.Minute, 0, 0);
        }
    }
}
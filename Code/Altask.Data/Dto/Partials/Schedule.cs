using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Altask.Data.Dto {
    public partial class Schedule {
        public List<DateTime> GetRunDates(DateTime from, DateTime to) {
            if (StartsOn > to || (EndsOn.HasValue && EndsOn < from)) {
                return new List<DateTime>();
            }

            var dates = new List<DateTime>();
            var endsOnDate = !EndsOn.HasValue ? DateTime.MinValue : EndsOn < to ? EndsOn : to;
            var endsAfter = !EndsOn.HasValue ? EndsAfter : 0;

            var daysOfWeek = new[] {
                OnSunday,
                OnMonday,
                OnTuesday,
                OnWednesday,
                OnThursday,
                OnFriday,
                OnSaturday
            };

            var lastDow = 0;
            var occurrence = 0;

            Func<DateTime, bool> inWindow = delegate (DateTime value) {
                if (value >= from && value <= to) {
                    return true;
                }

                return false;
            };

            var date = StartsOn;

            for (var index = 0; index < 7; index++) {
                if (daysOfWeek[index]) {
                    lastDow = index;
                }
            }

            switch (Frequency) {
                case "One-Time":
                    if (inWindow(date)) {
                        dates.Add(date);
                    }

                    break;

                case "Daily":

                    while (occurrence < endsAfter || date <= endsOnDate) {
                        if (inWindow(date)) {
                            dates.Add(date);
                        }

                        occurrence++;
                        date = date.AddDays(EveryN.Value);
                    }

                    break;

                case "Weekly":

                    while (occurrence < endsAfter || date <= endsOnDate) {
                        if (daysOfWeek[(int)date.DayOfWeek] && inWindow(date)) {
                            dates.Add(date);
                        }

                        if (dates.Count > 0 && (int)date.DayOfWeek == lastDow) {
                            occurrence++;
                            date = date.StartOfWeek().AddDays(EveryN.Value * 7);
                        }
                        else {
                            date = date.AddDays(1);
                        }
                    }

                    break;

                case "Monthly":

                    while (occurrence < endsAfter || date <= endsOnDate) {
                        if (OnWeek == 6) {
                            var dayIndex = DateTime.DaysInMonth(date.Year, date.Month);
                            var lastWorkingDayOfMonth = new DateTime(date.Year, date.Month, dayIndex);

                            while (dayIndex > 0) {
                                var dayOfMonth = new DateTime(date.Year, date.Month, dayIndex);

                                if (dayOfMonth.DayOfWeek == DayOfWeek.Sunday || dayOfMonth.DayOfWeek == DayOfWeek.Saturday) {
                                    dayIndex--;
                                } else {
                                    lastWorkingDayOfMonth = new DateTime(date.Year, date.Month, dayIndex);
                                    dayIndex = 0;
                                }
                            }

                            if (lastWorkingDayOfMonth <= endsOnDate) {
                                occurrence++;

                                if (inWindow(lastWorkingDayOfMonth)) {
                                    dates.Add(lastWorkingDayOfMonth);
                                }
                            }

                            date = date.StartOfMonth().AddMonths(EveryN.Value);
                        }
                        else {
                            var lastWeekInMonth = date.WeeksInMonth();
                            var validWeek = lastWeekInMonth < OnWeek ? date.WeekInMonth() == lastWeekInMonth : date.WeekInMonth() == OnWeek;

                            if (validWeek && daysOfWeek[(int)date.DayOfWeek] && inWindow(date)) {
                                dates.Add(date);
                            }

                            if (dates.Count > 0 && (int)date.DayOfWeek == lastDow) {
                                occurrence++;
                                date = date.StartOfMonth().AddMonths(EveryN.Value);
                            }
                            else {
                                date = date.AddDays(1);
                            }
                        }
                    }

                    break;

                case "Quarterly":
                    Action addQuarter = delegate ()
                    {
                        if (date.Month >= 1 && date.Month < 4)
                        {
                            date = new DateTime(date.Year, 4, 1);
                        }
                        else if (date.Month >= 4 && date.Month < 7)
                        {
                            date = new DateTime(date.Year, 7, 1);
                        }
                        else if (date.Month >= 7 && date.Month < 9)
                        {
                            date = new DateTime(date.Year, 9, 1);
                        }
                        else if (date.Month >= 9)
                        {
                            date = new DateTime(date.Year + 1, 1, 1);
                        }
                    };


                    if (date.Month > 1 && date.Month < 4)
                    {
                        date = new DateTime(date.Year, 1, 1);
                    } else if (date.Month > 4 && date.Month < 7)
                    {
                        date = new DateTime(date.Year, 4, 1);
                    } else if (date.Month > 7 && date.Month < 9)
                    {
                        date = new DateTime(date.Year, 7, 1);
                    } else if (date.Month > 9)
                    {
                        date = new DateTime(date.Year, 9, 1);
                    }

                    while (date < StartsOn) {
                        addQuarter();
                    }


                    while (occurrence < endsAfter || date <= endsOnDate)
                    {
                        if (inWindow(date))
                        {
                            dates.Add(date);  
                        }

                        occurrence++;
                        addQuarter();
                    }

                    break;

                case "Yearly":
                    date = new DateTime(date.Year, 1, 1);

                    while(date < StartsOn)
                    {
                        date = date.AddYears(1);
                    }

                    while (occurrence < endsAfter || date <= endsOnDate)
                    {
                        if (inWindow(date))
                        {  
                            dates.Add(date);   
                        }

                        occurrence++;
                        date = date.AddYears(1);
                    }

                    break;
            }

            return dates;
        }
    }
}

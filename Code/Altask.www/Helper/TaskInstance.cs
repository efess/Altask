using Altask.Data.Model;
using Altask.www.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace Altask.www.Helper
{
    public static class TaskInstance
    {
        public static async Task<List<Models.TaskInstance>> Create(AltaskDbContext context, ProjectToOptions filter)
        {
            if (filter == null)
            {
                filter = new ProjectToOptions();
            }

            var fromDate = filter.FromDate;
            var toDate = filter.ToDate;
            var instances = new List<Models.TaskInstance>();

            if (fromDate <= DateTime.Now)
            {
                filter.ToDate = DateTime.Now;

                var pastOccurrences = await context.Occurrences.AsNoTracking().Where(filter.GetOccurrencePredicate())
                    .Include(e => e.Task)
                    .Include(e => e.Schedule)
                    .ToListAsync();

                foreach (var occurrence in pastOccurrences)
                {
                    var instance = Altask.www.Models.TaskInstance.FromSchedule(occurrence.Task, occurrence.Date, occurrence.Schedule);
                    instance.MergeOccurrence(occurrence);
                    instances.Add(instance);
                }

                filter.FromDate = DateTime.Now;
            }


            filter.ToDate = toDate;

            var tasks = await context.Tasks.AsNoTracking().Where(filter.GetTaskPredicate())
                .Include(e => e.Form)
                .Include(e => e.Schedules)
                .ToListAsync();

            var occurrences = await context.Occurrences.AsNoTracking().Where(filter.GetOccurrencePredicate()).ToListAsync();
            var userIds = filter.GetUserIds();
            var assetIds = filter.GetAssetIds();

            foreach (var task in tasks)
            {
                foreach (var schedule in task.Schedules)
                {
                    var dtoSchedule = schedule.ToDto();
                    var dates = dtoSchedule.GetRunDates(filter.FromDate, filter.ToDate);

                    foreach (var date in dates)
                    {
                        if (dtoSchedule.Assets.Count > 0)
                        {
                            foreach (var asset in dtoSchedule.Assets)
                            {
                                if (assetIds.Count > 0 && !assetIds.Contains(asset.AssetId))
                                {
                                    continue;
                                }

                                if (dtoSchedule.Users.Count > 0)
                                {
                                    foreach (var user in dtoSchedule.Users)
                                    {
                                        if (userIds.Count > 0 && !userIds.Contains(user.UserId))
                                        {
                                            continue;
                                        }

                                        var instance = Models.TaskInstance.FromSchedule(task, date, schedule);
                                        var occurrence = occurrences.SingleOrDefault(o => o.ScheduleId == schedule.Id && o.AssetId == asset.AssetId && o.UserId == user.Id && o.Date == date);

                                        if (occurrence != null)
                                        {
                                            instance.MergeOccurrence(occurrence);
                                        }
                                        else
                                        {
                                            instance.AssetId = asset.AssetId;
                                            instance.Asset = asset.Asset;
                                            instance.UserId = user.UserId;
                                            instance.User = user.User;
                                        }

                                        instances.Add(instance);
                                    }
                                }
                                else
                                {
                                    var instance = Models.TaskInstance.FromSchedule(task, date, schedule);
                                    var occurrence = occurrences.SingleOrDefault(o => o.ScheduleId == schedule.Id && o.AssetId == asset.AssetId && o.Date == date);

                                    if (occurrence != null)
                                    {
                                        instance.MergeOccurrence(occurrence);
                                    }
                                    else
                                    {
                                        instance.AssetId = asset.AssetId;
                                        instance.Asset = asset.Asset;
                                    }

                                    instances.Add(instance);
                                }
                            }
                        }
                        else
                        {
                            foreach (var user in dtoSchedule.Users)
                            {
                                if (userIds.Count > 0 && !userIds.Contains(user.UserId))
                                {
                                    continue;
                                }

                                var instance = Models.TaskInstance.FromSchedule(task, date, schedule);
                                var occurrence = occurrences.SingleOrDefault(o => o.ScheduleId == schedule.Id && o.UserId == user.UserId && o.Date == date);

                                if (occurrence != null)
                                {
                                    instance.MergeOccurrence(occurrence);
                                }
                                else
                                {
                                    instance.UserId = user.UserId;
                                    instance.User = user.User;
                                }

                                instances.Add(instance);
                            }
                        }
                    }
                }
            }

            return instances;
        }
    }
}
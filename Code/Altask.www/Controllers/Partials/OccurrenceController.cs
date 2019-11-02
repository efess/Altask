namespace Altask.www.Controllers {
    using Altask.www.Models;
    using Data;
    using Data.Model;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Web.Mvc;

    public partial class OccurrenceController {
        internal override void BeforeCreate(Data.Model.Occurrence entity, Data.Dto.Occurrence dto) {
            var schedule = entity.Schedule ?? Context.Schedules.FirstOrDefault(s => s.Id == entity.ScheduleId);
            entity.Date = entity.Date.LessSeconds();
            var date = entity.Date;

            if (schedule.AsEarlyAsN.HasValue) {
                switch (schedule.AsEarlyAsFrequency) {
                    case "Minute(s)":
                        entity.AsEarlyAsDate = date.AddMinutes(-(double)schedule.AsEarlyAsN);
                        break;
                    case "Hour(s)":
                        entity.AsEarlyAsDate = date.AddHours(-(double)schedule.AsEarlyAsN);
                        break;
                    case "Day(s)":
                        entity.AsEarlyAsDate = date.AddDays(-(double)schedule.AsEarlyAsN);
                        break;
                    case "Week(s)":
                        entity.AsEarlyAsDate = date.AddDays(-(double)(schedule.AsEarlyAsN * 7));
                        break;
                    case "Month(s)":
                        entity.AsEarlyAsDate = date.AddMonths(-schedule.AsEarlyAsN.Value);
                        break;
                }
            }
        }

        internal async Task<EntityResult> AfterCreateAsync(Altask.www.Models.TaskInstance instance, Altask.Data.Dto.Occurrence occurrence, bool notifyAll = false) {
            SignalRHub.NotifyOccurrenceCreate(ClientId, instance, occurrence);
            return await System.Threading.Tasks.Task.FromResult(EntityResult.Succeded(0));
        }

        internal async Task<EntityResult> AfterUpdateAsync(Altask.www.Models.TaskInstance instance, Altask.Data.Dto.Occurrence occurrence, bool notifyAll = false) {
            SignalRHub.NotifyOccurrenceUpdate(ClientId, instance, occurrence);
            return await System.Threading.Tasks.Task.FromResult(EntityResult.Succeded(0));
        }

        internal override async Task<EntityResult> AfterCreateAsync(Data.Model.Occurrence entity, bool notifyAll = false) {
            await Context.Entry(entity).Reference(e => e.Asset).LoadAsync();
            await Context.Entry(entity).Reference(e => e.User).LoadAsync();
            await Context.Entry(entity).Reference(e => e.Task).LoadAsync();
            await Context.Entry(entity).Reference(e => e.Schedule).LoadAsync();
            var instance = TaskInstance.FromSchedule(entity.Task, entity.Date, entity.Schedule).MergeOccurrence(entity);
            SignalRHub.NotifyOccurrenceCreate(ClientId, instance, entity.ToDto());
            return EntityResult.Succeded(0);
        }

        internal override async Task<EntityResult> AfterUpdateAsync(Data.Model.Occurrence entity, bool notifyAll = false) {
            await Context.Entry(entity).Reference(e => e.Asset).LoadAsync();
            await Context.Entry(entity).Reference(e => e.User).LoadAsync();
            await Context.Entry(entity).Reference(e => e.Task).LoadAsync();
            await Context.Entry(entity).Reference(e => e.Schedule).LoadAsync();
            var instance = TaskInstance.FromSchedule(entity.Task, entity.Date, entity.Schedule).MergeOccurrence(entity);
            SignalRHub.NotifyOccurrenceUpdate(ClientId, instance, entity.ToDto());
            return EntityResult.Succeded(0);
        }

        [HttpPost]
        [JsonNetFilter]
        /// <summary>
        /// Adds an alert resolution <see cref="Altask.Data.Model.Occurrence"/>.
        /// </summary>
        /// <param name="schedule"></param>
        /// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
        public virtual async Task<ActionResult> AddAlertResolution(AlertResolution model) {
            ThrowIfDisposed();

            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }

            model.Date = model.Date.LessSeconds();
            var assetEntity = await Context.Assets.FindAsync(model.AssetId);

            if (assetEntity == null) {
                return BadRequest(ErrorDescriber.DoesNotExist("Asset"));
            }

            var userEntity = await Context.Users.FindAsync(model.UserId);

            if (userEntity == null) {
                return BadRequest(ErrorDescriber.DoesNotExist("User"));
            }

            var assetLogEntity = await Context.AssetLogs.FindAsync(model.AssetLogId);

            if (assetLogEntity == null) {
                return BadRequest(ErrorDescriber.DoesNotExist("Asset Log"));
            }

            var taskTypeEntity = await Context.TaskTypes.FirstOrDefaultAsync(t => t.Name == "Adhoc");

            if (taskTypeEntity == null) {
                return BadRequest(ErrorDescriber.DefaultError("The Adhoc task type does not exist."));
            }

            var scheduleAssetType = await Context.ScheduleAssetTypes.FirstOrDefaultAsync(sat => sat.Name == "Primary");

            if (scheduleAssetType == null) {
                return BadRequest(ErrorDescriber.DefaultError("The Primary schedule asset type does not exist."));
            }

            var scheduleUserType = await Context.ScheduleUserTypes.FirstOrDefaultAsync(sut => sut.Name == "Primary");

            if (scheduleUserType == null) {
                return BadRequest(ErrorDescriber.DefaultError("The Primary schedule user type does not exist."));
            }

            var newTask = Context.Tasks.Add(new Data.Model.Task() {
                Active = true,
                TaskCategoryId = model.TaskCategoryId,
                Description = model.Description,
                FormId = model.FormId,
                IdleTimeout = model.IdleTimeout,
                Name = model.Name,
                TaskTypeId = taskTypeEntity.Id
            });

            var newSchedule = new Data.Model.Schedule() {
                Active = true,
                AnyTime = false,
                AsEarlyAsFrequency = model.AsEarlyAsFrequency,
                AsEarlyAsN = model.AsEarlyAsN,
                EndsAfter = 1,
                Frequency = "One-Time",
                Name = model.Name,
                StartsOn = model.Date
            };

            newSchedule.Assets.Add(new Data.Model.ScheduleAsset() {
                AssetId = assetEntity.Id,
                ScheduleAssetTypeId = scheduleAssetType.Id
            });

            newSchedule.Users.Add(new Data.Model.ScheduleUser() {
                UserId = userEntity.Id,
                ScheduleUserTypeId = scheduleUserType.Id
            });

            newTask.Schedules.Add(newSchedule);
            Context.Tasks.Add(newTask);
            var result = await Context.SaveChangesAsync();

            if (result.Succeeded) {
                SignalRHub.NotifyTaskCreate(ClientId, newTask.ToDto());
                var result0 = await AddSingleOccurrence(newTask, newSchedule, assetEntity.Id, userEntity.Id, model.Date);

                if (result0.Succeeded) {
                    var newAssetLogResolution = new AssetLogResolution() {
                        AssetLogId = assetLogEntity.Id,
                        OccurrenceId = result0.Entity.OccurrenceId,
                        TaskId = newTask.Id
                    };

                    Context.AssetLogResolutions.Add(newAssetLogResolution);
                    var result1 = await Context.SaveChangesAsync();
                    await Context.Entry(newAssetLogResolution).Reference(alr => alr.Occurrence).LoadAsync();

                    if (result.Succeeded) {
                        SignalRHub.NotifyAssetLogResolutionCreate(ClientId, newAssetLogResolution.ToDto());
                        return Ok(new { assetLogResolution = newAssetLogResolution.ToDto(), instance = result0.Entity });
                    }

                    return BadRequest(result1);
                }

                return BadRequest(result0.Errors.ToArray());
            }
            else {
                return BadRequest(result);
            }
        }

        [HttpPost]
        [JsonNetFilter]
        /// <summary>
        /// Adds a one-time <see cref="Altask.Data.Model.Occurrence"/> based on the <see cref="Altask.Data.Model.Schedule"/>.
        /// </summary>
        /// <param name="schedule"></param>
        /// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
        public virtual async Task<ActionResult> AddOneTime(OneTimeOccurrence model) {
            ThrowIfDisposed();

            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }

            model.Date = model.Date.LessSeconds();
            List<Data.Model.User> userEntities = new List<Data.Model.User>();
            List<Data.Model.Asset> assetEntities = new List<Data.Model.Asset>();

            if (model.AssetIds != null && model.AssetIds.Count > 0) {
                foreach (var assetId in model.AssetIds) {
                    var assetEntity = await Context.Assets.FirstOrDefaultAsync(a => a.Id == assetId);

                    if (assetEntity != null) {
                        assetEntities.Add(assetEntity);
                    }
                }
            }

            if (model.UserIds != null && model.UserIds.Count > 0) {
                foreach (var userId in model.UserIds) {
                    var userEntity = await Context.Users.FirstOrDefaultAsync(u => u.Id == userId);

                    if (userEntity != null) {
                        userEntities.Add(userEntity);
                    }
                }
            }

            if (userEntities.Count == 0 && assetEntities.Count == 0) {
                return BadRequest(ErrorDescriber.DefaultError("At least one valid user or asset must be assigned to the task."));
            }

            var taskTypeEntity = await Context.TaskTypes.FirstOrDefaultAsync(t => t.Name == "Adhoc");

            if (taskTypeEntity == null) {
                return BadRequest(ErrorDescriber.DefaultError("The Adhoc task type does not exist."));
            }

            var scheduleAssetType = await Context.ScheduleAssetTypes.FirstOrDefaultAsync(sat => sat.Name == "Primary");

            if (scheduleAssetType == null) {
                return BadRequest(ErrorDescriber.DefaultError("The Primary schedule asset type does not exist."));
            }

            var scheduleUserType = await Context.ScheduleUserTypes.FirstOrDefaultAsync(sut => sut.Name == "Primary");

            if (scheduleUserType == null) {
                return BadRequest(ErrorDescriber.DefaultError("The Primary schedule user type does not exist."));
            }

            var newTask = Context.Tasks.Add(new Data.Model.Task() {
                Active = true,
                TaskCategoryId = model.TaskCategoryId,
                Description = model.Description,
                FormId = model.FormId,
                IdleTimeout = model.IdleTimeout,
                Name = model.Name,
                TaskTypeId = taskTypeEntity.Id
            });

            var newSchedule = new Data.Model.Schedule() {
                Active = true,
                AnyTime = false,
                AsEarlyAsFrequency = model.AsEarlyAsFrequency,
                AsEarlyAsN = model.AsEarlyAsN,
                EndsAfter = 1,
                Frequency = "One-Time",
                Name = model.Name,
                StartsOn = model.Date
            };

            foreach (var asset in assetEntities) {
                newSchedule.Assets.Add(new Data.Model.ScheduleAsset() {
                    AssetId = asset.Id,
                    ScheduleAssetTypeId = scheduleAssetType.Id
                });
            }

            foreach (var user in userEntities) {
                newSchedule.Users.Add(new Data.Model.ScheduleUser() {
                    UserId = user.Id,
                    ScheduleUserTypeId = scheduleUserType.Id
                });
            }

            newTask.Schedules.Add(newSchedule);
            Context.Tasks.Add(newTask);
            var result = await Context.SaveChangesAsync();
            List<TaskInstance> instances = new List<TaskInstance>();

            if (result.Succeeded) {
                if (assetEntities.Count > 0) {
                    foreach (var asset in assetEntities) {
                        if (userEntities.Count > 0) {
                            foreach (var user in userEntities) {
                                var result0 = await AddSingleOccurrence(newTask, newSchedule, asset.Id, user.Id, model.Date);

                                if (result0.Succeeded) {
                                    instances.Add(result0.Entity);
                                }
                            }
                        }
                        else {
                            var result0 = await AddSingleOccurrence(newTask, newSchedule, asset.Id, null, model.Date);

                            if (result0.Succeeded) {
                                instances.Add(result0.Entity);
                            }
                        }
                    }
                }
                else if (userEntities.Count > 0) {
                    foreach (var user in userEntities) {
                        var result0 = await AddSingleOccurrence(newTask, newSchedule, null, user.Id, model.Date);

                        if (result0.Succeeded) {
                            instances.Add(result0.Entity);
                        }
                    }
                }

                return Ok(new { instances = instances });
            }
            else {
                return BadRequest(result);
            }
        }

        private async Task<EntityResult<TaskInstance>> AddSingleOccurrence(Data.Model.Task task, Data.Model.Schedule scheduleEntity, int? assetId, int? userId, DateTime date) {
            date = date.LessSeconds();
            Context.Entry(task).Reference(t => t.Form).Load();

            var newOccurrence = new Altask.Data.Model.Occurrence() {
                AsEarlyAsDate = date,
                Date = date,
                FormModel = task.Form.PublishedModel,
                TaskId = task.Id,
                TimeSpent = 0,
                ScheduleId = scheduleEntity.Id,
            };

            var assetEntity = await Context.Assets.FindAsync(assetId);

            if (assetEntity != null) {
                newOccurrence.AssetId = assetEntity.Id;
            }

            var userEntity = await Context.Users.FindAsync(userId);

            if (userEntity != null) {
                newOccurrence.UserId = userEntity.Id;
            }

            if (assetEntity == null && userEntity == null) {
                return EntityResult<TaskInstance>.Failed(ErrorDescriber.DefaultError("An occurrence must have either and asset or user associated to it."));
            }

            newOccurrence.Logs.Add(new Data.Model.OccurrenceLog() { Type = "Created" });
            Context.Occurrences.Add(newOccurrence);
            BeforeCreate(newOccurrence, newOccurrence.ToDto());
            var result = await Context.SaveChangesAsync();

            if (result.Succeeded) {
                await AfterCreateAsync(newOccurrence, true);
                var instance = TaskInstance.FromSchedule(task, newOccurrence.Date, scheduleEntity).MergeOccurrence(newOccurrence);
                SignalRHub.NotifyOccurrenceCreate(null, instance, newOccurrence.ToDto());
                return EntityResult<TaskInstance>.Succeded(instance);
            }
            else {
                return EntityResult<TaskInstance>.Failed(result.Errors.ToArray());
            }
        }


        [HttpPost]
        [JsonNetFilter]
        /// <summary>
        /// Adds an <see cref="Altask.Data.Model.Occurrence"/> based on the <see cref="Altask.Data.Model.Schedule"/>.
        /// </summary>
        /// <param name="schedule"></param>
        /// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
        public virtual async Task<ActionResult> Add(long scheduleId, int? assetId, int? userId, DateTime date) {
            date = date.LessSeconds();
            ThrowIfDisposed();

            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }

            var scheduleEntity = await Context.Schedules.FindAsync(scheduleId);

            if (scheduleEntity == null) {
                return BadRequest(ErrorDescriber.DoesNotExist("Schedule"));
            }

            if (scheduleEntity.EndsOn.HasValue && scheduleEntity.EndsOn.Value < DateTime.Now) {
                return BadRequest(ErrorDescriber.DefaultError("No more occurrences can be created for the associated Schedule.  The Schedule has ended."));
            }

            if (scheduleEntity.EndsAfter.HasValue) {
                var pastOccurrences = await Context.Occurrences.Where(o => o.ScheduleId == scheduleEntity.Id).ToListAsync();

                if (pastOccurrences.Count == scheduleEntity.EndsAfter.Value) {
                    return BadRequest(ErrorDescriber.DefaultError("Not more occurrences can be created for the associated Schedule.  The maximum number of occurrences have been created."));
                }
            }

            var taskEntity = await Context.Tasks.FindAsync(scheduleEntity.TaskId);
            await Context.Entry(taskEntity).Reference(t => t.Form).LoadAsync();

            if (taskEntity == null) {
                return BadRequest(ErrorDescriber.DoesNotExistFor("Task", "Schedule"));
            }

            date = date.Date.Add((TimeSpan)scheduleEntity.StartsOn.TimeOfDay).LessSeconds();
            var occurrenceEntity = await Context.Occurrences.FirstOrDefaultAsync(o => o.ScheduleId == scheduleEntity.Id && o.Date == date);

            if (occurrenceEntity != null) {
                var instance = TaskInstance.FromSchedule(taskEntity, occurrenceEntity.Date, scheduleEntity).MergeOccurrence(occurrenceEntity);
                SignalRHub.NotifyOccurrenceCreate(null, instance, occurrenceEntity.ToDto());
                return Ok(new { schedule = scheduleEntity.ToDto(), instance = instance });
            }

            var newOccurrence = new Altask.Data.Model.Occurrence() {
                Date = date.Date.Add((TimeSpan)scheduleEntity.StartsOn.TimeOfDay),
                FormModel = taskEntity.Form.PublishedModel,
                TaskId = taskEntity.Id,
                TimeSpent = 0,
                ScheduleId = scheduleEntity.Id,
            };

            var assetEntity = await Context.Assets.FindAsync(assetId);

            if (assetEntity != null) {
                newOccurrence.AssetId = assetEntity.Id;
            }

            var userEntity = await Context.Users.FindAsync(userId);

            if (userEntity != null) {
                newOccurrence.UserId = userEntity.Id;
            }

            if (assetEntity == null && userEntity == null) {
                return BadRequest(ErrorDescriber.DefaultError("An occurrence must have either and asset or user associated to it."));
            }

            newOccurrence.Logs.Add(new Data.Model.OccurrenceLog() { Type = "Created" });
            Context.Occurrences.Add(newOccurrence);
            BeforeCreate(newOccurrence, newOccurrence.ToDto());
            var result = await Context.SaveChangesAsync();

            if (result.Succeeded) {
                await AfterCreateAsync(newOccurrence);
                var instance = TaskInstance.FromSchedule(taskEntity, newOccurrence.Date, scheduleEntity).MergeOccurrence(newOccurrence);
                SignalRHub.NotifyOccurrenceCreate(null, instance, newOccurrence.ToDto());
                return Ok(new { instance = instance });
            }
            else {
                return BadRequest(result);
            }
        }

        [HttpPost]
        [JsonNetFilter]
        /// <summary>
        /// Adds an <see cref="Altask.Data.Model.Occurrence"/> based on the <see cref="Altask.Data.Model.Schedule"/>.
        /// </summary>
        /// <param name="schedule"></param>
        /// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
        public virtual async Task<ActionResult> AddAndStart(long scheduleId, int? assetId, int? userId, DateTime date, int startedByUserId) {
            date = date.LessSeconds();
            ThrowIfDisposed();

            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }

            var scheduleEntity = await Context.Schedules.FindAsync(scheduleId);

            if (scheduleEntity == null) {
                return BadRequest(ErrorDescriber.DoesNotExist("Schedule"));
            }

            if (scheduleEntity.EndsOn.HasValue && scheduleEntity.EndsOn.Value < DateTime.Now) {
                return BadRequest(ErrorDescriber.DefaultError("No more occurrences can be created for the associated Schedule.  The Schedule has ended."));
            }

            if (scheduleEntity.EndsAfter.HasValue) {
                var pastOccurrences = await Context.Occurrences.Where(o => o.ScheduleId == scheduleEntity.Id && o.Date != date).ToListAsync();

                if (pastOccurrences.Count == scheduleEntity.EndsAfter.Value) {
                    return BadRequest(ErrorDescriber.DefaultError("Not more occurrences can be created for the associated Schedule.  The maximum number of occurrences have been created."));
                }
            }

            var taskEntity = await Context.Tasks.FindAsync(scheduleEntity.TaskId);
            await Context.Entry(taskEntity).Reference(t => t.Form).LoadAsync();

            if (taskEntity == null) {
                return BadRequest(ErrorDescriber.DoesNotExistFor("Task", "Schedule"));
            }

            var startedByEntity = await Context.Users.FindAsync(startedByUserId);

            if (startedByEntity == null) {
                return BadRequest(ErrorDescriber.DoesNotExist("User"));
            }

            date = date.Date.Add(scheduleEntity.StartsOn.TimeOfDay).LessSeconds();
            var occurrenceEntity = await Context.Occurrences.FirstOrDefaultAsync(o => o.ScheduleId == scheduleEntity.Id && o.Date == date &&
                (assetId.HasValue ? (userId.HasValue ? o.AssetId == assetId && o.UserId == userId : o.AssetId == assetId && o.UserId == null) :
                (userId.HasValue ? o.UserId == userId && o.AssetId == null : o.AssetId == null && o.UserId == null)));

            if (occurrenceEntity != null) {
                if (!occurrenceEntity.Started.GetValueOrDefault(false)) {
                    occurrenceEntity.Started = true;
                    occurrenceEntity.StartedBy = startedByEntity.UserName;
                    occurrenceEntity.StartedOn = DateTime.Now;
                    occurrenceEntity.TimeSpent = 0;
                    occurrenceEntity.Logs.Add(new Data.Model.OccurrenceLog() { Type = "Started" });
                    Context.Entry(occurrenceEntity).State = EntityState.Modified;
                    var result = await Context.SaveChangesAsync();

                    if (result.Succeeded) {
                        await AfterUpdateAsync(occurrenceEntity);
                        var instance = TaskInstance.FromSchedule(taskEntity, occurrenceEntity.Date, scheduleEntity).MergeOccurrence(occurrenceEntity);
                        SignalRHub.NotifyOccurrenceCreate(null, instance, occurrenceEntity.ToDto());
                        return Ok(new { instance = instance });
                    }
                    else {
                        return BadRequest(result);
                    }
                }

                var existing = TaskInstance.FromSchedule(taskEntity, occurrenceEntity.Date, scheduleEntity).MergeOccurrence(occurrenceEntity);
                SignalRHub.NotifyOccurrenceCreate(null, existing, occurrenceEntity.ToDto());
                return Ok(new { instance = existing });
            }
            else {
                var newOccurrence = new Altask.Data.Model.Occurrence() {
                    Date = date,
                    FormModel = taskEntity.Form.PublishedModel,
                    Started = true,
                    StartedBy = startedByEntity.UserName,
                    StartedOn = DateTime.Now,
                    TaskId = taskEntity.Id,
                    TimeSpent = 0,
                    ScheduleId = scheduleEntity.Id
                };

                var assetEntity = await Context.Assets.FindAsync(assetId);

                if (assetEntity != null) {
                    newOccurrence.AssetId = assetEntity.Id;
                }

                var userEntity = await Context.Users.FindAsync(userId);

                if (userEntity != null) {
                    newOccurrence.UserId = userEntity.Id;
                }

                if (assetEntity == null && userEntity == null) {
                    return BadRequest(ErrorDescriber.DefaultError("An occurrence must have either and asset or user associated to it."));
                }

                newOccurrence.Logs.Add(new Data.Model.OccurrenceLog() { Type = "Created" });
                newOccurrence.Logs.Add(new Data.Model.OccurrenceLog() { Type = "Started" });
                Context.Occurrences.Add(newOccurrence);
                BeforeCreate(newOccurrence, newOccurrence.ToDto());
                var result = await Context.SaveChangesAsync();

                if (result.Succeeded) {
                    await AfterCreateAsync(newOccurrence);
                    var instance = TaskInstance.FromSchedule(taskEntity, newOccurrence.Date, scheduleEntity).MergeOccurrence(newOccurrence);
                    SignalRHub.NotifyOccurrenceCreate(null, instance, newOccurrence.ToDto());
                    return Ok(new { instance = instance });
                }
                else {
                    return BadRequest(result);
                }
            }
        }

        [HttpPost]
        [JsonNetFilter]
        /// <summary>
        /// Completes a <see cref="Altask.Data.Model.Occurrence"/>.
        /// </summary>
        /// <param name="occurrenceId"></param>
        /// <param name="userId"></param>
        /// <param name="formModel"></param>
        /// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
        public virtual async Task<ActionResult> Complete(long occurrenceId, int userId, string formModel) {
            ThrowIfDisposed();

            if (formModel == null) {
                return BadRequest(ErrorDescriber.DefaultError("A valid FormModel representing the occurrences results must be specified."));
            }

            var userEntity = await Context.Users.FindAsync(userId);

            if (userEntity == null) {
                return BadRequest(ErrorDescriber.DoesNotExist("User"));
            }

            var occurrenceEntity = await Context.Occurrences.FindAsync(occurrenceId);

            if (occurrenceEntity == null) {
                return BadRequest(ErrorDescriber.DoesNotExist("Occurrence"));
            }

            if (!occurrenceEntity.Started.GetValueOrDefault(false)) {
                return BadRequest(ErrorDescriber.DefaultError("Occurrence cannot be completed. The occurrence has not been started."));
            }

            if (occurrenceEntity.Completed.GetValueOrDefault(false)) {
                return BadRequest(ErrorDescriber.DefaultError("Occurrence already completed"));
            }

            if (occurrenceEntity.StoppedOn.HasValue && !occurrenceEntity.ResumedOn.HasValue) {
                return BadRequest(ErrorDescriber.DefaultError("Occurrence cannot be completed. The occurrence was stopped and has not yet been resumed."));
            }

            occurrenceEntity.Completed = true;
            occurrenceEntity.CompletedBy = userEntity.UserName;
            occurrenceEntity.CompletedOn = DateTime.Now;
            occurrenceEntity.FormModel = formModel;
            occurrenceEntity.TimeSpent += (int)DateTime.Now.Subtract(occurrenceEntity.ResumedOn.GetValueOrDefault(occurrenceEntity.StartedOn.Value)).TotalSeconds;
            occurrenceEntity.StoppedBy = null;
            occurrenceEntity.StoppedOn = null;
            occurrenceEntity.ResumedBy = null;
            occurrenceEntity.ResumedOn = null;
            occurrenceEntity.Logs.Add(new Data.Model.OccurrenceLog() { Type = "Completed" });
            Context.Entry(occurrenceEntity).State = EntityState.Modified;
            var result = await Context.SaveChangesAsync();

            if (result.Succeeded) {
                await AfterUpdateAsync(occurrenceEntity);
                var taskEntity = await Context.Tasks.FindAsync(occurrenceEntity.TaskId);
                var scheduleEntity = await Context.Schedules.FindAsync(occurrenceEntity.ScheduleId);
                var instance = TaskInstance.FromSchedule(taskEntity, occurrenceEntity.Date, scheduleEntity).MergeOccurrence(occurrenceEntity);
                SignalRHub.NotifyOccurrenceCreate(null, instance, occurrenceEntity.ToDto());
                return Ok(new { instance = instance });
            }
            else {
                return BadRequest(result);
            }
        }

        [HttpPost]
        [JsonNetFilter]
        /// <summary>
        /// Dismisses a <see cref="Altask.Data.Model.Occurrence"/>.
        /// </summary>
        /// <param name="occurrenceId"></param>
        /// <param name="userId"></param>
        /// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
        public virtual async Task<ActionResult> Dismiss(long occurrenceId, int userId) {
            ThrowIfDisposed();

            var userEntity = await Context.Users.FindAsync(userId);

            if (userEntity == null) {
                return BadRequest(ErrorDescriber.DoesNotExist("User"));
            }

            var occurrenceEntity = await Context.Occurrences.FindAsync(occurrenceId);

            if (occurrenceEntity == null) {
                return BadRequest(ErrorDescriber.DoesNotExist("Occurrence"));
            }

            if (occurrenceEntity.Started.GetValueOrDefault(false)) {
                return BadRequest(ErrorDescriber.DefaultError("Occurrence already started"));
            }

            occurrenceEntity.Dismissed = true;
            occurrenceEntity.DismissedBy = userEntity.UserName;
            occurrenceEntity.DismissedOn = DateTime.Now;
            occurrenceEntity.Logs.Add(new Data.Model.OccurrenceLog() { Type = "Dismissed" });
            Context.Entry(occurrenceEntity).State = EntityState.Modified;
            var result = await Context.SaveChangesAsync();

            if (result.Succeeded) {
                await AfterUpdateAsync(occurrenceEntity);
                var taskEntity = await Context.Tasks.FindAsync(occurrenceEntity.TaskId);
                var scheduleEntity = await Context.Schedules.FindAsync(occurrenceEntity.ScheduleId);
                var instance = TaskInstance.FromSchedule(taskEntity, occurrenceEntity.Date, scheduleEntity).MergeOccurrence(occurrenceEntity);
                SignalRHub.NotifyOccurrenceCreate(null, instance, occurrenceEntity.ToDto());
                return Ok(new { instance = instance });
            }
            else {
                return BadRequest(result);
            }
        }

        [HttpGet]
        [JsonNetFilter]
        /// <summary>
        /// Returns a <see cref="Altask.Data.Model.Occurrence"/> for the specified <see cref="Altask.Data.Model.Schedule"/> on the specified date.
        /// </summary>
        /// <param name="id">The ID of the <see cref="Altask.Data.Model.Occurrence"/>.</param>
        /// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
        public virtual async Task<ActionResult> FindByDate(long scheduleId, DateTime date) {
            ThrowIfDisposed();
            var scheduleEntity = await Context.Schedules.FindAsync(scheduleId);

            if (scheduleEntity == null) {
                return BadRequest(JsonRequestBehavior.AllowGet, ErrorDescriber.DoesNotExist("Schedule"));
            }

            var occurrence = await Context.Occurrences.FirstOrDefaultAsync(o => o.ScheduleId == scheduleEntity.Id && o.Date == date.Date.Add(scheduleEntity.StartsOn.TimeOfDay));

            if (occurrence != null) {
                return Ok(new { occurrence = occurrence.ToDto() }, JsonRequestBehavior.AllowGet);
            }

            return Ok(JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [JsonNetFilter]
        /// <summary>
        /// Returns a collection of <see cref="Altask.Data.Model.Occurrence"/> objects for the specified <see cref="Altask.Data.Model.Schedule"/>.
        /// </summary>
        /// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
        public virtual async Task<ActionResult> ListForSchedule(long scheduleId) {
            ThrowIfDisposed();
            var scheduleEntity = await Context.Schedules.FindAsync(scheduleId);

            if (scheduleEntity == null) {
                return BadRequest(JsonRequestBehavior.AllowGet, ErrorDescriber.DoesNotExist("Schedule"));
            }

            var occurrenced = await Context.Occurrences.Where(o => o.ScheduleId == scheduleEntity.Id).ToListAsync();
            var dtoOccurrences = new List<Altask.Data.Dto.Occurrence>();

            foreach (var item in occurrenced) {
                dtoOccurrences.Add(item.ToDto());
            }

            return Ok(new { occurrences = dtoOccurrences }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [JsonNetFilter]
        /// <summary>
        /// Resumes a <see cref="Altask.Data.Model.Occurrence"/>.
        /// </summary>
        /// <param name="occurrenceId"></param>
        /// <param name="userId"></param>
        /// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
        public virtual async Task<ActionResult> Resume(long occurrenceId, int userId) {
            ThrowIfDisposed();

            var userEntity = await Context.Users.FindAsync(userId);

            if (userEntity == null) {
                return BadRequest(ErrorDescriber.DoesNotExist("User"));
            }

            var occurrenceEntity = await Context.Occurrences.FindAsync(occurrenceId);

            if (occurrenceEntity == null) {
                return BadRequest(ErrorDescriber.DoesNotExist("Occurrence"));
            }

            if (!occurrenceEntity.Started.GetValueOrDefault(false)) {
                return BadRequest(ErrorDescriber.DefaultError("Occurrence has not been started."));
            }

            if (occurrenceEntity.Completed.GetValueOrDefault(false)) {
                return BadRequest(ErrorDescriber.DefaultError("Occurrence has already been completed."));
            }

            if (!occurrenceEntity.StoppedOn.HasValue) {
                return BadRequest(ErrorDescriber.DefaultError("Occurrence cannot be resumed. The occurrence was not stopped."));
            }

            occurrenceEntity.ResumedBy = userEntity.UserName;
            occurrenceEntity.ResumedOn = DateTime.Now;
            occurrenceEntity.Logs.Add(new Data.Model.OccurrenceLog() { Type = "Resumed" });
            Context.Entry(occurrenceEntity).State = EntityState.Modified;
            var result = await Context.SaveChangesAsync();

            if (result.Succeeded) {
                await AfterUpdateAsync(occurrenceEntity);
                var taskEntity = await Context.Tasks.FindAsync(occurrenceEntity.TaskId);
                var scheduleEntity = await Context.Schedules.FindAsync(occurrenceEntity.ScheduleId);
                var instance = TaskInstance.FromSchedule(taskEntity, occurrenceEntity.Date, scheduleEntity).MergeOccurrence(occurrenceEntity);
                SignalRHub.NotifyOccurrenceCreate(null, instance, occurrenceEntity.ToDto());
                return Ok(new { instance = instance });
            }
            else {
                return BadRequest(result);
            }
        }

        [HttpPost]
        [JsonNetFilter]
        /// <summary>
        /// Starts a <see cref="Altask.Data.Model.Occurrence"/>.
        /// </summary>
        /// <param name="occurrenceId"></param>
        /// <param name="userId"></param>
        /// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
        public virtual async Task<ActionResult> Start(long occurrenceId, int userId) {
            ThrowIfDisposed();

            var userEntity = await Context.Users.FindAsync(userId);

            if (userEntity == null) {
                return BadRequest(ErrorDescriber.DoesNotExist("User"));
            }

            var occurrenceEntity = await Context.Occurrences.FindAsync(occurrenceId);

            if (occurrenceEntity == null) {
                return BadRequest(ErrorDescriber.DoesNotExist("Occurrence"));
            }

            if (occurrenceEntity.Started.GetValueOrDefault(false)) {
                return BadRequest(ErrorDescriber.DefaultError("Occurrence already started"));
            }

            occurrenceEntity.Started = true;
            occurrenceEntity.StartedBy = userEntity.UserName;
            occurrenceEntity.StartedOn = DateTime.Now;
            occurrenceEntity.TimeSpent = 0;
            occurrenceEntity.Logs.Add(new Data.Model.OccurrenceLog() { Type = "Started" });
            Context.Entry(occurrenceEntity).State = EntityState.Modified;
            var result = await Context.SaveChangesAsync();

            if (result.Succeeded) {
                await AfterUpdateAsync(occurrenceEntity);
                var taskEntity = await Context.Tasks.FindAsync(occurrenceEntity.TaskId);
                var scheduleEntity = await Context.Schedules.FindAsync(occurrenceEntity.ScheduleId);
                var instance = TaskInstance.FromSchedule(taskEntity, occurrenceEntity.Date, scheduleEntity).MergeOccurrence(occurrenceEntity);
                SignalRHub.NotifyOccurrenceCreate(null, instance, occurrenceEntity.ToDto());
                return Ok(new { instance = instance });
            }
            else {
                return BadRequest(result);
            }
        }

        [HttpPost]
        [JsonNetFilter]
        /// <summary>
        /// Stops a <see cref="Altask.Data.Model.Occurrence"/>.
        /// </summary>
        /// <param name="occurrenceId"></param>
        /// <param name="userId"></param>
        /// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
        public virtual async Task<ActionResult> Stop(long occurrenceId, int userId, string formModel) {
            ThrowIfDisposed();

            if (formModel == null) {
                return BadRequest(ErrorDescriber.DefaultError("A valid FormModel representing the occurrences results must be specified."));
            }

            var userEntity = await Context.Users.FindAsync(userId);

            if (userEntity == null) {
                return BadRequest(ErrorDescriber.DoesNotExist("User"));
            }

            var occurrenceEntity = await Context.Occurrences.FindAsync(occurrenceId);

            if (occurrenceEntity == null) {
                return BadRequest(ErrorDescriber.DoesNotExist("Occurrence"));
            }

            if (!occurrenceEntity.Started.GetValueOrDefault(false)) {
                return BadRequest(ErrorDescriber.DefaultError("Occurrence has not been started."));
            }

            if (occurrenceEntity.Completed.GetValueOrDefault(false)) {
                return BadRequest(ErrorDescriber.DefaultError("Occurrence has already been completed."));
            }

            occurrenceEntity.StoppedBy = userEntity.UserName;
            occurrenceEntity.StoppedOn = DateTime.Now;
            occurrenceEntity.TimeSpent += (int)DateTime.Now.Subtract(occurrenceEntity.ResumedOn.GetValueOrDefault(occurrenceEntity.StartedOn.Value)).TotalSeconds;
            occurrenceEntity.ResumedBy = null;
            occurrenceEntity.ResumedOn = null;
            occurrenceEntity.FormModel = formModel;
            occurrenceEntity.Logs.Add(new Data.Model.OccurrenceLog() { Type = "Stopped" });
            Context.Entry(occurrenceEntity).State = EntityState.Modified;
            var result = await Context.SaveChangesAsync();

            if (result.Succeeded) {
                await AfterUpdateAsync(occurrenceEntity);
                var taskEntity = await Context.Tasks.FindAsync(occurrenceEntity.TaskId);
                var scheduleEntity = await Context.Schedules.FindAsync(occurrenceEntity.ScheduleId);
                var instance = TaskInstance.FromSchedule(taskEntity, occurrenceEntity.Date, scheduleEntity).MergeOccurrence(occurrenceEntity);
                SignalRHub.NotifyOccurrenceCreate(null, instance, occurrenceEntity.ToDto());
                return Ok(new { instance = instance });
            }
            else {
                return BadRequest(result);
            }
        }
    }
}

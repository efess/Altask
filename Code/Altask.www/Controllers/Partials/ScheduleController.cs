
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Altask.Data;
using Altask.Data.Dto;
using Altask.Data.Model;
using Altask.www.Models;

namespace Altask.www.Controllers {
    public partial class ScheduleController {
        internal override async Task<EntityResult> AfterCreateAsync(Data.Model.Schedule entity, bool notifyAll = false) {
            foreach (var user in entity.Users) {
                await Context.Entry<Data.Model.ScheduleUser>(user).Reference(su => su.User).LoadAsync();
            }

            foreach (var asset in entity.Assets) {
                await Context.Entry<Data.Model.ScheduleAsset>(asset).Reference(sa => sa.Asset).LoadAsync();
            }

            return EntityResult.Succeded(0);
        }

        internal override async Task<EntityResult> AfterUpdateAsync(Data.Model.Schedule entity, bool notifyAll = false) {
            foreach (var user in entity.Users) {
                await Context.Entry<Data.Model.ScheduleUser>(user).Reference(su => su.User).LoadAsync();
            }

            foreach (var asset in entity.Assets) {
                await Context.Entry<Data.Model.ScheduleAsset>(asset).Reference(sa => sa.Asset).LoadAsync();
            }

            return EntityResult.Succeded(0);
        }

        internal override void BeforeCreate(Data.Model.Schedule entity, Data.Dto.Schedule dto) {
            ThrowIfDisposed();
            entity.StartsOn = entity.StartsOn.LessSeconds();

            foreach (var item in dto.Assets) {
                entity.Assets.Add(new Data.Model.ScheduleAsset() {
                    AssetId = item.AssetId,
                    ScheduleAssetTypeId = item.ScheduleAssetTypeId
                });
            }

            foreach (var item in dto.Users) {
                entity.Users.Add(new Data.Model.ScheduleUser() {
                    UserId = item.UserId,
                    ScheduleUserTypeId = item.ScheduleUserTypeId
                });
            }
        }

        internal override void BeforeUpdate(Data.Model.Schedule entity, Data.Dto.Schedule dto) {
            ThrowIfDisposed();
            entity.StartsOn = entity.StartsOn.LessSeconds();

            var currentAssets = entity.Assets.ToList();

            for (var index = currentAssets.Count - 1; index >= 0; index--) {
                var asset = currentAssets[index];

                if (!dto.Assets.Any(tda => tda.AssetId == asset.AssetId)) {
                    Context.ScheduleAssets.Remove(asset);
                }
            }

            foreach (var asset in dto.Assets) {
                var existingAsset = Context.Assets.FirstOrDefault(a => a.Id == asset.AssetId);

                if (existingAsset != null) {
                    if (!entity.Assets.Any(tda => tda.AssetId == asset.AssetId)) {
                        entity.Assets.Add(new Data.Model.ScheduleAsset() {
                            AssetId = asset.AssetId,
                            ScheduleAssetTypeId = asset.ScheduleAssetTypeId
                        });
                    }
                }
            }

            var currentUsers = entity.Users.ToList();

            for (var index = currentUsers.Count - 1; index >= 0; index--) {
                var user = currentUsers[index];

                if (!dto.Users.Any(tdu => tdu.UserId == user.UserId)) {
                    Context.ScheduleUsers.Remove(user);
                }
            }

            foreach (var user in dto.Users) {
                var existingUser = Context.Users.FirstOrDefault(a => a.Id == user.UserId);

                if (existingUser != null) {
                    if (!entity.Users.Any(tdu => tdu.UserId == user.UserId)) {
                        entity.Users.Add(new Data.Model.ScheduleUser() {
                            UserId = user.UserId,
                            ScheduleUserTypeId = user.ScheduleUserTypeId
                        });
                    }
                }
            }
        }

        [HttpPost]
        [JsonNetFilter]
        /// <summary>
        /// Returns a collection of projected run dates for the <see cref="Altask.Data.Model.Schedule"/>.
        /// </summary>
        /// <param name="schedule">The <see cref="Altask.Data.Model.Schedule"/>.</param>
        /// <param name="count">The number of dates within the constrains of the <see cref="Altask.Data.Model.Schedule"/> objects parameters to calculate out to.</param>
        /// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
        public virtual async Task<ActionResult> GetRunDates(Data.Dto.Schedule schedule, DateTime from, DateTime to) {
            from = from.LessSeconds();
            to = to.LessSeconds();
            ThrowIfDisposed();
            var dates = new List<DateTime>();

            try {
                dates = schedule.GetRunDates(from, to);
            }
            catch (Exception ex) {
                return BadRequest(ErrorDescriber.DefaultError(ex.Message));
            }

            return await System.Threading.Tasks.Task.FromResult(Ok(new { dates = dates }));
        }

        [HttpPost]
        [JsonNetFilter]
        /// <summary>
        /// Returns a collection of <see cref="Altask.Data.Model.Task"/> objects matching the specified filter.
        /// </summary>
        /// <param name="filter">A <see cref="Altask.www.Models.TaskListOptions"/> object on which to filter.</param>
        /// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
        public virtual async Task<ActionResult> ProjectTo(ProjectToOptions filter) {
            ThrowIfDisposed();

            if (filter == null) {
                filter = new ProjectToOptions();
            }

            return Ok(new { tasks = await Helper.TaskInstance.Create(Context, filter) }, JsonRequestBehavior.AllowGet);
        }
    }
}
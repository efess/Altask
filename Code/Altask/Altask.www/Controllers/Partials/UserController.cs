using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Altask.Data.Dto;
using Altask.Data.Model;

namespace Altask.www.Controllers {
    public partial class UserController {
        [HttpPost]
        [JsonNetFilter]
        /// <summary>
        /// Updates the specified <see cref="Altask.Data.Model.User"/>'s roles.
        /// </summary>
        /// <param name="user"></param>
        /// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
        public virtual async Task<ActionResult> UpdateWithRoles(Altask.Data.Dto.User user, List<string> roles) {
            ThrowIfDisposed();

            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }

            var existingUser = await Context.Users.FindAsync(user.Id);

            if (existingUser == null) {
                return BadRequest(ErrorDescriber.DoesNotExist("User"));
            }

            var currentRoles = existingUser.Roles.ToList();
            existingUser.FromDto(user);

            for (var index = currentRoles.Count - 1; index >= 0; index--) {
                var role = currentRoles[index];

                if (!roles.Contains(role.Name)) {
                    Context.UserRoles.Remove(role);
                }
            }

            foreach (var role in roles) {
                var existingRole = await Context.Roles.FirstOrDefaultAsync(r => r.Name == role);

                if (existingRole != null) {
                    if (!existingUser.Roles.Any(u => u.Name == role)) {
                        existingUser.Roles.Add(new Data.Model.UserRole() {
                            Name = existingRole.Name,
                            RoleId = existingRole.Id,
                        });
                    }
                }
            }

            Context.Entry(existingUser).State = EntityState.Modified;
            var result = await Context.SaveChangesAsync();
            Context.Entry(existingUser).Collection(e => e.Roles).Load();

            if (result.Succeeded) {
                return Ok(new { user = existingUser.ToDto() });
            }
            else {
                return BadRequest(result);
            }
        }

        [HttpPost]
        [JsonNetFilter]
        /// <summary>
        /// Updates the specified <see cref="Altask.Data.Model.User"/>'s settings.
        /// </summary>
        /// <param name="user"></param>
        /// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
        public virtual async Task<ActionResult> UpdateSettings(int id, string settings) {
            ThrowIfDisposed();

            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }

            var userEntity = await Context.Users.FindAsync(id);

            if (userEntity == null) {
                return BadRequest(ErrorDescriber.DoesNotExist("User"));
            }

            userEntity.Settings = settings;
            Context.Entry(userEntity).State = EntityState.Modified;
            var result = await Context.SaveChangesAsync();

            if (result.Succeeded) {
                return Ok(new { user = userEntity.ToDto() });
            }
            else {
                return BadRequest(result);
            }
        }
    }
}
using Altask.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Altask.www.Controllers {
    public partial class AssetAlertController {
        internal override async Task<EntityResult> AfterCreateAsync(Data.Model.AssetAlert entity, bool notifyAll = false) {
            foreach (var user in entity.Users) {
                await Context.Entry<Data.Model.AssetAlertUser>(user).Reference(aau => aau.User).LoadAsync();
            }

            return EntityResult.Succeded(0);
        }

        internal override async Task<EntityResult> AfterUpdateAsync(Data.Model.AssetAlert entity, bool notifyAll = false) {
            foreach (var user in entity.Users) {
                await Context.Entry<Data.Model.AssetAlertUser>(user).Reference(aau => aau.User).LoadAsync();
            }

            return EntityResult.Succeded(0);
        }

        internal override void BeforeCreate(Data.Model.AssetAlert entity, Data.Dto.AssetAlert dto) {
            ThrowIfDisposed();

            foreach (var item in dto.Users) {
                entity.Users.Add(new Data.Model.AssetAlertUser() {
                    UserId = item.UserId
                });
            }
        }

        internal override void BeforeUpdate(Data.Model.AssetAlert entity, Data.Dto.AssetAlert dto) {
            ThrowIfDisposed();

            var currentUsers = entity.Users.ToList();

            for (var index = currentUsers.Count - 1; index >= 0; index--) {
                var user = currentUsers[index];

                if (!dto.Users.Any(tdu => tdu.UserId == user.UserId)) {
                    Context.AssetAlertUsers.Remove(user);
                }
            }

            foreach (var user in dto.Users) {
                var existingUser = Context.Users.FirstOrDefault(a => a.Id == user.UserId);

                if (existingUser != null) {
                    if (!entity.Users.Any(tdu => tdu.UserId == user.UserId)) {
                        entity.Users.Add(new Data.Model.AssetAlertUser() {
                            UserId = user.UserId
                        });
                    }
                }
            }
        }
    }
}
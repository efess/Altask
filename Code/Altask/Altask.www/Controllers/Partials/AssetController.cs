using System.Linq;
using System.Threading.Tasks;

namespace Altask.www.Controllers {
    public partial class AssetController {
        internal override void BeforeCreate(Data.Model.Asset entity, Data.Dto.Asset dto) {
            ThrowIfDisposed();

            foreach (var item in dto.Groups) {
                entity.Groups.Add(new Data.Model.AssetGrouping() {
                    AssetGroupId = item.AssetGroupId
                });
            }
        }

        internal override void BeforeUpdate(Data.Model.Asset entity, Data.Dto.Asset dto) {
            ThrowIfDisposed();

            var currentGroups = entity.Groups.ToList();

            for (var index = currentGroups.Count - 1; index >= 0; index--) {
                var group = currentGroups[index];

                if (!dto.Groups.Any(ag => ag.AssetGroupId == group.AssetGroupId)) {
                    Context.AssetGroupings.Remove(group);
                }
            }

            foreach (var group in dto.Groups) {
                var existingGroup = Context.AssetGroups.FirstOrDefault(ag => ag.Id == group.AssetGroupId);

                if (existingGroup != null) {
                    if (!entity.Groups.Any(ag => ag.AssetGroupId == group.AssetGroupId)) {
                        entity.Groups.Add(new Data.Model.AssetGrouping() {
                            AssetGroupId = existingGroup.Id
                        });
                    }
                }
            }
        }
    }
}
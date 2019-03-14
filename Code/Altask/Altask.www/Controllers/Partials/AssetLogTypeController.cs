using Altask.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Altask.www.Controllers {
    public partial class AssetLogTypeController {
        internal override void BeforeCreate(Data.Model.AssetLogType entity, Data.Dto.AssetLogType dto) {
            ThrowIfDisposed();

            foreach (var item in dto.Assets) {
                entity.Assets.Add(new Data.Model.AssetLogTypeAsset() {
                    AssetId = item.AssetId
                });
            }
        }

        internal override void BeforeUpdate(Data.Model.AssetLogType entity, Data.Dto.AssetLogType dto) {
            ThrowIfDisposed();

            var currentAssets = entity.Assets.ToList();

            for (var index = currentAssets.Count - 1; index >= 0; index--) {
                var asset = currentAssets[index];

                if (!dto.Assets.Any(tdu => tdu.AssetId == asset.AssetId)) {
                    Context.AssetLogTypeAssets.Remove(asset);
                }
            }

            foreach (var asset in dto.Assets) {
                var existingAsset = Context.Assets.FirstOrDefault(a => a.Id == asset.AssetId);

                if (existingAsset != null) {
                    if (!entity.Assets.Any(tdu => tdu.AssetId == asset.AssetId)) {
                        entity.Assets.Add(new Data.Model.AssetLogTypeAsset() {
                            AssetId = asset.AssetId
                        });
                    }
                }
            }
        }
    }
}
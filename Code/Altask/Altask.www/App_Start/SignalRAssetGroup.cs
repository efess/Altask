//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------
using System;

namespace Altask.www {
    public partial class SignalRHub {
		internal static void NotifyAssetGroupCreate(Guid? clientId, Altask.Data.Dto.AssetGroup assetGroup) {
			if (!clientId.HasValue) {
				_context.Clients.All.notifyAssetGroupCreate(new { assetGroup = assetGroup });
			} else {
				SignalRConnection connection;

				if (_connections.TryGetValue(clientId.Value, out connection)) {
					_context.Clients.AllExcept(connection.ConnectionId).notifyAssetGroupCreate(new { connection = connection, assetGroup = assetGroup });
				} else {
					_context.Clients.All.notifyAssetGroupCreate(new { assetGroup = assetGroup });
				}
			}
		}

        internal static void NotifyAssetGroupUpdate(Guid? clientId, Altask.Data.Dto.AssetGroup assetGroup) {
            if (!clientId.HasValue) {
				_context.Clients.All.notifyAssetGroupUpdate(new { assetGroup = assetGroup });
			} else {
				SignalRConnection connection;

				if (_connections.TryGetValue(clientId.Value, out connection)) {
					_context.Clients.AllExcept(connection.ConnectionId).notifyAssetGroupUpdate(new { connection = connection, assetGroup = assetGroup });
				} else {
					_context.Clients.All.notifyAssetGroupCreate(new { assetGroup = assetGroup });
				}
			}
		}
	}
}

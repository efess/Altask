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
		internal static void NotifyAssetAlertUserCreate(Guid? clientId, Altask.Data.Dto.AssetAlertUser assetAlertUser) {
			if (!clientId.HasValue) {
				_context.Clients.All.notifyAssetAlertUserCreate(new { assetAlertUser = assetAlertUser });
			} else {
				SignalRConnection connection;

				if (_connections.TryGetValue(clientId.Value, out connection)) {
					_context.Clients.AllExcept(connection.ConnectionId).notifyAssetAlertUserCreate(new { connection = connection, assetAlertUser = assetAlertUser });
				} else {
					_context.Clients.All.notifyAssetAlertUserCreate(new { assetAlertUser = assetAlertUser });
				}
			}
		}

        internal static void NotifyAssetAlertUserUpdate(Guid? clientId, Altask.Data.Dto.AssetAlertUser assetAlertUser) {
            if (!clientId.HasValue) {
				_context.Clients.All.notifyAssetAlertUserUpdate(new { assetAlertUser = assetAlertUser });
			} else {
				SignalRConnection connection;

				if (_connections.TryGetValue(clientId.Value, out connection)) {
					_context.Clients.AllExcept(connection.ConnectionId).notifyAssetAlertUserUpdate(new { connection = connection, assetAlertUser = assetAlertUser });
				} else {
					_context.Clients.All.notifyAssetAlertUserCreate(new { assetAlertUser = assetAlertUser });
				}
			}
		}
	}
}
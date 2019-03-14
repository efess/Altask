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
		internal static void NotifyAssetAlertCreate(Guid? clientId, Altask.Data.Dto.AssetAlert assetAlert) {
			if (!clientId.HasValue) {
				_context.Clients.All.notifyAssetAlertCreate(new { assetAlert = assetAlert });
			} else {
				SignalRConnection connection;

				if (_connections.TryGetValue(clientId.Value, out connection)) {
					_context.Clients.AllExcept(connection.ConnectionId).notifyAssetAlertCreate(new { connection = connection, assetAlert = assetAlert });
				} else {
					_context.Clients.All.notifyAssetAlertCreate(new { assetAlert = assetAlert });
				}
			}
		}

        internal static void NotifyAssetAlertUpdate(Guid? clientId, Altask.Data.Dto.AssetAlert assetAlert) {
            if (!clientId.HasValue) {
				_context.Clients.All.notifyAssetAlertUpdate(new { assetAlert = assetAlert });
			} else {
				SignalRConnection connection;

				if (_connections.TryGetValue(clientId.Value, out connection)) {
					_context.Clients.AllExcept(connection.ConnectionId).notifyAssetAlertUpdate(new { connection = connection, assetAlert = assetAlert });
				} else {
					_context.Clients.All.notifyAssetAlertCreate(new { assetAlert = assetAlert });
				}
			}
		}
	}
}

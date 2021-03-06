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
		internal static void NotifyScheduleAssetCreate(Guid? clientId, Altask.Data.Dto.ScheduleAsset scheduleAsset) {
			if (!clientId.HasValue) {
				_context.Clients.All.notifyScheduleAssetCreate(new { scheduleAsset = scheduleAsset });
			} else {
				SignalRConnection connection;

				if (_connections.TryGetValue(clientId.Value, out connection)) {
					_context.Clients.AllExcept(connection.ConnectionId).notifyScheduleAssetCreate(new { connection = connection, scheduleAsset = scheduleAsset });
				} else {
					_context.Clients.All.notifyScheduleAssetCreate(new { scheduleAsset = scheduleAsset });
				}
			}
		}

        internal static void NotifyScheduleAssetUpdate(Guid? clientId, Altask.Data.Dto.ScheduleAsset scheduleAsset) {
            if (!clientId.HasValue) {
				_context.Clients.All.notifyScheduleAssetUpdate(new { scheduleAsset = scheduleAsset });
			} else {
				SignalRConnection connection;

				if (_connections.TryGetValue(clientId.Value, out connection)) {
					_context.Clients.AllExcept(connection.ConnectionId).notifyScheduleAssetUpdate(new { connection = connection, scheduleAsset = scheduleAsset });
				} else {
					_context.Clients.All.notifyScheduleAssetCreate(new { scheduleAsset = scheduleAsset });
				}
			}
		}
	}
}

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
		internal static void NotifyTaskCreate(Guid? clientId, Altask.Data.Dto.Task task) {
			if (!clientId.HasValue) {
				_context.Clients.All.notifyTaskCreate(new { task = task });
			} else {
				SignalRConnection connection;

				if (_connections.TryGetValue(clientId.Value, out connection)) {
					_context.Clients.AllExcept(connection.ConnectionId).notifyTaskCreate(new { connection = connection, task = task });
				} else {
					_context.Clients.All.notifyTaskCreate(new { task = task });
				}
			}
		}

        internal static void NotifyTaskUpdate(Guid? clientId, Altask.Data.Dto.Task task) {
            if (!clientId.HasValue) {
				_context.Clients.All.notifyTaskUpdate(new { task = task });
			} else {
				SignalRConnection connection;

				if (_connections.TryGetValue(clientId.Value, out connection)) {
					_context.Clients.AllExcept(connection.ConnectionId).notifyTaskUpdate(new { connection = connection, task = task });
				} else {
					_context.Clients.All.notifyTaskCreate(new { task = task });
				}
			}
		}
	}
}

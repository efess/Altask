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
		internal static void NotifyTaskAlertUserCreate(Guid? clientId, Altask.Data.Dto.TaskAlertUser taskAlertUser) {
			if (!clientId.HasValue) {
				_context.Clients.All.notifyTaskAlertUserCreate(new { taskAlertUser = taskAlertUser });
			} else {
				SignalRConnection connection;

				if (_connections.TryGetValue(clientId.Value, out connection)) {
					_context.Clients.AllExcept(connection.ConnectionId).notifyTaskAlertUserCreate(new { connection = connection, taskAlertUser = taskAlertUser });
				} else {
					_context.Clients.All.notifyTaskAlertUserCreate(new { taskAlertUser = taskAlertUser });
				}
			}
		}

        internal static void NotifyTaskAlertUserUpdate(Guid? clientId, Altask.Data.Dto.TaskAlertUser taskAlertUser) {
            if (!clientId.HasValue) {
				_context.Clients.All.notifyTaskAlertUserUpdate(new { taskAlertUser = taskAlertUser });
			} else {
				SignalRConnection connection;

				if (_connections.TryGetValue(clientId.Value, out connection)) {
					_context.Clients.AllExcept(connection.ConnectionId).notifyTaskAlertUserUpdate(new { connection = connection, taskAlertUser = taskAlertUser });
				} else {
					_context.Clients.All.notifyTaskAlertUserCreate(new { taskAlertUser = taskAlertUser });
				}
			}
		}
	}
}

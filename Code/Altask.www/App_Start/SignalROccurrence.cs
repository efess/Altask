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
		internal static void NotifyOccurrenceCreate(Guid? clientId, Altask.Data.Dto.Occurrence occurrence) {
			if (!clientId.HasValue) {
				_context.Clients.All.notifyOccurrenceCreate(new { occurrence = occurrence });
			} else {
				SignalRConnection connection;

				if (_connections.TryGetValue(clientId.Value, out connection)) {
					_context.Clients.AllExcept(connection.ConnectionId).notifyOccurrenceCreate(new { connection = connection, occurrence = occurrence });
				} else {
					_context.Clients.All.notifyOccurrenceCreate(new { occurrence = occurrence });
				}
			}
		}

        internal static void NotifyOccurrenceUpdate(Guid? clientId, Altask.Data.Dto.Occurrence occurrence) {
            if (!clientId.HasValue) {
				_context.Clients.All.notifyOccurrenceUpdate(new { occurrence = occurrence });
			} else {
				SignalRConnection connection;

				if (_connections.TryGetValue(clientId.Value, out connection)) {
					_context.Clients.AllExcept(connection.ConnectionId).notifyOccurrenceUpdate(new { connection = connection, occurrence = occurrence });
				} else {
					_context.Clients.All.notifyOccurrenceCreate(new { occurrence = occurrence });
				}
			}
		}
	}
}

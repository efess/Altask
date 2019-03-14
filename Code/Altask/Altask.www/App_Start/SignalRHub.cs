using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Concurrent;
using System.Threading.Tasks;

namespace Altask.www {
    [HubName("signalRHub")]
    public partial class SignalRHub : Hub {
        private static IHubContext _context = GlobalHost.ConnectionManager.GetHubContext<SignalRHub>();
        private static readonly ConcurrentDictionary<Guid, SignalRConnection> _connections = new ConcurrentDictionary<Guid, SignalRConnection>();
        public Task<SignalRConnection> Connect(Guid clientId, string userId) {
            SignalRConnection connection;

            if (!_connections.TryGetValue(clientId, out connection)) {
                connection = new SignalRConnection() { ConnectionId = Context.ConnectionId, UserId = userId };
                _connections.TryAdd(clientId, connection);
                Groups.Add(Context.ConnectionId, clientId.ToString());
            }

            return Task.FromResult(connection);
        }
        public Task Disconnect(Guid clientId) {
            SignalRConnection connection;
            if (_connections.TryRemove(clientId, out connection)) {
                return Groups.Remove(connection.ConnectionId, clientId.ToString());
            }

            return Task.FromResult("");
        }
        internal static void NotifyOccurrenceCreate(Guid? clientId, Altask.www.Models.TaskInstance instance, Altask.Data.Dto.Occurrence occurrence) {
            if (!clientId.HasValue) {
                _context.Clients.All.notifyOccurrenceCreate(new { instance = instance, occurrence = occurrence });
            }
            else {
                SignalRConnection connection;

                if (_connections.TryGetValue(clientId.Value, out connection)) {
                    _context.Clients.AllExcept(connection.ConnectionId).notifyOccurrenceCreate(new { connection = connection, instance = instance, occurrence = occurrence });
                } else {
                    _context.Clients.All.notifyOccurrenceCreate(new { instance = instance, occurrence = occurrence });
                }
            }
        }

        internal static void NotifyOccurrenceUpdate(Guid? clientId, Altask.www.Models.TaskInstance instance, Altask.Data.Dto.Occurrence occurrence) {
            if (!clientId.HasValue) {
                _context.Clients.All.notifyOccurrenceUpdate(new { instance = instance, occurrence = occurrence });
            }
            else {
                SignalRConnection connection;

                if (_connections.TryGetValue(clientId.Value, out connection)) {
                    _context.Clients.AllExcept(connection.ConnectionId).notifyOccurrenceUpdate(new { connection = connection, instance = instance, occurrence = occurrence });
                } else {
                    _context.Clients.All.notifyOccurrenceUpdate(new { instance = instance, occurrence = occurrence });
                }
            }
        }
    }

    public class SignalRConnection {
        public string UserId { get; set; }
        public string ConnectionId { get; set; }
    }
}
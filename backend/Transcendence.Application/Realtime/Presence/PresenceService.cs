using System.Collections.Concurrent;
using System.Dynamic;
using System.IO.Compression;
using Transcendence.Application.Realtime.Contracts;
namespace Transcendence.Application.Services;
public class PresenceService : IPresenceService
{

    private ConcurrentDictionary<Guid, ConcurrentDictionary<string, byte>> _connections = new(); // <UserId, <connectionId, 0> - no Concurrend set in C# so use Dictionary
    public bool AddConnection(Guid userId, string connectionId) //all mnethods are for concurent
    {
        var exist = _connections.GetOrAdd(userId, _ => new ConcurrentDictionary<string, byte>()); // 1 dict for 1 user
        bool added = exist.TryAdd(connectionId, 0);
        return added && exist.Count == 1; //means connected just now  
    }
    public bool RemoveConnection (Guid userId, string connectionId)
    {
        if (_connections.TryGetValue(userId, out var user))
        {
            bool rem = user.TryRemove(connectionId, out var temp);
            if (rem && user.IsEmpty)
            {
                bool remUser = _connections.TryRemove(userId, out var removedUser);
                return true;
            } 
        }
        return false;
    }

    public bool IsOnline(Guid userId)
    {
        bool exist = _connections.TryGetValue(userId, out var userConnections);
        return exist && userConnections?.Count > 0;
    }
 
}

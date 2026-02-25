using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace Transcendence.Api.Realtime.Hubs;
public abstract class BaseHub<TClient>: Hub<TClient> where TClient : class {


}

/*
Why BaseHub instead of a static helper class:

We use inheritance (BaseHub) because these methods depend on Hub context
(Context, Claims, ConnectionId), which is part of the SignalR lifecycle.

Using a helper class would require passing HubCallerContext around,
leaking infrastructure details into business logic and breaking boundaries.

BaseHub keeps:
- authentication logic close to the Hub
- access to Context without parameter passing
- a single extension point for all hubs (ChatHub, PresenceHub)

This is the same reason ASP.NET controllers inherit from ControllerBase
instead of using static helper methods with HttpContext.

*/
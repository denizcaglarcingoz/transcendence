using System.Drawing;
using System.Net.WebSockets;
using System.Security.Cryptography.X509Certificates;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.SignalR;
using Microsoft.VisualBasic;
using Transcendence.Application.Chat.Interfaces;
using Transcendence.Application.Chat.DTOs;
using Transcendence.Application.Realtime.DTOs;
using Transcendence.Application.Realtime.Contracts;
using Transcendence.Api.Common.Extensions;
using  Transcendence.Api.Realtime.Hubs;
using System.Text.Json;
using System.IO.IsolatedStorage;
using System.Collections.Specialized;
using Transcendence.Domain.Users;
using Microsoft.AspNetCore.Authorization;
namespace Transcendence.Api.Realtime.Hubs;
[Authorize]
public sealed class ChatHub : Hub<IRealtimeClient> 
{
    private readonly IChatService _chatService;
    private readonly IPresenceService _presenceService;
    private readonly INotificationService _notificationService;
    public ChatHub( IChatService chatService, IPresenceService presenceService, INotificationService notificationService )
    {
        _chatService = chatService;
        _presenceService = presenceService;
        _notificationService = notificationService;
    }
 
    public override async Task OnConnectedAsync()
{
    var userId = GetUserId();

    Console.WriteLine($"OnConnectedAsync fired. ConnectionId={Context.ConnectionId}, UserId={userId}");


    await Groups.AddToGroupAsync(Context.ConnectionId, GroupNames.User(userId)); // add connId to user's collection of connections  
    Console.WriteLine($"User {userId} joined group user:{userId}");
    
    var userConversations = await _chatService.GetUserConversationsIds(userId);
    foreach (var c in userConversations)
        await Groups.AddToGroupAsync(Context.ConnectionId, GroupNames.Conversation(c)); // add connection to conversation groups (group names are based on DB conversation IDs)

    var becameOnline = _presenceService.AddConnection(userId, Context.ConnectionId);

    Console.WriteLine(
        $"AddConnection result. UserId={userId}, ConnectionId={Context.ConnectionId}, BecameOnline={becameOnline}");
    if (becameOnline)
        {
            var presence = new PresenceEventDto
            {
                UserId = userId,
                IsOnline = true,
                ChangedAt = DateTimeOffset.UtcNow
            };
 
            foreach(var c in userConversations)
                await Clients.Group(GroupNames.Conversation(c)).UserOnLine(presence);  // broadcast to all active connections in the conversation group (all tabs/devices)
            /*  same faster:
                var tasks = userConversations
                            .Select(c => Clients.Group(GroupNames.Conversation(c)).UserOnline(presence));
                await Task.WhenAll(tasks);
            */
           
        }

        var onlineUsers = new HashSet<Guid>(); 
        
        foreach(var conv in userConversations)
        {
            var participants = await _chatService.GetParticipantsIds(conv);

            foreach (var p in participants)
            {
                if (p != userId && _presenceService.IsOnline(p)) 
                    onlineUsers.Add(p);
            }
        }   
         
        await Clients.Caller.OnlineUsersSnapshot(
            onlineUsers.Select(id => id.ToString())
        );
        await base.OnConnectedAsync();
    }
 public override async Task OnDisconnectedAsync(Exception? exception)
{
    var userId = TryGetCurrentUserId();

    Console.WriteLine($"OnDisconnectedAsync fired. ConnectionId={Context.ConnectionId}, UserId={userId}");

    if (userId is not null)
    {
        var removedLast = _presenceService.RemoveConnection(userId.Value, Context.ConnectionId);

        Console.WriteLine(
            $"RemoveConnection result. UserId={userId.Value}, ConnectionId={Context.ConnectionId}, RemovedLast={removedLast}");

        if (removedLast)
        {
            var presence = new PresenceEventDto
            {
                UserId = userId.Value,
                IsOnline = false,
                ChangedAt = DateTimeOffset.UtcNow
            };

            var userConversations = await _chatService.GetUserConversationsIds(userId.Value);

            Console.WriteLine(
                $"Broadcasting UserOffLine for user {userId.Value} to {userConversations.Count} conversations");

            foreach (var conv in userConversations)
                await Clients.Group(GroupNames.Conversation(conv)).UserOffLine(presence);
        }
    }
    else
    {
        Console.WriteLine($"OnDisconnectedAsync could not resolve user. ConnectionId={Context.ConnectionId}");
    }

    await base.OnDisconnectedAsync(exception);
} 
    public async Task JoinConversation(Guid conversationId) // user opened a chat → subscribe connection to conversation group
    {
        var userId = GetUserId();
        await _chatService.AssertUserIsParticipant(conversationId, userId); 
        await Groups.AddToGroupAsync(Context.ConnectionId, GroupNames.Conversation(conversationId));
    }
 
    public async Task LeaveConversation(Guid conversationId) //user closed chat → remove connection from conversation group
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, GroupNames.Conversation(conversationId)); 
    }

    public async Task SendMessage(SendMessageCommandDto dto)// user sends a message → persist and broadcast to conversation group
    {
        var senderId = GetUserId();

        var messageDto = await _chatService.SendMessageAsync( //validate, normalize timestamps, and persist message to databas
            senderId,
            dto.ConversationId,
            dto.ClientMessageId,
            dto.Content
        );
        await Clients.Group(GroupNames.Conversation(dto.ConversationId))
                    .MessageReceived(messageDto);

        var receivers = await _chatService.GetParticipantsIds(dto.ConversationId);

        await _notificationService.NotifyNewMessage(receivers, senderId, messageDto);
        await _notificationService.NotifyConversationsChanged(receivers);
        
        await Clients.Caller.MessageAck(new MessageAckDto  
        {
            ClientMessageId = dto.ClientMessageId,
            MessageId = messageDto.MessageId,
            CreatedAt = messageDto.CreatedAt
        });
    }

    public Task RequestPresenceSnapshot()
    {
        var online = _presenceService.GetOnlineUsers();
        return  Clients.Caller.OnlineUsersSnapshot(
            online.Select(id => id.ToString())
        );
    }
   
    public async Task DeliveredMessage(Guid messageId, Guid conversationId, Guid senderId)
    {
        var  userId = GetUserId(); 
        
        var deliveredDto = await _chatService.MarkMessageAsDeliveredAsync(userId, messageId);
        await Clients
                .Group(GroupNames.User(senderId))  
                .MessageDelivered(deliveredDto);
    }
  
    public async Task MarkAsRead(Guid conversationId)
{
    var userId = GetUserId();

    await _chatService.MarkConversationAsRead(userId, conversationId);
    await _notificationService.NotifyChange(userId);

    var lastMessageId = await _chatService.GetLastMessageId(conversationId);

    var participants = await _chatService.GetParticipantsIds(conversationId);
    var senderIds = participants.Where(id => id != userId);

    foreach (var senderId in senderIds)
    {
        await Clients
            .Group(GroupNames.User(senderId))
            .MessageRead(new MessageReadDto
            {
                ConversationId = conversationId,
                ReaderId = userId,
                MessageId = lastMessageId ?? Guid.Empty
            });
    }
}
 
 
    private Guid GetUserId()
    {
        var claimValue =
            Context.User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
            ?? Context.User?.FindFirst("sub")?.Value;

        if (Guid.TryParse(claimValue, out var userId))
            return userId;

        throw new HubException("Unauthorized.");
    }
 
    public async Task MarkAllIncomingAsDelivered()
    {
        var userId = GetUserId();
        var messages = await _chatService.DeliverPendingMessagesAsync(userId);
        foreach(var m in messages)
        {
               await Clients
                .Group(GroupNames.User(m.SenderId))  
                .MessageDelivered(m);
        }
    }
    public async Task DeleteMessage(Guid messageId)
{
    var userId = GetUserId();

    var deleted = await _chatService.DeleteMessageAsync(userId, messageId);

    var participantIds = await _chatService.GetParticipantsIds(deleted.ConversationId);

    foreach (var participantId in participantIds)
    {
        await Clients
            .Group(GroupNames.User(participantId))
            .MessageDeleted(deleted);
    }
}
    private Guid? TryGetCurrentUserId()
    {
        var claimValue =
            Context.User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
            ?? Context.User?.FindFirst("sub")?.Value;

        if (Guid.TryParse(claimValue, out var claimUserId))
            return claimUserId;

        var httpContext = Context.GetHttpContext();

        var devQuery = httpContext?.Request.Query["devUserId"].FirstOrDefault();
        if (Guid.TryParse(devQuery, out var queryUserId))
            return queryUserId;

        var devHeader = httpContext?.Request.Headers["X-Dev-UserId"].FirstOrDefault();
        if (Guid.TryParse(devHeader, out var headerUserId))
            return headerUserId;

        return null;
    }
}
    
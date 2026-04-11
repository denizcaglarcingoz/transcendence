namespace Transcendence.Application.Realtime.Contracts;
using Transcendence.Application.Chat.DTOs;
using System.Collections.Generic;
public interface INotificationService
{
        Task NotifyNewMessage(
            IEnumerable<Guid> participants,
            Guid senderId,
            ChatMessageDto message
 
            );
        Task NotifyConversationCreated(Guid userA, Guid userB, Guid conversationId);
} //class Transcendence.Application.Chat.DTOs.ChatMessageDto
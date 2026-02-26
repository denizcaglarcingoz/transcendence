using Transcendence.Application.Friends.DTOs;

namespace Transcendence.Application.Friends.Queries;
public interface IFriendsQuery
{
	Task<IReadOnlyList<FriendDto>> CountFriendsAsync(Guid userId, CancellationToken ct);
	Task<IReadOnlyList<FriendshipRequestDto>> ListFriendshipRequestsAsync(Guid userId, CancellationToken ct);
}

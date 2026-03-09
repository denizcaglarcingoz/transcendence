using Microsoft.EntityFrameworkCore;
using Transcendence.Application.Friends.Interfaces;
using Transcendence.Domain.Friends;
using Transcendence.Domain.Users;
using Transcendence.Infrastructure.Persistence;
namespace Transcendence.Infrastructure.Repositories;

public sealed class FriendshipRepository : IFriendshipRepository
{
    private readonly TranscendenceDbContext _db;

    public FriendshipRepository(TranscendenceDbContext db)
    {
        _db = db;
    }
	public async Task<bool> IsFriendAsync(Guid userAId, Guid userBId, CancellationToken ct) // database level logic, not service
	{
		throw new NotImplementedException("Should be implemented");
	}
	public async Task AddAsync(Friendship friendship, CancellationToken ct)
	{
		throw new NotImplementedException("Should be implemented");
	}

	public  Task RemoveAsync(Guid userAId, Guid userBId, CancellationToken ct)
    {
        var follow = new Friendship(userAId, userBId, DateTime.Now); // (Guid userAId, Guid userBId, DateTime createdAt)
		_db.UserFollows.Remove(follow);
        return Task.CompletedTask; // используется когда метод async по контракту, но внутри синхронный
    }
 
    public async Task <int> CountFriendsAsync (Guid userId, CancellationToken ct)
    {
        return await _db.UserFollows.CountAsync(x => x.User2Id == userId);
    }

    public async Task<IReadOnlyList<Guid>> ListFriendsAsync(Guid userId, CancellationToken ct)
	{
		throw new NotImplementedException("Should be implemented");
	}
	public async Task SaveChangesAsync(CancellationToken ct)
	{
		throw new NotImplementedException("Should be implemented");
	}


}
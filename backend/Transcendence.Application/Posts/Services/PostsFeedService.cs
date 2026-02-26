using Transcendence.Application.Friends.Interfaces;
using Transcendence.Application.Posts.DTOs;
using Transcendence.Application.Posts.Interfaces;
using Transcendence.Application.Users.Interfaces;
using Transcendence.Domain.Posts;

namespace Transcendence.Application.Posts.Services;
internal class PostsFeedService : IPostsFeedService
{
	private readonly IPostsFeedRepository _postsFeedRepository;
	private readonly IUserRepository _userRepository;
	private readonly IPostsRepository _postRepository;
	private readonly IFriendshipRepository _friendshipRepository;
	public PostsFeedService(
		IPostsFeedRepository postsFeedRepository,
		IUserRepository userRepository,
		IPostsRepository postRepository,
		IFriendshipRepository friendshipRepository)
	{
		_postsFeedRepository = postsFeedRepository;
		_userRepository = userRepository;
		_postRepository = postRepository;
		_friendshipRepository = friendshipRepository;
	}

	public async Task<CursorPageDto<FeedPostDto>> GetFeedAsync(
		int take,
		string? cursor,
		Guid currentUserId,
		CancellationToken ct)
	{
		take = (take < 1 || take > 50) ? 20 : take;

		// repository returns: Items + NextCursor (cursor logic stays in repository)
		var page = await _postsFeedRepository.GetFeedPageAsync(currentUserId, take, cursor, ct);


		// Map entity to DTO (manual mapping shown; use your mapper if you have one)
		var items = page.Items.Select(p => new FeedPostDto
		{
			// Fill fields you need for list view
			// Id = p.Id,
			// CreatedAt = p.CreatedAt,
			// Content = p.Content,
		}).ToList();

		return new CursorPageDto<FeedPostDto>(items, page.NextCursor);
	}
}


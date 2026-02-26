using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Connections;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Transcendence.Application.Common.Responses;
using Transcendence.Api.Common.Extensions;
using Transcendence.Application.Posts.Interfaces;
using Transcendence.Application.Posts.DTOs;
using Transcendence.Domain.Posts;

namespace Transcendence.Api.Controllers;

[Authorize]
[ApiController]
[Route("posts")]
public sealed class PostsProfileController : ControllerBase
{
	private readonly IPostsService _postsService;
	public PostsProfileController(IPostsService postsService) { _postsService = postsService; }

	//#--#GET /posts/me?take=20&cursor=<nextCursor>
	[HttpGet("me")]
	public async Task<ActionResult<ApiResponse<CursorPageDto<PostListItemDto>>>> GetOwnProfilePosts(
		[FromQuery] int take = 20,
		[FromQuery] string? cursor = null,
		CancellationToken ct = default)
	{
		Guid currentUserId = GetUserId();

		if (take <= 0 || take > 50) take = 20; // Enforce reasonable limits
		var postList = await _postsService.GetOwnProfilePostsAsync(take, cursor, currentUserId, ct);
		return this.OkResponse(postList);
	}

	//#--#GET /posts/by-username/{targetUserId}?take=20&cursor=<nextCursor>
	[HttpGet("by-username/{targetUserId:guid}")]
	public async Task<ActionResult<ApiResponse<CursorPageDto<PostListItemDto>>>> GetUserProfilePosts(
		[FromRoute] Guid targetUserId,
		[FromQuery] int take = 20,
		[FromQuery] string? cursor = null,
		CancellationToken ct = default)
	{
		Guid currentUserId = GetUserId();
		if (take <= 0 || take > 50) take = 20; // Enforce reasonable limits
		var postList = await _postsService.GetUserProfilePostsAsync(targetUserId, take, cursor, currentUserId, ct);
		return this.OkResponse(postList);
	}




	private Guid GetUserId()
	{
		var value =
			User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
			?? User.FindFirst("sub")?.Value;

		if (value is null || !Guid.TryParse(value, out var userId))
			throw new UnauthorizedAccessException("Invalid token.");

		return userId;
	}
}

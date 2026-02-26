using Transcendence.Application.Posts.DTOs;

namespace Transcendence.Application.Posts.DTOs;
public sealed class FeedPostDto
{
	public Guid Id { get; set; }
	public Guid AuthorId { get; set; }
	public string? ImageUrl { get; set; }
	public string? Content { get; set; }
	public DateTime CreatedAtUtc { get; set; }
	public bool IsLikedByCurrentUser { get; set; }
	public int LikesCount { get; set; }
	public string? AuthorUsername { get; set; }
	public string? AuthorAvatarUrl { get; set; }
}

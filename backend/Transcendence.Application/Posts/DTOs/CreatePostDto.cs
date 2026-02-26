namespace Transcendence.Application.Posts.DTOs;
public sealed class CreatePostDto
{
	public string? Content { get; init; }
	public Guid ImageFileId { get; init; }
}

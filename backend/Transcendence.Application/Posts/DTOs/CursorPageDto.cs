namespace Transcendence.Application.Posts.DTOs;

public sealed record CursorPageDto<T>(
	IReadOnlyList<T> Items,
	string? NextCursor
);
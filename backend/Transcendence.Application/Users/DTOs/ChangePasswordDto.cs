namespace Transcendence.Application.Users.DTOs;
public class ChangePasswordDto
{
	public string CurrentPassword { get; init; } = default!;
	public string NewPassword { get; init; } = default!;

}

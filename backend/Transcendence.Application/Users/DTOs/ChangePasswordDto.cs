namespace Transcendence.Application.Users.DTOs;
public class ChangePasswordDto
{
	public string CurrentPassword { get; init; } = default!;
	public string NewPassword { get; init; } = default!;

}

//if we don't fully switch to Google/JWT, it might matter for local accounts
// using System.ComponentModel.DataAnnotations;

// public sealed class ChangePasswordDto
// {
//     [Required]
//     public string CurrentPassword { get; init; } = default!;

//     [Required]
//     [StringLength(100, MinimumLength = 8)]
//     public string NewPassword { get; init; } = default!;
// }
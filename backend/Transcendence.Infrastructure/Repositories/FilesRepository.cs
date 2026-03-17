using Microsoft.EntityFrameworkCore;
using Transcendence.Domain.Files;
using Transcendence.Infrastructure.Persistence;
using Transcendence.Application.Files.Interface;

namespace Transcendence.Infrastructure.Repositories;

public sealed class FilesRepository : IFilesRepository
{
	private readonly TranscendenceDbContext _db;

	public FilesRepository(TranscendenceDbContext db)
	{
		_db = db;
	}

	public async Task AddAsync(FilesAsset asset, CancellationToken ct)
	{
		await _db.Files.AddAsync(asset, ct);
	}

	public async Task<FilesAsset?> GetByIdAsync(Guid id, CancellationToken ct)
	{
		return await _db.Files
			.SingleOrDefaultAsync(x => x.Id == id, ct);
	}

	public void Remove(FilesAsset asset)
	{
		_db.Files.Remove(asset);
	}

	public async Task SaveChangesAsync(CancellationToken ct)
	{
		await _db.SaveChangesAsync(ct);
	}
}
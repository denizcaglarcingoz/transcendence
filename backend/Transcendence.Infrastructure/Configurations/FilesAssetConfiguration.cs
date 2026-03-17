using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Transcendence.Domain.Files;
using Transcendence.Domain.Users;

namespace Transcendence.Infrastructure.Configurations;

public sealed class FilesAssetConfiguration : IEntityTypeConfiguration<FilesAsset>
{
	public void Configure(EntityTypeBuilder<FilesAsset> builder)
	{
		builder.ToTable("files");

		builder.HasKey(x => x.Id); // Primary Key

		builder.Property(x => x.OwnerId) // Must have an owner
			.IsRequired();

		builder.Property(x => x.StoragePath) 
			.IsRequired()
			.HasMaxLength(500);

		builder.Property(x => x.ContentType)
			.IsRequired()
			.HasMaxLength(100);

		builder.Property(x => x.SizeBytes)
			.IsRequired();

		builder.Property(x => x.UploadedAtUtc)
			.IsRequired();

		builder.HasOne<User>()
			.WithMany()
			.HasForeignKey(x => x.OwnerId)
			.OnDelete(DeleteBehavior.Cascade);

		builder.HasIndex(x => x.OwnerId);
		
		builder.HasIndex(x => x.StoragePath)
			.IsUnique();
	}
}
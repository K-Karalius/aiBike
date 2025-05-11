using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using server.Models;

namespace server.DatabaseContext.Configurations;

public class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
{
    public void Configure(EntityTypeBuilder<RefreshToken> builder)
    {
        builder.HasKey(rt => rt.Id);
        builder.HasIndex(rt => rt.Token).IsUnique();
        builder.Property(rt => rt.Expires).IsRequired();
        builder.Property(rt => rt.Revoked).IsRequired();
        builder.Property(rt => rt.UserId).IsRequired();
    }
}
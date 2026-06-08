using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartBudgetPro.Domain.Dashboard;

namespace SmartBudgetPro.Infrastructure.Persistence.Configurations;

public class UserDashboardConfigConfiguration : IEntityTypeConfiguration<UserDashboardConfig>
{
    public void Configure(EntityTypeBuilder<UserDashboardConfig> builder)
    {
        builder.ToTable("UserDashboardConfigs");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.ComponentKey)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(c => c.Columns)
            .IsRequired();

        builder.Property(c => c.Order)
            .IsRequired();

        builder.Property(c => c.Visible)
            .IsRequired();

        builder.HasIndex(c => c.UserId);
    }
}

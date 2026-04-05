using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartBudgetPro.Domain.Budgets;

namespace SmartBudgetPro.Infrastructure.Persistence.Configurations;

public class BudgetConfiguration : IEntityTypeConfiguration<Budget>
{
    public void Configure(EntityTypeBuilder<Budget> builder)
    {
        builder.ToTable("Budgets");

        builder.HasKey(b => b.Id);

        builder.Property(b => b.LimitAmount)
            .IsRequired()
            .HasPrecision(18, 2);

        builder.Property(b => b.SpentAmount)
            .IsRequired()
            .HasPrecision(18, 2);

        builder.Property(b => b.Status)
            .IsRequired()
            .HasConversion<string>();

        builder.HasIndex(b => new { b.UserId, b.TransactionCategoryId, b.Year, b.Month })
            .IsUnique();
    }
}
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartBudgetPro.Domain.Transactions;

namespace SmartBudgetPro.Infrastructure.Persistence.Configurations;

public class TransactionConfiguration : IEntityTypeConfiguration<Transaction>
{
    public void Configure(EntityTypeBuilder<Transaction> builder)
    {
        builder.ToTable("Transactions");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.Amount)
            .IsRequired()
            .HasPrecision(18, 2);

        builder.Property(t => t.Description)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(t => t.Type)
            .IsRequired()
            .HasConversion<string>();

        builder.Property(t => t.Recurrence)
            .IsRequired()
            .HasConversion<string>();

        builder.HasIndex(t => t.UserId);
        builder.HasIndex(t => t.TransactionDate);
    }
}
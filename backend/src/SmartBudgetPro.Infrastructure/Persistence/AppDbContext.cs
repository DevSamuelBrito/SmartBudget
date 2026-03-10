using Microsoft.EntityFrameworkCore;
using SmartBudgetPro.Domain.Budgets;
using SmartBudgetPro.Domain.Transactions;
using SmartBudgetPro.Domain.Users;
using System.Reflection; 

namespace SmartBudgetPro.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Transaction> Transactions { get; set; }
    public DbSet<TransactionCategory> TransactionCategories { get; set; }
    public DbSet<Budget> Budgets { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}
using Microsoft.EntityFrameworkCore;
using SmartBudgetPro.Application.Interfaces;
using SmartBudgetPro.Domain.Users;

namespace SmartBudgetPro.Infrastructure.Persistence.Repositories;

public class UserRepository(AppDbContext context) : IUserRepository
{
    public async Task AddAsync(User user)
    {
        await context.Users.AddAsync(user);
        await context.SaveChangesAsync();
    }

    public async Task UpdateAsync(User user)
    {
        context.Users.Update(user);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid userId)
    {
        var user = await context.Users.FindAsync(userId);

        if (user is null)
            return;

        context.Users.Remove(user);
        await context.SaveChangesAsync();
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        var normalizedEmail = email.Trim();

        return await context.Users
            .FirstOrDefaultAsync(u => EF.Functions.ILike(u.Email, normalizedEmail));
    }

    public async Task<bool> EmailExistsAsync(string email, Guid? excludeUserId = null)
    {
        var normalizedEmail = email.Trim();

        return await context.Users.AnyAsync(u =>
            EF.Functions.ILike(u.Email, normalizedEmail) &&
            (!excludeUserId.HasValue || u.Id != excludeUserId.Value));
    }

    public async Task<User?> GetByIdAsync(Guid userId)
    {
        return await context.Users.FindAsync(userId);
    }
}
using SmartBudgetPro.Application.Common;
using SmartBudgetPro.Application.Interfaces;
using DomainUser = SmartBudgetPro.Domain.Users.User;

namespace SmartBudgetPro.Application.UseCases.User.CreateUser;

public class CreateUserUseCase(IUserRepository userRepository, IPasswordHasher passwordHasher)
{
    public async Task<UserDto> ExecuteAsync(CreateUserUseCaseInput input)
    {
        var existingUser = await userRepository.GetByEmailAsync(input.Email);

        if (existingUser != null)
            throw new InvalidOperationException("A user with the same email already exists.");

        var passwordHash = passwordHasher.Hash(input.Password);

        var user = DomainUser.Create(input.Name, input.Email, passwordHash);

        await userRepository.AddAsync(user);

        return new UserDto(user.Id, user.Name, user.Email);
    }
}
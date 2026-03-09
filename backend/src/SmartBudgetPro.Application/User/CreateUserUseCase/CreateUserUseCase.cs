

using SmartBudgetPro.Application.Interfaces;
using SmartBudgetPro.Domain;

namespace SmartBudgetPro.Application.User.CreateUserUseCase;

public class CreateUserUseCase(IUserRepository userRepository, IPasswordHasher passwordHasher)
{
    public async Task<CreateUserUseCaseOutput> ExecuteAsync(CreateUserUseCaseInput input)
    {
        var existingUser = await userRepository.GetByEmailAsync(input.Email);

        if (existingUser != null)
            throw new InvalidOperationException("A user with the same email already exists.");

        var passwordHash = passwordHasher.Hash(input.Password);

        var user = User.Create(input.Name, input.Email, passwordHash);

        await userRepository.CreateAsync(user);

        return new CreateUserUseCaseOutput(user.Id, user.Name, user.Email);
    }
}
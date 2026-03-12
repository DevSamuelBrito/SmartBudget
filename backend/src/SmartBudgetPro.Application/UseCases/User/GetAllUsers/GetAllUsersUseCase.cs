using SmartBudgetPro.Application.Interfaces;

namespace SmartBudgetPro.Application.UseCases.User.GetAllUsers
{
    public class GetAllUsersUseCase(IUserRepository userRepository)
    {
        public async Task<IEnumerable<GetAllUsersUseCaseOutput>> ExecuteAsync()
        {
            var users = await userRepository.GetAllAsync();

            return users.Select(u => new GetAllUsersUseCaseOutput(
                u.Id,
                u.Name,
                u.Email
            ));
        }
    }
}

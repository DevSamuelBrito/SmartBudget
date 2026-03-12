using SmartBudgetPro.Application.Common;
using SmartBudgetPro.Application.Interfaces;

namespace SmartBudgetPro.Application.UseCases.User.GetAllUsers
{
    public class GetAllUsersUseCase(IUserRepository userRepository)
    {
        public async Task<IEnumerable<UserDto>> ExecuteAsync()
        {
            var users = await userRepository.GetAllAsync();

            return users.Select(u => new UserDto(
                u.Id,
                u.Name,
                u.Email
            ));
        }
    }
}

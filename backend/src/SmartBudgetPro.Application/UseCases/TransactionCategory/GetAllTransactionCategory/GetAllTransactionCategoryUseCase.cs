using FluentValidation;
using SmartBudgetPro.Application.Common.DTOs;
using SmartBudgetPro.Application.Interfaces;
using SmartBudgetPro.Shared.Pagination;

namespace SmartBudgetPro.Application.TransactionCategory.GetAllTransactionCategory
{
    public class GetAllTransactionCategoryUseCase(
        ITransactionCategoryRepository transactionCategoryRepository,
        IValidator<GetAllTransactionCategoryUseCaseInput> validator)
    {
        public async Task<PagedResult<TransactionCategoryDto>> ExecuteAsync(GetAllTransactionCategoryUseCaseInput input)
        {
            await validator.ValidateAndThrowAsync(input);

            var skip = (input.Page - 1) * input.PageSize;

            var categories = await transactionCategoryRepository.GetByUserIdPagedAsync(input.UserId, skip, input.PageSize, input.Name, input.Icon);
            var totalCount = await transactionCategoryRepository.CountByUserIdAsync(input.UserId, input.Name, input.Icon);

            var items = categories.Select(c => new TransactionCategoryDto(
                c.Id,
                c.UserId,
                c.Name,
                c.Icon,
                c.CreatedAt,
                c.UpdatedAt
            ));

            return new PagedResult<TransactionCategoryDto>(items, totalCount, input.Page, input.PageSize);
        }
    }
}

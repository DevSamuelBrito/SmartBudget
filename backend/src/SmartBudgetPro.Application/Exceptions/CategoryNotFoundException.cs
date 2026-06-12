using SmartBudgetPro.Shared.Exceptions;

namespace SmartBudgetPro.Application.Exceptions;

public sealed class CategoryNotFoundException : BusinessNotFoundException
{
    public CategoryNotFoundException()
        : base("Category not found.")
    {
    }
}

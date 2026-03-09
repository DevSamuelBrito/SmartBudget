using System;

namespace SmartBudgetPro.Domain;

public class Transaction
{
    public Guid Id { get; set; }
    public Guid TransactionCategoryId { get; set; } = null!;
    public Guid UserId { get; set; }
    public decimal Amount { get; set; }
    public string Description { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

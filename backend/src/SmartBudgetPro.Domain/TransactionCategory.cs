using System;

namespace SmartBudgetPro.Domain;

public class TransactionCategory
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

using SmartBudgetPro.Domain.Transactions;

namespace SmartBudgetPro.Application.Interfaces
{
    /// <summary>
    /// Defines persistence operations for financial transactions.
    /// </summary>
    public interface IFinancialTransactionRepository
    {
        /// <summary>
        /// Retrieves all financial transactions.
        /// </summary>
        /// <returns>A collection containing all financial transactions.</returns>
        Task<IEnumerable<FinancialTransaction>> GetAllAsync();

        /// <summary>
        /// Retrieves a financial transaction by its identifier.
        /// </summary>
        /// <param name="transactionId">The unique identifier of the transaction.</param>
        /// <returns>The transaction if found; otherwise, <c>null</c>.</returns>
        Task<FinancialTransaction?> GetByIdAsync(Guid transactionId);

        /// <summary>
        /// Adds a new financial transaction.
        /// </summary>
        /// <param name="transaction">The transaction to persist.</param>
        Task AddAsync(FinancialTransaction transaction);

        /// <summary>
        /// Updates an existing financial transaction.
        /// </summary>
        /// <param name="transaction">The transaction with updated data.</param>
        Task UpdateAsync(FinancialTransaction transaction);
    }
}

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
        /// Retrieves all user-created monthly recurring transactions.
        /// </summary>
        /// <returns>A collection containing monthly recurring source transactions.</returns>
        Task<IEnumerable<FinancialTransaction>> GetAllMonthlyRecurringAsync();

        /// <summary>
        /// Retrieves all financial transactions for a specific user.
        /// </summary>
        /// <param name="userId">The unique identifier of the user.</param>
        /// <returns>A collection containing the user's financial transactions.</returns>
        Task<IEnumerable<FinancialTransaction>> GetByUserIdAsync(Guid userId);

        /// <summary>
        /// Retrieves a page of financial transactions for a specific user.
        /// </summary>
        /// <param name="userId">The unique identifier of the user.</param>
        /// <param name="skip">How many records to skip.</param>
        /// <param name="take">How many records to take.</param>
        Task<IEnumerable<FinancialTransaction>> GetByUserIdPagedAsync(Guid userId, int skip, int take);

        /// <summary>
        /// Counts all financial transactions for a specific user.
        /// </summary>
        /// <param name="userId">The unique identifier of the user.</param>
        Task<int> CountByUserIdAsync(Guid userId);

        /// <summary>
        /// Retrieves a financial transaction by its identifier.
        /// </summary>
        /// <param name="transactionId">The unique identifier of the transaction.</param>
        /// <returns>The transaction if found; otherwise, <c>null</c>.</returns>
        Task<FinancialTransaction?> GetByIdAsync(Guid transactionId);

        /// <summary>
        /// Checks whether an auto-generated occurrence already exists for the specified origin transaction in a given month.
        /// </summary>
        /// <param name="originTransactionId">The unique identifier of the source recurring transaction.</param>
        /// <param name="year">The target year.</param>
        /// <param name="month">The target month.</param>
        /// <returns><c>true</c> if an occurrence exists; otherwise, <c>false</c>.</returns>
        Task<bool> ExistsOccurrenceForMonthAsync(Guid originTransactionId, int year, int month);

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

        /// <summary>
        /// Deletes a financial transaction by its identifier.
        /// </summary>
        /// <param name="transactionId">The unique identifier of the transaction.</param>
        Task DeleteAsync(Guid transactionId);

        /// <summary>
        /// Checks if there is at least one financial transaction linked to a category.
        /// </summary>
        /// <param name="categoryId">The unique identifier of the category.</param>
        /// <returns><c>true</c> if at least one linked transaction exists; otherwise, <c>false</c>.</returns>
        Task<bool> ExistsTransactionByCategoryAsync(Guid categoryId);

        /// <summary>
        /// Returns the sum of all expense transactions for a given category and period.
        /// </summary>
        Task<decimal> GetTotalExpensesByCategoryAndPeriodAsync(Guid categoryId, int year, int month);
    }
}

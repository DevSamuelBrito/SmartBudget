using SmartBudgetPro.Application.Interfaces;

namespace SmartBudgetPro.Application.UseCases.FinancialTransaction.DeleteFinancialTransaction
{
    public class DeleteFinancialTransactionUseCase(IFinancialTransactionRepository financialTransactionRepository)
    {
        public async Task ExecuteAsync(Guid transactionId)
        {
            await financialTransactionRepository.DeleteAsync(transactionId);
        }
    }
}
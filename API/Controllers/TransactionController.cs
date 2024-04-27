using Application.Interfaces;

namespace API.Controllers
{
    public class TransactionController(
        ITransactionService transactionService) : BaseApiController
    {
        private readonly ITransactionService _transactionService = transactionService;
    }
}

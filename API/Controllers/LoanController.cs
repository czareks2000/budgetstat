using Application.Dto.Counterparty;
using Application.Dto.Loan;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class LoanController(
        ILoanService loanService) : BaseApiController
    {
        private readonly ILoanService _loanService = loanService;

        [HttpPost("counterparty")] //api/counterparty
        public async Task<IActionResult> CreateCounterparty(CounterpartyCreateDto newCounterparty)
        {
            return HandleResult(await _loanService.CreateCounterparty(newCounterparty));
        }

        [Authorize(Policy = "IsOwner")]
        [HttpDelete("counterparty/{counterpartyId}")] //api/counterparty/{counterpartyId}
        public async Task<IActionResult> DeleteCounterparty(int counterpartyId)
        {
            return HandleResult(await _loanService.DeleteCounterparty(counterpartyId));
        }

        [HttpGet("counterparties")] //api/counterparties
        public async Task<IActionResult> GetAllCounterparties()
        {
            return HandleResult(await _loanService.GetAllCounterparties());
        }

        [HttpGet("loans")] //api/loans
        public async Task<IActionResult> GetAllLoans()
        {
            return HandleResult(await _loanService.GetAll());
        }

        [HttpPost("loans")] //api/loans
        public async Task<IActionResult> CreateLoan(LoanCreateDto newLoan)
        {
            return HandleResult(await _loanService.CreateLoan(newLoan));
        }
        
        [HttpPut("loans/{loanId}")] //api/loans/{loanId}
        public async Task<IActionResult> UpdateLoan(int loanId, LoanUpdateDto updatedLoan)
        {
            return HandleResult(await _loanService.UpdateLoan(loanId, updatedLoan));
        }
    }
}

﻿using Application.Dto.Counterparty;
using Application.Dto.Loan;
using Application.Interfaces;
using Domain.Enums;
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

        [HttpGet("loans")] //api/loans?loanStatus=1&counterpartyId=1
        public async Task<IActionResult> GetLoans([FromQuery] LoanStatus loanStatus = LoanStatus.InProgress, [FromQuery] int counterpartyId = 0)
        {
            return HandleResult(await _loanService.GetLoans(loanStatus, counterpartyId));
        }

        [Authorize(Policy = "IsOwner")]
        [HttpGet("loans/{loanId}")] //api/loans/{loanId}
        public async Task<IActionResult> GetLoan(int loanId)
        {
            return HandleResult(await _loanService.GetLoan(loanId));
        }

        [HttpPost("loans")] //api/loans
        public async Task<IActionResult> CreateLoan(LoanCreateDto newLoan)
        {
            return HandleResult(await _loanService.CreateLoan(newLoan));
        }

        [Authorize(Policy = "IsOwner")]
        [HttpPut("loans/{loanId}")] //api/loans/{loanId}
        public async Task<IActionResult> UpdateLoan(int loanId, LoanUpdateDto updatedLoan)
        {
            return HandleResult(await _loanService.UpdateLoan(loanId, updatedLoan));
        }

        [Authorize(Policy = "IsOwner")]
        [HttpDelete("loans/{loanId}")] //api/loans/{loanId}
        public async Task<IActionResult> DeleteLoan(int loanId)
        {
            return HandleResult(await _loanService.DeleteLoan(loanId));
        }

        [Authorize(Policy = "IsOwner")]
        [HttpPost("loans/{loanId}/payoff")] //api/loans/{loanId}/payoff
        public async Task<IActionResult> CreatePayoff(int loanId, PayoffCreateDto newPayoff)
        {
            return HandleResult(await _loanService.CreatePayoff(loanId, newPayoff));
        }
        
        [Authorize(Policy = "IsOwner")]
        [HttpPost("counterparty/{counterpartyId}/payoff")] //api/counterparty/{counterpartyId}/payoff
        public async Task<IActionResult> CollectivePayoff(int counterpartyId, ColectivePayoffDto collectivePayoff)
        {
            return HandleResult(await _loanService.CollectivePayoff(counterpartyId, collectivePayoff));
        }

        [Authorize(Policy = "IsOwner")]
        [HttpDelete("payoff/{payoffId}")] //api/payoff/{payoffId}
        public async Task<IActionResult> DeletePayoff(int payoffId)
        {
            return HandleResult(await _loanService.DeletePayoff(payoffId));
        }
    }
}

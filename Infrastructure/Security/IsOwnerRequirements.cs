using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Security.Claims;

namespace Infrastructure.Security
{
    public class IsOwnerRequirements : IAuthorizationRequirement
    {
    }

    public class IsOwnerRequirementsHandler(
        DataContext dataContext,
        IHttpContextAccessor httpContextAccessor) : AuthorizationHandler<IsOwnerRequirements>
    {
        private readonly DataContext _dataContext = dataContext;
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsOwnerRequirements requirement)
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null) return Task.CompletedTask;

            string ownerId = null;

            if (RouteContainsKey("accountId"))
            {
                var accountId = GetRouteValue("accountId");
                ownerId = _dataContext.Accounts
                    .Where(a => a.Id == accountId)
                    .Select(a => a.UserId)
                    .FirstOrDefault();
            } 
            else if (RouteContainsKey("budgetId"))
            {
                var budgetId = GetRouteValue("budgetId");
                ownerId = _dataContext.Budgets
                    .Where(b => b.Id == budgetId)
                    .Select(b => b.UserId)
                    .FirstOrDefault();
            }
            else if (RouteContainsKey("transactionId"))
            {
                var transactionId = GetRouteValue("transactionId");
                ownerId = _dataContext.Transactions
                    .Where(t => t.Id == transactionId)
                    .Include(t => t.Account)
                    .Select(t => t.Account.UserId)
                    .FirstOrDefault();
            }
            else if (RouteContainsKey("transferId"))
            {
                var transferId = GetRouteValue("transferId");
                ownerId = _dataContext.Transfers
                    .Where(t => t.Id == transferId)
                    .Include(t => t.ToAccount)
                    .Select(t => t.ToAccount.UserId)
                    .FirstOrDefault();
            }
            else if (RouteContainsKey("counterpartyId"))
            {
                var counterpartyId = GetRouteValue("counterpartyId");
                ownerId = _dataContext.Counterparties
                    .Where(c => c.Id == counterpartyId)
                    .Select(c => c.UserId)
                    .FirstOrDefault();
            }
            else if (RouteContainsKey("loanId"))
            {
                var loanId = GetRouteValue("loanId");
                ownerId = _dataContext.Loans
                    .Where(c => c.Id == loanId)
                    .Select(c => c.UserId)
                    .FirstOrDefault();
            }
            else if (RouteContainsKey("payoffId"))
            {
                var payoffId = GetRouteValue("payoffId");
                ownerId = _dataContext.Payoffs
                    .Where(c => c.Id == payoffId)
                    .Include(p => p.Account)
                    .Select(c => c.Account.UserId)
                    .FirstOrDefault();
            }
            // tutaj dodać kolejne sprawdzanie odpowiednich Id
            
            if (ownerId == null) return Task.CompletedTask;

            if (ownerId == userId) context.Succeed(requirement);

            return Task.CompletedTask;
        }

        private bool RouteContainsKey(string key)
        {
            return (bool)_httpContextAccessor.HttpContext?.Request.RouteValues.ContainsKey(key);
        }

        private int GetRouteValue(string key)
        {
            return int.Parse(_httpContextAccessor.HttpContext?.Request.RouteValues
                    .SingleOrDefault(x => x.Key == key).Value.ToString());
        }
    }
}

﻿using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Domain
{
    public class Loan
    {
        public int Id { get; set; }
        public LoanType LoanType { get; set; }
        public int? AccountId { get; set; }
        [Precision(18, 2)]
        public decimal CurrentAmount { get; set; } = 0;
        [Precision(18, 2)]
        public decimal FullAmount { get; set; }
        public int CounterpartyId { get; set; }
        public DateTime LoanDate { get; set; } = DateTime.UtcNow.Date;
        public DateTime RepaymentDate { get; set; }
        public string Description { get; set; }
        public string UserId { get; set; }
        public LoanStatus LoanStatus { get; set; } = LoanStatus.InProgress;
        public int CurrencyId { get; set; }

        public User User { get; set; }
        public virtual Account Account { get; set; }
        public virtual Counterparty Counterparty { get; set; }
        public virtual ICollection<Payoff> Payoffs { get; set; } = new List<Payoff>();
        public virtual Currency Currency { get; set; }
    }
}

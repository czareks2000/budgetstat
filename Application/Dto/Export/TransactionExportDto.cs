﻿using Domain.Enums;

namespace Application.Dto.Export
{
    public class TransactionExportDto
    {
        public int Id { get; set; }

        public DateTime Date { get; set; }

        public TransactionType Type { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; }

        public string Description { get; set; }

        public string Account { get; set; }
        public int? AccountId { get; set; }

        public string MainCategory { get; set; }
        public string Category { get; set; }
        public int CategoryId { get; set; }
        
        public bool Considered { get; set; }
    }
}

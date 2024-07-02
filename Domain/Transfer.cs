﻿namespace Domain
{
    public class Transfer
    {
        public int Id { get; set; }
        public decimal FromAmount { get; set; }
        public decimal ToAmount { get; set; }
        public int FromAccountId { get; set; }
        public int ToAccountId { get; set; }
        public DateTime Date { get; set; }

        public virtual Account FromAccount { get; set; }
        public virtual Account ToAccount { get; set; }
    }
}

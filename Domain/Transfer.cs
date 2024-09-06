using Microsoft.EntityFrameworkCore;

namespace Domain
{
    public class Transfer
    {
        public int Id { get; set; }
        [Precision(18, 2)]
        public decimal FromAmount { get; set; }
        [Precision(18, 2)]
        public decimal ToAmount { get; set; }
        public int FromAccountId { get; set; }
        public int ToAccountId { get; set; }
        public DateTime Date { get; set; }

        public virtual Account FromAccount { get; set; }
        public virtual Account ToAccount { get; set; }
    }
}

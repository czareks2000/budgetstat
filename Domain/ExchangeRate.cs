using Microsoft.EntityFrameworkCore;

namespace Domain
{
    public class ExchangeRate
    {
        public int Id { get; set; }
        public string InputCurrencyCode { get; set; }
        public string OutputCurrencyCode { get; set; }
        [Precision(18, 8)]
        public decimal Rate { get; set; }
        public DateTime Date { get; set; }
    }
}

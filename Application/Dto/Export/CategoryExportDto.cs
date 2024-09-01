using Domain.Enums;
using System.Text.Json.Serialization;

namespace Application.Dto.Export
{
    public class CategoryExportDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public TransactionType Type { get; set; }
        public bool IsMain { get; set; } = false;
        public int? MainCategoryId { get; set; }
    }
}

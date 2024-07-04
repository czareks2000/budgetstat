using Domain;

namespace Application.Dto.Category
{
    public class CategoryCreateDto
    {
        public string Name { get; set; }
        public int IconId { get; set; }
        public TransactionType Type { get; set; }
        public bool IsMain { get; set; }
        public int? MainCategoryId { get; set; }
    }
}

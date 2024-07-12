using Domain.Enums;

namespace Application.Dto.Category
{
    public class MainCategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int IconId { get; set; }
        public TransactionType Type { get; set; }
        public List<CategoryDto> SubCategories { get; set; }
    }
}

using Domain;

namespace Application.Dto.Category
{
    public class CategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Icon { get; set; }
        public TransactionType Type { get; set; }
    }
}

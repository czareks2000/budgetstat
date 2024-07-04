namespace Application.Dto.Category
{
    public class CategoryUpdateDto
    {
        public string Name { get; set; }
        public int IconId { get; set; }
        public bool IsMain { get; set; }
        public int? MainCategoryId { get; set; }
    }
}

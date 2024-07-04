using Application.Core;
using Application.Dto.Icon;

namespace Application.Interfaces
{
    public interface IIconService
    {
        // przegląd wszystkich icon
        Task<Result<List<IconDto>>> GetIcons();
    }
}

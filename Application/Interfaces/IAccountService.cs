using Application.Core;
using Application.Dto;

namespace Application.Interfaces
{
    public interface IAccountService
    {
        // utworzenie konta
        // edycja konta
        // usunięcie konta
        // pobranie listy kont
        Task<Result<List<AccountDto>>> GetAll();
        // zmiana statusu konta
    }
}

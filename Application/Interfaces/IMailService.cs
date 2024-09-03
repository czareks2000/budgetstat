using Application.Core;
using Application.Dto.Mail;

namespace Application.Interfaces
{
    public interface IMailService
    {
        Task<Result<object>> SendEmail(Message message);
    }
}

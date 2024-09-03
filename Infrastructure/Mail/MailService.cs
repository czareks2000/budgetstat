using Microsoft.Extensions.Options;
using MimeKit;
using MailKit.Net.Smtp;
using Application.Interfaces;
using Application.Dto.Mail;
using Application.Core;

namespace Infrastructure.Mail
{
    public class MailService(
        IOptions<EmailConfiguration> emailConfig) : IMailService
    {
        private readonly EmailConfiguration _emailConfig = emailConfig.Value;

        public async Task<Result<object>> SendEmail(Message message)
        {
            var emailMessage = CreateEmailMessage(message);

            using var client = new SmtpClient();
            try
            {
                client.Connect(_emailConfig.SmtpServer, _emailConfig.Port, true);
                client.AuthenticationMechanisms.Remove("XOAUTH2");
                client.Authenticate(_emailConfig.From, _emailConfig.Password);

                await client.SendAsync(emailMessage);
                return Result<object>.Success(null);
            }
            catch (Exception e)
            {
                return Result<object>.Failure("Failed to send email: " + e.Message);
            }
            finally
            {
                client.Disconnect(true);
                client.Dispose();
            }
        }

        private MimeMessage CreateEmailMessage(Message message)
        {
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress(_emailConfig.UserName, _emailConfig.From));
            emailMessage.To.AddRange(message.To);
            emailMessage.Subject = message.Subject;
            emailMessage.Body = new TextPart(MimeKit.Text.TextFormat.Text)
            {
                Text = message.Content
            };

            return emailMessage;
        }
    }
}

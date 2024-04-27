using Application.Core;
using Application.Interfaces;
using Application.Services;
using Infrastructure.Currency;
using Infrastructure.Security;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Extentions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services,
            IConfiguration config)
        {
            services.AddDbContext<DataContext>(options =>
            {
                var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

                string connStr = config.GetConnectionString("DefaultConnection");

                options.UseNpgsql(connStr);
            });


            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy.WithOrigins("http://localhost:3000").AllowAnyMethod().AllowAnyHeader();
                });
            });

            services.AddHttpContextAccessor();

            services.AddScoped<IUserAccessor, UserAccessor>();
            services.AddScoped<ICurrencyService, CurrencyService>();

            
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);


            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<ITransactionService, TransactionService>();

            return services;
        }
    }
}

using Application.Interfaces;
using AutoMapper;
using Persistence;

namespace Application.Services
{
    public class StatsService(
        DataContext context,
        IUtilities utilities,
        IMapper mapper) : IStatsService
    {
        private readonly DataContext _context = context;
        private readonly IUtilities _utilities = utilities;
        private readonly IMapper _mapper = mapper;
    }
}

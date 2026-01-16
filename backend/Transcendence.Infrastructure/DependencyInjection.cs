using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Transcendence.Application.Users.Interfaces;
using Transcendence.Application.UserFollows.Interfaces;
using Transcendence.Application.Posts.Interfaces;
using Transcendence.Infrastructure.Persistence;
using Transcendence.Infrastructure.Repositories;

namespace Transcendence.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString =
            configuration.GetConnectionString("DefaultConnection");

        services.AddDbContext<TranscendenceDbContext>(options =>
            options.UseNpgsql(connectionString)); // config DBcontetx and uses Npgsql.EntityFrameworkCore.PostgreSQL
        services.AddScoped<IUserRepository, UserRepository>(); // when IUserRepository needed - creates UserRepository
        services.AddScoped<IUserFollowRepository, UserFollowRepository>(); 
        services.AddScoped<IPostRepository, PostRepository>(); 
        return services;
    }
}

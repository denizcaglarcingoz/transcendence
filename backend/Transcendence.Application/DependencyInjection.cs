
using Microsoft.Extensions.DependencyInjection;
using Transcendence.Application.Chat.Interfaces;
using Transcendence.Application.Chat.Services;
using Transcendence.Application.Realtime.Contracts;
using Transcendence.Application.Users.Services;

namespace Transcendence.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication (this IServiceCollection services) // adds services from the Application layer to the DI container
    {
        //my services:
        services.AddScoped<IChatService, ChatService>();
        services.AddScoped<FollowService>();
        services.AddScoped<ProfileService>();
        services.AddSingleton<IPresenceService, PresenceService>();         
        


        return services;    
    }
}


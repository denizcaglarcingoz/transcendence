
using Microsoft.Extensions.DependencyInjection;
using Transcendence.Application.Chat.Abstractions;
using Transcendence.Application.Chat.Services;
using Transcendence.Application.Messages.Abstractions;
using Transcendence.Application.Messages.Services;
using Transcendence.Application.Users.Services;


namespace Transcendence.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication (this IServiceCollection services) // adds services from the Application layer to the DI container
    {
        //my services:
        services.AddScoped<IChatService, ChatService>();
        services.AddScoped<IMessageService, MessageService>();         
        services.AddScoped<FollowService>();
        services.AddScoped<ProfileService>();
        return services;    
    }
}


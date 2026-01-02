
using Microsoft.Extensions.DependencyInjection;
using Transcendence.Application.Chat.Abstractions;
using Transcendence.Application.Chat.Services;
using Transcendence.Application.Messages.Abstractions;
using Transcendence.Application.Messages.Services;


namespace Transcendence.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication (this IServiceCollection services) // add my method to services
    {
        //my services:
        services.AddScoped<IChatService, ChatService>();
        services.AddScoped<IMessageService, MessageService>();         

        return services;
    }
}


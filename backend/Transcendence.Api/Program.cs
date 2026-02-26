using Transcendence.Application;
using Transcendence.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Transcendence.Application.Users.Interfaces;
using Transcendence.Application.UserFollows.Interfaces;
using Transcendence.Application.Users.Services;
using Transcendence.Infrastructure.Persistence;
using Transcendence.Infrastructure.Repositories;
using Transcendence.Application.Posts.Interfaces;
using Transcendence.Api.Common.Extensions;
using Transcendence.Api.Realtime;
using  Transcendence.Api.Common.Middelware;
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer(); // scan endpoints for  OpenAPI
builder.Services.AddSwaggerGen();

builder.Services.AddAuthentication();
builder.Services.AddAuthorization();

builder.Services.AddSignalR()
    .AddJsonProtocol(o =>
    {
        o.PayloadSerializerOptions.PropertyNameCaseInsensitive = true;
    });

builder.Services.AddApplication(); //my extention method

builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", policy =>
    {
        policy
            .WithOrigins("http://localhost:5500") // если запускаешь через локальный сервер
            .AllowAnyHeader()
            .AllowAnyMethod()
    		.SetIsOriginAllowed(_ => true)
            .AllowCredentials();
    });
});
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
var app = builder.Build();  //app IApplicationBuilder

app.UseStaticFiles(); // темп

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
	app.UseCors("DevCors");
	app.UseMiddleware<DevAuthMiddleware>();
}

app.UseAuthentication();
app.UseAuthorization();
app.UseGlobalExceptionHandling();

app.MapChatEndpoints();
app.MapControllers();
app.Run();


/*
	If a class:
	• has dependencies
	• must live within a request
	• is used through a constructor

	it is registered in DI
*/
/*
1. builder = WebApplication.CreateBuilder()
2. builder.Services.AddXxx()        ← DependencyInjection
3. app = builder.Build()
4. app.UseXxx()                     ← Middleware 
5. app.MapXxx()                     ← Endpoints (routing)
6. app.Run()

Роли слоёв (очень важно)

🟢 Domain
	•	сущности
	•	бизнес-правила
	•	ни от кого не зависит

🟢 Application
	•	use cases
	•	интерфейсы (IChatService, IMessageService)
	•	НЕ знает, КАК это реализовано

🟢 Infrastructure
	•	реализует интерфейсы из Application
	•	БД, SignalR, AI, BackgroundJobs
	•	должна знать интерфейсы, которые реализует

👉 иначе она не сможет их реализовать

*/

/*
Api ─────▶ Application ─────▶ Domain
 │            ▲
 │            │
 └────▶ Infrastructure ─────┘


Внутренние слои НЕ ЗНАЮТ, КАК они вызываются!!!

Api знает всё, потому что он “снаружи”
Application знает только Domain
Infrastructure знает Application, чтобы реализовать интерфейсы
Domain НИЧЕГО НЕ ЗНАЕТ
❗ Domain — центр. Всё остальное — вокруг

*/
using System.Text.Json;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;

namespace Transcendence.Api.Extensions;

public static class ExceptionHandlingExtensions //just namespace
{
   public static IApplicationBuilder UseGlobalExceptionHandling(this IApplicationBuilder app ) // ext for builder
    {
        app.UseExceptionHandler( // standart method middleware for error handling
            errorApp =>  // Action<IApplicationBuilder>
            {
                errorApp.Run( async context => //  adds terminal (last )middleware,  delegate Func<HttpContext, Task> 
                {
                    var exceptionFeature = context.Features.Get<IExceptionHanlderFeature>();
                    var exception = exceptionFeature?.Errror;
                    
                    var exceptionCode = exception switch
                    {
                        ValidationException => StatusCodes.Status400BadRequest,
                        ForbiddenException =>  StatusCodes.Status403Forbidden,
                        NotFoundException =>  StatusCodes.Status404NotFound,
                        _ => StatusCodes.Status500InternalServerError
                    };

                    var error = exception?.Message ?? "unknown error";
                    
                    var response = ApiResponse<Object>.Fail(error);
                    context.Response.StatusCode = exceptionCode;
                    
                    context.Response.ContentType = "application/json";
                    
                    await context.Response.WriteAsync(JsonSerializer.Serialize(response));
                });

            });
        return app;
    }
};


/*
var errorBranch = app.New(); // создаётся новый builder

configure(errorBranch); // ты настраиваешь errorApp

var errorDelegate = errorBranch.Build();

app.Use(async (context, next) =>
{
    try
    {
        await next();
    }
    catch
    {
        await errorDelegate(context); // переключение на error pipeline
    }
});
*/



 
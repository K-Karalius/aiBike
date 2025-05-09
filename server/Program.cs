using Microsoft.OpenApi.Models;
using server.Extensions;
using server.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddJsonFile("connectionStrings.json", optional: true, reloadOnChange: true);

builder.Services
    .AddDataSeeders()
    .AddDbContextWithIdentity(builder.Configuration)
    .AddJwtOptions(builder.Configuration)
    .AddJwtAuthentication()
    .AddAuthorization()
    .AddCommandHandlers()
    .AddEndpointsRegistration()
    .AddEndpointsApiExplorer()
    .AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo {
            Title   = "aiBike API",
            Version = "v1"
        });
    });

var app = builder.Build();

await app.SeedDataAsync();
app.UseMiddleware<ExceptionMiddleware>();

app.RegisterEndpoints();    

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "aiBike v1");
    });
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.Run();
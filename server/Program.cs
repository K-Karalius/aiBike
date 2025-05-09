using Microsoft.OpenApi.Models;
using Serilog;
using server.Configuration;
using server.Extensions;
using server.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddEnvironmentVariables();

builder.Host.UseSerilog((hostCtx, loggerConfig) => loggerConfig
    .ReadFrom.Configuration(hostCtx.Configuration)
    .Enrich.FromLogContext()
);

builder.Services.Configure<LoggingInterceptorOptions>(
    builder.Configuration.GetSection("LoggingInterceptor"));
builder.Services.AddHttpContextAccessor();

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

app.UseMiddleware<ExceptionMiddleware>();
app.UseMiddleware<LoggingMiddleware>();

await app.SeedDataAsync();

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
using Microsoft.OpenApi.Models;
using Serilog;
using server.Configuration;
using server.Extensions;
using server.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.UseUrls("http://0.0.0.0:5058");

builder.Configuration
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile("connectionStrings.json", optional: true, reloadOnChange: true)
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
    .AddAuthenticationAndAuthorization(builder.Configuration)
    .AddCommandHandlersWithCaching(builder.Configuration)
    .AddEndpointsRegistration()
    .AddEndpointsApiExplorer()
    .AddSwaggerGen(options =>
    {
        options.SwaggerDoc("v1", new OpenApiInfo
        {
            Title = "Your API",
            Version = "v1"
        });

        options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            Name = "Authorization",
            In = ParameterLocation.Header,
            Type = SecuritySchemeType.ApiKey,
            Scheme = "Bearer",
            BearerFormat = "JWT",
            Description = "Enter ‘Bearer’ [space] and then your valid JWT."
        });

        options.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                []
            }
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
    app.UseSwaggerUI(c => { c.SwaggerEndpoint("/swagger/v1/swagger.json", "aiBike v1"); });
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.Run();
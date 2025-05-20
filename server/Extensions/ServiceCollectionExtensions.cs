using System.IdentityModel.Tokens.Jwt;
using System.Reflection;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using server.Common.Abstractions;
using server.Common.Authorization;
using server.Configuration;
using server.DatabaseContext;
using server.Models;
using Scrutor;

namespace server.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddDbContextWithIdentity(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<ApplicationDbContext>(opts =>
            opts.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection")
            )
        );

        services.AddIdentity<IdentityUser, IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        return services;
    }


    public static IServiceCollection AddJwtOptions(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<JwtSettings>(configuration.GetSection(nameof(JwtSettings)));
        return services;
    }

    public static IServiceCollection AddJwtAuthentication(
        this IServiceCollection services
    )
    {
        services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                var settings = services.BuildServiceProvider()
                    .GetRequiredService<IOptions<JwtSettings>>().Value;

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = settings.Issuer,
                    ValidateAudience = true,
                    ValidAudience = settings.Audience,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(settings.Secret)
                    ),
                    ValidateLifetime = true,
                    RoleClaimType = ClaimTypes.Role,
                    NameClaimType = JwtRegisteredClaimNames.Sub
                };
            });

        return services;
    }

    public static IServiceCollection AddCommandHandlersWithCaching(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddMemoryCache();
        services.Configure<HandlerCacheSettingsOptions>(configuration);

        services.Scan(scan => scan
            .FromEntryAssembly()
            .AddClasses(classes =>
                classes.AssignableTo(typeof(ICommandHandler<,>)))
            .AsImplementedInterfaces()
            .WithScopedLifetime()
        );

        services.Decorate(
            typeof(ICommandHandler<,>),
            typeof(CachingCommandHandlerDecorator<,>)
        );

        return services;
    }

    public static IServiceCollection AddEndpointsRegistration(this IServiceCollection services)
    {
        var endpointTypes = Assembly.GetExecutingAssembly()
            .GetTypes()
            .Where(t => typeof(IEndpoint).IsAssignableFrom(t)
                        && t is { IsInterface: false, IsAbstract: false });

        foreach (var type in endpointTypes)
        {
            services.AddScoped(typeof(IEndpoint), type);
        }

        return services;
    }

    public static IServiceCollection AddAuthenticationAndAuthorization(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddJwtOptions(configuration);
        services.AddJwtAuthentication();

        services.AddAuthorization(options =>
        {
            options.AddPolicy(
                AuthorizationPolicies.UserOrAdmin,
                policy => policy.RequireRole(
                    Roles.User.ToString().ToUpperInvariant(),
                    Roles.Admin.ToString().ToUpperInvariant()
                )
            );

            options.AddPolicy(
                AuthorizationPolicies.AdminOnly,
                policy => policy.RequireRole(
                    Roles.Admin.ToString().ToUpperInvariant()
                )
            );

            var userOrAdmin = options.GetPolicy(AuthorizationPolicies.UserOrAdmin)!;
            options.FallbackPolicy = userOrAdmin;
        });

        return services;
    }
}
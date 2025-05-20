using System.Text.Json;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using server.Configuration;

namespace server.Common.Abstractions;

public sealed class CachingCommandHandlerDecorator<TCommand, TResult>(
    ICommandHandler<TCommand, TResult> inner,
    IMemoryCache cache,
    IOptionsMonitor<HandlerCacheSettingsOptions> options,
    ILogger<CachingCommandHandlerDecorator<TCommand, TResult>> logger)
    : ICommandHandler<TCommand, TResult>
{
    public Task<Result<TResult>> Handle(TCommand command)
    {
        var handlerName = inner.GetType().Name;
        if (!options.CurrentValue.HandlerCacheSettings
                .TryGetValue(handlerName, out var settings)
            || !settings.Enabled)
        {
            return inner.Handle(command);
        }

        logger.LogInformation($"Handling {handlerName} command from cache");
        var cacheKey = $"{handlerName}:{JsonSerializer.Serialize(command)}";
        return cache.GetOrCreateAsync(cacheKey, async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(settings.CacheSeconds);
            return await inner.Handle(command);
        })!;
    }
}
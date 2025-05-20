namespace server.Configuration;

public sealed class HandlerCacheSettingsOptions
{
    public Dictionary<string, HandlerCacheSettings> HandlerCacheSettings { get; set; } = new();
}

public sealed record HandlerCacheSettings(bool Enabled, int CacheSeconds);

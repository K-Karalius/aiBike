namespace server.Common.Abstractions;

public interface ISeeder
{
    Task SeedAsync(IServiceProvider serviceProvider);
}
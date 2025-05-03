using Microsoft.EntityFrameworkCore;

namespace server.DatabaseContext;

public class DatabaseContext : DbContext
{
    public DatabaseContext(DbContextOptions<DatabaseContext> options)
        : base(options)
    {
    }
}


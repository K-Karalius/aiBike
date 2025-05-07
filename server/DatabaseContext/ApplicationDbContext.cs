using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.DatabaseContext;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : IdentityDbContext<IdentityUser, IdentityRole, string>(options)
{
    public DbSet<Bike> Bike { get; set; }
    public DbSet<Reservation> Reservation { get; set; }
    public DbSet<Ride> Ride { get; set; }
    public DbSet<Station> Station { get; set; }
}
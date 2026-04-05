using Microsoft.EntityFrameworkCore;

namespace Server.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) {}

        public DbSet<User> Users { get; set; }
        public DbSet<Reviewer> Reviewers { get; set; }
        public DbSet<Author> Authors { get; set; }
        public DbSet<Paper> Papers { get; set; }
        public DbSet<Review> Reviews { get; set; }
    }
}
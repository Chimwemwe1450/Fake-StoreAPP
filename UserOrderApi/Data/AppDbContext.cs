using Microsoft.EntityFrameworkCore;
using UserOrderApi.Models;

namespace UserOrderApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Order> Orders { get; set; } 
        public DbSet<OrderItem> OrderItems { get; set; }  
        public DbSet<Product> Products { get; set; }  
        public DbSet<User> Users { get; set; } 

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
         
            modelBuilder.Entity<Order>()
                .HasMany(o => o.Items)
                .WithOne(oi => oi.Order) 
                .HasForeignKey(oi => oi.OrderId)  
                .OnDelete(DeleteBehavior.Cascade);  
            

         
            modelBuilder.Entity<OrderItem>()
                .HasKey(oi => oi.Id);  
            modelBuilder.Entity<Product>().HasData(
                new Product { Id = 1, Name = "Product 1", Price = 10.00M },
                new Product { Id = 2, Name = "Product 2", Price = 20.00M }
            );

            base.OnModelCreating(modelBuilder);
        }
    }
}

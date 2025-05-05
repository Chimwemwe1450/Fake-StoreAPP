using UserOrderApi.Models;  // Add this line to use OrderItem

namespace UserOrderApi.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public decimal Total { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<OrderItem> Items { get; set; }  // List of OrderItem
    }
}

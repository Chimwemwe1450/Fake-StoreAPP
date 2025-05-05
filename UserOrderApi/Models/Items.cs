using System.Text.Json.Serialization;

namespace UserOrderApi.Models
{
    public class OrderItem
    {
        public int Id { get; set; }

        public int OrderId { get; set; }
        [JsonIgnore]
        public Order? Order { get; set; }

        public int ProductId { get; set; }  // Optional, for tracking
        public string ItemName { get; set; }  // Name saved directly
        public decimal Price { get; set; }   // Price at time of purchase
        public int Quantity { get; set; }
    }
}

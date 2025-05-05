using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserOrderApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserOrderApi.Models;
using UserOrderApi.Data;
using System.Linq;

namespace UserOrderApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderItemsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrderItemsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/OrderItems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetOrderItems()
        {
            var orderItems = await _context.OrderItems
                .Include(oi => oi.Order)
                .Select(oi => new
                {
                    oi.Id,
                    oi.ItemName,
                    oi.Price,
                    oi.Quantity,
                    oi.Order.UserId
                })
                .ToListAsync();

            return Ok(orderItems);
        }

        // POST: api/OrderItems
        [HttpPost]
        public async Task<ActionResult<Order>> PostOrder([FromBody] Order order)
        {
            if (order == null || order.Items == null || !order.Items.Any())
            {
                return BadRequest("Order or items data is null or empty.");
            }

            decimal total = 0;

            var newOrder = new Order
            {
                UserId = order.UserId,
                CreatedAt = DateTime.UtcNow,
                Items = new List<OrderItem>()
            };

            _context.Orders.Add(newOrder);
            await _context.SaveChangesAsync(); // Get OrderId

            foreach (var item in order.Items)
            {
                var orderItem = new OrderItem
                {
                    OrderId = newOrder.Id,
                    Order = newOrder,
                    ItemName = item.ItemName,    
                    Price = item.Price,         
                    Quantity = item.Quantity
                };

                total += item.Price * item.Quantity;
                _context.OrderItems.Add(orderItem);
            }

            newOrder.Total = total;
            _context.Entry(newOrder).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrderItems), new { id = newOrder.Id }, newOrder);
        }
    }
}

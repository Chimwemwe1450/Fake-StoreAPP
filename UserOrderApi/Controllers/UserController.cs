using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserOrderApi.Models;
using UserOrderApi.Data;
using BCrypt.Net;

namespace UserOrderApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/User?email=...&password=...
        [HttpGet]
        public async Task<ActionResult<object>> GetUsers([FromQuery] string? email, [FromQuery] string? password)
        {
            if (!string.IsNullOrEmpty(email) && !string.IsNullOrEmpty(password))
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

                if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
                {
                    return NotFound("Invalid email or password.");
                }

                return Ok(new
                {
                    user.Id,
                    user.Username,
                    user.Email,
                });
            }

         
            var users = await _context.Users
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.Email,
                
                })
                .ToListAsync();

            return Ok(users);
        }

        // POST: api/User
        [HttpPost]
        public async Task<ActionResult<User>> PostUser([FromBody] UserRegistrationModel model)
        {
            if (model == null)
            {
                return BadRequest("User data is null");
            }

            // Hash the password
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(model.Password);

            var user = new User
            {
                Username = model.Username,
                Email = model.Email,
                PasswordHash = hashedPassword
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUsers), new { id = user.Id }, new
            {
                user.Id,
                user.Username,
                user.Email
            });
        }
    }

    public class UserRegistrationModel
    {
        public required string Username { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}

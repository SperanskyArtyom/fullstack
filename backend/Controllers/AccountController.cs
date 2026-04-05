using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.Data;
using Server.ViewModels;
using Microsoft.EntityFrameworkCore;
namespace Server.Controllers
{
    public class AccountController : Controller
    {
        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        private readonly AppDbContext _context;

        public AccountController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("account/login")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model)
        {
            _context.Database.EnsureCreated(); 

            if (!_context.Users.Any(u => u.Type == UserType.Admin))
            {
                _context.Users.Add(new User
                {
                    Email = "admin@example.com",
                    Password = "admin123", 
                    Type = UserType.Admin
                });

                _context.SaveChanges();
                Console.WriteLine("✅ Создан администратор: admin@example.com / admin123");
            }
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == model.Email && u.Password == model.Password);

            if (user == null)
                return Unauthorized("Неверный email или пароль");

            HttpContext.Session.SetInt32("UserId", user.Id);
            HttpContext.Session.SetString("UserType", user.Type.ToString());

            return Ok(new { user.Email, user.Type });
        }

        [HttpPost("account/logout")]
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return Ok();
        }

        [HttpGet("account/check")]
        public IActionResult CheckAuth()
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null)
                return Unauthorized();

            var userType = HttpContext.Session.GetString("UserType");
            return Ok(new { UserId = userId, UserType = userType });
        }
        [HttpPost("account/register")]
        public async Task<IActionResult> Register([FromBody] RegisterViewModel model)
        {

            if (await _context.Users.AnyAsync(u => u.Email == model.Email))
                return BadRequest("Email уже зарегистрирован");

            var user = new User
            {
                Email = model.Email,
                Password = model.Password,
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var author = new Author
            {
                UserId = user.Id,
                FullName = model.FullName,
                Location = "",

            };

            _context.Authors.Add(author);
            await _context.SaveChangesAsync();

            HttpContext.Session.SetInt32("UserId", user.Id);

            return Ok();
        }
    }
}
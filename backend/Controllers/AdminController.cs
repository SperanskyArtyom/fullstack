using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.Data;
using Server.ViewModels;
using Microsoft.EntityFrameworkCore;
namespace Server.Controllers
{
    public class AdminController : Controller
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet("api/admin/users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Where(u => u.Type != UserType.Admin)
                .Select(u => new { u.Id, u.Email, u.Type ,u.Password})
                .ToListAsync();

            return Ok(users);
        }
        [HttpPost("api/admin/users")]
        public async Task<IActionResult> CreateUser([FromBody] CreateViewModel model)
        {
            if (await _context.Users.AnyAsync(u => u.Email == model.Email))
                return BadRequest("Email уже зарегистрирован");
            var type = UserType.Author;
            var typeT = model.Type;
            Console.WriteLine("D            "  + typeT);
            if (typeT != "Author" && typeT != "Reviewer")
                return BadRequest("Неверный тип пользователя");
            if (typeT == "Author") type = UserType.Author;
            if (typeT == "Reviewer") type = UserType.Reviewer;

  

            if (type == UserType.Author)
            {
            var user = new User
            {
                Email = model.Email,
                Password = model.Password,
                Type = type
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
                var author = new Author
                {
                    UserId = user.Id,
                    FullName = "",
                    Location = "",
                    FieldOfExpertise = Specialization.Common,
                    Bio = "",
                    XLink = "",
                    Linkeding = ""
                };
                _context.Authors.Add(author);
            await _context.SaveChangesAsync();
            return Ok(new { user.Id, user.Email, user.Password, user.Type });

            }
            else if (type == UserType.Reviewer)
            {
            var user = new User
            {
                Email = model.Email,
                Password = model.Password,
                Type = type
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
                var reviewer = new Reviewer
                {
                    UserId = user.Id,
                    FullName = "",
                    Institution = "",
                    TotalReviews = 0,
                    InProgress = 0,
                    Completed = 0,
                    GetNewReviews = true,
                    MaxConcurrentReviews = 10
                };
                _context.Reviewers.Add(reviewer);
                await _context.SaveChangesAsync();
                return Ok(new { user.Id, user.Email, user.Password, user.Type });

            }
                return BadRequest("Ошибка регистрации");


        }
        [HttpGet("api/admin/papers")]
        public async Task<IActionResult> GetAllPapers()
        {
            var papers = await _context.Papers
                .Select(p => new { p.Id, p.Title, p.Status, p.CreatedAt, p.UserId })
                .ToListAsync();

            return Ok(papers);
        }
        [HttpDelete("api/admin/papers/{id}")]
        public async Task<IActionResult> DeletePaper(int id)
        {
            var paper = await _context.Papers.FindAsync(id);
            if (paper == null) return NotFound();

            _context.Papers.Remove(paper);
            await _context.SaveChangesAsync();

            return Ok();
        }
        [HttpDelete("api/admin/users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null || user.Type == UserType.Admin)
                return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
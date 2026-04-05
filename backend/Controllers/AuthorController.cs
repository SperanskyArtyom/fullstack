using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.ViewModels;
using Microsoft.EntityFrameworkCore;
namespace Server.Controllers
{
    public class AuthorController : Controller
    {
        private readonly AppDbContext _context;

        public AuthorController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("api/author/profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return Unauthorized();

            var author = await _context.Authors
                .Include(a => a.User)
                .FirstOrDefaultAsync(a => a.UserId == userId);

            if (author == null) return NotFound();

            return Ok(new {
                author.FullName,
                author.Location,
                author.FieldOfExpertise,
                author.Bio,
                author.XLink,
                author.Linkeding,
                Email = author.User.Email
            });
        }

        [HttpPut("api/author/profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] Author updated)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return Unauthorized();

            var author = await _context.Authors
                .Include(a => a.User)
                .FirstOrDefaultAsync(a => a.UserId == userId);

            if (author == null) return NotFound();

            author.FullName = updated.FullName;
            author.Location = updated.Location;
            author.FieldOfExpertise = updated.FieldOfExpertise;
            author.Bio = updated.Bio;
            author.XLink = updated.XLink;
            author.Linkeding = updated.Linkeding;

            await _context.SaveChangesAsync();

            return Ok(new {
                author.FullName,
                author.Location,
                author.FieldOfExpertise,
                author.Bio,
                author.XLink,
                author.Linkeding,
                Email = author.User.Email
            });
        }
    }
}
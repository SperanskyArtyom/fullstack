using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Server.Controllers
{
    public class ReviewController : Controller
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ReviewController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }
        [HttpGet("api/reviews/mine")]
        public async Task<IActionResult> GetMyReviews()
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return Unauthorized();

            var reviews = await _context.Reviews
                .Where(r => r.UserId == userId)
                .Include(r => r.Paper)
                .OrderByDescending(r => r.Paper.CreatedAt)
                .Select(r => new
                {
                    r.Id,
                    r.Score,
                    r.Recommendation,
                    r.ConfidentialCommentsToEditor,
                    r.CommentsToAuthors,
                    r.TechnicalMerit,
                    r.Originality,
                    r.PresentationQuality,
                    PaperTitle = r.Paper.Title,
                    PaperCreatedAt = r.Paper.CreatedAt,
                    r.IsDraft,
                    Paper = r.Paper
                })
                .ToListAsync();

            return Ok(reviews);
        }
    }
}
using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.ViewModels;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
namespace Server.Controllers
{
    public class ReviewAttachment
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }

        public int ReviewId { get; set; }
        public Review Review { get; set; }
    }
    public class ReviewerController : Controller
    {
        private readonly AppDbContext _context;

        public ReviewerController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet("api/reviewer/{id}")]
        public async Task<IActionResult> GetReview(int id)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return Unauthorized();

            var review = await _context.Reviews
                .Where(r => r.Id == id && r.UserId == userId)
                .Select(r => new
                {
                    r.Id,
                    r.Score,
                    r.Recommendation,
                    r.TechnicalMerit,
                    r.Originality,
                    r.PresentationQuality,
                    r.CommentsToAuthors,
                    r.ConfidentialCommentsToEditor,
                    r.IsDraft,
                    r.PaperId,
                    Paper = r.Paper
                })
                .FirstOrDefaultAsync();

            if (review == null)
                return NotFound();

            return Ok(review);
        }
        [HttpGet("api/reviewer/profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return Unauthorized();

            var author = await _context.Reviewers
                .Include(a => a.User)
                .FirstOrDefaultAsync(a => a.UserId == userId);

            if (author == null) return NotFound();

            return Ok(new {
                author.FullName,
                author.Institution,
                author.FieldOfExpertise,
                author.TotalReviews,
                author.InProgress,
                author.Completed,
                Email = author.User.Email
            });
        }
        [HttpPost("api/reviewer/create")]
        public async Task<IActionResult> CreateReview([FromForm] ReviewDto model)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return Unauthorized();

            var review = new Review
            {
                Score = model.Score,
                Recommendation = model.Recommendation,
                TechnicalMerit = model.TechnicalMerit,
                Originality = model.Originality,
                PresentationQuality = model.PresentationQuality,
                CommentsToAuthors = model.CommentsToAuthors,
                ConfidentialCommentsToEditor = model.ConfidentialCommentsToEditor,
                IsDraft = model.IsDraft,
                PaperId = model.PaperId,
                UserId = userId.Value,
                CreatedAt = DateTime.UtcNow,
                Attachments = ""
            };

            _context.Reviews.Add(review);

            // Обновляем статус статьи
            var paper = await _context.Papers.FindAsync(model.PaperId);
            if (paper != null)
            {
                paper.Status = PaperStatus.Draft;
            }

            await _context.SaveChangesAsync();

            return Ok(new { review.Id });
        }
        [HttpPut("api/reviewer/profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] Reviewer updated)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return Unauthorized();

            var author = await _context.Reviewers
                .Include(a => a.User)
                .FirstOrDefaultAsync(a => a.UserId == userId);

            if (author == null) return NotFound();

            author.FullName = updated.FullName;
            author.Institution = updated.Institution;
            author.FieldOfExpertise = updated.FieldOfExpertise;

            await _context.SaveChangesAsync();

            return Ok(new {
                author.FullName,
                author.Institution,
                author.FieldOfExpertise,
                Email = author.User.Email
            });
        }
        [HttpGet("api/reviewer/paper")]
        public async Task<IActionResult> GetVisiblePapers()
        {
            var papers = await _context.Papers
                .Where(p => p.Status == 0)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return Ok(papers);
        }
        [HttpPut("api/reviewer/{id}")]
        public async Task<IActionResult> UpdateReview(int id, [FromForm] ReviewDto model)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return Unauthorized();

            var review = await _context.Reviews
                .FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);

            if (review == null)
                return NotFound();

            review.Score = model.Score;
            review.Recommendation = model.Recommendation;
            review.TechnicalMerit = model.TechnicalMerit;
            review.Originality = model.Originality;
            review.PresentationQuality = model.PresentationQuality;
            review.CommentsToAuthors = model.CommentsToAuthors;
            review.ConfidentialCommentsToEditor = model.ConfidentialCommentsToEditor;
            review.IsDraft = model.IsDraft;
            review.PaperId = model.PaperId;

            // Обновляем статус статьи, если нужно
            var paper = await _context.Papers.FindAsync(model.PaperId);
            if (paper != null)
            {
                paper.Status = PaperStatus.Draft;
            }

            await _context.SaveChangesAsync();

            return Ok(new { review.Id });
        }
       
    }
}
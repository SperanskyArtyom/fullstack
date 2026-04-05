using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Server.Models;
using System.IO;
using Microsoft.EntityFrameworkCore;

namespace Server.Controllers
{
    public class PaperCreateModel
    {
        public string Title { get; set; } = null!;
        public string Content { get; set; } = null!;
        public PaperCategory Category { get; set; }
        public string Tags { get; set; } = null!;
        public IFormFile? Image { get; set; }
    }
    public class PaperController : Controller
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public PaperController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpGet]
        [Route("api/my-papers")]
        public async Task<IActionResult> GetMyPapers()
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null)
                return Unauthorized();

            var papers = await _context.Papers
                .Where(p => p.UserId == userId)
                .Select(p => new {
                    p.Id,
                    p.Title,
                    p.CreatedAt,
                    p.Status
                })
                .ToListAsync();

            return Ok(papers);
        }
        [HttpGet("api/papers/{id}/reviews")]
        public async Task<IActionResult> GetReviews(int id)
        {
            var paper = await _context.Papers.FindAsync(id);
            if (paper == null)
                return NotFound();

            if (paper.Status == PaperStatus.Send)
                return Forbid(); 
            var reviews = await _context.Reviews
                .Where(r => r.PaperId == id)
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
                })
                .ToListAsync();

            return Ok(reviews);
        }
        [HttpGet("api/papers/{id}")]
        public async Task<IActionResult> GetPaper(int id)
        {
            var paper = await _context.Papers
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (paper == null)
                return NotFound();

            return Ok(new
            {
                paper.Id,
                paper.Title,
                paper.Content,
                paper.CreatedAt,
                paper.Status,
                paper.Category,
                paper.Tags,
                paper.ImagePath,
            });
        }
        [HttpPost("api/papers")]
        public async Task<IActionResult> CreatePaper([FromForm] PaperCreateModel model)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null)
                return Unauthorized();

            var paper = new Paper
            {
                Title = model.Title,
                Content = model.Content,
                Category = model.Category,
                Tags = model.Tags,
                Status = PaperStatus.Send,
                CreatedAt = DateTime.Now,
                UserId = userId.Value
            };

            if (model.Image != null)
            {
                var uploadsPath = Path.Combine("wwwroot", "uploads");
                if (!Directory.Exists(uploadsPath))
                {
                    Directory.CreateDirectory(uploadsPath);
                }

                var fileName = Path.GetFileName(model.Image.FileName);
                var savePath = Path.Combine(uploadsPath, fileName);

                using (var stream = new FileStream(savePath, FileMode.Create))
                {
                    await model.Image.CopyToAsync(stream);
                }
                paper.ImagePath = "/uploads/" + fileName;
            }

            _context.Papers.Add(paper);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}


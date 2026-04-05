namespace Server.Models
{
    public class Review
    {
        public int Id { get; set; }
        public int Score { get; set; }
        public string Recommendation { get; set; } = "";
        public string TechnicalMerit { get; set; } = "";
        public string Originality { get; set; } = "";
        public string PresentationQuality { get; set; } = "";
        public string CommentsToAuthors { get; set; } = "";
        public string ConfidentialCommentsToEditor { get; set; } = "";
        public string Attachments { get; set; }
        public bool IsDraft { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public int PaperId { get; set; }
        public Paper Paper { get; set; } = null!;
        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}
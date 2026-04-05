namespace Server.Models
{    
    public enum PaperCategory
    {
        Medicine,
        Technology,
        Common
    }
    public enum PaperStatus
    {
        Send,
        Draft,
        Approved,
        Declined
    }
 
    public class Paper
    {
        public int Id { get; set; }
        public PaperStatus Status { get; set; } = PaperStatus.Send;
        public string Title { get; set; } = null!;
        public string Content { get; set; } = null!;

        public PaperCategory Category { get; set; }

        public string Tags { get; set; } 

        public string? ImagePath { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}
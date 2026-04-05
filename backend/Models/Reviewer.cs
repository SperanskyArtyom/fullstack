namespace Server.Models
{
    public enum ExpertiseField
    {
        Medicine,
        ComputerScience,
        Common
    }

    public class Reviewer
    {
        public int Id { get; set; }

        public string FullName { get; set; }
        public string Institution { get; set; }

        public ExpertiseField FieldOfExpertise { get; set; } = ExpertiseField.Common;

        public int TotalReviews { get; set; }
        public int InProgress { get; set; }
        public int Completed { get; set; }

        public bool GetNewReviews { get; set; }
        public int MaxConcurrentReviews { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}
public class ReviewDto
{
    public int Score { get; set; }
    public string Recommendation { get; set; }
    public string TechnicalMerit { get; set; }
    public string Originality { get; set; }
    public string PresentationQuality { get; set; }
    public string? CommentsToAuthors { get; set; }
    public string? ConfidentialCommentsToEditor { get; set; }
    public bool IsDraft { get; set; }
    public int PaperId { get; set; }

    public IFormFileCollection? Attachments { get; set; }
}
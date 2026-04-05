namespace Server.Models
{
    public enum Specialization
    {
        Medicine,
        ComputerScience,
        Common
    }

    public class Author
    {
        public int Id { get; set; }

        public string FullName { get; set; } = "";
        public string Location { get; set; } = "";

        public Specialization FieldOfExpertise { get; set; } = Specialization.Common;

        public string Bio { get; set; } = "";
        public string XLink { get; set; } = "";
        public string Linkeding { get; set; } = "";
        public ICollection<Paper> Papers { get; set; } = new List<Paper>();

        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}
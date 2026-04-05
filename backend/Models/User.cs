namespace Server.Models
{
    public enum UserType
    {
        Author,
        Reviewer,
        Admin
    }
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public UserType Type { get; set; }

    }
}
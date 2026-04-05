namespace Server.ViewModels
{
    public class RegisterViewModel
    {
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public int Type {get;set;}
    }
}
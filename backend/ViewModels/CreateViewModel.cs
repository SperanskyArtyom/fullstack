namespace Server.ViewModels
{
    public class CreateViewModel
    {
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Type {get;set;}
    }
}
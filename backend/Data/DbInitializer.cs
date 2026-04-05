using System;
using System.Linq;
using Server.Models;

namespace Server.Data
{
    public static class DbInitializer
    {
        public static void Initialize(AppDbContext db)
        {
            db.Database.EnsureCreated(); // Убедимся, что база существует

            if (!db.Users.Any(u => u.Type == UserType.Admin))
            {
                db.Users.Add(new User
                {
                    Email = "admin@example.com",
                    Password = "admin123", // ⚠ не забудь позже захешировать
                    Type = UserType.Admin
                });

                db.SaveChanges();
                Console.WriteLine("✅ Создан администратор: admin@example.com / admin123");
            }
        }
    }
}
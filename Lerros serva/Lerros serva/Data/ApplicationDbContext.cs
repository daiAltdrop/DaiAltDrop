using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Lerros_serva.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Profile> Profiles { get; set; } = null!;
        public DbSet<Account> Accounts { get; set; }
    }

    public enum Gender
    {
        Male,
        Female
    }

    public class Profile
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey(nameof(Account))]
        public int AccountId { get; set; }
       
        public Account Account { get; set; } = null!;

        [Required]
        [MaxLength(50)]
        public string Nickname { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [Required]
        public Gender Gender { get; set; }

        
        [Required]
        public List<string> Photos { get; set; } = new();

        [Required]
        public DateOnly Birthdate { get; set; }
    }

    [Index(nameof(Email), IsUnique = true)]
    [Index(nameof(Phone), IsUnique = true)]
    public class Account
    {
        [Key]
        public int Id { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string PasswordHash { get; set; }
        public string? Avatar { get; set; } // ? дозволяє полю бути пустим (null), якщо аватарки ще немає
        public string Login { get; set; }
    }
}

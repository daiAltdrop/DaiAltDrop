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
}

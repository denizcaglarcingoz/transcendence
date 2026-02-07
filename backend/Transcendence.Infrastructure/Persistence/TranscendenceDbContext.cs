using Microsoft.EntityFrameworkCore;
using Transcendence.Domain.UserFollows;
using Transcendence.Domain.Users;
using Transcendence.Domain.Posts;
using Transcendence.Domain.Chat;


namespace Transcendence.Infrastructure.Persistence;


public class TranscendenceDbContext: DbContext
{
     public TranscendenceDbContext( 
          DbContextOptions<TranscendenceDbContext> options) : base (options){}
     public DbSet<User> Users => Set<User>();
     public DbSet<UserFollow> UserFollows => Set<UserFollow>();
     public DbSet<Post> Posts => Set<Post>();
     public DbSet<Conversation> Conversations => Set<Conversation>();
     public DbSet<ConversationParticipant> ConversationParticipants => Set<ConversationParticipant>();
     public DbSet<Message> Messages => Set<Message>();

     protected override void OnModelCreating(ModelBuilder modelBuilder) // finds all classes that implement IEntityTypeCOnfiguration<T>
     {
        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(TranscendenceDbContext).Assembly);
     }
}
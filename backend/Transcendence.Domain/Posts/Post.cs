namespace Transcendence.Domain.Posts;

public sealed class Post //minimal, preliminary 
{
    public Guid Id {get; private set; }
    public Guid AuthorId {get; private set; }
    public DateTimeOffset CreatedAt {get; private set; }
    
    private Post () {}

    public Post (Guid id, Guid authorId)
    {
        Id = id;
        AuthorId = authorId;
        CreatedAt = DateTimeOffset.UtcNow;
    }
}
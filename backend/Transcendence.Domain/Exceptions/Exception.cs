using System;

namespace Transcendence.Domain.Exceptions
{
    public class DomainException : Exception // to separate business errors from technical ones.
    {
        public DomainException(string message) : base(message)
        {
        
        }   
    }
    public class FollowYourselfException : DomainException
    {
        public FollowYourselfException() : base("Cannot follow yourself")
        {
        
        }   
    }

    public class NotFoundException : DomainException
    {
        public NotFoundException(string message): base(message) {}
        public NotFoundException() : base ("not found") {}
    }

    public class ForbiddenException : DomainException
    {
        public ForbiddenException(string message): base (message) {}
        public ForbiddenException(): base ("No way ") {}

    }

   public class InvalidArgumentException : DomainException
    {
        public InvalidArgumentException(string message): base (message) {}
        public InvalidArgumentException(): base ("wrong arguement ") {}

    }
 
}
**User** (entity)
```text
User
├── Profile (1:1)
├── UserSettings (1:1)
├── RefreshToken (1:N)
│
├── Post (1:N)
│   ├── Media (1:N)
│   ├── Like (N:M) ── User
│   ├── Comment (1:N)
│   │   └── ModerationLog (1:N)
│   └── ModerationLog (1:N)
│
├── Follow (N:M) ── User
│
├── Notification (1:N)
│
└── Report (1:N)
      ├── Post (N:1)
      └── Comment (N:1) 
```

**Relationship types:**
- **1 : 1 (One-to-One)**
	One record in entity A is linked to exactly one record in entity B.
- **1 : N (One-to-Many)**
	One record in entity A can be linked to many records in entity B.
- **N : M (Many-to-Many)**
    Multiple records in entity A can be linked to multiple records in entity B, usually through a linking table.

ModerationLog (entity)
 ├── Post
 └── Comment

*  *( "for Minor: Content moderation AI (auto moderation, auto deletion, auto warning, etc.")*



#### **🔹 User (entity) — core entity**

  **Purpose:**
Represents a system user and serves as the **central entity** of the application.


**Why it exists as a separate entity:**
- stores authentication-related data (email, password hash)
- defines user identity and role in the system
- acts as the owner of most other entities
   
**Key responsibilities:**

- authentication and authorization
- ownership of content (posts, comments)
- participation in social relationships
    
    **User is the core entity** — almost everything else in the system is directly or indirectly connected to users.


#### **🔹 Like (relationship entity) — N : M (User ↔ Post)**

**Purpose:** Represents the fact that a user liked a post.

**Why it is a separate table:**
- implements a many-to-many relationship between users and posts  
- stores additional data (e.g. when the like was created)
- prevents data duplication
      

**Important clarification:**
- Like has its **own table and class**
- Like **never exists on its own**
     It only exists as a link:
User ───< Like >─── Post  
 **Like** is a relationship entity - it has its own table and class, but it only exists as a link between User and Post.

####  **🔹 Profile (entity) — 1 : 1**

Represents public user information that can be shown to other users.
 - not all user data is public
  - profile can be extended independently
  - privacy settings belong here
    
Profile depends on User, but not vice versa.

#### **🔹 Post (entity) — 1 : N (User → Post)**

Represents user-generated content.

- has its own lifecycle
- can be moderated
- belongs to exactly one user
    
 A post cannot exist without an author.

#### **🔹 Comment (entity) — 1 : N (Post → Comment)**

Represents interaction with content.

- belongs to a post
- authored by a user
    
 Comment is similar to Post, but always scoped to another entity.

---

#### **🔹 Friendship (entity) — N : M (User ↔ User)**

Represents social connections between users.

- relationship has its own state (pending / accepted / rejected)    
- cannot be stored directly inside User
     

 This is a relationship entity, not a core business object.

#### **🔹 ModerationLog (entity) — OPTIONAL**
 
Stores moderation decisions for posts and comments.

- not required for basic moderation  
- useful for transparency and explanation
    
 This is a technical/log entity, not a core domain entity.

**more detailed:**
 **User**

Represents a registered person in the system.
Owns content, interacts with other users, and is the core of authentication and authorization.

Why a separate entity:
Authentication data, identifiers, and security-related fields change independently from profile or settings.
Keeping User minimal prevents accidental coupling between security logic and presentation or preferences.

**Profile**

Stores public user information (display name, bio, avatar).
Visible to other users.

Why a separate entity:
Public profile data changes frequently and independently from authentication logic.
Separating it avoids unnecessary exposure of sensitive fields and allows profile evolution without impacting auth or sessions.

**UserSettings**

Stores user preferences such as language, privacy options, and notification settings.

Why a separate entity:
Settings evolve over time and differ per user but do not affect core identity.
Isolation allows easy extension (new preferences) without modifying the User entity or authentication flows.

**RefreshToken**

Represents a long-lived authentication token used to refresh access tokens.
Supports logout, token revocation, and multiple active sessions.

Why a separate entity:
Tokens have their own lifecycle (issue, revoke, expire) independent of the user.
Storing them separately enables multi-device sessions, explicit logout, and security auditing.

**Post**

Represents user-generated content published to the feed.
Can be moderated, liked, commented on, and reported.

Why a separate entity:
Posts have a full lifecycle (draft → published → moderated → deleted).
They are central to many processes (feed, moderation, interactions), so isolating them avoids tight coupling with user or interaction logic.

**Media**

Represents media files (images, videos) attached to a post.

Why a separate entity:
Media handling (storage, formats, processing) changes independently from posts.
Separation allows multiple media per post, reuse, and future extensions (e.g. CDN, video processing) without altering post logic.

**Like**

Represents a user’s reaction to a post.
Stores who liked what and when.

Why a separate entity:
A like is not just a counter — it has ownership, time, and rules (unique per user/post).
As an entity, it supports notifications, analytics, undo actions, and feed ranking.

**Comment**

Represents a textual response to a post.
Can be edited, deleted, and moderated.

Why a separate entity:
Comments have their own lifecycle and moderation rules independent of posts.
Treating them separately allows nested logic, permissions, and independent scaling.

**Follow**

Represents a subscription relationship between two users.

Why a separate entity:
Follow relationships are many-to-many and include metadata (date, status).
As a standalone entity, they power feed generation, notifications, and recommendations without bloating the User model.

**Notification**

Represents an event delivered to a user (like, comment, follow, moderation result).
Includes read/unread state and contextual payload.

Why a separate entity:
Notifications are persistent, stateful, and user-specific.
They must be queryable, markable as read, and deletable — which requires a dedicated lifecycle.

**Report**

Represents a user complaint about a post or comment.

Why a separate entity:
Reports are created independently of moderation results and may accumulate over time.
Separating them allows tracking abuse patterns, multiple reports per content, and proper moderation workflows.

**ModerationLog**

Represents moderation decisions made by AI or moderators.
Stores history, status, and reasoning.

Why a separate entity:
Moderation is a process, not a flag.
Logs must preserve history, support audits, and allow multiple decisions over time without overwriting content state.





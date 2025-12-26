  
This is a **conceptual API list** based on agreed user scenarios.
Exact routes and parameters can be refined later.
## **🔐 Authentication**

- **Register user**
    Сreates a new user account
    (e.g._ _POST /auth/register__)_
    
- **Login user**
    Authenticates user and returns token
    (e.g._ _POST /auth/login__)_
    
- **Logout user**
    Ends user session
    _(e.g._ _POST /auth/logout__)_
    

## **👤 User & Profile**

- **Get user profile**
    Returns public profile data
    _(e.g._ _GET /users/{id}__)_
    
- **Get own profile**
    Returns authenticated user profile
    _(e.g._ _GET /users/me__)_
    
- **Update profile**
    Updates avatar, display name, bio
    _(e.g._ _PUT /users/me/profile__)_
    
## **📝 Posts**

- **Get feed posts**
    Returns list of visible posts
    _(e.g._ _GET /posts__)_
    
- **Create post**
    Creates a new post
    _(e.g._ _POST /posts__)_
    
- **Get single post**
    Returns post with comments
    _(e.g._ _GET /posts/{id}__)_
    
- **Delete own post**
    Removes user’s post
    _(e.g._ _DELETE /posts/{id}__)_

## **💬 Comments**

- **Create comment**
    Adds comment to a post
    _(e.g._ _POST /posts/{id}/comments__)_
    
- **Delete own comment**
    Removes user’s comment
    _(e.g._ _DELETE /comments/{id}__)_
    
## **❤️ Likes**

- **Like post**
    Adds like to a post
    _(e.g._ _POST /posts/{id}/like__)_
    
- **Unlike post**
    Removes like from a post
    _(e.g._ _DELETE /posts/{id}/like__)_
    
## **🤝 Friendships**

- **Send friend request**
    Sends connection request
    _(e.g._ _POST /friends/request__)_
    
- **Accept friend request**
    Accepts incoming request
    _(e.g._ _POST /friends/accept__)_
    
- **Reject friend request**
    Rejects incoming request
    _(e.g._ _POST /friends/reject__)_
    
- **Get friends list**
    Returns user connections
    _(e.g._ _GET /friends__)_

## **🛡 Moderation (Minor Requirement)**

- **Automatic content check**
    Content is checked on creation
    _(internal backend process)_
    
- **Get moderation status** _(optional)_
    Returns moderation result for content
    _(e.g._ _GET /moderation/{type}/{id}__)_
    
## **🌍 Localization (Minor Requirement)**

- **Set user language**
    Updates preferred language
    _(e.g._ _PUT /users/me/language__)_

This document describes how the backend of **Transcendence** is designed and how frontend and backend teams collaborate.

The backend is built around **user scenarios and domain rules**, not around controllers or database tables.

---

## 1. Backend philosophy

The backend is structured in layers with clear responsibilities:

- **Domain** — business rules and core entities
- **Application** — use cases (what the system does)
- **API** — HTTP interface and contract
- **Infrastructure** — technical implementation details

The API is treated as a **contract**, not as an implementation detail.

---

## 2. How backend work starts (important)

Backend development **does not start** with DTOs or endpoints.

### The correct order is:

1. **User scenarios**
2. **Domain entities and rules**
3. **Use cases**
4. **API contract (Swagger)**
5. **Implementation**

This ensures that the API reflects real system behavior and stays stable.

---

## 3. User scenarios

User scenarios describe **who does what** in the system.

Examples:
- User views the feed
- User creates a post
- User likes a post
- User writes a comment
- Moderator hides a post
- User updates profile

Scenarios are discussed and approved **before** any API work begins.

---

## 4. Domain layer (core logic)

The Domain layer contains:
- Entities (User, Post, Comment, Like, Follow, ModerationLog)
- Business rules and invariants

Examples of domain rules:
- A user cannot like the same post twice
- A deleted post cannot be commented on
- A blocked user cannot create content

The Domain layer:
- Has no knowledge of HTTP
- Has no knowledge of databases
- Is independent of frameworks

---

## 5. Application layer (use cases)

Use cases describe **how the system reacts to user actions**.

Examples:
- CreatePost
- LikePost
- FollowUser
- HidePost
- GetFeed

Each use case:
- Coordinates domain logic
- Does not contain HTTP or serialization logic
- Can be tested independently

---

## 6. API contract (what frontend receives first)

Before backend implementation, the frontend receives the **API contract**, which includes:

### DTOs (Data Transfer Objects)

DTOs define the exact shape of request and response data.

- Field names
- Data types
- Required vs optional fields
- Enum values

DTOs are part of the contract and must remain stable.

---

### Endpoints

Endpoints define available backend operations via HTTP.

- Each endpoint represents a user action
- Endpoints map directly to use cases
- RESTful conventions are used

---

### Status codes

HTTP status codes describe request outcomes.

Examples:
- `200 OK` — successful request
- `201 Created` — resource created
- `400 Bad Request` — validation error
- `401 Unauthorized` — authentication required or token expired
- `403 Forbidden` — action not allowed
- `404 Not Found` — resource does not exist

Frontend must rely on status codes, not on error message text.

---

### Errors

Errors are returned in a structured format with machine-readable codes.

- Frontend must not parse error message strings
- Error codes are stable
- Messages may be localized

---

### Swagger (OpenAPI)

Swagger is the **single source of truth** for the backend API.

Swagger documents:
- Endpoints
- DTOs
- Enums
- Errors
- Authentication rules

Frontend uses Swagger to:
- Generate types
- Mock API responses
- Develop UI independently from backend implementation

---

## 7. Authentication flow

- Backend uses JWT-based authentication
- Frontend sends the access token with every protected request
- Backend validates the token via middleware
- Backend is stateless and does not store sessions

If the access token expires:
- Backend returns `401 Unauthorized`
- Frontend refreshes the token and retries the request

---

## 8. Pagination rules

Pagination is controlled by the frontend via request parameters.

Frontend sends:
- `page`
- `pageSize`

Backend returns:
- `items`
- `page`
- `pageSize`
- `total`

Backend is responsible for slicing data and providing total counts.

---

## 9. Frontend–Backend collaboration rules

- Swagger defines the API contract
- Backend does not break existing contracts without versioning
- Frontend does not guess backend behavior
- Frontend does not parse error messages
- All changes to the API contract are discussed before implementation

---

## 10. Summary

- Backend logic starts from user scenarios and domain rules
- API is a contract derived from use cases
- Swagger is the single source of truth
- Frontend and backend can work in parallel without blocking each other


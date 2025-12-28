# API Usage (Frontend)

## Core rule
Frontend depends only on the **API contract** (OpenAPI/Swagger).

If it’s not documented in Swagger, frontend should not rely on it.

## Base URL & versioning
All calls target:
- `/api/v1/...`

## Authentication usage
Frontend sends:
```
Authorization: Bearer <accessToken>
Accept-Language: en|de|uk
```

Frontend behavior:
- on `401` → call `/auth/refresh`, then retry original request once
- on refresh failure → redirect to login

## Errors
Frontend expects unified error shape:
```json
{
  "code": "Post.ContentTooShort",
  "message": "The post content is too short."
}
```

## Pagination
Frontend uses:
- `page`, `pageSize`
Backend returns:
- `items`, `page`, `pageSize`, `total`

Pagination is used for all list endpoints.
Frontend specifies `page` and `pageSize` query parameters.
Backend returns paginated results with `items`, `page`, `pageSize`, and `total`.
> **Backend paginates data.**
> **Frontend paginates user experience.**

---

## Moderation UI integration
Content responses may include:
- `moderationStatus`
- `moderationMessage`

Frontend uses it to:
- show warnings
- hide content on the client if status is `hide` (server should also enforce)

## Mocking
Frontend can mock API responses using:
- Swagger-generated types
- static fixtures matching DTOs **(Data Transfer Object)**

Frontend may mock API responses during development.
Mocks must strictly follow DTOs defined in Swagger.
This allows frontend development without waiting for backend implementation.
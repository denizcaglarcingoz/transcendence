# Swagger & DTO — Frontend Guide (Transcendence)

This document explains **how frontend developers work with the backend API** using Swagger and DTOs.

---

## 1. What is Swagger?

**Swagger (OpenAPI) is the API contract.**

It tells you:
- which endpoints exist
- which HTTP methods to use
- what data to send
- what data you will receive
- which errors can happen

**Rule:**
> If it is in Swagger — it exists.  
> If it is not in Swagger — do not use it.

---

## 2. Where to look

You will receive a Swagger UI link, for example:

```
https://api.transcendence.com/swagger
```

In Swagger UI you can see:
- endpoints grouped by feature
- request body schema
- response schema
- HTTP status codes
- example JSON

You **do not need backend code access**.

---

## 3. What is a DTO?

**DTO = Data Transfer Object**

For frontend, DTO means:
- exact JSON shape
- source for TypeScript interfaces
- contract for requests and responses

**Do not invent JSON yourself.**

---

## 4. Request DTO (what you send)

Swagger example:

```json
{
  "email": "string",
  "password": "string"
}
```

Frontend must:
- send exactly these fields
- use correct types
- not add extra fields

Example:
```ts
const body = {
  email: emailValue,
  password: passwordValue
};
```

---

## 5. Response DTO (what you receive)

Swagger example:

```json
{
  "accessToken": "string",
  "expiresInSeconds": 3600
}
```

Frontend:
```ts
response.accessToken;
response.expiresInSeconds;
```

Only fields documented in Swagger are guaranteed.

---

## 6. Error format (IMPORTANT)

All backend errors use the same structure:

```json
{
  "code": "AUTH_INVALID_PASSWORD",
  "message": "Invalid credentials"
}
```

Frontend rules:
- use `code` for logic
- display `message` to the user
- never parse message text

Example:
```ts
if (error.code === "AUTH_INVALID_PASSWORD") {
  showError(t("errors.invalidPassword"));
}
```

---

## 7. HTTP status codes

| Status | Meaning |
|------|--------|
| 200 / 201 | Success |
| 400 | Validation error |
| 401 | Not authenticated |
| 403 | Forbidden |
| 404 | Not found |
| 409 | Conflict |

**Errors are never returned inside 200 responses.**

---

## 8. Pagination

Frontend sends:
```
GET /posts?page=1&pageSize=20
```

Backend returns:
```json
{
  "items": [ ... ],
  "page": 1,
  "pageSize": 20,
  "total": 134
}
```

Frontend responsibilities:
- control `page` and `pageSize`
- render `items`
- calculate pagination using `total`

---

## 9. API versioning

Endpoints include version:
```
/api/v1/posts
```

Rules:
- always include version
- switch to `/v2` only by agreement

---

## 10. Working without backend ready

Swagger allows frontend to:
- generate TypeScript types
- mock API responses
- build UI before backend is finished

**Mock data must match Swagger DTO exactly.**

---

## 11. Golden rules (summary)

- Trust Swagger, not assumptions
- Use DTOs exactly as defined
- Handle HTTP status codes
- Use error `code`, not message text
- Do not guess JSON
- Do not rely on undocumented fields

---

**Swagger is the single source of truth for the API.**


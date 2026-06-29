
# BACKEND FUNDAMENTALS
---
# PRIORITY 1 — WEB & BACKEND FUNDAMENTALS

## 1. Introduction to Backend Development

**1-liner:** Backend = the invisible engine that processes requests, talks to databases, and returns data.

**Client-Server Flow:**
```
User opens app → Types URL → Browser sends HTTP Request → DNS resolves IP → 
    → Request hits Load Balancer → Forwards to Backend Server → 
    → Server processes (auth, business logic, DB query) → 
    → Returns HTTP Response → Browser renders page
```

**Stateless vs Stateful:**

| Stateless | Stateful |
|-----------|----------|
| Server forgets you after each request | Server remembers you between requests |
| Every request has all context needed | Session stored server-side |
| REST APIs are stateless | WebSocket chat is stateful |
| Scales horizontally easily | Harder to scale (sticky sessions needed) |

**Monolithic vs Microservices:**

- Monolithic: One big app → All features in single codebase → Deploy together → Simple but rigid.
- Microservices: App split into services → Auth Service, Order Service, Payment Service → Deploy independently → Complex but scalable.

**Backend Responsibilities:** Handle requests, authenticate users, process business logic, query databases, manage caching, ensure security, handle errors.

---

## 2. REST APIs

**1-liner:** REST = architectural style where everything is a resource, accessed via standard HTTP methods.

**REST Principles (The 6 Constraints):**

| Principle | What it means | Flow Example |
|-----------|---------------|--------------|
| **Resource-Oriented** | Everything is a resource (nouns, not verbs) | `/users/123` not `/getUser?id=123` |
| **Statelessness** | Server has no memory of previous requests | Each request has auth token + all data needed |
| **Client-Server** | UI and logic are separate | Frontend team owns React; Backend owns API |
| **Cacheability** | Responses can be cached | `Cache-Control: max-age=3600` → CDN caches it |
| **Uniform Interface** | Same HTTP verbs for all resources | GET /users, POST /users, DELETE /users/123 |
| **Layered System** | Client doesn't know about intermediaries | LB, CDN, API Gateway are invisible to client |

**API Design Flow:**
```
Design endpoints:
    GET    /api/v1/users          → List users (paginated)
    GET    /api/v1/users/123      → Get user 123
    POST   /api/v1/users          → Create user
    PUT    /api/v1/users/123      → Replace user 123
    PATCH  /api/v1/users/123      → Update user 123 partially
    DELETE /api/v1/users/123      → Delete user 123

Pagination: GET /users?page=2&limit=20
Filtering:  GET /users?role=admin&status=active
Sorting:    GET /users?sort=-created_at (descending)
Versioning: /api/v1/... or Header: API-Version: v1
```

**REST vs RPC:**

- REST: Resource-centric, HTTP verbs, stateless, cacheable.
- RPC: Action-centric, `/doSomething`, often uses POST only, tighter coupling.

**REST vs GraphQL:**

- REST: Multiple endpoints, fixed response shape, over-fetching/under-fetching possible.
- GraphQL: Single endpoint, client requests exact fields, no over-fetching, but caching is harder.

---

## 3. HTTP Protocol

**1-liner:** HTTP = the language browsers and servers speak to exchange data.

**Request Lifecycle Flow:**
```
User types "google.com" → Browser checks DNS cache → 
    → DNS query → Gets IP (142.250.185.78) → 
    → TCP handshake (SYN → SYN-ACK → ACK) → 
    → TLS handshake (for HTTPS) → 
    → HTTP Request sent → Server processes → 
    → HTTP Response returned → Browser renders
```

**HTTP Versions:**

| Version | Key Feature | Flow |
|---------|-------------|------|
| **HTTP/1.1** | Persistent connections, pipelining | One request at a time per connection, head-of-line blocking |
| **HTTP/2** | Multiplexing, binary framing, server push | Multiple requests share one connection, headers compressed (HPACK) |
| **HTTP/3** | QUIC over UDP | Faster handshake, no head-of-line blocking, built-in encryption |

**Why HTTP is Stateless:**
```
Request 1: GET /profile → Server returns profile → Forgets you
Request 2: GET /orders → Server has no idea who you are → You must send auth token again
```
Stateless = simpler server, easier to scale, but client must carry identity every time.

---

## 4. HTTP Methods

**The Methods:**

| Method | Safe? | Idempotent? | Flow | Use Case |
|--------|-------|-------------|------|----------|
| **GET** | Yes | Yes | Read resource | `GET /users/123` → Returns user |
| **POST** | No | No | Create resource | `POST /users` → Body: user data → Creates user |
| **PUT** | No | Yes | Replace entire resource | `PUT /users/123` → Body: full user → Replaces |
| **PATCH** | No | Yes | Partial update | `PATCH /users/123` → Body: {name: "John"} → Updates name only |
| **DELETE** | No | Yes | Remove resource | `DELETE /users/123` → User gone |
| **OPTIONS** | Yes | Yes | What methods are allowed? | CORS preflight uses this |
| **HEAD** | Yes | Yes | GET without body | Check if resource exists, get headers only |

**Safe = doesn't change server state.**

**Idempotent = doing it multiple times = same result as once.**

**PUT vs PATCH:**

- PUT: Send full object → Replaces everything → Missing fields = deleted.
- PATCH: Send only changed fields → Partial update → Other fields untouched.

**POST vs PUT:**

- POST: Create new, server assigns ID → Not idempotent (POST twice = 2 resources).
- PUT: Update existing (or create at known URL) → Idempotent (PUT twice = same result).

---

## 5. HTTP Status Codes

**The Codes (Memorize these):**

**1xx — Informational**
- `100 Continue` → Server received headers, send body now.

**2xx — Success**

| Code | Meaning | When to use |
|------|---------|-------------|
| **200 OK** | Generic success | GET returned data, PUT/PATCH succeeded |
| **201 Created** | Resource created | POST succeeded, new resource born |
| **202 Accepted** | Accepted for processing | Async job started (e.g., video processing) |
| **204 No Content** | Success, nothing to return | DELETE succeeded, no body needed |

**3xx — Redirection**

| Code | Meaning | Flow |
|------|---------|------|
| **301 Moved Permanently** | URL changed forever | Browser bookmarks new URL, SEO juice passes |
| **302 Found** | Temporarily moved | Browser uses new URL this time, but keeps old bookmark |
| **304 Not Modified** | Cache is still valid | Browser uses cached version, no download needed |

**4xx — Client Error (You messed up)**

| Code | Meaning | When |
|------|---------|------|
| **400 Bad Request** | Malformed request | Invalid JSON, missing required field |
| **401 Unauthorized** | Not authenticated | No token, invalid token, token expired |
| **403 Forbidden** | No permission | Authenticated, but can't access this resource |
| **404 Not Found** | Resource doesn't exist | `/users/999` when user 999 doesn't exist |
| **405 Method Not Allowed** | Wrong HTTP method | `DELETE /users` when only GET/POST allowed |
| **409 Conflict** | Resource conflict | Email already exists, duplicate entry |
| **422 Unprocessable Entity** | Validation failed | Data format OK, but values invalid (e.g., negative age) |
| **429 Too Many Requests** | Rate limited | Client sent too many requests, slow down |

**5xx — Server Error (We messed up)**

| Code | Meaning | When |
|------|---------|------|
| **500 Internal Server Error** | Generic server crash | Uncaught exception, bug in code |
| **502 Bad Gateway** | Upstream error | LB got invalid response from backend server |
| **503 Service Unavailable** | Server overloaded | Maintenance, too much traffic, circuit breaker open |
| **504 Gateway Timeout** | Upstream too slow | Backend didn't respond in time |

**Quick Diffs:**

- **401 vs 403:** 401 = "Who are you?" (auth missing); 403 = "I know you, but you can't" (permission denied).
- **400 vs 422:** 400 = "I can't read this" (malformed); 422 = "I read it, but it's wrong" (semantic error).
- **502 vs 503 vs 504:** 502 = bad response from upstream; 503 = server can't handle request; 504 = upstream too slow.

---

# PRIORITY 2 — AUTHENTICATION & AUTHORIZATION

## 6. Authentication (Who are you?)

**1-liner:** Authentication = proving identity (username + password, fingerprint, OTP).

**Flow:**
```
User enters credentials → Server verifies against DB → 
    → Match? → Generate token/session → Return to client
    → No match? → 401 Unauthorized
```

**Password Hashing:**
```
User password: "mypassword123"
    → Server stores: bcrypt("mypassword123" + salt) = "$2b$10$..."
    → Even if DB leaks, attacker can't reverse hash
```

**Password Salting:**
```
Without salt: hash("password") → Same for all users with "password" → Rainbow table attack easy
With salt: hash("password" + random_salt) → Unique per user → Rainbow table useless
```

**MFA Flow:**
```
Step 1: Enter password → Valid? → Proceed to Step 2
Step 2: Enter OTP from SMS/Authenticator → Valid? → Authenticated
```

**Authentication vs Authorization:**

- Authentication = "Who are you?" (login).
- Authorization = "What can you do?" (permissions).

---

## 7. Authorization (What can you do?)

**RBAC (Role-Based Access Control):**
```
User "Alice" → Role: "Admin" → Can: create, read, update, delete ALL
User "Bob"   → Role: "Editor" → Can: read, update OWN posts
User "Carol" → Role: "Viewer" → Can: read only
```

**ABAC (Attribute-Based):**
```
Access granted if: (role == "Manager" AND department == "Sales" AND time < 18:00)
    → More granular, context-aware
```

**Where to check authorization?**

- Gateway level: Block early (performance).
- Service level: Fine-grained control (security).
- Both: Defense in depth.

---

## 8. Sessions

**1-liner:** Session = server-side memory of who you are.

**Flow:**
```
User logs in → Server creates Session ID (random string) → 
    → Stores in server memory/Redis: {session_id: {user_id: 123, role: "admin"}} → 
    → Sends session_id in cookie → 
    → Browser sends cookie with every request → 
    → Server looks up session_id → Knows who you are
```

**Session Storage:**

- In-memory: Fast, but lost on restart, doesn't scale.
- Redis: Shared across servers, TTL auto-expiry, scales horizontally.
- Database: Persistent but slower.

**Session Expiration:**
```
Idle timeout: No activity for 30 min → Session destroyed
Absolute timeout: Max 8 hours → Force re-login
```

---

## 9. Cookies

**1-liner:** Cookie = small text file browser stores and sends with every request to the domain.

**Types:**

| Type | Flow | Use Case |
|------|------|----------|
| **Session Cookie** | Deleted when browser closes | Short-term login |
| **Persistent Cookie** | Has Expires/Max-Age | "Remember me" for 7 days |

**Security Attributes:**

| Attribute | What it does | Without it |
|-----------|--------------|------------|
| **Secure** | Only sent over HTTPS | Cookie sent over HTTP = intercepted |
| **HttpOnly** | JS can't read cookie | XSS steals cookie via `document.cookie` |
| **SameSite=Strict** | Cookie only sent to same origin | CSRF: evil.com sends request to bank.com with cookie |
| **SameSite=Lax** | Cookie sent on top-level navigation | Balance between security and UX |
| **SameSite=None** | Cookie sent everywhere | Needed for cross-site, must use Secure |

**Cookies vs Sessions:**

- Cookie = storage mechanism (client-side or reference to server data).
- Session = concept of server remembering you (stored via cookie ID or JWT).

---

## 10. JWT (JSON Web Token)

**1-liner:** JWT = self-contained token that carries user identity and claims, signed but not encrypted by default.

**Structure (3 parts, dot-separated):**
```
eyJhbGciOiJIUzI1NiJ9.  → Header: {alg: "HS256", typ: "JWT"}
eyJ1c2VyX2lkIjoxMjN9.  → Payload: {user_id: 123, role: "admin", iat: 1234567890}
SflKxwRJSMeKKF2QT4fwpMe... → Signature: HMACSHA256(base64(header) + "." + base64(payload), secret)
```

**Authentication Flow:**
```
User logs in → Server verifies credentials → 
    → Generates Access Token (JWT, expires 15 min) + Refresh Token (long-lived, stored in DB/Redis) → 
    → Client stores Access Token in memory/localStorage → 
    → Every request: Authorization: Bearer <access_token> → 
    → Server verifies signature → Extracts claims → Knows user identity
```

**Access Token vs Refresh Token:**

| | Access Token | Refresh Token |
|---|---|---|
| Lifetime | Short (15 min) | Long (7 days) |
| Purpose | Access APIs | Get new access token when old expires |
| Storage | Client memory | HttpOnly cookie (secure) |
| Revocation | Can't easily revoke | Stored in DB/Redis → Can revoke by deleting |

**Why JWTs can't be easily revoked:**
```
JWT is self-contained → Server just verifies signature → No DB lookup → 
    → To revoke: Need blacklist (Redis) → Defeats stateless purpose → 
    → Solution: Short expiry + refresh token rotation
```

**Signing vs Encryption:**

- Signing = "I made this" (integrity) — anyone can read, but can't forge.
- Encryption = "Only you can read this" (confidentiality) — JWE for encryption.

---

## 11. OAuth 2.0 (Basic)

**1-liner:** OAuth 2.0 = delegation protocol — you authorize App X to access your Google data without giving App X your password.

**Actors:**

| Actor | Role |
|-------|------|
| **Resource Owner** | You (the user) |
| **Client** | The app requesting access (e.g., "MyApp") |
| **Authorization Server** | Google/Facebook — issues tokens |
| **Resource Server** | Google APIs — holds your data |

**Authorization Code Flow (Google Login):**
```
User clicks "Login with Google" → Redirected to Google → 
    → User enters Google credentials → Google shows consent screen → 
    → User approves → Google redirects back with ?code=xyz → 
    → MyApp exchanges code + client_secret for Access Token → 
    → MyApp uses Access Token to call Google APIs → Gets user profile → 
    → MyApp creates local session/JWT for user
```

**OAuth vs JWT:**

- OAuth = protocol/framework for authorization.
- JWT = token format that can be used WITHIN OAuth.
- You can use OAuth without JWT (e.g., opaque tokens), and JWT without OAuth (e.g., custom auth).

---

# PRIORITY 3 — CROSS-ORIGIN COMMUNICATION

## 12. CORS (Cross-Origin Resource Sharing)

**1-liner:** CORS = browser security feature that lets servers decide which other domains can access their APIs.

**Same-Origin Policy:**
```
Page from https://bank.com → Can fetch https://bank.com/api ✓
Page from https://evil.com → Fetch https://bank.com/api ✗ (blocked by browser)
```

**CORS Flow:**
```
Browser sends Preflight (OPTIONS) → 
    → Server responds with headers:
        Access-Control-Allow-Origin: https://frontend.com
        Access-Control-Allow-Methods: GET, POST, PUT
        Access-Control-Allow-Headers: Content-Type, Authorization
    → Browser allows actual request
```

**Preflight Request:**
```
Browser: OPTIONS /api/data
    Origin: https://frontend.com
    Access-Control-Request-Method: POST
    Access-Control-Request-Headers: Content-Type

Server: 200 OK
    Access-Control-Allow-Origin: https://frontend.com
    Access-Control-Allow-Methods: POST
    Access-Control-Allow-Headers: Content-Type
    Access-Control-Max-Age: 86400

Browser: Now sends actual POST request
```

**Why CORS exists:** Prevent malicious websites from calling your APIs using your cookies.

**Credentials:**
```
Frontend: fetch(url, { credentials: 'include' }) → Sends cookies
Server: Access-Control-Allow-Credentials: true → AND specific origin (not *)
```

---

# PRIORITY 4 — API SECURITY

## 13. Rate Limiting

**1-liner:** Rate limiting = throttle requests to prevent abuse and ensure fair usage.

**Algorithms:**

| Algorithm | Flow | Pros/Cons |
|-----------|------|-----------|
| **Fixed Window** | Counter resets every minute → 100 req/min | Simple, but burst at window edge |
| **Sliding Window** | Track requests in last 60 sec → Reject if >100 | Smooth, but more memory |
| **Token Bucket** | Bucket has N tokens → Each request takes 1 → Refill at rate R | Bursts allowed, smooth average |
| **Leaky Bucket** | Queue requests → Process at fixed rate | Smooth output, but can queue indefinitely |

**Token Bucket Flow:**
```
Bucket capacity: 10 tokens, refill: 1 token/sec
    → Request 1: Bucket has 10 → Grant, bucket = 9
    → Request 2: Bucket has 9 → Grant, bucket = 8
    ...
    → Request 11: Bucket empty → Reject (429) or Queue
    → After 1 sec: 1 token refilled → Next request granted
```

**Most common:** Token Bucket (flexible bursts + smooth average).

---

## 14. API Security Basics

**Security Checklist Flow:**
```
Request arrives → 
    1. HTTPS? → No? → Reject (HSTS)
    2. API Key valid? → No? → 401
    3. Bearer Token valid? → No? → 401
    4. Rate limit OK? → No? → 429
    5. Input sanitized? → SQL injection attempt? → Reject
    6. XSS attempt in payload? → Sanitize/escape
    7. CSRF token valid? → No? → Reject (for stateful forms)
    8. Authorization check → Role/permission OK? → No? → 403
    9. Process request → Log activity → Return response
```

**Quick Definitions:**

- **API Key:** Simple identifier for app/client (not user-specific).
- **Bearer Token:** "Bearer of this token is authorized" — sent in Authorization header.
- **CSRF:** Evil site tricks browser into sending authenticated request to your API.
- **XSS:** Attacker injects malicious JS into your page → Steals cookies/session.
- **SQL Injection:** `'; DROP TABLE users; --` → Always use parameterized queries.
- **Input Validation:** Check type, length, format, range before processing.

---

# PRIORITY 5 — API DESIGN BEST PRACTICES

**Naming Conventions:**
```
✓ GET /users          (plural nouns)
✓ GET /users/123/orders (nested resources)
✗ GET /getUser        (no verbs in URL)
✗ GET /users/123/getOrders
```

**Error Responses:**
```json
{
    "error": {
        "code": "INVALID_EMAIL",
        "message": "Email format is invalid",
        "field": "email",
        "timestamp": "2024-01-15T10:30:00Z"
    }
}
```

**Idempotency:**
```
POST /payments (not idempotent) → Client retries → Double charge!
Solution: Idempotency-Key: uuid-123 → Server checks key → Already processed? → Return same response
```

**Retry Safety:**

- GET = safe to retry anytime.
- POST = not safe → Use idempotency key.
- PUT/DELETE = idempotent → Retry OK.

---

# PRIORITY 6 — SERIALIZATION & DATA EXCHANGE

## JSON
**1-liner:** JSON = text format for data exchange — human-readable, language-agnostic.

**Serialization Flow:**
```
Object (User {name: "Alice", age: 30}) → JSON.stringify() → '{"name":"Alice","age":30}' → Send over wire
```
**Deserialization Flow:**
```
'{"name":"Alice","age":30}' → JSON.parse() → Object {name: "Alice", age: 30}
```

## Protocol Buffers
**1-liner:** Protobuf = binary serialization format — smaller, faster than JSON, but needs schema.

**Flow:**
```
Define .proto schema → Generate code (Java/Go/Python) → 
    → Serialize object to binary → Send (smaller payload) → 
    → Deserialize on other end using same schema
```
**Where used:** gRPC, microservice internal communication, high-performance APIs.

---

# PRIORITY 7 — BACKEND PERFORMANCE

**Connection Pooling:**
```
Without pool: Request → Create DB connection → Query → Close connection → (slow, expensive)
With pool:    Pool has 10 ready connections → Request borrows one → Query → Return to pool → (fast, reuse)
```

**Request Timeouts:**
```
Client → Server → DB query taking 30 sec → Timeout after 5 sec → Return 504 → Client not stuck
```

**Compression:**
```
Response: 1MB JSON → Gzip compress → 200KB → Browser decompresses → Faster transfer
```

**Caching Flow:**
```
Request → Check Redis cache → Hit? → Return cached data (1ms)
        → Miss? → Query DB → Store in Redis → Return data (100ms)
```

**Asynchronous Processing:**
```
User uploads video → API returns "Processing started" (202) → 
    → Video queued → Worker processes → User polls /status or gets webhook → 
    → Processing done → User notified
```

**Why Paginate?**
```
GET /users → 1 million users → Response = 500MB → Timeout, crash, bad UX
GET /users?page=1&limit=20 → 20 users → 10KB → Fast, usable
```

---

# PRIORITY 8 — BACKEND ARCHITECTURE

**Layered Architecture Flow:**
```
HTTP Request → Controller (handles HTTP, validates input) → 
    → Service (business logic, orchestration) → 
    → Repository (DB queries, data access) → 
    → Database → Response flows back up
```

**Why separate?**

| Layer | Responsibility | Change without affecting |
|-------|---------------|--------------------------|
| Controller | HTTP handling, routing | Service logic |
| Service | Business rules, workflows | DB schema, HTTP details |
| Repository | Data persistence | Business logic |

**Middleware Flow:**
```
Request → AuthMiddleware → RateLimitMiddleware → LoggingMiddleware → 
    → ValidationMiddleware → Router → Controller
```

**Dependency Injection:**
```
Without DI: Service creates new DatabaseConnection() → Tight coupling → Can't swap DB
With DI:    Service receives IDatabaseConnection → Runtime injection → Easy to swap/mock
```

---

# PRIORITY 9 — BACKEND RELIABILITY

**Idempotency:**
```
Retry POST /charge → Without idempotency key → Double charge
With idempotency key → Server sees duplicate → Returns same response → No double charge
```

**Retries with Exponential Backoff:**
```
Request fails → Wait 1 sec → Retry → Fails → Wait 2 sec → Retry → Fails → Wait 4 sec → Retry
→ Max retries reached → Circuit breaker opens
```

**Circuit Breaker:**
```
Normal: Request → Service → Response
Fail threshold reached (e.g., 5 errors in 60 sec) → Circuit OPEN → 
    → Fast fail (don't call failing service) → After timeout → Half-open → 
    → Test request → Success? → Close circuit → Normal flow
```

**Health Checks:**
```
Load Balancer → GET /health → 
    → DB connection OK? → Cache OK? → Disk space OK? → 200 OK → Keep sending traffic
    → DB down? → 503 → Stop sending traffic → Alert on-call
```

**Graceful Shutdown:**
```
SIGTERM received → Stop accepting new requests → Finish processing in-flight requests → 
    → Close DB connections → Flush logs → Exit cleanly
```

---

# PRIORITY 10 — API DOCUMENTATION & TESTING

**OpenAPI/Swagger Flow:**
```
Write openapi.yaml → Auto-generates docs + client SDKs + server stubs → 
    → Frontend devs read docs → Know exact endpoints, params, responses
```

**Testing Tools:**

| Tool | Use |
|------|-----|
| **Postman** | Manual API testing, collections, environments |
| **cURL** | Quick command-line testing |
| **Contract Testing** | Ensure provider and consumer agree on API contract |

---

# COMMON INTERVIEW SCENARIOS — QUICK ANSWERS

| # | Question | Answer |
|---|----------|--------|
| 1 | What makes API RESTful? | Resources, HTTP verbs, statelessness, uniform interface |
| 2 | REST vs GraphQL? | REST = multiple endpoints, fixed shape; GraphQL = single endpoint, client picks fields |
| 3 | REST vs gRPC? | REST = HTTP/JSON, human-readable; gRPC = HTTP/2 + Protobuf, binary, faster |
| 4 | PUT vs PATCH? | PUT = full replace; PATCH = partial update |
| 5 | GET vs POST? | GET = read, idempotent, safe; POST = create, not idempotent |
| 6 | Auth vs Authz? | Auth = who are you; Authz = what can you do |
| 7 | Cookies vs Sessions? | Cookie = storage mechanism; Session = server memory of user (often via cookie) |
| 8 | JWT vs Session-based? | JWT = stateless, self-contained, scales well; Session = server-side, easy to revoke |
| 9 | OAuth vs JWT? | OAuth = protocol; JWT = token format. OAuth can use JWT tokens |
| 10 | Google Login flow? | Redirect to Google → User consents → Code returned → Exchange code for token → Get profile |
| 11 | What is CORS? | Browser security letting servers whitelist cross-origin requests |
| 12 | Preflight request? | Browser sends OPTIONS first to check if actual request is allowed |
| 13 | Why rate limiting? | Prevent abuse, DDoS, ensure fair usage, protect resources |
| 14 | Secure REST API? | HTTPS, auth tokens, input validation, rate limiting, CORS, least privilege |
| 15 | Status codes for scenarios? | 200=OK, 201=Created, 400=Bad Request, 401=Unauth, 403=Forbidden, 404=Not Found, 500=Error |
| 16 | Version APIs? | URL (/v1/), Header (API-Version), or Content-Type (application/vnd.api.v1+json) |
| 17 | Why stateless? | Scales horizontally, no server memory needed, each request self-contained |
| 18 | Expired JWT? | Return 401 → Client uses refresh token → Get new access token → Retry original request |
| 19 | Why HTTPS? | Encrypts data in transit → Prevents MITM, eavesdropping, tampering |
| 20 | Secure login system? | HTTPS + password hashing (bcrypt+salt) + MFA + rate limiting + JWT (short access + refresh) + CSRF protection |

---

# REVISION ORDER (Highest ROI)

1. HTTP Request Lifecycle (DNS → TCP → TLS → HTTP)
2. HTTP Methods (GET/POST/PUT/PATCH/DELETE + idempotency)
3. HTTP Status Codes (200, 201, 400, 401, 403, 404, 500, 502, 503, 504)
4. REST Principles (6 constraints + resource naming)
5. Authentication (password hashing, MFA)
6. JWT (structure, access vs refresh, why hard to revoke)
7. Sessions vs Cookies (flow, HttpOnly, Secure, SameSite)
8. OAuth 2.0 (actors, authorization code flow)
9. CORS (same-origin, preflight, headers)
10. Rate Limiting (token bucket, why needed)
11. API Security (HTTPS, XSS, CSRF, SQL injection, input validation)
12. API Design (naming, versioning, pagination, error responses, idempotency)
13. Backend Architecture (Controller → Service → Repository)
14. Backend Performance (connection pooling, caching, compression, async)
15. Backend Reliability (retries, circuit breaker, health checks, graceful shutdown)
16. Serialization (JSON vs Protobuf)
17. All comparison tables
18. Common interview scenarios (20 questions)

---

# HANDS-ON PRACTICE PROJECTS

## 1. User Authentication Service
**Flow:**
```
POST /register → Validate input → Hash password (bcrypt) → Store in DB → 201 Created
POST /login → Verify password → Generate Access Token (JWT, 15min) + Refresh Token (7d, HttpOnly cookie) → 200 OK
POST /refresh → Verify refresh token → Generate new access token → 200 OK
POST /logout → Invalidate refresh token (delete from Redis) → Clear cookie → 200 OK
GET /profile → Verify access token → Return user data → 200 OK
```

## 2. Library Management API
**Flow:**
```
GET /books?page=1&limit=20&genre=fiction&sort=-rating → 
    → Parse query params → Query DB with filters → Paginate → Return books
POST /books → Validate → Insert → 201
PUT /books/123 → Replace → 200
PATCH /books/123 → Partial update → 200
DELETE /books/123 → Delete → 204
```

## 3. E-commerce Backend
**Flow:**
```
GET /products (paginated, filtered)
POST /cart → Add item → JWT auth → Update cart in DB
POST /orders → Validate cart → Check stock → Create order → Payment (async) → 202 Accepted
GET /orders/456 → Auth → Check ownership → Return order
```

## 4. URL Shortener
**Flow:**
```
POST /shorten → body: {url: "https://..."} → Generate short code (base62) → Store mapping → Return short URL
GET /abc123 → Lookup code → 301 redirect to original URL → Increment click count
Rate limit: Token bucket per IP → 429 if exceeded
Cache: Redis stores popular URLs → 1ms response vs 10ms DB lookup
```

## 5. Blog Platform API
**Flow:**
```
GET /posts (public, paginated)
POST /posts → Auth (JWT) → Role check (Editor/Admin) → Create post → 201
PUT /posts/123 → Auth → Ownership check → Update → 200
DELETE /posts/123 → Auth → Admin OR Owner → Delete → 204
GET /posts/123/comments → Public → Return comments
POST /posts/123/comments → Auth → Create comment → 201
```

---

**REMEMBER:** Interviewers care about:

1. **Can you trace a request end-to-end?** (DNS → LB → Server → DB → Response)
2. **Why this status code / method / auth mechanism?** (Trade-offs matter)
3. **What happens when things fail?** (Timeouts, retries, circuit breakers)
4. **How do you scale?** (Stateless, caching, connection pooling, async)

> Tell the story of a request's journey through your system.

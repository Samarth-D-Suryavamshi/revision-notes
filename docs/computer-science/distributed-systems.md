# System Design

---

# Priority 1 — Distributed Systems Fundamentals

## 1. Introduction to System Design

**HLD vs LLD**
```
HLD (High-Level Design): "How many servers? What services? How do they talk?"
  → Architecture, scalability, availability, trade-offs

LLD (Low-Level Design): "What classes? What methods? How do objects interact?"
  → Classes, interfaces, design patterns, code structure
```

**System Design Interview Flow:**
```
1. Requirements (5 min)    → Functional + Non-functional + Constraints
2. Capacity Estimation (5 min) → Back-of-envelope math
3. High-Level Design (10 min) → API + Database + Basic Architecture
4. Deep Dive (15 min)      → Scaling, caching, messaging, reliability
5. Trade-offs (5 min)       → What if requirements change?
```

| Aspect | What to Ask |
|--------|-------------|
| **Functional** | What features? Who uses it? |
| **Non-Functional** | Scale? Latency? Availability? Consistency? |
| **Constraints** | Budget? Team size? Time to market? |

---

## 2. Scalability

**Vertical Scaling (Scale Up)**
```
Server: 8 CPU → 16 CPU → 32 CPU → 64 CPU
         16GB → 32GB → 64GB → 128GB RAM

Limit: Hardware ceiling, single point of failure, expensive
```

**Horizontal Scaling (Scale Out)**
```
Server 1    Server 2    Server 3    Server 4
  ↓           ↓           ↓           ↓
Load Balancer distributes traffic

Advantage: No ceiling, fault tolerant, cost-effective, elastic
```

| Vertical | Horizontal |
|----------|-----------|
| Bigger machine | More machines |
| Single point of failure | Fault tolerant |
| Hardware limit | Virtually unlimited |
| Expensive (specialized hardware) | Cheap (commodity hardware) |
| Data consistency easier | Requires distributed coordination |

**Why big companies prefer horizontal?** → No single point of failure, unlimited scale, use cheap hardware, handle traffic spikes by adding/removing instances.

---

## 3. Availability

**System Flow — High Availability:**
```
User Request → Load Balancer → Server A (active) → If A fails → LB routes to Server B (standby)
                                    ↓
                              Health check every 5s → A down? → Failover to B
```

| Term | Meaning | Example |
|------|---------|---------|
| **Uptime** | % time system is operational | 99.9% = 8.76 hrs downtime/year |
| **Redundancy** | Duplicate components | Multiple servers, DB replicas |
| **Failover** | Switch to backup on failure | Active-Passive, Active-Active |
| **Active-Active** | All nodes serve traffic simultaneously | Load balanced, instant failover |
| **Active-Passive** | Primary serves, standby waits | Slower failover, cheaper |

**Availability Tiers:**
```
99%     → 3.65 days downtime/year
99.9%   → 8.76 hours downtime/year ("three nines")
99.99%  → 52.6 minutes downtime/year ("four nines")
99.999% → 5.26 minutes downtime/year ("five nines")
```

---

## 4. Reliability

**System Flow — Fault Tolerance:**
```
Request → Service A → Service B fails → Retry with backoff → Still fails? → Circuit breaker opens → Return fallback → Log error → Alert team
```

| Term | Definition | Example |
|------|-----------|---------|
| **Fault Tolerance** | System continues despite failures | Retry, fallback, circuit breaker |
| **Durability** | Data survives failures | Replication, backups, WAL |
| **Idempotency** | Same request = same result | Retry safe, no double-charge |
| **Disaster Recovery** | Recover from major outage | Cross-region replication, backups |

**Reliability vs Availability:**
```
Availability: "Is the system up?" (uptime percentage)
Reliability: "Does it work correctly?" (correct results, no data loss)

A system can be available but unreliable (returns wrong data)
A system can be reliable but unavailable (down for maintenance)
```

---

## 5. Consistency

**System Flow — Consistency Models:**
```
Strong Consistency: Write completes → All reads see new value immediately
Eventual Consistency: Write completes → Some reads see old value temporarily → Eventually all see new value
```

| Model | Guarantee | Use Case |
|-------|-----------|----------|
| **Strong** | All reads see latest write | Banking, inventory, payments |
| **Eventual** | Reads may be stale temporarily | Social media feeds, comments, likes |
| **Read-after-Write** | My writes are immediately visible | User profile updates |
| **Session** | Consistent within user session | Shopping cart |

**Why social media uses eventual consistency?** → Faster writes, global scale, stale data acceptable (showing 998 vs 1000 likes is fine).

---

## 6. CAP Theorem

**System Flow — Network Partition Forces Choice:**
```
Node A ──Network Partition── Node B
   │                          │
   ↓                          ↓
Write to A                Read from B

Choose:
  CP (Consistency + Partition tolerance): Reject write on A → System unavailable
  AP (Availability + Partition tolerance): Accept write on A → B has stale data

CA is impossible in distributed systems (network partitions happen)
```

| Choice | System | Behavior |
|--------|--------|----------|
| **CP** | MongoDB (configurable), HBase | Consistent but may reject requests during partition |
| **AP** | Cassandra, DynamoDB | Available but may return stale data during partition |
| **CA** | Single-node RDBMS | Not truly distributed |

**Real-world:** Most systems choose AP with tunable consistency (e.g., DynamoDB lets you specify read consistency per request).

---

## 7. PACELC Theorem

**Extension of CAP:**
```
If Partitioned (P) → Choose Availability (A) or Consistency (C)
Else (E) → Choose Latency (L) or Consistency (C)

Trade-off: Even without partition, consistency costs latency
```

---

# Priority 2 — Core Infrastructure Components

## 8. Load Balancer

**System Flow:**
```
User → DNS → Load Balancer → Server 1 (healthy)
                         → Server 2 (healthy)
                         → Server 3 (unhealthy → removed)
```

| Type | Layer | What it sees | Example |
|------|-------|--------------|---------|
| **L4** | Transport (TCP/UDP) | IP + Port | HAProxy, AWS NLB |
| **L7** | Application (HTTP) | URL, headers, cookies | Nginx, AWS ALB |

**L4 vs L7:**
```
L4: Faster, simpler, can't inspect HTTP content, cheaper
L7: Slower, smarter, can route by URL (/api → service A, /web → service B), SSL termination
```

**Algorithms:**

| Algorithm | How it works | Best For |
|-----------|-------------|----------|
| **Round Robin** | Sequential: 1, 2, 3, 1, 2, 3... | Equal capacity servers |
| **Least Connections** | Route to server with fewest active connections | Variable request duration |
| **Weighted Round Robin** | Server with weight 2 gets 2x traffic | Unequal capacity |
| **IP Hash** | Hash(client IP) → server | Session stickiness |
| **Least Response Time** | Route to fastest server | Latency-sensitive |

**Health Checks:**
```
LB pings /health every 5s → 200 OK? Keep in pool. 5xx? Remove. Retry after 30s.
```

---

## 9. Reverse Proxy

**System Flow:**
```
Client → Reverse Proxy → Server A (routing, SSL, caching)
                    → Server B
                    → Server C

Client sees only proxy IP. Servers hidden.
```

**What it does:**

| Function | How |
|----------|-----|
| **Request Routing** | /api → backend-service, /static → CDN |
| **SSL Termination** | Decrypt HTTPS → HTTP to backend (saves CPU) |
| **Caching** | Serve cached responses directly |
| **Compression** | Gzip responses before sending |
| **Rate Limiting** | Block excessive requests |

**Reverse Proxy vs Load Balancer:**
```
Reverse Proxy: Routes by content (URL, headers), SSL, caching, security
Load Balancer: Distributes by health/algorithm, TCP/HTTP level

Often combined: Nginx acts as both reverse proxy AND load balancer
```

**Reverse Proxy vs Forward Proxy:**
```
Forward Proxy: Client → Proxy → Internet (hides client, e.g., VPN)
Reverse Proxy: Internet → Proxy → Server (hides server, e.g., Nginx)
```

---

## 10. API Gateway

**System Flow:**
```
Client → API Gateway → Auth check → Rate limit? → Route to Service A → Aggregate response → Return
                 → Route to Service B
                 → Route to Service C
```

**Functions:**

| Function | Example |
|----------|---------|
| **Authentication** | Verify JWT token |
| **Authorization** | Check user permissions |
| **Rate Limiting** | 100 requests/min per API key |
| **Request Routing** | /users → User Service, /orders → Order Service |
| **API Aggregation** | One call fetches user + orders + payments |
| **SSL Termination** | Decrypt incoming HTTPS |

---

## 11. CDN

**System Flow:**
```
User in Mumbai requests image → DNS routes to nearest edge server (Mumbai)
  → Cache hit? Serve immediately (10ms)
  → Cache miss? Fetch from origin (US), cache, serve (200ms)
```

| Aspect | How |
|--------|-----|
| **Edge Servers** | Distributed globally, cache content close to users |
| **Static Content** | Images, CSS, JS, videos (cached long-term) |
| **Dynamic Content** | API responses (cached short-term, edge computing) |
| **Cache Invalidation** | Purge specific URLs or entire cache on update |
| **Geographic** | User in India → Mumbai edge, not US origin |

**Why Netflix uses CDN?** → Reduce latency (video from nearby server), reduce origin load (99% served from edge), handle traffic spikes (World Cup finale).

**CDN vs Reverse Proxy:**
```
CDN: Distributed globally, caches static content, reduces latency for end users
Reverse Proxy: Single location, routes to backends, handles dynamic requests
```

---

# Priority 3 — Caching

## 12. Cache Fundamentals

**System Flow:**
```
Request → Cache check → Hit? Return (1ms)
                    → Miss? Fetch from DB (100ms) → Store in cache → Return
```

| Term | Definition |
|------|-----------|
| **Cache Hit** | Data found in cache (fast) |
| **Cache Miss** | Data not in cache (slow, fetch from source) |
| **Cache Eviction** | Removing old data when cache is full |
| **Hit Rate** | Hits / Total requests (target: >90%) |

---

## 13. Redis

**System Flow:**
```
Application → Redis (in-memory) → Data in RAM (microseconds)
         → If miss → Database (milliseconds)
```

**Why Redis instead of DB?**
```
Redis: In-memory, microseconds, simple data structures, pub/sub
DB: Disk-based, milliseconds, complex queries, ACID transactions

Use Redis for: Session store, real-time leaderboards, rate limiting, caching
Use DB for: Persistent data, complex joins, transactions
```

**Why Redis is fast?** → In-memory (RAM), single-threaded (no lock contention), C implementation, optimized data structures.

**Data Structures:**

| Structure | Use |
|-----------|-----|
| **String** | Simple key-value, counters |
| **Hash** | Object storage (user profile) |
| **List** | Queue, timeline |
| **Set** | Unique items, tags |
| **Sorted Set** | Leaderboards, rankings |
| **Bitmap** | Presence checks (online users) |

---

## 14. Cache Strategies

**System Flow — Cache Aside (Lazy Loading):**
```
Read:  App → Cache? → Hit → Return
              → Miss → DB → Store in cache → Return

Write: App → Update DB → Invalidate cache (or update cache)
```

| Strategy | Read Flow | Write Flow | Pros | Cons |
|----------|-----------|-----------|------|------|
| **Cache Aside** | Check cache → miss → DB → cache | Update DB, invalidate cache | Simple, cache only hot data | Stale data possible, cache miss penalty |
| **Read Through** | Check cache → miss → cache loads from DB | Update DB, cache invalidates | Consistent, less app code | Cache controls loading |
| **Write Through** | Check cache | Update cache + DB together | Strong consistency | Slower writes (2 operations) |
| **Write Around** | Check cache → miss → DB | Write to DB only (skip cache) | No cache pollution | Higher read misses |
| **Write Back** | Check cache | Write to cache only, async flush to DB | Fastest writes | Data loss risk if cache crashes |

**Cache Aside vs Write Through:**
```
Cache Aside: Lazy, simple, eventual consistency. Good for read-heavy.
Write Through: Eager, consistent, slower writes. Good for write-heavy + consistency needed.
```

---

## 15. Cache Eviction

| Policy | How it works | Best For |
|----------|-------------|----------|
| **LRU** | Evict least recently used | Temporal locality (recent = likely reused) |
| **LFU** | Evict least frequently used | Popular content (frequently = important) |
| **FIFO** | Evict oldest added | Simple, predictable |
| **TTL** | Evict after time expires | Time-sensitive data (sessions, API responses) |

---

# Priority 4 — Database Scaling

## 16. Replication

**System Flow:**
```
Write → Primary DB → Replicate → Replica 1 (read)
                              → Replica 2 (read)
                              → Replica 3 (read)

Read traffic split across replicas. Write goes to primary only.
```

| Type | How | Trade-off |
|------|-----|-----------|
| **Synchronous** | Primary waits for replica confirmation | Zero data loss, slower writes |
| **Asynchronous** | Primary doesn't wait | Faster writes, potential data loss |

**Why Read Replicas?** → Scale read traffic (1 write → 10 reads), analytics on replica (no load on primary), disaster recovery.

**Replication vs Backup:**
```
Replication: Real-time, live copy, for scaling reads + failover
Backup: Point-in-time, stored separately, for disaster recovery
```

---

## 17. Sharding

**System Flow:**
```
User ID 1-1000 → Shard A (Server 1)
User ID 1001-2000 → Shard B (Server 2)
User ID 2001-3000 → Shard C (Server 3)

Or hash-based: hash(user_id) % 3 → shard number
```

| Type | How | Example |
|------|-----|---------|
| **Horizontal** | Split rows across servers | Users 1-1M on Shard A, 1M-2M on Shard B |
| **Vertical** | Split columns across servers | User profile on DB1, user activity on DB2 |

**Shard Key:**
```
Good: user_id (even distribution, query pattern matches)
Bad: country (India = 80% data, hot shard), created_at (recent data = hot shard)
```

**Challenges:**

| Problem | Fix |
|---------|-----|
| **Hot Shard** | One shard gets most traffic | Re-shard, add shard key prefix |
| **Rebalancing** | Shard too big | Consistent hashing, add shards gradually |
| **Cross-shard queries** | JOIN across shards | Denormalize, application-level join |
| **Complexity** | More moving parts | Use managed services (DynamoDB, Cosmos DB) |

---

## 18. Partitioning

| Type | How | Example |
|------|-----|---------|
| **Range** | By value range | Orders by month (Jan, Feb, Mar) |
| **Hash** | By hash of key | hash(user_id) % 10 |
| **List** | By explicit list | Country IN ('US', 'CA') |
| **Composite** | Range + Hash | Year range + hash within year |

---

## 19. Database Indexing (System Perspective)

**System Flow:**
```
Query: SELECT * FROM users WHERE email = 'x'
No index: Full table scan → O(n) → Slow for large tables
With index: B-tree lookup → O(log n) → Fast

Trade-off: Index speeds reads, slows writes (index must be updated)
```

| Index Type | Use | Trade-off |
|-----------|-----|-----------|
| **Primary** | Unique row identifier | Auto-created, clustered |
| **Secondary** | Non-unique lookups | Extra storage, slower writes |
| **Covering** | Includes all query columns | No table lookup, larger index |

---

# Priority 5 — Messaging Systems

## 20. Message Queues

**System Flow:**
```
Producer → Queue → Consumer 1
             → Consumer 2
             → Consumer 3

Decouples producer from consumer. Producer doesn't wait. Consumer processes at own pace.
```

| Pattern | How | Example |
|---------|-----|---------|
| **Queue** | One message → One consumer | Order processing (each order handled once) |
| **Pub/Sub** | One message → Many consumers | Notification (push + email + SMS) |

**Why Message Queues?** → Decoupling, async processing, load leveling (smooth spikes), reliability (persist if consumer down).

| Tool | Type | Best For |
|------|------|----------|
| **RabbitMQ** | Queue + Pub/Sub | Complex routing, enterprise |
| **Kafka** | Distributed log | High throughput, event sourcing, streaming |
| **SQS** | Managed queue | AWS, simple, no infrastructure |

**Queue vs Pub/Sub:**
```
Queue: Message consumed by ONE consumer (work distribution)
Pub/Sub: Message consumed by MANY consumers (broadcast)
```

---

## 21. Event-Driven Architecture

**System Flow:**
```
User signs up → Event: "UserCreated" → Event Bus
                                    → Email Service: "Send welcome email"
                                    → Analytics Service: "Track signup"
                                    → CRM Service: "Add to mailing list"
                                    → Search Service: "Index user"

Loosely coupled. Services don't know about each other.
```

---

# Priority 6 — Storage Systems

## 22-24. File vs Blob vs Object Storage

| Type | What | Use | Example |
|------|------|-----|---------|
| **File Storage** | Hierarchical folders | Shared drives, NAS | NFS, SMB |
| **Blob Storage** | Unstructured binary data | Images, videos, backups | S3, Azure Blob |
| **Object Storage** | Object + Metadata + Unique ID | Cloud-native media, logs | S3, GCS, MinIO |

**Object Storage:**
```
Object = Data + Metadata + Global ID
Bucket = Container for objects
No hierarchy (flat), infinite scale, 99.999999999% durability
```

**Why Object Storage for media?** → Infinite scale, cheap ($0.023/GB), CDN integration, no server management.

---

# Priority 7 — Communication Protocols

## 25. REST APIs

**System Flow:**
```
Client → HTTP GET /users/123 → Server → Return JSON → Client
```

| Method | Action | Idempotent? |
|--------|--------|-------------|
| **GET** | Read | Yes |
| **POST** | Create | No |
| **PUT** | Update (full) | Yes |
| **PATCH** | Update (partial) | No |
| **DELETE** | Remove | Yes |

**Idempotency:** Same request → Same result. Safe to retry.
```
POST /payments (not idempotent) → Retry = double charge
PUT /users/123 (idempotent) → Retry = same update
```

**Versioning:** `/v1/users` or `Accept: application/vnd.api.v1+json`

---

## 26. WebSockets

**System Flow:**
```
Client ←→ WebSocket Connection (persistent, full-duplex) ←→ Server

HTTP Handshake → Upgrade to WebSocket → Bidirectional messages

Use: Chat, live notifications, real-time gaming, stock tickers
```

**vs HTTP polling:**
```
Polling: Client asks every 2s → "Any new messages?" → Wasteful
WebSocket: Server pushes instantly when message arrives → Efficient
```

---

## 27. gRPC

**System Flow:**
```
Client → Protocol Buffers (binary) → HTTP/2 → Server → Protobuf response

Compact, fast, typed. Not human-readable (vs JSON).
```

| Feature | gRPC | REST |
|---------|------|------|
| Format | Protobuf (binary) | JSON (text) |
| Speed | Fast (compact) | Slower (verbose) |
| Readability | Poor (binary) | Good (human-readable) |
| Streaming | Bidirectional | Request-response only |
| Browser | Needs proxy | Native support |
| Use | Internal microservices | Public APIs, web clients |

**gRPC vs WebSockets:**
```
gRPC: RPC framework, typed, protobuf, HTTP/2, internal APIs
WebSockets: Protocol, persistent, bidirectional, real-time, browser-friendly
```

---

# Priority 8 — Reliability Patterns

## Retry

**System Flow:**
```
Request → Fail → Wait 1s → Retry → Fail → Wait 2s → Retry → Fail → Wait 4s → Retry → Success

Exponential Backoff: 1s, 2s, 4s, 8s, 16s... (prevents thundering herd)
```

## Circuit Breaker

**System Flow:**
```
Closed (normal): Request → Service → Response
                    ↓
              5 failures in 10s
                    ↓
Open (failing): Request → Immediately return fallback (no call to service)
                    ↓
              Wait 30s
                    ↓
Half-Open: Test request → If success → Close, If fail → Open
```

| State | Behavior | Why |
|-------|----------|-----|
| **Closed** | Normal operation | Everything works |
| **Open** | Fast fail, no calls | Service is down, don't waste resources |
| **Half-Open** | Test with limited traffic | Check if service recovered |

## Bulkhead

**System Flow:**
```
Without bulkhead: Thread pool shared → Slow service A consumes all → Service B starves
With bulkhead: Pool A (10 threads) for Service A, Pool B (10 threads) for Service B → Isolated
```

## Timeout

```
Request → Wait max 5s → If no response → Fail fast → Return error
Prevents hanging requests from consuming resources
```

## Idempotency

**System Flow:**
```
Client generates Idempotency-Key: abc123 → Server stores key → Processes → Returns result
Client retries with same key → Server checks key → Already processed → Returns same result

No double charge, no duplicate orders.
```

---

# Priority 9 — Observability

**System Flow:**
```
App → Logs (text events) → ELK Stack → Searchable, queryable
    → Metrics (numbers) → Prometheus → Grafana dashboards → Alerts
    → Traces (request path) → OpenTelemetry → Jaeger → Latency breakdown
```

| Pillar | What | Question it answers | Tool |
|--------|------|---------------------|------|
| **Logs** | Events, errors, debug info | "What happened?" | ELK, Splunk |
| **Metrics** | Aggregated numbers over time | "Is it healthy?" | Prometheus, Datadog |
| **Traces** | Request path across services | "Where is it slow?" | Jaeger, Zipkin |

**Health Checks:**
```
/health → Check DB connection, cache, external services → Return 200 (healthy) or 503 (unhealthy)
Load balancer removes unhealthy instances.
```

---

# Priority 10 — Security

| Concept | What | Example |
|---------|------|---------|
| **Authentication** | Who are you? | Username/password, JWT, OAuth |
| **Authorization** | What can you do? | RBAC, permissions |
| **JWT** | Signed token with claims | Access token, refresh token |
| **OAuth 2.0** | Delegated authorization | "Login with Google" |
| **HTTPS** | Encrypted HTTP | TLS 1.3, certificates |
| **Rate Limiting** | Prevent abuse | 100 requests/min per IP |
| **API Keys** | Service-to-service auth | X-API-Key header |

**JWT Flow:**
```
Login → Server creates JWT (header.payload.signature) → Client stores → Sends in Authorization header
→ Server verifies signature → Extracts user info → No DB lookup needed
```

---

# Priority 11 — Capacity Estimation

**System Flow — Back-of-Envelope:**
```
1. Users: 1M DAU → 10M MAU
2. Requests: 1M users × 10 actions/day = 10M requests/day
3. RPS: 10M / 86400s ≈ 116 RPS (peak 3x = 350 RPS)
4. Storage: 10M requests × 1KB = 10GB/day → 3.6TB/year
5. Bandwidth: 10M × 1KB = 10GB/day outgoing
6. Cache: 20% hot data = 2GB cache needed
```

**Quick Reference:**

| Metric | Estimate | Rule |
|--------|----------|------|
| **RPS** | DAU × actions / 86400 × peak factor (3x) | Peak hours = 3x average |
| **Storage** | Requests × size × retention | Add 50% buffer |
| **Bandwidth** | RPS × response size × 8 (bits) | Account for peaks |
| **Cache** | 20% of working set | Pareto principle |
| **DB** | Storage × replication factor | Primary + 2 replicas = 3x |

---

# Priority 12 — Common System Design Problems

## URL Shortener (TinyURL)

**System Flow:**
```
Long URL → Hash (MD5/Base62) → Check DB (collision?) → Store → Return short URL
Short URL → Lookup DB → 301 Redirect → Long URL
```

**Design:**
```
API: POST /shorten {longUrl} → {shortUrl}
     GET /{shortCode} → 301 Redirect

DB: short_code (PK) | long_url | created_at | expiry

Scale: 100M URLs → 6 chars Base62 = 62^6 ≈ 56 billion combinations

Cache: Redis stores hot URLs (top 20% = 80% traffic)
```

## Rate Limiter

**System Flow:**
```
Request → Check Redis (counter for user/API key) → Within limit? → Process
                                      → Exceeded? → 429 Too Many Requests

Algorithms:
  Token Bucket: Tokens refill at fixed rate. Request consumes token.
  Sliding Window: Count requests in last N seconds.
  Fixed Window: Count requests in current window. Reset at boundary.
```

## Notification Service

**System Flow:**
```
Event → Queue (Kafka) → Workers → Fan out:
                              → Push (FCM/APNS) → Mobile
                              → Email (SendGrid) → Inbox
                              → SMS (Twilio) → Phone
                              → In-app (WebSocket) → Browser
```

## WhatsApp / Chat

**System Flow:**
```
User A sends message → WebSocket → Chat Server → Store in DB → Push to User B via WebSocket
                                                    → If B offline → Store in queue → Push when online

Presence: Heartbeat every 30s → Last seen timestamp
Delivery: Single tick (sent) → Double tick (delivered) → Blue tick (read)
```

## Instagram Feed

**System Flow:**
```
User posts → Fan out to followers:
  Pull model: User opens app → Fetch recent posts from followed users → Merge + sort → Display
  Push model: Post → Push to all followers' feeds → Store in feed cache → Instant display
  Hybrid: Push for active users (few followers), Pull for celebrities (millions of followers)
```

---

# Priority 13 — Design Evaluation

**Always evaluate against:**

| Criteria | Check | Question |
|----------|-------|----------|
| **Scalability** | Handle 10x growth? | Sharding, caching, load balancing |
| **Availability** | Survive failures? | Replicas, failover, redundancy |
| **Reliability** | Correct under failures? | Idempotency, retries, circuit breaker |
| **Consistency** | Right consistency model? | Strong for payments, eventual for social |
| **Fault Tolerance** | Graceful degradation? | Fallbacks, circuit breakers |
| **Security** | Auth, encryption, rate limiting? | JWT, HTTPS, API keys |
| **Performance** | Latency acceptable? | Caching, CDN, async processing |
| **Cost** | Affordable at scale? | Managed services, right-sizing |
| **Maintainability** | Easy to modify? | Microservices, clean APIs |
| **Extensibility** | Easy to add features? | Event-driven, plugin architecture |
| **Observability** | Can we debug issues? | Logs, metrics, traces, alerts |

---

# Common Interview Scenarios — Quick Answers

| Question | One-Liner |
|----------|-----------|
| HLD vs LLD | HLD = architecture, scale, services. LLD = classes, patterns, code |
| Horizontal vs Vertical | Horizontal = more machines (fault tolerant). Vertical = bigger machine (limit) |
| Availability vs Reliability | Available = up. Reliable = correct + no data loss |
| Strong vs Eventual | Strong = all see latest. Eventual = temporary staleness OK |
| CAP Theorem | Partition happens → Pick Consistency (CP) or Availability (AP). Can't have all three |
| Load Balancer vs Reverse Proxy | LB = distribute traffic. RP = route by content, SSL, cache |
| L4 vs L7 | L4 = TCP/UDP, fast. L7 = HTTP, smart routing |
| Cache Aside vs Write Through | Aside = lazy, simple. Write Through = eager, consistent |
| Why Redis? | In-memory, microseconds, data structures, pub/sub |
| Replication vs Sharding | Replication = copy data (read scale). Sharding = split data (write scale) |
| Queue vs Pub/Sub | Queue = one consumer. Pub/Sub = many consumers |
| REST vs gRPC | REST = HTTP + JSON, human-readable. gRPC = HTTP/2 + Protobuf, fast, internal |
| REST vs WebSocket | REST = request-response. WebSocket = persistent, bidirectional |
| Circuit Breaker | Open after failures → fast fail → test recovery → close if healthy |
| Idempotency | Same request = same result. Safe to retry |
| Design URL Shortener | Hash → store → cache hot URLs → 301 redirect |
| Design Rate Limiter | Token bucket or sliding window in Redis |
| Design WhatsApp | WebSocket for real-time, fan-out for delivery, presence heartbeat |
| Design Instagram | Hybrid push/pull feed, CDN for images, cache for hot content |
| Estimate storage | DAU × actions × size × retention × buffer |

---

# Quick Reference: When to Use What

| Problem | Solution |
|---------|----------|
| Scale reads | Read replicas, caching |
| Scale writes | Sharding, queue-based async |
| Reduce latency | CDN, caching, connection pooling |
| Handle spikes | Message queues, auto-scaling |
| Real-time updates | WebSockets, SSE |
| Internal service communication | gRPC |
| Public API | REST + JSON |
| Prevent cascade failures | Circuit breaker, bulkhead, timeout |
| Retry failed requests | Exponential backoff + idempotency |
| Session management | Redis |
| Media storage | Object storage (S3) |
| Analytics | OLAP/data warehouse |
| Event-driven architecture | Kafka, message queues |
| Authentication | JWT, OAuth 2.0 |
| Rate limiting | Redis + token bucket |

---

# Final Tip: Interview Flow for System Design

```
1. CLARIFY (5 min)      → Functional + non-functional requirements
2. ESTIMATE (5 min)     → DAU, RPS, storage, bandwidth
3. HIGH-LEVEL (10 min)  → API, DB schema, basic architecture diagram
4. DEEP DIVE (15 min)   → Scaling, caching, messaging, reliability, trade-offs
5. EVALUATE (5 min)     → Bottlenecks, failure modes, future extensions
```

> **Always remember:** System design is about trade-offs. There's no perfect solution. Explain WHY you chose X over Y.

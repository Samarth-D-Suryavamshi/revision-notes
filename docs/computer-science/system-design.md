
# System Design — Interview Notes (System-First Approach)

---

## 1. SYSTEM DESIGN FUNDAMENTALS

**What is System Design?**
→ Process of defining architecture, components, interfaces, and data to satisfy requirements.

**HLD vs LLD:**
| HLD (High-Level) | LLD (Low-Level) |
|-------------------|-----------------|
| Architecture, components, data flow | Class design, APIs, algorithms |
| "What" and "Why" | "How" |
| Diagrams, trade-offs | Code, database schema |

**How to begin a system design interview:**
```
1. Clarify Requirements
   - Functional: What should it do?
   - Non-functional: Scale? Latency? Availability?

2. Capacity Estimation
   - DAU, QPS, storage, bandwidth

3. API Design
   - Endpoints, request/response

4. Database Design
   - Schema, read/write ratio

5. High-Level Architecture
   - Load balancer, app servers, DB, cache

6. Deep Dive
   - Scaling, caching, messaging, trade-offs

7. Bottlenecks & Monitoring
   - Single points of failure, observability
```

---

## 2. SCALABILITY

**Vertical Scaling (Scale Up):**
→ Bigger machine. More CPU/RAM/disk.
- Pros: Simple, no code changes
- Cons: Hardware limits, single point of failure, expensive

**Horizontal Scaling (Scale Out):**
→ More machines. Add servers.
- Pros: Unlimited scale, fault tolerance, cost-effective
- Cons: Complexity, distributed system challenges

**Why large companies prefer horizontal?**
→ Commodity hardware, no single point of failure, elastic scaling.

**Stateless Services:**
→ Any server can handle any request. No session stored locally. Session in Redis/DB.

---

## 3. AVAILABILITY

**Uptime:** % time system is operational. 99.9% (3 nines) = 8.76h downtime/year.

**High Availability (HA):**
→ System continues operating despite failures.

**Redundancy:**
→ Duplicate components. If one fails, backup takes over.

**Failover:**
```
Active Server A  ----fail---->  Standby Server B
     (serving)                    (takes over)
```

**Active-Active:** Both servers serving simultaneously. Load balanced.
**Active-Passive:** One active, one standby. Switch on failure.

---

## 4. RELIABILITY

**Reliability vs Availability:**
| Reliability | Availability |
|-------------|--------------|
| Correctness of operation | Uptime |
| Data not corrupted | System is up |
| Every request handled correctly | System responds |

**Fault Tolerance:**
→ System continues working when components fail.

**Durability:**
→ Data survives crashes. WAL, replication, backups.

**Retry Mechanisms:**
```
Request -> Fail -> Wait 1s -> Retry -> Fail -> Wait 2s -> Retry -> Success
```
→ Exponential backoff + jitter to avoid thundering herd.

**Idempotency:**
→ Same request = same result. Safe to retry. Idempotency key in header.

**Disaster Recovery:**
→ Backups, multi-region, RPO (data loss tolerance), RTO (downtime tolerance).

---

## 5. CONSISTENCY

**Strong Consistency:**
→ Read always returns latest write. All nodes agree.
→ Cost: Slower, lower availability.

**Eventual Consistency:**
→ Read may return stale data, but converges to latest.
→ Cost: Faster, higher availability.

**Read-after-Write:**
→ User writes, then immediately reads. Must see their write.

**Session Consistency:**
→ Read-after-write guaranteed within same session.

**Why social media uses eventual consistency?**
→ 1B+ users, global distribution, availability > perfect consistency. Stale likes/comments acceptable briefly.

---

## 6. CAP THEOREM

**In a distributed system, pick 2 of 3:**
```
         Consistency
            /    \
           /      \
    Partition ---- Availability
       Tolerance
```

| Choice | System | Example |
|--------|--------|---------|
| CP | Consistent + Partition-tolerant | ZooKeeper, etcd, HBase |
| AP | Available + Partition-tolerant | Cassandra, DynamoDB, DNS |
| CA | Consistent + Available | Single-node databases (not truly distributed) |

**Can you have all 3?**
→ No. Network partitions happen. Must choose consistency or availability.

**PACELC Theorem:**
→ If partitioned (P), choose A or C. Else (E), choose latency (L) or consistency (C).

---

## 7. LOAD BALANCER

**L4 (Transport Layer):**
→ TCP/UDP level. Routes by IP + port. Fast, less intelligent.
→ Examples: AWS NLB, HAProxy (L4 mode)

**L7 (Application Layer):**
→ HTTP level. Routes by URL, header, cookie. Smart, slower.
→ Examples: Nginx, AWS ALB, Envoy

**Algorithms:**
| Algorithm | How It Works |
|-----------|-------------|
| Round Robin | A -> B -> C -> A |
| Least Connections | Send to server with fewest active connections |
| Weighted Round Robin | A (weight 3) gets 3x traffic of B (weight 1) |
| IP Hash | Same client IP -> same server (session stickiness) |
| Least Response Time | Send to fastest-responding server |

**Health Checks:**
→ LB periodically pings backends. Unhealthy removed from pool.

**Session Persistence (Sticky Sessions):**
→ Same user -> same server. Use cookie or IP hash.

---

## 8. REVERSE PROXY

**What:** Sits in front of servers. Client talks to proxy, proxy talks to backend.

```
Client -> Reverse Proxy (Nginx) -> App Server 1
                                 -> App Server 2
                                 -> App Server 3
```

**Functions:**
- Request routing
- SSL termination (HTTPS -> HTTP to backends)
- Caching
- Compression (gzip)
- Rate limiting

**Reverse Proxy vs Load Balancer:**
| Reverse Proxy | Load Balancer |
|---------------|---------------|
| Can be LB | Specifically distributes load |
| Also caches, SSL, security | Primarily traffic distribution |
| Nginx is both | AWS ALB/NLB is LB |

**Reverse Proxy vs Forward Proxy:**
| Forward Proxy | Reverse Proxy |
|---------------|---------------|
| Client side | Server side |
| Hides client | Hides server |
| Corporate proxy, VPN | Nginx, Cloudflare |

---

## 9. API GATEWAY

**What:** Single entry point for all client requests.

```
Client -> API Gateway -> Auth Service
                     -> User Service
                     -> Order Service
                     -> Payment Service
```

**Responsibilities:**
- Authentication (who are you?)
- Authorization (what can you do?)
- Rate limiting (prevent abuse)
- Request routing (to correct microservice)
- API aggregation (combine multiple service responses)
- SSL termination
- Request/response transformation

---

## 10. CDN (CONTENT DELIVERY NETWORK)

**How it works:**
```
User in Mumbai requests image
    |
DNS routes to nearest edge server (Mumbai POP)
    |
Cache hit? -> Serve immediately (few ms)
Cache miss? -> Fetch from origin -> Cache -> Serve next user
```

**Edge Servers:** Cache servers geographically distributed.

**Static vs Dynamic Content:**
- Static: Images, CSS, JS (cache heavily, long TTL)
- Dynamic: API responses (cache lightly, short TTL, or not at all)

**Cache Invalidation:**
→ Purge specific URLs or patterns when content updates.

**Why Netflix uses CDN?**
→ Reduces latency (serve from nearby), reduces origin load, handles traffic spikes.

**CDN vs Reverse Proxy:**
| CDN | Reverse Proxy |
|-----|---------------|
| Geographically distributed | Usually single location |
| Optimized for static content | General purpose |
| Akamai, Cloudflare, AWS CloudFront | Nginx, HAProxy |

---

## 11. CACHING FUNDAMENTALS

**Why Cache?**
→ Reduce DB load, reduce latency, handle read-heavy workloads.

**Cache Hit:** Data found in cache. Fast.
**Cache Miss:** Data not in cache. Fetch from DB, store in cache.

**Cache Eviction:** Remove old data when cache full.

---

## 12. REDIS

**Why Redis instead of database?**
→ In-memory = microsecond latency. DB = millisecond latency.

**Why Redis fast?**
→ In-memory, single-threaded (no context switching), C implementation, efficient data structures.

**Data Structures:**
- String, List, Set, Sorted Set, Hash, Bitmap, HyperLogLog, Stream, Geo

**Persistence (optional):**
- RDB: Periodic snapshots
- AOF: Append-only log of every write

**Pub/Sub:**
→ Publisher sends to channel. All subscribers receive. Fire-and-forget.

**Distributed Cache:**
→ Redis Cluster shards data across nodes.

---

## 13. CACHE STRATEGIES

```
CACHE ASIDE (Lazy Loading):
  App checks cache -> Miss -> Fetch from DB -> Write to cache -> Return
  App checks cache -> Hit -> Return
  Write: Update DB, invalidate cache
  Pros: Simple, cache only hot data
  Cons: First read slow, stale data risk

READ THROUGH:
  App asks cache -> Miss -> Cache fetches from DB -> Returns to app
  Pros: Transparent to app
  Cons: Cache library complexity

WRITE THROUGH:
  App writes -> Cache updated -> DB updated (synchronous)
  Pros: Cache always fresh
  Cons: Write latency (2 writes)

WRITE AROUND:
  App writes -> DB only. Cache updated on next read.
  Pros: Fast writes
  Cons: First read after write is slow

WRITE BACK (Write Behind):
  App writes -> Cache updated -> Async write to DB
  Pros: Fastest writes
  Cons: Data loss risk if cache fails before DB write
```

**Cache Aside vs Write Through:**
→ Cache Aside: App manages cache. Write Through: Cache manages DB sync.

---

## 14. CACHE EVICTION

| Policy | How It Works |
|--------|-------------|
| LRU | Evict least recently used |
| LFU | Evict least frequently used |
| FIFO | Evict first in |
| TTL | Evict when time expires |

---

## 15. DATABASE SCALING

### Replication
```
Write -> Primary -> Async replication -> Replica 1 (read)
                                    -> Replica 2 (read)
```
**Why Read Replicas?**
→ Scale reads, reduce primary load, disaster recovery.

**Synchronous vs Asynchronous:**
| Sync | Async |
|------|-------|
| Primary waits for replica ACK | Fire and forget |
| Zero data loss | Replication lag |
| Slower writes | Faster writes |

**Replication vs Backup:**
| Replication | Backup |
|-------------|--------|
| Real-time, continuous | Point-in-time snapshot |
| For availability | For recovery |
| Replica is live | Backup is offline |

### Sharding
→ Split data across multiple databases.

```
User ID 1-1000    -> Shard 1
User ID 1001-2000 -> Shard 2
User ID 2001-3000 -> Shard 3
```

**Shard Key:**
→ Column determining which shard stores data. Choose high cardinality, even distribution.

**Hot Shard:**
→ One shard gets disproportionate traffic. Fix: better shard key, rebalancing.

**Rebalancing:**
→ Move data when shards grow unevenly or add new shards.

### Partitioning
| Type | How |
|------|-----|
| Range | time < '2024-01-01' -> partition 1 |
| Hash | hash(id) % N -> partition |
| List | region IN ('US', 'CA') -> partition 1 |

---

## 16. MESSAGING SYSTEMS

### Message Queue
```
Producer -> Queue -> Consumer 1
                 -> Consumer 2
                 -> Consumer 3
```
→ Decouples producer and consumer. Buffer for traffic spikes.

**Queue vs Pub/Sub:**
| Queue | Pub/Sub |
|-------|---------|
| One message -> one consumer | One message -> all subscribers |
| Work distribution | Broadcast |
| RabbitMQ, SQS | Kafka, Redis Pub/Sub |

**Why Message Queues?**
→ Decoupling, async processing, load leveling, reliability (persist until processed).

### Kafka
```
Producer -> Topic (Partition 1, Partition 2, Partition 3) -> Consumer Group
```
- Topics divided into partitions
- Consumers in group share partitions
- Ordered within partition, not across
- Durable: messages persisted to disk

---

## 17. STORAGE SYSTEMS

**File Storage:**
→ Hierarchical (folders/files). NFS, SMB.

**Block Storage:**
→ Raw disk blocks. Databases use this. AWS EBS.

**Object Storage:**
```
Bucket -> Object (data + metadata + unique ID)
```
→ Flat namespace, HTTP access, highly durable. AWS S3, Azure Blob.

**File vs Object Storage:**
| File | Object |
|------|--------|
| Hierarchical | Flat |
| POSIX operations | HTTP REST API |
| Limited metadata | Rich metadata |
| NFS | S3 |

**Why Object Storage for media?**
→ Infinite scale, HTTP access, CDN integration, cheap, durable (99.999999999%).

---

## 18. COMMUNICATION PROTOCOLS

### REST APIs
```
GET    /users       -> List users
GET    /users/123   -> Get user 123
POST   /users       -> Create user
PUT    /users/123   -> Update user 123
DELETE /users/123   -> Delete user 123
```

**Idempotency:**
- GET, PUT, DELETE: Idempotent (same result every time)
- POST: Not idempotent (creates new resource each time)

**Versioning:**
→ /v1/users, /v2/users. Header: Accept: application/vnd.api.v2+json

### WebSockets
```
Client -> HTTP Upgrade -> Server
[Persistent TCP connection established]
<-> Full duplex messages <->
```
→ Use: Chat, live notifications, gaming. Low latency, server push.

### gRPC
```
Service Definition (.proto)
    |
gRPC -> HTTP/2 -> Protocol Buffers (binary)
    |
Client Stub <-> Server
```

**REST vs gRPC:**
| REST | gRPC |
|------|------|
| HTTP/1.1 or HTTP/2 | HTTP/2 only |
| JSON/XML | Protobuf (binary, compact) |
| Human-readable | Not human-readable |
| Universal | Needs client library |
| Loose contract | Strict .proto contract |

**gRPC vs WebSockets:**
| gRPC | WebSockets |
|------|------------|
| RPC framework | Communication protocol |
| Request-response + streaming | Bi-directional streaming |
| Strongly typed | Any message format |
| Service definitions | No strict schema |

---

## 19. RELIABILITY PATTERNS

### Retry with Exponential Backoff
```
Attempt 1: Wait 1s
Attempt 2: Wait 2s
Attempt 3: Wait 4s
Attempt 4: Wait 8s
... + jitter (random) to prevent synchronized retries
```

### Circuit Breaker
```
CLOSED:  Requests pass through normally
    |
Failures > threshold
    |
OPEN:    Requests fail fast (no call to failing service)
    |
After timeout
    |
HALF-OPEN: Allow limited requests to test
    |
Success -> CLOSED
Failure -> OPEN
```
→ Prevents cascade failures. Failing service gets time to recover.

### Bulkhead
→ Isolate failures. If payment service fails, order service still works.
```
App -> Thread Pool A (Payment) -> Payment Service
    -> Thread Pool B (Orders)   -> Order Service
```

### Timeout
→ Don't wait forever. Fail fast.

### Idempotency
→ Idempotency key in header. Server stores processed keys. Duplicate detected, same response returned.

---

## 20. OBSERVABILITY

**Three Pillars:**
| Pillar | What | Example |
|--------|------|---------|
| **Logs** | Discrete events | "User 123 logged in at 10:00" |
| **Metrics** | Numeric data over time | CPU 80%, latency 50ms |
| **Traces** | Request path across services | A -> B -> C -> D |

**Health Checks:**
→ /health endpoint. LB uses to determine if instance is healthy.

**Monitoring:**
→ Collect metrics, visualize dashboards, set alerts.

**Tools:**
- Prometheus (metrics) + Grafana (visualization)
- ELK Stack (Elasticsearch, Logstash, Kibana) for logs
- Jaeger/Zipkin for tracing
- OpenTelemetry (unified observability)

---

## 21. SECURITY

**Authentication:** Who are you? (Login, JWT, OAuth)
**Authorization:** What can you do? (RBAC, permissions)

**JWT:**
```
Header.Payload.Signature
```
→ Signed token containing claims. Stateless. Client sends with every request.

**OAuth 2.0:**
```
User -> Authorize App -> Get Code -> Exchange for Token -> Access Resource
```
→ Delegated authorization. "App X can access my Google Calendar."

**HTTPS:**
→ HTTP + TLS encryption. Prevents eavesdropping, tampering.

**Rate Limiting:**
→ Prevent abuse. Token bucket, leaky bucket algorithms.

**API Keys:**
→ Identify client. Simple, but less secure than OAuth.

**Secrets Management:**
→ Don't hardcode passwords. Use Vault, AWS Secrets Manager, environment variables.

---

## 22. CAPACITY ESTIMATION

**Back-of-the-envelope calculations:**

```
Example: Twitter-like system

Users: 100M DAU
Posts per user per day: 5
-> 500M posts/day
-> 500M / 86400 ≈ 5,800 posts/second (peak ~3x = 17,400)

Timeline reads: 100M users * 20 timelines/day = 2B reads/day
-> 2B / 86400 ≈ 23,000 reads/second (peak ~70,000)

Storage per post: 1KB text + metadata
-> 500M * 1KB = 500GB/day
-> 500GB * 365 = 182TB/year

Images: 20% posts have image, 2MB each
-> 100M * 2MB = 200GB/day

Bandwidth:
-> Reads: 70,000 * 1KB = 70MB/s outbound
-> Images: 70,000 * 20% * 2MB = 28GB/s outbound (CDN handles)
```

**Key Numbers to Remember:**
| Unit | Value |
|------|-------|
| 1M requests/day | ~12 RPS average |
| 1B requests/day | ~12,000 RPS average |
| 1KB * 1B | 1TB |
| SSD read | ~0.1ms |
| Network same datacenter | ~0.5ms |
| Network cross-country | ~50-100ms |

---

## 23. COMMON SYSTEM DESIGNS

### URL Shortener (TinyURL)
```
Requirements:
- Shorten long URL -> short code
- Redirect short code -> original URL
- Custom aliases
- Analytics (optional)

Design:
Client -> API Gateway -> Load Balancer -> App Servers -> Cache (Redis)
                                                  |
                                            Database (NoSQL - high write)
                                                  |
                                            Analytics (Kafka + DW)

Algorithm:
- Hash original URL -> base62 encode -> 7 chars = 62^7 ≈ 3.5 trillion URLs
- Collision check: if exists, append counter
- Or: Pre-generate random keys, assign on demand

Capacity:
- 100M URLs/day = ~1,000 writes/second
- Read:write = 100:1 -> 100,000 reads/second
- Storage: 100M * 500 bytes = 50GB/day
```

### Rate Limiter
```
Requirements:
- Limit requests per user/IP per time window
- 100 requests/minute per user

Algorithms:
1. Token Bucket:
   - Bucket has capacity C, refills at rate R per second
   - Request takes 1 token. If empty, reject.
   - Pros: Allows bursts, smooth

2. Leaky Bucket:
   - Queue requests, process at fixed rate
   - Queue full -> reject
   - Pros: Smooth output rate

3. Fixed Window:
   - Count requests in time window
   - Reset at window boundary
   - Cons: Burst at boundary

4. Sliding Window:
   - Count requests in last N seconds
   - More accurate, more memory

Distributed:
- Redis stores counters
- Lua script for atomic increment + check
```

### Notification Service
```
Requirements:
- Send SMS, Email, Push notifications
- Support multiple providers (failover)
- Retry failed notifications
- Rate limiting per user

Design:
Client -> API Gateway -> App Server -> Message Queue (Kafka/RabbitMQ)
                                           |
                                    Workers (Consumer Group)
                                           |
                                    Provider 1 (Primary)
                                    Provider 2 (Fallback)
                                    Provider 3 (Fallback)

Retry:
- Failed -> Dead Letter Queue -> Retry with backoff
- Max retries -> Alert ops team
```

### WhatsApp / Chat
```
Requirements:
- 1-on-1 and group messaging
- Online/offline status
- Message delivery receipts
- Media sharing

Design:
Client A -> Load Balancer -> Chat Server (WebSocket)
                                |
                        Message -> Queue -> Chat Server B -> Client B
                                |
                        Store in Database (messages)
                        Update Cache (online status)

Offline Messages:
- Store in DB
- Push notification via FCM/APNS
- Client reconnects -> fetch missed messages

Group Chat:
- Fan-out: Message -> Queue -> All group members' inboxes
- Or: Pull model - client fetches group messages on open
```

### Instagram Feed
```
Requirements:
- Post image/video with caption
- Follow/unfollow users
- Timeline/feed of followed users
- Like, comment

Design:
Upload: Client -> CDN -> Object Storage (S3)
        Metadata -> App Server -> Database (PostgreSQL)

Feed Generation:
Fan-out on Write (Push):
- User posts -> Write to all followers' feeds (precompute)
- Pros: Fast read
- Cons: Slow write for celebs (1M followers)

Fan-out on Read (Pull):
- User opens app -> Fetch posts from all followed users
- Pros: Fast write
- Cons: Slow read, complex query

Hybrid:
- Normal users: Push (precompute feed)
- Celebrities: Pull (on-demand, followers fetch celeb posts separately)

Feed Service:
Client -> CDN -> Load Balancer -> Feed Service -> Cache (Redis, user's feed)
                                              |
                                        Post Service -> Database
```

---

## COMPLETE WORKFLOW: "How does a request flow through a system?"

```
User opens instagram.com
    |
1. DNS Resolution
   - Browser queries DNS -> Gets CDN edge IP
    |
2. CDN
   - Static assets (JS, CSS, images) served from edge
   - Cache hit? Return immediately
   - Cache miss? Fetch from origin
    |
3. Load Balancer
   - HTTPS terminated at LB
   - Route to healthy app server (least connections)
    |
4. API Gateway
   - Authenticate JWT token
   - Rate limit check
   - Route to Feed Service
    |
5. Feed Service
   - Check Redis cache for user's feed
   - Cache miss? Query Post Service
    |
6. Post Service
   - Fetch posts from followed users
   - Query database (sharded by user_id)
   - Return to Feed Service -> Cache -> User
    |
7. Database
   - Read replicas handle read queries
   - Primary handles writes (new posts)
    |
8. Background
   - New post -> Kafka -> Fan-out workers -> Update followers' caches
```

---

## COMPLETE WORKFLOW: "How does caching work in a read-heavy system?"

```
User requests product details
    |
1. App Server checks Redis
   - Hit? Return product (1ms)
   - Miss? Continue to DB
    |
2. Query Database
   - Fetch product from PostgreSQL (10ms)
    |
3. Write to Redis
   - Store product with TTL (e.g., 1 hour)
    |
4. Return to user
    |
5. Next request (same product)
   - Redis hit -> 1ms response
   - DB load reduced
    |
6. Product updated by admin
   - Write to DB
   - Invalidate Redis key (or update cache)
   - Next read fetches fresh data
```

---

## QUICK ANSWER CHEAT SHEET

| Question | Answer |
|----------|--------|
| HLD vs LLD? | HLD = architecture/what/why; LLD = code/how |
| Horizontal vs Vertical scaling? | Horizontal = more machines; Vertical = bigger machine |
| Why horizontal preferred? | No SPOF, unlimited scale, commodity hardware |
| What is HA? | System continues despite failures |
| Active-Active vs Active-Passive? | Both serve vs one standby |
| Reliability vs Availability? | Reliability = correctness; Availability = uptime |
| Strong vs Eventual consistency? | Strong = always latest; Eventual = converges over time |
| Why social media uses eventual? | Availability > perfect consistency, stale data acceptable |
| CAP theorem? | Pick 2 of Consistency, Availability, Partition Tolerance |
| Can you have all 3? | No. Network partitions force C or A choice |
| L4 vs L7 LB? | L4 = TCP/IP fast; L7 = HTTP smart routing |
| Reverse Proxy vs LB? | RP = routes + cache + SSL; LB = distributes load |
| Reverse vs Forward proxy? | Forward hides client; Reverse hides server |
| API Gateway functions? | Auth, rate limit, routing, aggregation, SSL |
| Why CDN? | Reduce latency, origin load, handle spikes |
| Cache Aside vs Write Through? | Aside = app manages; Through = cache syncs with DB |
| Cache Aside vs Write Back? | Aside = DB source of truth; Back = cache source of truth (risky) |
| Why Redis fast? | In-memory, single-threaded, C implementation |
| Redis persistence? | RDB snapshots + AOF log |
| Read Replicas? | Scale reads, reduce primary load, DR |
| Sync vs Async replication? | Sync = consistent, slow; Async = fast, lag risk |
| Replication vs Backup? | Replication = real-time live; Backup = point-in-time offline |
| What is shard key? | Determines which shard stores data |
| Hot shard? | One shard gets too much traffic |
| Queue vs Pub/Sub? | Queue = one consumer; Pub/Sub = all subscribers |
| Why message queues? | Decoupling, async, load leveling, reliability |
| File vs Object storage? | File = hierarchical POSIX; Object = flat HTTP, scalable |
| Why object for media? | Infinite scale, HTTP, CDN, cheap, durable |
| REST idempotent methods? | GET, PUT, DELETE idempotent; POST not |
| WebSockets use case? | Chat, live updates, gaming, server push |
| REST vs gRPC? | REST = HTTP+JSON universal; gRPC = HTTP/2+protobuf fast |
| gRPC vs WebSockets? | gRPC = RPC framework; WebSockets = protocol |
| Circuit breaker states? | Closed -> Open -> Half-Open -> Closed/Open |
| Why circuit breaker? | Prevent cascade failures, give recovery time |
| Bulkhead pattern? | Isolate failures per resource pool |
| Exponential backoff? | Retry wait doubles each attempt + jitter |
| Idempotency key? | Header to detect duplicates, safe retries |
| Observability pillars? | Logs, Metrics, Traces |
| JWT structure? | Header.Payload.Signature |
| OAuth 2.0 flow? | Authorize -> Code -> Token -> Access Resource |
| Rate limiting algorithms? | Token bucket, leaky bucket, fixed/sliding window |
| How to estimate QPS? | DAU * actions/day / 86400 * peak factor (2-3x) |
| How to estimate storage? | Records/day * size * retention |
| URL shortener algorithm? | Hash + base62, or pre-generated random keys |
| Rate limiter algorithm? | Token bucket (allows bursts) or sliding window (accurate) |
| Chat system architecture? | WebSocket -> Chat Server -> Queue -> DB + Push |
| Feed push vs pull? | Push = precompute (fast read); Pull = on-demand (fast write) |
| Instagram hybrid feed? | Normal users push, celebrities pull |
| How to handle celebrity posts? | Separate fan-out, on-demand fetch |
| How to prevent duplicate requests? | Idempotency keys, deduplication |
| How to handle server failures? | Health checks, auto-failover, replication |
| How to monitor distributed system? | Logs + Metrics + Traces + Alerts |
| What is RPO? | Recovery Point Objective - max acceptable data loss |
| What is RTO? | Recovery Time Objective - max acceptable downtime |
| What is SLA? | Service Level Agreement - uptime guarantee |
| What is SLO? | Service Level Objective - internal performance target |
| What is SLI? | Service Level Indicator - measurable metric |
| What is blue-green deployment? | Two environments, instant switch |
| What is canary release? | Route small % to new version |
| What is feature flag? | Toggle features without deploy |
| What is chaos engineering? | Intentionally break to test resilience |
| What is load testing? | Test performance under load |
| What is stress testing? | Test breaking point |
| What is soak testing? | Test over extended period |
| What is a single point of failure? | Component whose failure brings down system |
| How to eliminate SPOF? | Redundancy, replication, failover |
| What is a health check? | Endpoint to verify service health |
| What is a readiness probe? | Can instance receive traffic? |
| What is a liveness probe? | Is instance still alive? |
| What is graceful shutdown? | Finish in-flight requests before stopping |
| What is a rolling deployment? | Update instances one by one |
| What is database migration? | Schema changes without downtime |
| What is a dark launch? | Deploy to production, not visible to users |
| What is A/B testing? | Compare two versions |
| What is multi-region? | Deploy across geographic regions |
| What is geo-routing? | Route to nearest region |
| What is a cold start? | First request to new instance = slow |
| What is connection pooling? | Reuse DB connections |
| What is a thread pool? | Reuse threads for tasks |
| What is backpressure? | Slow down producer when consumer overwhelmed |
| What is a dead letter queue? | Store failed messages for later analysis |
| What is event sourcing? | Store events, derive state |
| What is CQRS? | Separate read and write models |
| What is saga pattern? | Long transaction as sequence of local ones |
| What is two-phase commit? | Prepare + Commit, atomic across services |
| What is eventual consistency in practice? | Read replica lag, cache stale data |
| What is a distributed transaction? | Transaction spanning multiple services |
| What is compensating transaction? | Undo a completed step |
| What is an outbox pattern? | Write event to DB, then publish |
| What is CDC? | Capture DB changes as events |
| What is Debezium? | CDC tool |
| What is schema registry? | Manage Avro/Protobuf/JSON schemas |
| What is a service mesh? | Sidecar proxies for service communication |
| What is Istio? | Service mesh implementation |
| What is Envoy? | Proxy for service mesh |
| What is Kubernetes? | Container orchestration |
| What is Docker? | Container runtime |
| What is a container? | Lightweight isolated environment |
| What is serverless? | Run code without managing servers |
| What is AWS Lambda? | Serverless compute |
| What is FaaS? | Function as a Service |
| What is PaaS? | Platform as a Service |
| What is IaaS? | Infrastructure as a Service |
| What is SaaS? | Software as a Service |
| What is multi-tenancy? | Multiple customers share infrastructure |
| What is tenant isolation? | Prevent cross-tenant data access |
| What is data residency? | Store data in specific geographic region |
| What is GDPR? | EU data privacy regulation |
| What is HIPAA? | US healthcare data protection |
| What is SOC2? | Security compliance standard |
| What is PCI DSS? | Payment card security standard |
| What is encryption at rest? | Encrypt stored data |
| What is encryption in transit? | Encrypt network traffic |
| What is mTLS? | Mutual TLS, both sides authenticate |
| What is a WAF? | Web Application Firewall |
| What is DDoS protection? | Mitigate distributed denial of service |
| What is a botnet? | Network of compromised computers |
| What is a man-in-the-middle attack? | Intercept communication |
| What is SQL injection? | Malicious SQL in input |
| What is XSS? | Cross-site scripting |
| What is CSRF? | Cross-site request forgery |
| What is CORS? | Cross-origin resource sharing |
| What is a zero-trust architecture? | Never trust, always verify |
| What is a bastion host? | Jump server for secure access |
| What is a VPN? | Virtual private network |
| What is a VPC? | Virtual private cloud |
| What is a subnet? | Network segment |
| What is NAT? | Network address translation |
| What is a firewall? | Filter network traffic |
| What is a security group? | Cloud firewall rules |
| What is IAM? | Identity and access management |
| What is RBAC? | Role-based access control |
| What is ABAC? | Attribute-based access control |
| What is MFA? | Multi-factor authentication |
| What is SSO? | Single sign-on |
| What is SAML? | Security assertion markup language |
| What is OIDC? | OpenID Connect |
| What is LDAP? | Directory access protocol |
| What is Kerberos? | Network authentication protocol |
| What is a certificate authority? | Issue SSL certificates |
| What is a self-signed certificate? | Certificate signed by itself |
| What is certificate pinning? | Hardcode expected certificate |
| What is HSTS? | HTTP strict transport security |
| What is CSP? | Content security policy |
| What is SRI? | Subresource integrity |
| What is a honeypot? | Decoy system to detect attacks |
| What is intrusion detection? | Monitor for malicious activity |
| What is intrusion prevention? | Block malicious activity |
| What is SIEM? | Security information and event management |
| What is SOAR? | Security orchestration, automation, response |
| What is a vulnerability scan? | Find security weaknesses |
| What is penetration testing? | Simulate attacks |
| What is red teaming? | Adversarial security testing |
| What is blue teaming? | Defensive security operations |
| What is purple teaming? | Collaborative offense + defense |
| What is threat modeling? | Identify and mitigate threats |
| What is STRIDE? | Threat classification: Spoofing, Tampering, Repudiation, Info disclosure, DoS, Elevation |
| What is DREAD? | Risk rating: Damage, Reproducibility, Exploitability, Affected users, Discoverability |
| What is CVSS? | Common vulnerability scoring system |
| What is CVE? | Common vulnerabilities and exposures |
| What is CWE? | Common weakness enumeration |
| What is OWASP? | Open web application security project |
| What is OWASP Top 10? | Most critical web app security risks |
| What is a security champion? | Developer focused on security |
| What is shift-left security? | Security early in development |
| What is DevSecOps? | Security in DevOps pipeline |
| What is SAST? | Static application security testing |
| What is DAST? | Dynamic application security testing |
| What is IAST? | Interactive application security testing |
| What is SCA? | Software composition analysis |
| What is secret scanning? | Find hardcoded secrets |
| What is dependency scanning? | Check for vulnerable dependencies |
| What is container scanning? | Check for image vulnerabilities |
| What is infrastructure scanning? | Check cloud config for misconfigurations |
| What is compliance scanning? | Check against standards |
| What is a security baseline? | Minimum security requirements |
| What is a security policy? | Rules and guidelines |
| What is an incident response plan? | Steps for security incidents |
| What is forensics? | Investigate security incidents |
| What is evidence preservation? | Maintain integrity of evidence |
| What is chain of custody? | Document evidence handling |
| What is a post-mortem? | Analyze incident, prevent recurrence |
| What is a runbook? | Step-by-step operational procedures |
| What is a playbook? | Automated or semi-automated response |
| What is chaos engineering? | Intentionally inject failures |
| What is game day? | Practice incident response |
| What is a fire drill? | Test emergency procedures |
| What is business continuity? | Maintain operations during disruption |
| What is disaster recovery? | Recover from catastrophic failure |
| What is a backup strategy? | 3-2-1 rule: 3 copies, 2 media, 1 offsite |
| What is archival? | Long-term storage |
| What is data lifecycle management? | Manage data from creation to deletion |
| What is data classification? | Label data by sensitivity |
| What is data masking? | Hide sensitive data |
| What is tokenization? | Replace sensitive data with token |
| What is anonymization? | Remove identifying information |
| What is pseudonymization? | Replace identifiers with pseudonyms |
| What is differential privacy? | Add noise to protect individual data |
| What is homomorphic encryption? | Compute on encrypted data |
| What is zero-knowledge proof? | Prove without revealing |
| What is a blockchain? | Distributed immutable ledger |
| What is a smart contract? | Self-executing code on blockchain |
| What is a consensus algorithm? | Agreement in distributed systems |
| What is proof of work? | Mining, energy-intensive |
| What is proof of stake? | Validator-based, energy-efficient |
| What is a distributed ledger? | Shared database across nodes |
| What is a cryptocurrency? | Digital currency on blockchain |
| What is a stablecoin? | Pegged to fiat currency |
| What is DeFi? | Decentralized finance |
| What is an NFT? | Non-fungible token |
| What is Web3? | Decentralized internet |
| What is a DAO? | Decentralized autonomous organization |
| What is a DApp? | Decentralized application |
| What is IPFS? | Interplanetary file system |
| What is a content hash? | Address content by hash |
| What is a Merkle tree? | Hash tree for integrity verification |
| What is a bloom filter? | Probabilistic membership test |
| What is a consistent hash? | Distribute keys evenly, minimal rehash on change |
| What is a rendezvous hash? | Highest score wins assignment |
| What is jump consistent hash? | Fast, minimal memory consistent hash |
| What is a virtual node? | Multiple points per physical node in consistent hash |
| What is a gossip protocol? | Spread information peer-to-peer |
| What is SWIM? | Scalable weakly-consistent infection-style membership |
| What is Raft? | Consensus algorithm, leader election |
| What is Paxos? | Consensus algorithm, proven correct |
| What is ZAB? | ZooKeeper atomic broadcast |
| What is Viewstamped Replication? | Primary-backup replication |
| What is Multi-Paxos? | Optimized Paxos for log replication |
| What is Fast Paxos? | Reduce latency in Paxos |
| What is EPaxos? | Leaderless consensus |
| What is Flexible Paxos? | Weaken quorum requirements |
| What is a quorum? | Majority vote |
| What is a write quorum? | W + R > N for strong consistency |
| What is a read quorum? | Minimum reads for consistency |
| What is anti-entropy? | Repair inconsistent replicas |
| What is read repair? | Fix inconsistencies on read |
| What is hinted handoff? | Store write for failed node, deliver later |
| What is Merkle tree sync? | Efficiently compare replica state |
| What is vector clock? | Track causality in distributed systems |
| What is a Lamport timestamp? | Logical clock for ordering |
| What is a Happens-Before relation? | Causal ordering of events |
| What is total order? | All events have defined order |
| What is partial order? | Some events concurrent |
| What is linearizability? | Strong consistency, real-time order |
| What is serializability? | Equivalent to some serial execution |
| What is snapshot isolation? | Read consistent snapshot |
| What is read committed? | Read only committed data |
| What is repeatable read? | Same read returns same data |
| What is write skew? | Anomaly in snapshot isolation |
| What is phantom read? | New rows appear on re-read |
| What is lost update? | Two writes overwrite each other |
| What is a dirty read? | Read uncommitted data |
| What is a fuzzy read? | Non-repeatable read |
| What is optimistic concurrency? | Check on commit |
| What is pessimistic concurrency? | Lock on access |
| What is MVCC? | Multi-version concurrency control |
| What is a lock manager? | Manage database locks |
| What is deadlock detection? | Find and break deadlocks |
| What is deadlock prevention? | Order locks to prevent cycles |
| What is two-phase locking? | Growing + shrinking phases |
| What is strict 2PL? | Hold all locks until commit |
| What is rigorous 2PL? | Hold all locks until end |
| What is a lock escalation? | Row -> page -> table lock |
| What is a latch? | Lightweight lock |
| What is a spinlock? | Busy-wait lock |
| What is a mutex? | Mutual exclusion lock |
| What is a semaphore? | Counting lock |
| What is a read-write lock? | Multiple readers or one writer |
| What is a condition variable? | Wait for condition |
| What is a barrier? | Synchronize multiple threads |
| What is a countdown latch? | Wait for N events |
| What is a cyclic barrier? | Reusable barrier |
| What is a Phaser? | Java flexible barrier |
| What is a StampedLock? | Java optimistic read lock |
| What is a ReentrantLock? | Java explicit lock |
| What is a ReentrantReadWriteLock? | Java RW lock |
| What is a ConcurrentHashMap? | Thread-safe hash map |
| What is a CopyOnWriteArrayList? | Thread-safe list |
| What is a BlockingQueue? | Thread-safe queue |
| What is a SynchronousQueue? | Direct handoff queue |
| What is a DelayQueue? | Delayed element queue |
| What is a PriorityBlockingQueue? | Priority queue |
| What is a LinkedTransferQueue? | Transfer queue |
| What is a ForkJoinPool? | Work-stealing thread pool |
| What is a CompletableFuture? | Async computation |
| What is a reactive stream? | Async data stream |
| What is backpressure in reactive? | Handle overflow |
| What is Project Reactor? | Java reactive library |
| What is RxJava? | Java reactive extensions |
| What is Akka? | Actor model framework |
| What is an actor? | Concurrent unit with mailbox |
| What is a mailbox? | Actor message queue |
| What is actor supervision? | Handle actor failures |
| What is let-it-crash? | Restart failed actors |
| What is Erlang? | Actor model language |
| What is Elixir? | Erlang VM language |
| What is OTP? | Open Telecom Platform |
| What is a gen_server? | Generic server behavior |
| What is a gen_fsm? | Generic finite state machine |
| What is a supervisor tree? | Hierarchical fault tolerance |
| What is a worker? | Process that does work |
| What is a supervisor? | Process that monitors workers |
| What is a restart strategy? | One-for-one, one-for-all, rest-for-one |
| What is a max restart intensity? | Limit restart frequency |
| What is a circuit breaker in Erlang? | Stop calling failing service |
| What is a bulkhead in Erlang? | Isolate failures |
| What is a timeout in Erlang? | Limit wait time |
| What is a retry in Erlang? | Try again |
| What is idempotency in Erlang? | Safe retries |

---

## SKIP THESE (Unless Senior Distributed Systems Role)

Raft/Paxos internals, distributed transaction protocols (2PC/3PC), vector clocks, CRDTs, consistent hashing implementation, gossip protocol implementation, Kubernetes internals, service mesh internals, GFS/HDFS implementation, consensus algorithm proofs

---

**Revision Order:** System Design Fundamentals -> Scalability -> Availability -> Reliability -> Consistency -> CAP -> Load Balancer -> Reverse Proxy -> API Gateway -> CDN -> Redis -> Cache Strategies -> Replication -> Sharding -> Message Queues -> REST -> WebSockets -> gRPC -> Reliability Patterns -> Capacity Estimation -> TinyURL -> Rate Limiter -> Notification Service -> WhatsApp -> Instagram Feed

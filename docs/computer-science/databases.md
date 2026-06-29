
# Databases - Interview Notes (System-First Approach)

---

## 1. DATABASE FUNDAMENTALS

**What is a Database?**
Organized collection of data with efficient retrieval, modification, and management.

**DBMS vs RDBMS:**
| DBMS | RDBMS |
|------|-------|
| Any data model (hierarchical, network) | Relational model only |
| No strict schema | Tables, rows, columns |
| No built-in relationships | Foreign keys enforce relationships |
| Examples: MongoDB, Redis | Examples: PostgreSQL, MySQL |

**Why databases over files?**
Concurrent access, ACID guarantees, indexing, query language, security, scalability.

**Schema:** Blueprint defining tables, columns, types, constraints.

**Types:**
- Relational: Tables, SQL, ACID (PostgreSQL, MySQL)
- Document: JSON documents, flexible schema (MongoDB)
- Key-Value: Simple lookup (Redis, DynamoDB)
- Column-Family: Wide columns, analytics (Cassandra, HBase)
- Graph: Nodes + edges, relationships (Neo4j)
- Time-Series: Timestamp-optimized (InfluxDB, TimescaleDB)
- In-Memory: RAM-based, ultra-fast (Redis, Memcached)

---

## 2. RELATIONAL DATABASE FUNDAMENTALS

**Table:** Collection of related data (e.g., users)
**Tuple:** Row/record (e.g., (1, "Alice", "alice@email.com"))
**Attribute:** Column (e.g., email)

**Keys:**
| Key | Definition |
|-----|-----------|
| Primary Key | Unique identifier per row. One per table. Cannot be NULL. |
| Foreign Key | Column referencing PK of another table. Enforces referential integrity. |
| Unique Key | Alternate unique identifier. Can be NULL (one). Multiple allowed. |
| Candidate Key | Any column(s) that could be PK. |
| Composite Key | PK made of multiple columns. |
| Super Key | Any set of columns that uniquely identifies a row. |
| Surrogate Key | Artificial PK (auto-increment ID), no business meaning. |
| Alternate Key | Candidate key not chosen as PK. |

**Primary Key vs Unique Key:**
PK = NOT NULL + one per table + clustered index (usually). Unique = can have one NULL + many per table.

**Why Foreign Keys?**
Prevent orphaned records. orders.user_id must exist in users.id.

---

## 3. SQL CATEGORIES

| Category | Commands | Purpose |
|----------|----------|---------|
| DDL | CREATE, ALTER, DROP, TRUNCATE | Define/change structure |
| DML | INSERT, UPDATE, DELETE | Manipulate data |
| DQL | SELECT | Query data |
| DCL | GRANT, REVOKE | Control access |
| TCL | COMMIT, ROLLBACK, SAVEPOINT | Manage transactions |

**DELETE vs TRUNCATE vs DROP:**
| DELETE | TRUNCATE | DROP |
|--------|----------|------|
| Row-by-row, WHERE filter | All rows, no WHERE | Entire table + structure |
| Can rollback | Cannot rollback (usually) | Cannot rollback |
| Triggers fire | Triggers don't fire | - |
| Slow (logs each row) | Fast (deallocate pages) | Fastest |

---

## 4. SQL QUERIES

```sql
-- Basic
SELECT name, salary FROM employees WHERE dept = 'Engineering' ORDER BY salary DESC LIMIT 10;

-- Aggregation
SELECT dept, AVG(salary) as avg_sal 
FROM employees 
GROUP BY dept 
HAVING AVG(salary) > 50000;
```

**WHERE vs HAVING:**
- WHERE: Filters rows BEFORE aggregation
- HAVING: Filters groups AFTER aggregation

**Execution Order:**
FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT

---

## 5. JOINS

```sql
-- INNER JOIN: Only matching rows from both tables
SELECT e.name, d.name 
FROM employees e 
INNER JOIN departments d ON e.dept_id = d.id;

-- LEFT JOIN: All left table + matching right (NULL if no match)
SELECT e.name, COALESCE(d.name, 'No Dept') 
FROM employees e 
LEFT JOIN departments d ON e.dept_id = d.id;

-- RIGHT JOIN: All right table + matching left
-- FULL OUTER JOIN: All rows from both (NULL where no match)
-- CROSS JOIN: Cartesian product (every combination)
-- SELF JOIN: Table joined to itself
SELECT a.name as employee, b.name as manager 
FROM employees a 
JOIN employees b ON a.manager_id = b.id;
```

**INNER vs LEFT:**
INNER = intersection. LEFT = all from left + matched from right.

**When SELF JOIN useful?**
Hierarchies: employee-manager, categories with parent categories.

---

## 6. AGGREGATE FUNCTIONS

```sql
COUNT(*)          -- Total rows
COUNT(column)     -- Non-NULL values
SUM(salary)       -- Total
AVG(salary)       -- Average
MAX(salary)       -- Highest
MIN(salary)       -- Lowest
```

---

## 7. SUBQUERIES

```sql
-- Scalar: Returns single value
SELECT name FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);

-- Correlated: References outer query (executes per row)
SELECT e.name FROM employees e 
WHERE salary > (SELECT AVG(salary) FROM employees WHERE dept = e.dept);

-- EXISTS: Check if subquery returns any row
SELECT name FROM departments d 
WHERE EXISTS (SELECT 1 FROM employees WHERE dept_id = d.id);

-- IN: Match against list
SELECT * FROM employees WHERE dept_id IN (SELECT id FROM departments WHERE location = 'NY');

-- ANY/ALL: Compare against all values
SELECT * FROM employees WHERE salary > ALL (SELECT salary FROM employees WHERE dept = 'Intern');
```

---

## 8. WINDOW FUNCTIONS

```sql
-- ROW_NUMBER: Unique rank (1,2,3,4) even with ties
SELECT name, salary, 
       ROW_NUMBER() OVER (ORDER BY salary DESC) as rank
FROM employees;

-- RANK: Same rank for ties, skips next (1,2,2,4)
SELECT name, salary,
       RANK() OVER (ORDER BY salary DESC) as rank
FROM employees;

-- DENSE_RANK: Same rank for ties, no skip (1,2,2,3)
SELECT name, salary,
       DENSE_RANK() OVER (ORDER BY salary DESC) as rank
FROM employees;

-- LEAD/LAG: Access next/previous row
SELECT name, salary,
       LAG(salary) OVER (ORDER BY salary) as prev_salary,
       LEAD(salary) OVER (ORDER BY salary) as next_salary
FROM employees;

-- PARTITION BY: Reset window per group
SELECT dept, name, salary,
       ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC) as dept_rank
FROM employees;

-- NTILE: Divide into buckets
SELECT name, NTILE(4) OVER (ORDER BY salary) as quartile FROM employees;
```

**ROW_NUMBER vs RANK:**
ROW_NUMBER always unique. RANK gives same number to ties, skips next.

**Window vs GROUP BY:**
GROUP BY collapses rows. Window functions keep all rows + add computed column.

---

## 9. CTEs (Common Table Expressions)

```sql
-- Non-recursive
WITH high_earners AS (
    SELECT * FROM employees WHERE salary > 100000
)
SELECT name, dept FROM high_earners WHERE dept = 'Engineering';

-- Recursive: Hierarchies
WITH RECURSIVE org_tree AS (
    SELECT id, name, manager_id, 0 as level 
    FROM employees WHERE manager_id IS NULL  -- CEO
    UNION ALL
    SELECT e.id, e.name, e.manager_id, level + 1
    FROM employees e
    JOIN org_tree o ON e.manager_id = o.id
)
SELECT * FROM org_tree;
```

---

## 10. VIEWS

**Normal View:**
```sql
CREATE VIEW engineering_salaries AS
SELECT name, salary FROM employees WHERE dept = 'Engineering';
-- Query like table: SELECT * FROM engineering_salaries;
```
Virtual table, query stored, executed on access.

**Materialized View:**
Physical copy stored on disk. Fast read, stale data. REFRESH MATERIALIZED VIEW to update.

---

## 11. NORMALIZATION

**Goal:** Reduce redundancy, prevent anomalies.

| Normal Form | Rule | Violation Example |
|-------------|------|-----------------|
| 1NF | Atomic values, no repeating groups | phones: "123,456" -> separate rows |
| 2NF | 1NF + no partial dependency | PK=(order_id, product_id), but product_name depends only on product_id |
| 3NF | 2NF + no transitive dependency | employee_id -> dept_id -> dept_name -> move dept_name to dept table |
| BCNF | 3NF + every determinant is candidate key | student, course -> professor, but professor -> course |

**Denormalization:**
Intentionally add redundancy for read performance. E.g., store order_total instead of summing line items.

**When denormalize?**
Read-heavy workloads, analytics, when JOIN cost > storage cost.

---

## 12. ACID PROPERTIES

| Property | What It Means | Example |
|----------|--------------|---------|
| Atomicity | All or nothing | Bank transfer: debit + credit both happen or neither |
| Consistency | Valid state to valid state | Transfer preserves total balance |
| Isolation | Concurrent transactions don't interfere | Two transfers on same account execute as if sequential |
| Durability | Committed data survives crashes | After COMMIT, data on disk even if power lost |

**Why ACID?**
Data integrity. Financial systems, inventory, bookings cannot tolerate partial updates.

---

## 13. TRANSACTIONS

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
SAVEPOINT before_bonus;
UPDATE accounts SET balance = balance + 10 WHERE id = 2;
-- Oops, rollback to savepoint
ROLLBACK TO before_bonus;
COMMIT;
```

**Autocommit:**
Each statement is a transaction. Turn off for multi-statement operations.

---

## 14. CONCURRENCY CONTROL

**Problems:**
| Problem | Scenario |
|---------|----------|
| Dirty Read | Read uncommitted data that gets rolled back |
| Non-repeatable Read | Re-read same row, data changed by another transaction |
| Phantom Read | Re-run query, new rows appear/disappear |
| Lost Update | Two transactions overwrite each other |

**Isolation Levels:**
| Level | Dirty Read | Non-repeatable | Phantom | Performance |
|-------|-----------|---------------|---------|-------------|
| Read Uncommitted | Yes | Yes | Yes | Fastest |
| Read Committed | No | Yes | Yes | Fast |
| Repeatable Read | No | No | Yes | Medium |
| Serializable | No | No | No | Slowest |

**PostgreSQL default:** Read Committed.
**MySQL InnoDB default:** Repeatable Read.

**Repeatable Read vs Serializable:**
Repeatable Read locks rows read. Serializable locks range (prevents phantoms).

---

## 15. LOCKS

| Lock | Behavior |
|------|----------|
| Shared (S) | Read lock. Multiple can hold. Blocks writers. |
| Exclusive (X) | Write lock. Only one. Blocks all others. |
| Row-level | Lock specific row. Better concurrency. |
| Table-level | Lock entire table. Fast, coarse. |

**Deadlock:**
```
T1: Lock A -> wants B
T2: Lock B -> wants A
-> Circular wait. DB detects, kills one (rollback).
```

---

## 16. INDEXING

**Why indexes improve reads?**
B+ Tree lookup: O(log n) vs table scan: O(n).

**Why too many indexes slow writes?**
Every INSERT/UPDATE/DELETE must update all indexes.

**B+ Tree:**
```
        [10 | 30 | 50]
       /     |      \
   [5|10]  [20|30]  [40|50|60]
```
All data in leaf nodes (linked for range scans). Internal nodes only guide.

| Index Type | Use Case |
|-----------|----------|
| Clustered | Data stored in index order. One per table. PK usually. |
| Non-clustered | Separate structure pointing to data. Many allowed. |
| Composite | Multiple columns. Order matters (leftmost prefix). |
| Covering | Index contains all columns query needs. No table lookup. |
| Unique | Enforces uniqueness. PK, alternate keys. |
| Partial | Index subset of rows. Smaller, faster for filtered queries. |

**Hash Index:**
O(1) equality lookup. No range scans. PostgreSQL supports, rarely used.

---

## 17. QUERY OPTIMIZATION

**Execution Plan Flow:**
```sql
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'a@b.com';
```
```
Seq Scan on users  (cost=0.00..35.50 rows=1 width=100)
  Filter: (email = 'a@b.com')
```
- Sequential Scan: Read every row. Bad for large tables.
- Index Scan: Use index to find rows. Good.
- Index Only Scan: All data in index. No table access. Best.

**Cost-based Optimizer:**
Estimates cost (I/O + CPU) of different plans, picks cheapest.

**Cardinality:** Number of unique values. High = selective.
**Selectivity:** Fraction of rows matching condition. Low = good for index.

**Optimize slow query:**
1. EXPLAIN ANALYZE -> find bottleneck
2. Add index on WHERE/JOIN columns
3. Rewrite to avoid functions on indexed columns
4. Consider covering index
5. Partition large tables
6. Update statistics (ANALYZE)

---

## 18. POSTGRESQL DEEP DIVE

### Architecture
```
Client -> Postmaster -> Backend Process (per connection)
                    |
              Shared Memory (buffer cache, WAL buffers)
                    |
              Data Files + WAL + Indexes
```

### MVCC (Multi-Version Concurrency Control)
```
T1 starts at timestamp 100
T2 starts at timestamp 200
    |
T1 updates row X -> Creates new version (X', xmin=100, xmax=200)
T2 reads row X -> Sees version where xmin <= 200 < xmax -> Gets old version
    |
Both proceed without blocking!
```
Readers don't block writers, writers don't block readers.
Each transaction sees a snapshot at its start time.

**Why MVCC?**
High concurrency. No read locks needed.

### VACUUM
Removes dead tuples (old versions no longer visible). Reclaims space.
**Autovacuum:** Background process. **Manual:** VACUUM ANALYZE.
Without vacuum: table bloats, performance degrades.

### WAL (Write-Ahead Logging)
```
1. Client: UPDATE row
2. PostgreSQL: Write to WAL buffer (sequential, fast)
3. WAL buffer -> WAL file on disk (fsync)
4. Background: Apply to data files (checkpoint)
```
Durability guarantee. Crash recovery: replay WAL.

**Why WAL?**
Random I/O to data files = slow. Sequential WAL = fast. Recovery possible.

### EXPLAIN / EXPLAIN ANALYZE
- EXPLAIN: Estimated plan
- EXPLAIN ANALYZE: Actual execution times

### SERIAL / BIGSERIAL
Auto-increment. Creates sequence, default nextval().

### JSONB
Binary JSON. Indexed with GIN. Query with operators: ->, ->>, @>, ?.

### Index Types
| Type | Use |
|------|-----|
| B-tree | Default. Equality, range, sorting. |
| Hash | Equality only. Rarely used. |
| GIN | Array, JSONB, full-text search. |
| GiST | Geospatial, nearest-neighbor. |
| BRIN | Very large, naturally ordered tables (time-series). |

### Connection Pooling
Opening connection = expensive (fork backend). pgBouncer reuses connections.

---

## 19. MONGODB

### Document Model
```json
{
  "_id": ObjectId("..."),
  "name": "Alice",
  "address": { "city": "NYC", "zip": "10001" },
  "orders": [ObjectId("..."), ObjectId("...")]
}
```
BSON (Binary JSON). Richer types than JSON (Date, ObjectId, Decimal).

### CRUD
```js
db.users.insertOne({name: "Alice"});
db.users.find({age: {$gte: 18}}, {name: 1, _id: 0});  // Projection
db.users.updateOne({name: "Alice"}, {$set: {age: 30}});
db.users.deleteOne({name: "Alice"});
```

### Aggregation Pipeline
```js
db.orders.aggregate([
  {$match: {status: "shipped"}},
  {$group: {_id: "$customer_id", total: {$sum: "$amount"}}},
  {$sort: {total: -1}},
  {$limit: 10}
]);
```
Stages process documents left-to-right. Pipeline = efficient server-side processing.

### Indexing
| Type | Use |
|------|-----|
| Single Field | db.users.createIndex({email: 1}) |
| Compound | db.users.createIndex({dept: 1, salary: -1}) |
| Multikey | Index on array elements |
| Text | Full-text search |
| TTL | Auto-delete after time (sessions, logs) |

### Replication
```
Primary -> Writes + Reads
    |
Secondary 1 -> Async replication
Secondary 2 -> Async replication
```
Replica Set: 1 primary + N secondaries. Automatic failover.

### Sharding
```
Router (mongos) -> Shard 1 (range A-M) -> Replica Set
                -> Shard 2 (range N-Z) -> Replica Set
```
Shard key determines distribution. Balancer moves chunks.

### Transactions
- Single-document: Always atomic
- Multi-document: Since 4.0 (replica sets), 4.2 (sharded)

### Data Modeling: Embed vs Reference
| Embed | Reference |
|-------|-----------|
| One-to-few, read together | One-to-many, independent access |
| No joins needed | Avoids duplication |
| E.g., user.address | E.g., user.orders (large list) |

---

## 20. SQL vs NoSQL

| Aspect | SQL (PostgreSQL) | NoSQL (MongoDB) |
|--------|-----------------|-----------------|
| Schema | Rigid, predefined | Flexible, dynamic |
| Consistency | Strong (ACID) | Eventual (configurable) |
| Transactions | Full ACID | Single-doc atomic, multi-doc limited |
| Joins | Native, efficient | Manual (application) or $lookup |
| Scaling | Vertical + read replicas | Horizontal (sharding) |
| Use Case | Complex queries, relationships | Rapid iteration, unstructured data |
| Performance | Fast for structured queries | Fast for simple lookups, writes |

**When SQL?**
Complex relationships, ACID required, structured data, reporting.

**When NoSQL?**
Rapid schema changes, massive scale, unstructured/semi-structured, high write throughput.

---

## 21. PRODUCTION DATABASE CONCEPTS

### Replication
```
App -> Write -> Primary
      |
    Read -> Replica 1
    Read -> Replica 2
```
**Synchronous:** Primary waits for replica ACK. Consistent but slow.
**Asynchronous:** Fire and forget. Fast but replication lag.

### Sharding vs Partitioning
| Sharding | Partitioning |
|----------|-------------|
| Data across multiple servers | Data across multiple tables/files on same server |
| Horizontal scale | Manageable chunks |
| Complex | Simpler |

**Partitioning Types:**
- Range: orders_2023, orders_2024
- List: orders_east, orders_west
- Hash: Hash of key determines partition

### Backup & Recovery
- Snapshots: Point-in-time copy
- PITR: Replay WAL to any point
- WAL Recovery: Replay since last checkpoint

### Caching
- Query Cache: Store result of frequent queries (MySQL removed, PostgreSQL doesn't have)
- Application Cache: Redis/Memcached in front of DB
- Cache Invalidation: Write-through, write-back, TTL-based

### Connection Pooling
```
App (100 threads) -> Pool (20 connections) -> Database
```
Why? Connection = expensive (TCP + auth + memory). Pool reuses.

### Read/Write Separation
```
Write -> Primary
Read  -> Replica 1 / Replica 2 / Replica 3
```
Reduces primary load. Handle replication lag (stale reads).

---

## COMPLETE WORKFLOW: "What happens when you run a query?"

```sql
SELECT name, salary FROM employees WHERE dept = 'Engineering' ORDER BY salary DESC LIMIT 10;
```

```
1. PARSER
   Tokenize, check syntax, build parse tree

2. ANALYZER
   Validate tables/columns exist, resolve names

3. REWRITER
   Apply rules (view expansion, subquery flattening)

4. PLANNER/OPTIMIZER
   Generate candidate plans:
   - Seq Scan + Filter + Sort + Limit
   - Index Scan on dept_idx + Filter + Sort + Limit
   - Index Scan on (dept, salary) covering index -> Limit
   Estimate costs, pick cheapest

5. EXECUTOR
   - Use buffer cache (RAM) if page present
   - Page fault -> Load from disk -> Add to cache
   - Apply filters, sort, limit
   - Return results

6. If UPDATE/INSERT:
   - Lock rows (Shared/Exclusive)
   - Write to WAL (sequential)
   - Modify buffer cache pages (dirty)
   - Background: Checkpoint writes dirty pages to disk
```

---

## COMPLETE WORKFLOW: "What happens during a transaction?"

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;  -- $1000 -> $900
UPDATE accounts SET balance = balance + 100 WHERE id = 2;  -- $500 -> $600
COMMIT;
```

```
BEGIN:
  -> Start transaction, get transaction ID
  -> Take snapshot of database state

UPDATE 1:
  -> Acquire row-level exclusive lock on id=1
  -> Write new version to buffer cache (xmin=TXID)
  -> Old version marked with xmax=TXID
  -> Write WAL record: "UPDATE id=1, old=1000, new=900"

UPDATE 2:
  -> Acquire row-level exclusive lock on id=2
  -> Write new version
  -> Write WAL record

COMMIT:
  -> Write WAL commit record
  -> fsync WAL to disk (durability)
  -> Release locks
  -> Other transactions now see new versions
  -> Background: Checkpoint eventually writes data files

If ROLLBACK:
  -> Write WAL abort record
  -> New versions marked dead
  -> Old versions remain visible
  -> VACUUM cleans up later
```

---

## QUICK ANSWER CHEAT SHEET

| Question | Answer |
|----------|--------|
| DBMS vs RDBMS? | DBMS = any model; RDBMS = relational tables + SQL |
| PK vs Unique Key? | PK = NOT NULL, one per table, clustered; Unique = can NULL, many allowed |
| Why Foreign Keys? | Referential integrity, prevent orphans |
| DELETE vs TRUNCATE vs DROP? | DELETE = row-by-row, rollbackable; TRUNCATE = all rows, fast; DROP = remove table |
| WHERE vs HAVING? | WHERE filters rows; HAVING filters groups |
| INNER vs LEFT JOIN? | INNER = intersection; LEFT = all left + matched right |
| When SELF JOIN? | Hierarchies: employee-manager, categories |
| Window vs GROUP BY? | GROUP BY collapses; Window keeps rows + adds column |
| ROW_NUMBER vs RANK? | ROW_NUMBER always unique; RANK ties = same number, skips |
| Why normalize? | Reduce redundancy, prevent anomalies |
| When denormalize? | Read-heavy, analytics, JOIN cost > storage cost |
| ACID? | Atomicity, Consistency, Isolation, Durability |
| Isolation levels? | Read Uncommitted -> Read Committed -> Repeatable Read -> Serializable |
| PostgreSQL default? | Read Committed |
| Dirty Read? | Read uncommitted data that gets rolled back |
| Phantom Read? | Re-run query, new rows appear |
| Shared vs Exclusive Lock? | Shared = read, multiple; Exclusive = write, one only |
| Why indexes improve reads? | B+ Tree O(log n) vs scan O(n) |
| Why indexes slow writes? | Must update index on every INSERT/UPDATE/DELETE |
| Clustered vs Non-clustered? | Clustered = data in order, one per table; Non-clustered = separate pointer |
| B+ Tree? | Balanced tree, all data in linked leaves, range scan efficient |
| Covering Index? | Index has all query columns -> no table lookup |
| Optimize slow query? | EXPLAIN ANALYZE -> index -> rewrite -> covering index -> partition |
| What is MVCC? | Multi-version concurrency: readers see snapshot, no locks |
| Why VACUUM? | Remove dead tuples, reclaim space, prevent bloat |
| Why WAL? | Sequential write = fast; crash recovery via replay |
| PostgreSQL index types? | B-tree, Hash, GIN, GiST, BRIN |
| When GIN? | Arrays, JSONB, full-text |
| When GiST? | Geospatial, nearest-neighbor |
| MongoDB embed vs reference? | Embed = one-to-few, read together; Reference = one-to-many, independent |
| MongoDB replication? | Primary + secondaries, async, auto-failover |
| MongoDB sharding? | Shard key distributes across servers, mongos routes |
| SQL vs NoSQL? | SQL = ACID, joins, structured; NoSQL = flexible, scale, unstructured |
| When SQL? | Complex queries, relationships, ACID required |
| When NoSQL? | Rapid changes, massive scale, unstructured |
| Synchronous vs Async replication? | Sync = consistent, slow; Async = fast, lag risk |
| Connection pooling? | Reuse connections, avoid per-request overhead |
| Read/Write separation? | Write primary, read replicas, reduce load |
| Cache invalidation? | Write-through, write-back, TTL |
| What happens on query execution? | Parse -> Analyze -> Rewrite -> Plan -> Optimize -> Execute |
| What happens in transaction? | BEGIN -> lock -> write WAL -> modify -> COMMIT -> fsync WAL -> release |
| What is page fault? | Requested page not in RAM -> OS loads from disk -> resume |
| What is deadlock? | Circular wait for locks -> DB kills one |
| How DB detects deadlock? | Wait-for graph, cycle detection |
| What is cardinality? | Number of unique values in column |
| What is selectivity? | Fraction of rows matching condition |
| What is execution plan? | Step-by-step strategy chosen by optimizer |
| Seq Scan vs Index Scan? | Seq = read all rows; Index = use B+ Tree, faster for selective queries |
| What is materialized view? | Precomputed result stored on disk, refresh to update |
| What is CTE? | Named temporary result set, readable, recursive for hierarchies |
| What is composite index? | Multiple columns; order matters (leftmost prefix) |
| What is partial index? | Index subset of rows, smaller, faster for filtered queries |
| What is pgBouncer? | PostgreSQL connection pooler, reuses connections |
| What is replication lag? | Delay between primary write and replica visibility |
| What is TTL index? | MongoDB auto-deletes documents after time |
| What is oplog? | MongoDB operation log, replication source |
| What is shard key? | Field determining document distribution across shards |
| What is journaling in MongoDB? | Write to journal before acknowledging, durability |
| What is fsync? | Force data to disk, durability guarantee |
| What is checkpoint? | Background write of dirty buffers to data files |
| What is buffer cache? | RAM cache of disk pages, reduces I/O |
| What is dirty page? | Modified in cache, not yet written to disk |
| What is autovacuum? | PostgreSQL background process, automatic cleanup |
| What is sequence? | Auto-increment counter, used by SERIAL |
| What is JSONB vs JSON? | JSONB = binary, parsed, indexable; JSON = text, store as-is |
| What is full-text search? | Index words in text, ranked relevance search |
| What is trigger? | Procedure auto-executed on INSERT/UPDATE/DELETE |
| What is stored procedure? | Precompiled SQL routine, executes on server |
| What is cursor? | Pointer to result set, fetch row-by-row |
| What is pagination? | LIMIT + OFFSET or keyset (cursor-based) |
| What is keyset pagination? | WHERE id > last_seen ORDER BY id LIMIT N, no OFFSET skip |
| What is upsert? | INSERT or UPDATE if exists (ON CONFLICT) |
| What is N+1 query? | Loop fetches related data one-by-one, fix with JOIN |
| What is eager loading? | Fetch related data in one query |
| What is lazy loading? | Fetch related data on demand |
| What is database migration? | Versioned schema changes |
| What is CQRS? | Separate read and write models |
| What is event sourcing? | Store events, derive state |
| What is outbox pattern? | Write event to DB table, then publish |
| What is saga pattern? | Long-running transaction as sequence of local transactions |
| What is two-phase commit? | Prepare then commit, atomic across resources |
| What is CAP theorem? | Consistency, Availability, Partition tolerance: pick 2 |
| What is BASE? | Basically Available, Soft state, Eventual consistency (NoSQL) |
| What is optimistic locking? | No locks, check version at commit, retry if conflict |
| What is pessimistic locking? | Lock before access, safe but slower |
| What is idempotency? | Same request = same result, safe to retry |
| What is circuit breaker? | Stop calling failing DB |
| What is bulkhead? | Isolate failures per resource pool |
| What is cache stampede? | Many requests hit DB on cache miss |
| What is cache warming? | Pre-populate cache before use |
| What is cache penetration? | Request non-existent key repeatedly |
| What is cache avalanche? | Many keys expire simultaneously |
| What is bloom filter? | Probabilistic set membership, reduce cache misses |
| What is CDC (Change Data Capture)? | Stream DB changes to other systems |
| What is Debezium? | CDC tool, captures DB changes |
| What is temporal table? | Auto-track data history |
| What is multi-tenant database? | Multiple customers, one DB |
| What is row-level tenancy? | tenant_id column per row |
| What is schema-level tenancy? | Schema per tenant |
| What is noisy neighbor? | One tenant affects others |
| What is tenant isolation? | Prevent cross-tenant access |

---

## SKIP THESE (Unless Database Engineering Role)

PostgreSQL source code internals, query planner implementation details, storage engine internals, MongoDB WiredTiger internals, distributed consensus algorithms (Raft/Paxos) in database implementations, advanced indexing algorithms, PostgreSQL extension development, database kernel development, advanced replication protocols, custom storage engines

---

**Revision Order:** Database Fundamentals -> Relational Concepts -> SQL Syntax -> Queries -> Joins -> Aggregates -> Subqueries -> Window Functions -> CTEs -> Normalization -> ACID -> Transactions -> Concurrency -> Locks -> Indexing -> Query Optimization -> PostgreSQL (MVCC, WAL, VACUUM) -> MongoDB -> SQL vs NoSQL -> Production Concepts (Replication, Sharding, Partitioning, Caching, Connection Pooling)

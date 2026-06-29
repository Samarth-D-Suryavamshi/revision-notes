# Concurrency & Multithreading

---

# Priority 1 — Concurrency Fundamentals

## 1. Introduction to Concurrency

**Concurrency vs Parallelism**
```
Concurrency: Multiple tasks making progress (interleaved, not necessarily simultaneous)
Parallelism: Multiple tasks executing at the exact same time (requires multiple cores)

Analogy: Concurrency = Juggling 3 balls (switching attention). Parallelism = 3 people each holding 1 ball.
```

**Process vs Thread**

| Process | Thread |
|---------|--------|
| Independent program with own memory | Lightweight unit within a process |
| Heavy (MBs of memory) | Light (KBs of memory) |
| IPC needed to communicate | Shared memory (same heap) |
| OS manages scheduling | OS manages scheduling |
| Crash doesn't affect other processes | Crash kills entire process |

**System Flow — Why Multiple Threads?**
```
Single Thread: Request 1 → Process → Response → Request 2 → Process → Response (slow, sequential)
Multi Thread: Request 1 → Thread-1 → Process
             Request 2 → Thread-2 → Process  (simultaneous, faster)
             Request 3 → Thread-3 → Process
```

**Context Switching:**
```
Thread A running → Timer interrupt → Save Thread A state (registers, PC) → Load Thread B state → Thread B running
Cost: ~1-10 microseconds. Too much switching = overhead > benefit.
```

---

## 2. Threads

**Thread Lifecycle:**
```
NEW → START() → RUNNABLE → Scheduler picks → RUNNING → sleep()/wait() → BLOCKED/WAITING/TIMED_WAITING → notify()/I/O complete → RUNNABLE → run() completes → TERMINATED
```

**Thread States:**

| State | Meaning |
|-------|---------|
| **NEW** | Created, not started |
| **RUNNABLE** | Ready to run, waiting for CPU |
| **RUNNING** | Currently executing |
| **BLOCKED** | Waiting for monitor lock |
| **WAITING** | Waiting indefinitely (wait()) |
| **TIMED_WAITING** | Waiting with timeout (sleep(1000)) |
| **TERMINATED** | Execution completed |

**Daemon Thread:**
```
Background thread (garbage collector, heartbeat). JVM exits when only daemons remain.
Non-daemon = user thread. JVM waits for all user threads to finish.
```

**Why threads lighter than processes?**
```
Process: Own memory space, file descriptors, code segment
Thread: Shares code, data, heap. Only has own stack + registers + PC.
```

---

## 3. Thread Synchronization

**Race Condition:**
```
Shared counter = 0
Thread A reads counter (0) → Thread B reads counter (0) → A increments (1) → B increments (1)
Result: 1 (expected 2). Lost update.
```

**Critical Section:**
```
Code that accesses shared resource. Must be protected so only one thread executes at a time.

Thread A: [enter CS] → read shared_var → modify → write → [exit CS]
Thread B: [wait] → [enter CS] → read shared_var → modify → write → [exit CS]
```

**Thread Safety:**
```
Code is thread-safe if multiple threads can execute it concurrently without causing errors.

How to achieve:
1. No shared state (immutable objects, local variables)
2. Synchronize access (locks, synchronized)
3. Thread-safe data structures (ConcurrentHashMap)
4. Atomic operations (CAS)
```

**Memory Visibility:**
```
Thread A writes to shared variable → Stored in CPU cache → May not flush to main memory immediately
Thread B reads shared variable → Reads from its own cache → Sees stale value

Fix: volatile, synchronized, atomic variables (force flush to main memory)
```

---

# Priority 2 — Synchronization Primitives

## 4. Mutex

**System Flow:**
```
Thread A: mutex.lock() → Enter critical section → mutex.unlock()
Thread B: mutex.lock() → BLOCKED (A holds lock) → ... → A unlocks → B enters
```

**Mutex = Mutual Exclusion. Only one thread can hold it at a time.**

**Mutex has ownership:** Only the thread that locked it can unlock it.

**Mutex vs Semaphore:**

| Mutex | Semaphore |
|-------|-----------|
| Binary (0 or 1) | Can be counting (0 to N) |
| Has ownership | No ownership |
| Lock/unlock must be same thread | Any thread can signal |
| Use: protect critical section | Use: limit resource access |

---

## 5. Locks

| Lock Type | How it works | Use Case |
|-----------|-------------|----------|
| **Exclusive Lock** | One reader OR one writer | General mutual exclusion |
| **Read Lock** | Multiple readers simultaneously | Read-heavy data |
| **Write Lock** | Exclusive, no readers or writers | Write operations |
| **Reentrant Lock** | Same thread can lock multiple times | Recursive algorithms |
| **Spin Lock** | Thread busy-waits (spins) instead of blocking | Very short critical sections |

**Spin Lock vs Mutex:**

| Spin Lock | Mutex |
|-----------|-------|
| Busy-waits (consumes CPU) | Blocks (yields CPU) |
| Low latency if lock held briefly | Better for long critical sections |
| Use: kernel, real-time systems | Use: general application code |

**Read-Write Lock vs Mutex:**
```
Mutex: Read = block others. Read-Write Lock: Multiple reads allowed simultaneously, write exclusive.

Scenario: 10 readers, 1 writer
Mutex: All 10 readers queue up (slow)
RW Lock: All 10 readers proceed concurrently (fast), writer waits
```

---

## 6. Semaphore

**System Flow:**
```
Semaphore permits = 3
Thread A: acquire() → permits=2 → Proceed
Thread B: acquire() → permits=1 → Proceed
Thread C: acquire() → permits=0 → Proceed
Thread D: acquire() → permits=0 → BLOCKED
Thread A: release() → permits=1 → D unblocks → Proceed
```

| Type | Permits | Use |
|------|---------|-----|
| **Binary** | 1 | Like mutex, but no ownership |
| **Counting** | N | Limit concurrent access (connection pool, API rate limit) |

**Binary Semaphore vs Mutex:**
```
Binary Semaphore: Any thread can signal (release). No ownership.
Mutex: Only owner can unlock. Ownership enforced.

Use mutex for critical sections. Use semaphore for resource pools.
```

---

## 7. Condition Variables

**System Flow — Producer-Consumer:**
```
Buffer empty:
Consumer: lock(mutex) → while(buffer.empty) → wait(cond, mutex) → UNLOCKS mutex, sleeps
Producer: lock(mutex) → add item → signal(cond) → unlock(mutex)
Consumer: wakes up → RELOCKS mutex → consume item → unlock(mutex)
```

| Method | Action |
|--------|--------|
| `wait()` | Release lock, sleep until signaled |
| `notify()` | Wake up ONE waiting thread |
| `notifyAll()` | Wake up ALL waiting threads |

**Why needed?** → Mutex alone can't wait for a condition. Condition variable = "wake me when X happens."

**Condition Variable vs Semaphore:**

| Condition Variable | Semaphore |
|-------------------|-----------|
| Signaling mechanism (wake specific threads) | Counting permits |
| Must be used with mutex | Independent |
| Use: producer-consumer, bounded buffer | Use: resource limiting |

---

## 8. Atomic Operations

**CAS (Compare-And-Swap):**
```
Atomic operation: Read value → Compare with expected → If match, write new value → Return success/failure

Thread A: CAS(counter, expected=5, new=6) → Success, counter=6
Thread B: CAS(counter, expected=5, new=6) → Failure (counter is 6 now), retry
```

**Why faster than locks?**
```
Lock: Acquire mutex → Enter kernel → Block/unblock → Release mutex (expensive context switches)
CAS: Single CPU instruction (no kernel involvement, no blocking)
```

**Limitation:** CAS can suffer from ABA problem (value changes A→B→A, CAS thinks unchanged). Use atomic stamps/versions to fix.

---

# Priority 3 — Deadlocks & Synchronization Problems

## 9. Deadlocks

**Four Necessary Conditions (ALL must hold):**
```
1. Mutual Exclusion: Resource can be held by only one thread
2. Hold and Wait: Thread holds resource while waiting for another
3. No Preemption: Resources cannot be forcibly taken
4. Circular Wait: Thread A waits for B, B waits for C, C waits for A
```

**System Flow — Deadlock:**
```
Thread A: lock(Account1) → ... → lock(Account2) → Transfer A→B
Thread B: lock(Account2) → ... → lock(Account1) → Transfer B→A

A holds 1, waits for 2
B holds 2, waits for 1
DEADLOCK — both wait forever
```

**Prevention:**

| Strategy | How |
|----------|-----|
| **Eliminate Mutual Exclusion** | Use lock-free structures (hard) |
| **Eliminate Hold and Wait** | Acquire all locks at once, or none |
| **Eliminate No Preemption** | Timeout and retry, or priority inheritance |
| **Eliminate Circular Wait** | Lock ordering (always lock A before B) |

**Banker's Algorithm:**
```
Before granting request, simulate if system remains in safe state.
If yes → grant. If no → wait.
Safe state = there exists a sequence where all threads can complete.
```

---

## 10. Starvation

**System Flow:**
```
High-priority threads keep getting CPU → Low-priority thread never runs → Starvation

Or: Reader threads keep acquiring lock → Writer thread never gets access → Write starvation
```

**Fix:** Fair scheduling (FIFO queue), priority aging (boost waiting threads).

---

## 11. Livelock

**System Flow:**
```
Thread A: "You go first" → waits
Thread B: "No, you go first" → waits
Both active, both polite, both blocked forever.

vs Deadlock: Both are waiting (blocked)
   Livelock: Both are running but making no progress
```

**Deadlock vs Livelock vs Starvation:**

| Deadlock | Livelock | Starvation |
|----------|----------|------------|
| All blocked, no progress | All active, no progress | Some blocked, others keep progressing |
| Circular wait | Polite yielding | Unfair scheduling |
| Fix: lock ordering | Fix: random backoff | Fix: fair queues |

---

## 12. Classical Problems

**Producer-Consumer (Bounded Buffer):**
```
Buffer size = N
Producer: while(full) wait(notFull) → add item → signal(notEmpty)
Consumer: while(empty) wait(notEmpty) → remove item → signal(notFull)
```

**Readers-Writers:**
```
Multiple readers OR one writer.
Readers: lock(readCount) → increment → if first reader, lock(writeLock) → read → decrement → if last reader, unlock(writeLock)
Writers: lock(writeLock) → write → unlock(writeLock)
```

**Dining Philosophers:**
```
5 philosophers, 5 forks (between each pair).
Philosopher needs 2 forks to eat.

Deadlock: All pick left fork simultaneously → All wait for right fork → Starve.

Fix: Pick lower-numbered fork first. Or limit philosophers at table.
```

---

# Priority 4 — Thread Pools & Task Execution

## 13. Thread Pools

**System Flow:**
```
Task arrives → Put in queue → Idle worker thread picks up → Executes → Returns to pool → Reusable

No thread pool: Request → Create thread → Process → Destroy thread (expensive)
Thread pool: Request → Reuse existing thread → Process → Return to pool (fast)
```

**Why not create thread per request?**
```
Thread creation: ~1ms + memory overhead
1000 requests = 1000 threads = memory explosion + context switching overhead
Thread pool: Fixed threads, queue excess tasks, reuse threads
```

| Pool Type | Behavior | Use |
|-----------|----------|-----|
| **Fixed** | N threads, unbounded queue | Predictable load |
| **Cached** | Create as needed, idle threads timeout | Bursty load |
| **Scheduled** | Execute after delay or periodically | Timers, cron jobs |
| **Single** | One thread, sequential execution | Ordered execution |

**Thread Pool Parameters:**
```
Core pool size: Always keep alive
Max pool size: Create up to this many
Queue: Hold tasks when all threads busy
Keep-alive time: How long to keep extra threads idle
Rejection policy: What to do when full (abort, discard, caller-runs)
```

---

## 14. Executor Framework (Java)

**System Flow:**
```
Submit task → ExecutorService → Task Queue → Worker Thread → Execute → Return Future
```

| Interface | What it does |
|-----------|-------------|
| **Executor** | Basic: `execute(Runnable)` |
| **ExecutorService** | + `submit()`, `invokeAll()`, `shutdown()` |
| **ScheduledExecutorService** | + `schedule()`, `scheduleAtFixedRate()` |

**Graceful Shutdown:**
```java
executor.shutdown();           // Stop accepting new tasks, finish queued
executor.awaitTermination(30, TimeUnit.SECONDS); // Wait for completion
executor.shutdownNow();        // Force interrupt all threads
```

---

# Priority 5 — Futures & Asynchronous Programming

## 15. Futures

**System Flow:**
```
Submit task → Get Future object → Future.get() blocks until result ready → Use result
```

| Type | Blocking? | Composable? | Use |
|------|-----------|-------------|-----|
| **Future** | Yes (get() blocks) | No | Simple async result |
| **CompletableFuture** | No (callbacks) | Yes (thenApply, thenCompose) | Complex async chains |

**CompletableFuture Chain:**
```java
CompletableFuture.supplyAsync(() -> fetchUser())
    .thenApply(user -> user.getName())
    .thenCompose(name -> fetchOrders(name))
    .thenAccept(orders -> sendEmail(orders));
```

---

## 16. Async Programming

**Synchronous vs Asynchronous:**
```
Synchronous:  Call API → Wait → Get response → Continue (blocking, one thing at a time)
Asynchronous: Call API → Continue other work → Response arrives → Callback executes (non-blocking)
```

**Async vs Multithreading:**

| Async | Multithreading |
|-------|---------------|
| Programming model (non-blocking) | Execution model (multiple threads) |
| Can use single thread (event loop) | Requires multiple threads |
| Callbacks, promises, async/await | Locks, synchronization |
| Use: I/O bound (network, disk) | Use: CPU bound (computation) |

**Event Loop:**
```
Single thread: Event queue → Pick event → Execute callback → Return to queue → Pick next event
No blocking! If callback needs I/O, register callback, continue to next event.
```

**Python asyncio:**
```python
async def fetch():
    result = await aiohttp.get(url)  # Non-blocking, yields control
    return result
```

---

## 17. Reactive Programming (Basic)

**System Flow:**
```
Publisher → emits events → Subscriber receives → Backpressure: Subscriber says "slow down" if overwhelmed
```

**Backpressure:**
```
Fast producer, slow consumer → Consumer buffers overflow → Memory leak
Fix: Consumer signals "I can handle N more" → Producer pauses/resumes
```

---

# Priority 6 — Memory Model

## 18. Memory Visibility

**System Flow:**
```
Thread A writes x=1 → Stored in CPU cache L1 → May stay in cache → Thread B reads x → Gets stale value from its cache

Fix: Memory barrier (synchronized, volatile, atomic) → Forces flush to main memory → Invalidates other caches
```

**Why local variables aren't shared:**
```
Each thread has its own stack. Local variables live on stack → Thread-private.
Shared variables live on heap → Need synchronization.
```

---

## 19. volatile (Java)

**System Flow:**
```
Thread A: volatile x = 1 → Immediately flushed to main memory → Other threads see update
Thread B: read volatile x → Reads from main memory (not stale cache) → Sees 1
```

**Guarantees:**

| Guarantee | Meaning |
|-----------|---------|
| **Visibility** | Write visible to all threads immediately |
| **Ordering** | Instructions before/after volatile can't be reordered |

**Limitations:**
```
volatile int count = 0;
count++;  // NOT atomic! Read → Increment → Write (3 steps, race condition possible)

Fix: Use AtomicInteger or synchronized for compound operations.
```

**volatile vs synchronized:**

| volatile | synchronized |
|----------|-------------|
| Visibility + ordering | Visibility + ordering + mutual exclusion |
| No locking | Acquires monitor lock |
| Use: simple flag, status variable | Use: compound operations, critical sections |

---

# Priority 7 — Concurrent Data Structures

| Structure | Thread-Safe? | How it works | Use |
|-----------|-------------|--------------|-----|
| **HashMap** | No | Not synchronized | Single-threaded |
| **ConcurrentHashMap** | Yes | Segment-level locking (Java 7) / CAS + synchronized (Java 8+) | Multi-threaded reads/writes |
| **BlockingQueue** | Yes | Blocking put/take | Producer-consumer |
| **CopyOnWriteArrayList** | Yes | Copy on write, read lock-free | Read-heavy, write-rare |
| **ConcurrentLinkedQueue** | Yes | Lock-free CAS | High-concurrency queue |

**HashMap vs ConcurrentHashMap:**
```
HashMap: Not thread-safe. Concurrent modification = infinite loop or corruption.
ConcurrentHashMap: Thread-safe without locking entire map. Multiple reads, limited write locking.
```

---

# Priority 8 — Language-Specific Concurrency

## Java
```java
// Thread creation
new Thread(() -> { ... }).start();

// Synchronized method
public synchronized void increment() { count++; }

// ReentrantLock
Lock lock = new ReentrantLock();
lock.lock(); try { ... } finally { lock.unlock(); }

// ExecutorService
ExecutorService executor = Executors.newFixedThreadPool(4);
Future<Integer> future = executor.submit(() -> compute());

// CompletableFuture
CompletableFuture.supplyAsync(() -> fetch())
    .thenApply(result -> transform(result))
    .thenAccept(finalResult -> process(finalResult));
```

## Python
```python
# threading (GIL = only one thread runs Python bytecode at a time)
import threading
t = threading.Thread(target=worker)
t.start()

# multiprocessing (bypasses GIL, true parallelism)
from multiprocessing import Pool
pool = Pool(4)
results = pool.map(worker, tasks)

# asyncio (single-threaded, non-blocking I/O)
import asyncio
async def main():
    result = await fetch_data()
```

**GIL (Global Interpreter Lock):**
```
Python has GIL → Only one thread executes Python bytecode at a time → Threads don't parallelize CPU work
Fix: Use multiprocessing for CPU-bound, asyncio for I/O-bound
```

## C++
```cpp
std::thread t([]() { ... });
std::mutex mtx;
std::lock_guard<std::mutex> lock(mtx);  // RAII, auto-unlock
std::atomic<int> counter(0);
counter.fetch_add(1);  // Atomic increment
std::future<int> fut = std::async(std::launch::async, compute);
```

---

# Priority 9 — Performance Considerations

| Problem | Cause | Fix |
|---------|-------|-----|
| **Lock Contention** | Too many threads competing for same lock | Finer-grained locks, lock-free structures, reduce critical section |
| **Context Switching Cost** | Too many threads, CPU spends time switching | Right-size thread pool, async I/O |
| **False Sharing** | Threads modify adjacent cache lines → Cache invalidation | Pad data to separate cache lines (64 bytes) |
| **Thread Starvation** | Unfair scheduling, priority inversion | Fair locks, priority inheritance |
| **Thread Explosion** | Unlimited thread creation | Thread pools, backpressure |
| **Busy Waiting** | Spin lock spins too long | Use mutex for long waits, adaptive spinning |

**Why more threads can reduce performance?**
```
More threads than cores → Excessive context switching → CPU overhead > parallel benefit
Optimal: threads ≈ cores (CPU-bound) or threads > cores (I/O-bound, since threads block on I/O)
```

---

# Priority 10 — Production Concurrency Patterns

| Pattern | System Flow | Use |
|---------|-------------|-----|
| **Producer-Consumer** | Producer → BlockingQueue → Consumer | Decouple production from consumption |
| **Worker Queue** | Tasks → Queue → Thread Pool Workers | Process jobs asynchronously |
| **Thread Pool** | Submit → Queue → Reuse threads | Limit resource usage |
| **Pipeline** | Stage 1 → Queue → Stage 2 → Queue → Stage 3 | Data processing chains |
| **Publish-Subscribe** | Publisher → Topic → Multiple Subscribers | Event broadcasting |

---

# Common Interview Scenarios — Quick Answers

| Question | One-Liner |
|----------|-----------|
| Concurrency vs Parallelism | Concurrency = interleaved progress. Parallelism = simultaneous execution |
| Process vs Thread | Process = independent, own memory. Thread = lightweight, shared memory |
| Race condition | Multiple threads access shared data, outcome depends on timing |
| Critical section | Code accessing shared resource, needs mutual exclusion |
| Mutex vs Semaphore | Mutex = binary, owned. Semaphore = counting, no ownership |
| Binary Semaphore vs Mutex | Semaphore: any thread can signal. Mutex: only owner unlocks |
| Spin Lock vs Mutex | Spin lock busy-waits (fast, burns CPU). Mutex blocks (slower, saves CPU) |
| RW Lock vs Mutex | RW: multiple readers OR one writer. Mutex: one at a time |
| Deadlock vs Starvation vs Livelock | Deadlock: all blocked. Starvation: some blocked forever. Livelock: all active, no progress |
| Producer-Consumer | Producer adds to bounded buffer, consumer removes. Sync with condition variables |
| Dining Philosophers | 5 philos, 5 forks. Deadlock if all grab left. Fix: ordered locking |
| Why thread pools? | Reuse threads, limit resource usage, reduce creation overhead |
| Thread pool vs new thread per request | Pool = bounded, reusable. New thread = unbounded, expensive |
| Future vs CompletableFuture | Future = blocking get(). CompletableFuture = composable, non-blocking callbacks |
| Sync vs Async | Sync = wait for result. Async = continue, result later |
| Async vs Multithreading | Async = model (non-blocking). Multithreading = execution (multiple threads) |
| volatile vs synchronized | volatile = visibility. synchronized = visibility + mutual exclusion |
| HashMap vs ConcurrentHashMap | HashMap = not thread-safe. CHM = segment/CAS locking, thread-safe |
| CAS vs Locks | CAS = atomic instruction, no kernel. Lock = kernel involvement, blocking |
| Why atomic ops faster? | Single CPU instruction, no context switch, no kernel trap |

---

# Quick Reference: When to Use What

| Scenario | Solution |
|----------|----------|
| Protect shared counter | AtomicInteger (CAS) |
| Protect critical section | synchronized or ReentrantLock |
| Read-heavy, write-rare | ReadWriteLock or CopyOnWriteArrayList |
| Limit concurrent DB connections | Counting Semaphore |
| Producer-consumer queue | BlockingQueue + Thread Pool |
| Complex async chains | CompletableFuture |
| I/O-bound, many connections | Async/await + Event Loop |
| CPU-bound, parallel processing | Thread Pool (size = CPU cores) |
| Prevent deadlock | Lock ordering, timeout, tryLock |
| Thread-safe map | ConcurrentHashMap |
| Thread-safe list (read-heavy) | CopyOnWriteArrayList |

---

# Final Tip: Interview Flow for Concurrency Questions

```
1. Identify shared state (what's being accessed by multiple threads?)
2. Identify race conditions (read-modify-write? check-then-act?)
3. Choose synchronization (mutex for exclusion, semaphore for limiting, atomic for simple ops)
4. Check for deadlocks (lock ordering? timeouts?)
5. Consider performance (contention? granularity?)
6. Mention thread-safe alternatives (concurrent collections, thread pools)
```

> **Always remember:** Shared mutable state = danger. Make it immutable, localize it, or synchronize it.

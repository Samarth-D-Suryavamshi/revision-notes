
# Language-Specific — Interview Notes (System-First Approach)

---

## JAVA

---

### 1. JVM, JDK, JRE

```
JDK (Java Development Kit)
  |
  +-- JRE (Java Runtime Environment)
  |     |
  |     +-- JVM (Java Virtual Machine)
  |     |     |
  |     |     +-- Class Loader
  |     |     +-- Runtime Data Areas (Heap, Stack, Metaspace)
  |     |     +-- Execution Engine (Interpreter + JIT)
  |     |     +-- Garbage Collector
  |     |
  |     +-- Java Class Libraries
  |
  +-- Development Tools (javac, jdb, javadoc)
```

**JDK vs JRE vs JVM:**
| JDK | JRE | JVM |
|-----|-----|-----|
| Develop + Run | Run only | Execute bytecode |
| Includes JRE + tools | Includes JVM + libraries | Abstract machine |

**How Java executes code:**
```
Hello.java -> javac -> Hello.class (bytecode)
    |
java Hello -> JVM loads -> Class Loader -> Bytecode Verifier -> JIT Compiler -> Native Machine Code -> Execute
```

**What happens after `java Main`?**
1. JVM starts, creates main thread
2. Bootstrap Class Loader loads core classes (java.lang.*)
3. Extension Class Loader loads extension libraries
4. Application Class Loader loads user classes
5. Bytecode verifier checks validity
6. Interpreter executes bytecode (hot paths JIT-compiled)
7. Main method invoked

---

### 2. COLLECTIONS FRAMEWORK

**Hierarchy:**
```
Iterable
  |
  +-- Collection
  |     |
  |     +-- List (ordered, duplicates)
  |     |     +-- ArrayList (dynamic array, fast random access)
  |     |     +-- LinkedList (doubly linked, fast insert/delete)
  |     |     +-- Vector (synchronized, legacy)
  |     |     +-- Stack (LIFO, legacy)
  |     |
  |     +-- Set (unique)
  |     |     +-- HashSet (hash table, O(1))
  |     |     +-- LinkedHashSet (insertion order)
  |     |     +-- TreeSet (sorted, Red-Black tree, O(log n))
  |     |
  |     +-- Queue (FIFO)
  |           +-- PriorityQueue (heap, priority order)
  |           +-- LinkedList (as queue)
  |           +-- ArrayDeque (resizable array, faster than Stack)
  |
  +-- Map (key-value)
        +-- HashMap (hash table, O(1), not thread-safe)
        +-- LinkedHashMap (insertion/access order)
        +-- TreeMap (sorted, Red-Black tree)
        +-- Hashtable (synchronized, legacy)
        +-- ConcurrentHashMap (thread-safe, fine-grained locks)
```

**ArrayList vs LinkedList:**
| ArrayList | LinkedList |
|-----------|-----------|
| Dynamic array | Doubly linked list |
| Fast get(i): O(1) | Slow get(i): O(n) |
| Slow insert middle: O(n) | Fast insert middle: O(1) |
| Cache-friendly | More memory overhead |

**HashMap internals:**
```
Key -> hashCode() -> hash() -> index = (n-1) & hash
    |
Bucket (array of Node<K,V>)
    |
    +-- null? -> Store new node
    +-- collision? -> Linked list (treeify if > 8)
    |
    Load factor 0.75 -> Resize (double capacity) when 75% full
```

**HashMap vs ConcurrentHashMap:**
| HashMap | ConcurrentHashMap |
|---------|-------------------|
| Not thread-safe | Thread-safe |
| Null key/value allowed | Null not allowed |
| Fast | Slightly slower (segment locks) |
| Fail-fast iterator | Weakly consistent iterator |

**HashSet vs LinkedHashSet vs TreeSet:**
| HashSet | LinkedHashSet | TreeSet |
|---------|---------------|---------|
| Unordered | Insertion order | Sorted (natural/comparator) |
| O(1) ops | O(1) ops | O(log n) ops |
| Hash table | Hash table + linked list | Red-Black tree |

---

### 3. GENERICS

**Why Generics?**
→ Type safety at compile time. No ClassCastException at runtime.

**Type Erasure:**
```java
List<String> list = new ArrayList<>();
// At runtime: List (raw type), String info erased
// Compiler inserts casts automatically
```
→ Java replaces generic types with Object (or first bound). Bytecode has no generics.

**Wildcards:**
```java
List<? extends Number>  // Can read Number, can't add (covariant)
List<? super Integer>   // Can add Integer, read as Object (contravariant)
List<?>                 // Unbounded, read-only
```

**PECS Principle:**
→ Producer Extends, Consumer Super
- Producer (read): `? extends T`
- Consumer (write): `? super T`

---

### 4. EXCEPTION HANDLING

**Hierarchy:**
```
Throwable
  |
  +-- Error (unchecked, don't catch)
  |     +-- OutOfMemoryError
  |     +-- StackOverflowError
  |
  +-- Exception
        |
        +-- RuntimeException (unchecked)
        |     +-- NullPointerException
        |     +-- ArrayIndexOutOfBoundsException
        |     +-- IllegalArgumentException
        |
        +-- Checked (must handle or declare)
              +-- IOException
              +-- SQLException
              +-- ClassNotFoundException
```

**Checked vs Unchecked:**
| Checked | Unchecked |
|---------|-----------|
| Compile-time check | Runtime |
| External conditions | Programming errors |
| IOException, SQLException | NullPointerException, IllegalArgumentException |
| Must catch or throws | Optional |

**throw vs throws:**
- throw: Actually throw an exception instance
- throws: Declare that method might throw (for checked exceptions)

**finally:**
→ Always executes (even if exception thrown, return called). Use for cleanup (close resources).

---

### 5. STREAMS API

```java
List<Integer> nums = Arrays.asList(1, 2, 3, 4, 5);

nums.stream()
    .filter(n -> n % 2 == 0)    // keep even
    .map(n -> n * n)             // square
    .sorted()                     // sort
    .collect(Collectors.toList()); // [4, 16]
```

**Stream vs Collection:**
| Collection | Stream |
|-----------|--------|
| Stores data | Computes on demand |
| Eager evaluation | Lazy evaluation |
| Can traverse multiple times | Single-use |
| External iteration | Internal iteration |

**map vs flatMap:**
- map: Transform each element (1-to-1)
- flatMap: Transform + flatten (1-to-many)

```java
List<List<Integer>> nested = Arrays.asList(Arrays.asList(1,2), Arrays.asList(3,4));
nested.stream().flatMap(List::stream).collect(...); // [1,2,3,4]
```

**Why Streams are lazy?**
→ Intermediate operations (filter, map) don't execute until terminal operation (collect, forEach) called. Enables optimization (fuse operations, short-circuit).

---

### 6. JVM MEMORY LAYOUT

```
JVM Memory
  |
  +-- Heap (all objects, shared across threads)
  |     |
  |     +-- Young Generation
  |     |     +-- Eden (new objects)
  |     |     +-- Survivor 0
  |     |     +-- Survivor 1
  |     |
  |     +-- Old Generation (long-lived objects)
  |
  +-- Stack (per thread, method frames, local variables)
  |     +-- Local variables
  |     +-- Operand stack
  |     +-- Frame data
  |
  +-- Metaspace (class metadata, replaces PermGen)
  |
  +-- Program Counter (per thread, current instruction)
  |
  +-- Native Method Stack (native code)
```

**Heap vs Stack:**
| Heap | Stack |
|------|-------|
| All objects | Primitive locals, references |
| Shared (all threads) | Per thread |
| Managed by GC | Auto-managed (push/pop) |
| Slower allocation | Fast allocation |
| Larger | Smaller |

---

### 7. GARBAGE COLLECTION

**How GC works:**
```
1. Mark: Identify reachable objects (from GC roots: stack refs, static fields)
2. Sweep: Remove unreachable objects
3. Compact: Move surviving objects to reduce fragmentation (optional)
```

**Generational Hypothesis:**
→ Most objects die young. Few survive long.

**Young Generation (Minor GC):**
```
Eden (new objects) -> fills up -> Minor GC
    |
Survivors moved to S0 or S1
After several survivals -> Promoted to Old Gen
```

**Old Generation (Major GC / Full GC):**
→ Full GC scans entire heap. STW (Stop The World) pause. Expensive.

**Garbage Collectors:**
| Collector | Use Case | Characteristics |
|-----------|----------|----------------|
| Serial | Single-threaded apps | Simple, STW |
| Parallel | Throughput-focused | Multi-threaded, STW |
| CMS | Low latency (deprecated) | Concurrent, less STW |
| G1 GC | Balanced (default Java 9+) | Region-based, predictable pauses |
| ZGC | Ultra-low latency (<10ms) | Concurrent, scalable |
| Shenandoah | Low latency | Concurrent, region-based |

**Why Full GC expensive?**
→ Scans entire heap, long STW pause, all threads stopped.

---

### 8. MULTITHREADING

**Creating Threads:**
```java
// Way 1: extends Thread
class MyThread extends Thread { public void run() { ... } }

// Way 2: implements Runnable
class MyTask implements Runnable { public void run() { ... } }
new Thread(new MyTask()).start();

// Way 3: implements Callable (returns result)
Callable<String> task = () -> "result";
Future<String> future = executor.submit(task);
```

**Runnable vs Callable:**
| Runnable | Callable |
|----------|----------|
| void run() | T call() throws Exception |
| No return | Returns result |
| No checked exceptions | Can throw checked |

**synchronized vs Lock:**
| synchronized | Lock (ReentrantLock) |
|-------------|----------------------|
| Built-in keyword | Explicit object |
| Auto-release (block end) | Manual lock/unlock |
| No fairness option | Can be fair |
| No try-lock | tryLock() available |
| No interruptible | lockInterruptibly() |

**volatile vs synchronized:**
| volatile | synchronized |
|----------|--------------|
| Visibility only (read from main memory) | Visibility + atomicity |
| No mutual exclusion | Mutual exclusion |
| Use: flag variables | Use: compound operations |
| i++ NOT atomic | i++ atomic within block |

**Executor Framework:**
```java
ExecutorService executor = Executors.newFixedThreadPool(10);
executor.submit(task);
executor.shutdown();
```

**Thread Pools:**
| Type | Behavior |
|------|----------|
| FixedThreadPool | Fixed N threads, queue excess |
| CachedThreadPool | Create as needed, reuse idle |
| SingleThreadExecutor | One thread, sequential |
| ScheduledThreadPool | Delayed/periodic execution |
| WorkStealingPool | ForkJoinPool, work-stealing |

**CompletableFuture (async programming):**
```java
CompletableFuture.supplyAsync(() -> fetchUser())
    .thenApply(user -> user.getName())
    .thenAccept(name -> System.out.println(name))
    .exceptionally(ex -> "Error: " + ex.getMessage());
```

---

### 9. CONCURRENCY UTILITIES

| Utility | Purpose |
|---------|---------|
| CountDownLatch | Wait for N events |
| CyclicBarrier | Synchronize N threads at barrier |
| Semaphore | Control access to N resources |
| AtomicInteger/AtomicLong | Lock-free atomic operations |
| ConcurrentHashMap | Thread-safe map |
| CopyOnWriteArrayList | Thread-safe list (read-heavy) |
| BlockingQueue | Thread-safe queue |

---

### 10. JAVA 8+ FEATURES

| Feature | What It Does |
|---------|-------------|
| Lambda | `(x, y) -> x + y` - anonymous function |
| Functional Interface | Single abstract method interface (`@FunctionalInterface`) |
| Method Reference | `String::length` - shorthand for lambda |
| Optional | `Optional<T>` - avoid null checks |
| Streams | Functional data processing pipeline |
| Default Methods | Interface methods with default implementation |
| New Date/Time API | `LocalDate`, `LocalTime`, `ZonedDateTime` |

---

## PYTHON

---

### 1. PYTHON FUNDAMENTALS

**Object Model:**
→ Everything is an object. Variables are references to objects.

**Dynamic Typing:**
```python
x = 5      # x references int object 5
x = "hi"   # x now references str object "hi"
```

**Duck Typing:**
→ "If it walks like a duck and quacks like a duck, it's a duck."
→ No type checking. Call method, handle AttributeError if missing.

**LEGB Rule (Variable Resolution):**
```
L - Local (function scope)
E - Enclosing (outer function)
G - Global (module level)
B - Built-in (print, len, etc.)
```
→ Python searches in L -> E -> G -> B order.

---

### 2. MEMORY MANAGEMENT

**Reference Counting:**
```python
a = [1, 2, 3]  # ref count = 1
b = a          # ref count = 2
del a          # ref count = 1
del b          # ref count = 0 -> GC frees memory
```

**Why Reference Counting alone insufficient?**
→ Circular references: `a.ref = b; b.ref = a` -> ref count never reaches 0.

**Garbage Collector (Generational):**
```
Generation 0 (new objects) -> survive -> Generation 1 -> survive -> Generation 2
```
→ GC runs more frequently on younger generations.

**Object Interning:**
→ Small integers (-5 to 256) and short strings cached. `a = 5; b = 5` -> same object.

---

### 3. GIL (Global Interpreter Lock)

**What:**
→ Mutex protecting access to Python objects. Only one thread executes Python bytecode at a time.

**Why GIL?**
→ Simplifies memory management (reference counting). Prevents race conditions on object access.

**Impact:**
| Task Type | Effect |
|-----------|--------|
| CPU-bound | No speedup with threads (GIL serializes) |
| I/O-bound | Threads useful (GIL released during I/O) |

**Threads vs Processes in Python:**
| Threads | Processes |
|---------|-----------|
| Shared memory | Separate memory |
| GIL limited | No GIL, true parallelism |
| Good for I/O | Good for CPU |
| threading module | multiprocessing module |

```python
# CPU-bound: Use processes
from multiprocessing import Pool
pool = Pool(4)
results = pool.map(heavy_compute, data)

# I/O-bound: Use threads or asyncio
from concurrent.futures import ThreadPoolExecutor
with ThreadPoolExecutor(10) as ex:
    ex.map(fetch_url, urls)
```

---

### 4. ITERATORS

**Iterator Protocol:**
```python
class MyIterator:
    def __iter__(self): return self
    def __next__(self):
        if no_more: raise StopIteration
        return next_value
```

**Iterable vs Iterator:**
| Iterable | Iterator |
|----------|----------|
| Has __iter__() | Has __iter__() + __next__() |
| Can loop over | Can loop over + remembers state |
| list, tuple, dict | Generator, file objects |

---

### 5. GENERATORS

**What:**
→ Functions that yield values lazily. Memory efficient.

```python
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

# Usage: for num in fibonacci(1000000): print(num)  # Uses O(1) memory
```

**Generator vs List:**
| Generator | List |
|-----------|------|
| Lazy evaluation | Eager evaluation |
| O(1) memory | O(n) memory |
| Single iteration | Multiple iterations |
| Values computed on demand | All values stored |

**Generator Expression:**
```python
squares = (x*x for x in range(1000000))  # Generator
squares = [x*x for x in range(1000000)]  # List (uses memory)
```

---

### 6. DECORATORS

**What:**
→ Higher-order function that wraps another function.

```python
def timer(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        print(f"Took {time.time() - start}s")
        return result
    return wrapper

@timer
def slow_func(): ...
# Equivalent: slow_func = timer(slow_func)
```

**How it works internally:**
```
1. Define wrapper function
2. wrapper calls original func
3. Return wrapper (replaces original name)
4. @syntax is syntactic sugar for reassignment
```

---

### 7. CONTEXT MANAGERS

**What:**
→ Manage resources (files, locks, connections) with setup/cleanup.

```python
with open('file.txt', 'r') as f:
    data = f.read()
# f.close() called automatically, even if exception
```

**How it works:**
```python
class File:
    def __enter__(self):      # setup
        self.file = open(self.path)
        return self.file
    def __exit__(self, exc_type, exc_val, traceback):  # cleanup
        self.file.close()
```

**Why use?**
→ Guaranteed cleanup, readable, exception-safe.

---

### 8. ASYNC PROGRAMMING

```python
import asyncio

async def fetch(url):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.text()

async def main():
    tasks = [fetch(url) for url in urls]
    results = await asyncio.gather(*tasks)

asyncio.run(main())
```

**asyncio vs Threads:**
| asyncio | Threads |
|---------|---------|
| Single thread, event loop | Multiple threads |
| Cooperative multitasking | Preemptive multitasking |
| await yields control | OS switches threads |
| Great for many connections | Good for parallel CPU |
| No GIL issues (one thread) | GIL limits CPU parallelism |

**When asyncio?**
→ Thousands of concurrent connections (web servers, chat). Less overhead than threads.

---

## C++

---

### 1. STL

**Containers:**
| Container | Underlying | Use Case |
|-----------|-----------|----------|
| vector | Dynamic array | Default, fast random access |
| list | Doubly linked list | Frequent insert/delete middle |
| deque | Double-ended queue | Fast push/pop both ends |
| set | Red-Black tree | Sorted unique elements |
| map | Red-Black tree | Sorted key-value |
| unordered_set | Hash table | Fast lookup, unordered |
| unordered_map | Hash table | Fast key-value, unordered |
| queue | Adapter (deque/list) | FIFO |
| stack | Adapter (deque/list) | LIFO |
| priority_queue | Heap | Max/min element access |

**vector vs list:**
| vector | list |
|--------|------|
| Contiguous memory | Scattered nodes |
| O(1) random access | O(n) random access |
| O(n) insert middle | O(1) insert middle (with iterator) |
| Cache-friendly | Cache-unfriendly |
| May reallocate | Stable iterators |

**map vs unordered_map:**
| map | unordered_map |
|-----|---------------|
| Sorted | Unordered |
| O(log n) | O(1) average |
| Tree-based | Hash-based |
| Custom comparator | Hash function |

**Algorithms:**
```cpp
sort(v.begin(), v.end());                    // O(n log n)
lower_bound(v.begin(), v.end(), x);          // First >= x, O(log n)
upper_bound(v.begin(), v.end(), x);          // First > x, O(log n)
binary_search(v.begin(), v.end(), x);        // Exists? O(log n)
```

---

### 2. SMART POINTERS

**Why Smart Pointers?**
→ Automatic memory management. Prevent leaks, dangling pointers, double-free.

| Pointer | Ownership | Use Case |
|---------|-----------|----------|
| unique_ptr | Exclusive | Sole owner, auto-delete |
| shared_ptr | Shared | Multiple owners, reference counted |
| weak_ptr | Non-owning | Break cycles, observe without keeping alive |

```cpp
unique_ptr<Resource> res = make_unique<Resource>();
// res owns resource exclusively
// Cannot copy, only move

shared_ptr<Resource> s1 = make_shared<Resource>();
shared_ptr<Resource> s2 = s1;
// Both own, ref count = 2
// Last one destroyed -> resource freed

weak_ptr<Resource> w = s1;
// Doesn't affect ref count
// Must lock() to get shared_ptr before use
```

**shared_ptr vs unique_ptr:**
| unique_ptr | shared_ptr |
|-----------|-----------|
| Zero overhead | Reference count overhead |
| Move-only | Copyable |
| Single owner | Shared ownership |
| Preferred default | When shared needed |

---

### 3. RAII

**Resource Acquisition Is Initialization:**
→ Acquire resource in constructor. Release in destructor. Guaranteed cleanup.

```cpp
class FileHandle {
    FILE* file;
public:
    FileHandle(const char* path) { file = fopen(path, "r"); }
    ~FileHandle() { if (file) fclose(file); }  // guaranteed cleanup
    // No manual close needed, exception-safe
};

// Usage:
void process() {
    FileHandle fh("data.txt");  // opens
    // ... use fh ...
} // fh destroyed, file closed automatically (even if exception thrown)
```

**Why important?**
→ Exception safety, no resource leaks, deterministic cleanup.

---

### 4. MOVE SEMANTICS

**Why introduced?**
→ Avoid expensive copies of temporary objects.

```cpp
vector<string> createList() {
    vector<string> v = {"a", "b", "c"};
    return v;  // Move (not copy) - v is about to be destroyed
}

vector<string> list = createList();  // Move constructor called
```

**Copy vs Move:**
| Copy | Move |
|------|------|
| Duplicate data | Transfer ownership |
| Source unchanged | Source left in valid but unspecified state |
| Deep copy for pointers | Steal pointer, null out source |
| Expensive | Cheap |

**Rvalue References:**
```cpp
void process(vector<int>&& v);  // Takes temporary (rvalue)
void process(const vector<int>& v);  // Takes lvalue or const rvalue

vector<int> getData();
process(getData());  // Calls rvalue ref version (move)

vector<int> data = {1,2,3};
process(std::move(data));  // Explicitly move from data
```

**Perfect Forwarding:**
→ Preserve value category (lvalue/rvalue) when passing arguments.

---

### 5. MODERN C++

| Feature | What |
|---------|------|
| auto | Type inference: `auto x = 5;` |
| constexpr | Compile-time computation |
| Range-based for | `for (auto& x : container)` |
| Lambda | `[capture](params) -> return_type { body }` |
| enum class | Type-safe enums |
| nullptr | Type-safe null pointer |
| Smart pointers | unique_ptr, shared_ptr, weak_ptr |
| Move semantics | Transfer instead of copy |

---

## CROSS-LANGUAGE COMPARISON

| Topic | Java | Python | C++ |
|-------|------|--------|-----|
| Memory | GC (automatic) | GC (ref counting + generational) | Manual / Smart pointers |
| Exceptions | Checked + Unchecked | Only unchecked | No checked exceptions |
| Collections | Rich framework (Collections) | Built-in (list, dict, set) | STL |
| Concurrency | Threads + ExecutorService | Threads + asyncio + multiprocessing | Threads + async |
| Null Safety | Optional | None (use checks) | nullptr |
| Generics | Type erasure | Duck typing | Templates |
| Lambdas | Java 8+ | Always | C++11+ |
| Pass by | Value (primitives) / Reference (objects) | Reference (always) | Value (default) / Reference (explicit) |

---

## COMPLETE WORKFLOW: "How does Java execute a program?"

```
1. Write: Hello.java
   public class Hello { public static void main(String[] args) { ... } }

2. Compile: javac Hello.java
   -> Hello.class (bytecode)

3. Run: java Hello
   |
   a. JVM Bootstrap
      - Create JVM instance
      - Initialize system classes
   |
   b. Class Loading
      - Bootstrap Class Loader: java.lang.*, java.util.*
      - Extension Class Loader: extension libraries
      - Application Class Loader: user classes (Hello.class)
   |
   c. Linking
      - Verification: Bytecode valid?
      - Preparation: Allocate static fields
      - Resolution: Resolve symbolic references
   |
   d. Initialization
      - Execute static initializers
      - Set static field values
   |
   e. Execution
      - Find main(String[])
      - Create main thread
      - Allocate stack frame
      - Execute bytecode (interpreter)
      - Hot methods JIT-compiled to native code
   |
   f. During Execution
      - Objects allocated on Heap
      - Local variables on Stack
      - GC runs in background
   |
   g. Termination
      - main() returns
      - Non-daemon threads finish
      - JVM shuts down
```

---

## COMPLETE WORKFLOW: "How does HashMap work internally?"

```
HashMap<String, Integer> map = new HashMap<>();

1. put("key", 100)
   |
   a. hash = hash("key")  // hashCode() ^ (hashCode() >>> 16)
   |
   b. index = (n - 1) & hash  // n = table length (power of 2)
   |
   c. table[index] == null?
      Yes: Create new Node, store at index
      No: Check key equality
         Match: Update value
         No match: Append to linked list
   |
   d. Size > threshold (load factor 0.75 * capacity)?
      Yes: Resize (double capacity), rehash all entries

2. get("key")
   |
   a. hash = hash("key")
   b. index = (n - 1) & hash
   c. Traverse bucket (list or tree)
   d. Return matching Node's value

3. Collision Handling
   - < 8 nodes in bucket: Linked list
   - >= 8 nodes: Convert to Red-Black tree (O(log n) vs O(n))
   - <= 6 nodes: Convert back to list
```

---

## COMPLETE WORKFLOW: "How does Python's GIL affect threading?"

```
Thread 1: CPU work
    |
    acquire GIL
    execute 100 bytecode instructions (or timeout)
    release GIL
    |
Thread 2: CPU work
    |
    acquire GIL
    execute 100 bytecode instructions
    release GIL
    |
Result: Threads alternate, NOT parallel for CPU work

I/O Operation:
Thread 1: read file
    |
    acquire GIL
    start I/O
    release GIL (I/O doesn't need GIL)
    |
Thread 2: CPU work
    |
    acquire GIL
    execute bytecode (while Thread 1 waits for I/O)
    |
Result: Threads overlap during I/O, useful for I/O-bound

Solution for CPU-bound:
- multiprocessing: Separate processes, each with own GIL
- C extensions: Release GIL during C code
- asyncio: Single thread, cooperative multitasking
```

---

## COMPLETE WORKFLOW: "How does C++ RAII work with exceptions?"

```cpp
void process() {
    DatabaseConnection conn("db");      // ctor: connect
    FileHandle file("data.txt");        // ctor: open
    LockGuard lock(mutex);              // ctor: acquire lock

    riskyOperation();                   // might throw!

} // All destructors called in reverse order, guaranteed!
  // lock released -> file closed -> connection closed

// Even if riskyOperation() throws:
//   Stack unwinding happens
//   Local objects destroyed
//   No leaks, no dangling locks
//   Exception propagates to caller
```

---

## QUICK ANSWER CHEAT SHEET

| Question | Answer |
|----------|--------|
| JDK vs JRE vs JVM? | JDK = develop+run; JRE = run; JVM = execute bytecode |
| How Java executes code? | javac -> bytecode -> Class Loader -> Verifier -> JIT -> native code |
| Heap vs Stack? | Heap = all objects shared; Stack = per thread locals |
| HashMap internals? | Array of buckets, hash -> index, linked list/tree for collisions |
| HashMap vs ConcurrentHashMap? | HashMap = not thread-safe; ConcurrentHashMap = fine-grained locks |
| ArrayList vs LinkedList? | ArrayList = fast get, slow insert; LinkedList = slow get, fast insert |
| HashSet vs TreeSet? | HashSet = unordered O(1); TreeSet = sorted O(log n) |
| Why Generics? | Type safety, no ClassCastException |
| Type Erasure? | Generics removed at runtime, replaced with Object |
| extends vs super wildcard? | extends = read (Producer); super = write (Consumer) |
| Checked vs Unchecked? | Checked = compile-time, external; Unchecked = runtime, programming error |
| throw vs throws? | throw = actually throw; throws = declare possibility |
| Why finally? | Guaranteed cleanup regardless of exception |
| Stream vs Collection? | Stream = lazy compute; Collection = stored data |
| map vs flatMap? | map = 1-to-1 transform; flatMap = 1-to-many + flatten |
| Why Streams lazy? | Intermediate ops deferred until terminal op, enables optimization |
| Runnable vs Callable? | Runnable = void, no exception; Callable = returns T, throws |
| synchronized vs Lock? | synchronized = auto-release; Lock = manual, more features |
| volatile vs synchronized? | volatile = visibility only; synchronized = visibility + atomicity |
| How GC works? | Mark reachable -> Sweep unreachable -> Compact (optional) |
| Minor vs Major GC? | Minor = Young Gen; Major/Full = entire heap |
| Why Full GC expensive? | Scans entire heap, long STW pause |
| G1 vs ZGC? | G1 = balanced, region-based; ZGC = ultra-low latency (<10ms) |
| CompletableFuture? | Async programming, chain operations, handle exceptions |
| CountDownLatch? | Wait for N events before proceeding |
| CyclicBarrier? | Synchronize N threads at a point, reusable |
| Java 8 features? | Lambda, Streams, Optional, Default methods, Method refs |
| Python LEGB? | Local -> Enclosing -> Global -> Built-in |
| Duck Typing? | If it has the method, use it. No type checking |
| Python memory management? | Reference counting + generational GC for cycles |
| Why ref counting insufficient? | Circular references never reach 0 |
| What is GIL? | Mutex allowing only one thread to execute Python bytecode |
| Why GIL? | Simplifies reference counting, prevents race conditions |
| Threads vs Processes Python? | Threads = shared memory, GIL-limited; Processes = separate, parallel |
| When asyncio? | Many concurrent connections, less overhead than threads |
| Generator vs List? | Generator = lazy, O(1) memory; List = eager, O(n) memory |
| How decorators work? | Wrapper function replaces original, adds behavior |
| Context managers? | __enter__ setup, __exit__ cleanup, guaranteed execution |
| C++ vector vs list? | vector = contiguous, fast access; list = linked, fast insert |
| map vs unordered_map? | map = sorted tree O(log n); unordered_map = hash O(1) |
| Why Smart Pointers? | Automatic memory management, prevent leaks |
| unique_ptr vs shared_ptr? | unique_ptr = exclusive, move-only; shared_ptr = shared, refcounted |
| What is RAII? | Acquire in constructor, release in destructor |
| Why RAII important? | Exception safety, deterministic cleanup, no leaks |
| Copy vs Move? | Copy = duplicate; Move = transfer ownership, cheap |
| Why move semantics? | Avoid expensive copies of temporaries |
| Rvalue reference? | && binds to temporaries, enables move |
| auto? | Type inference at compile time |
| constexpr? | Compile-time computation |
| Lambda capture? | [ ] = none, [=] = by value, [&] = by reference |
| Pass by value vs reference? | Value = copy; Reference = alias, no copy |
| Mutable vs Immutable Python? | Mutable = can change (list, dict); Immutable = can't (tuple, str, int) |
| Python is pass by? | Pass by object reference (like pass by value of reference) |
| Java is pass by? | Pass by value (primitives = copy, objects = reference copy) |
| C++ is pass by? | Pass by value (default), reference (explicit), pointer |
| String immutable Java? | Yes, for security, hash caching, thread safety |
| StringBuilder vs StringBuffer? | StringBuilder = faster, not thread-safe; StringBuffer = synchronized |
| equals vs == Java? | == = reference equality; equals = content equality |
| hashCode vs equals? | Equal objects must have same hashCode |
| Comparable vs Comparator? | Comparable = natural ordering (this vs other); Comparator = external ordering |
| Comparable contract? | sgn(x.compareTo(y)) == -sgn(y.compareTo(x)); transitive |
| Cloneable interface? | Marker for Object.clone() support |
| Serializable interface? | Marker for object serialization |
| transient keyword? | Field not serialized |
| volatile keyword? | Read from main memory, not cache |
| final keyword? | Variable = can't reassign; Method = can't override; Class = can't inherit |
| static keyword? | Belongs to class, not instance |
| abstract class? | Can't instantiate, may have abstract methods |
| interface default method? | Method with implementation in interface |
| static method in interface? | Utility method, not inherited |
| functional interface? | Single abstract method, lambda target |
| method reference types? | Static, Instance, Constructor, Arbitrary object |
| Optional purpose? | Avoid null, explicit absence handling |
| Stream parallel? | parallelStream() for parallel processing |
| Collectors.toMap? | Collect stream to Map |
| Collectors.groupingBy? | Group by key |
| Collectors.partitioningBy? | Partition by predicate |
| Stream reduce? | Combine elements to single result |
| Stream collect? | Mutable reduction to collection |
| Stream flatMap? | Map + flatten nested structures |
| Stream peek? | Inspect elements without consuming |
| Stream distinct? | Remove duplicates |
| Stream sorted? | Natural or custom order |
| Stream limit/skip? | Truncate or skip elements |
| Stream findFirst/findAny? | Return Optional of first/any match |
| Stream anyMatch/allMatch/noneMatch? | Short-circuit boolean checks |
| Stream iterate/generate? | Create infinite streams |
| IntStream/LongStream/DoubleStream? | Primitive specialized streams |
| Boxing/unboxing? | Primitive <-> Wrapper auto-conversion |
| Autoboxing performance? | Creates objects, use primitive streams for performance |
| String pool? | Interned strings in heap for reuse |
| intern() method? | Add string to pool manually |
| Class Loader types? | Bootstrap, Extension, Application, Custom |
| Class Loader delegation? | Parent-first delegation model |
| Custom Class Loader? | Load classes from non-standard sources |
| Reflection? | Inspect/modify classes at runtime |
| Annotation? | Metadata for compiler/runtime |
| @Override? | Compiler verifies method override |
| @Deprecated? | Mark obsolete |
| @SuppressWarnings? | Ignore compiler warnings |
| @FunctionalInterface? | Compiler verifies SAM |
| @SafeVarargs? | Suppress varargs warnings |
| Java module system? | JPMS, encapsulation at package level |
| module-info.java? | Declare module dependencies and exports |
| requires transitive? | Dependent modules get transitive dependency |
| exports vs opens? | exports = compile+runtime; opens = reflection only |
| ServiceLoader? | Load service implementations dynamically |
| SPI? | Service Provider Interface |
| JDBC? | Java database connectivity |
| JNDI? | Java naming and directory interface |
| JMX? | Java management extensions |
| JNI? | Java native interface |
| NIO? | Non-blocking I/O |
| NIO.2? | Path, Files, WatchService |
| ByteBuffer? | Direct buffer for I/O |
| Channel? | Connection to entity capable of I/O |
| Selector? | Multiplexed non-blocking I/O |
| CompletableFuture thenCompose? | Flatten nested futures |
| CompletableFuture thenCombine? | Combine two independent futures |
| CompletableFuture allOf/anyOf? | Wait for all/any to complete |
| CompletableFuture exceptionally? | Handle exception |
| CompletableFuture handle? | Handle success or exception |
| CompletableFuture whenComplete? | Side effect on completion |
| ForkJoinPool? | Work-stealing thread pool |
| RecursiveTask? | Task returning result for ForkJoin |
| RecursiveAction? | Task without result for ForkJoin |
| StampedLock? | Optimistic read locking |
| ReadWriteLock? | Multiple readers or one writer |
| Condition? | Wait/notify alternative with locks |
| BlockingQueue types? | ArrayBlockingQueue, LinkedBlockingQueue, PriorityBlockingQueue, SynchronousQueue, DelayQueue |
| TransferQueue? | Blocking queue with transfer |
| ConcurrentLinkedQueue? | Lock-free queue |
| CopyOnWriteArrayList? | Thread-safe, copy-on-write |
| ConcurrentHashMap computeIfAbsent? | Atomic compute if key absent |
| ConcurrentHashMap merge? | Atomic merge operation |
| AtomicInteger? | Lock-free integer operations |
| AtomicReference? | Lock-free reference operations |
| CAS? | Compare-And-Swap, lock-free primitive |
| ABA problem? | Value changed A->B->A, CAS succeeds incorrectly |
| AtomicStampedReference? | Solve ABA with version stamp |
| LongAdder? | Better than AtomicLong for high contention |
| Exchanger? | Thread pair exchange objects |
| Phaser? | Flexible barrier |
| Semaphore? | Control access to N resources |
| CountDownLatch vs CyclicBarrier? | Latch = one-time; Barrier = reusable |
| ThreadLocal? | Per-thread variable |
| InheritableThreadLocal? | Child threads inherit value |
| ExecutorService shutdown? | Graceful shutdown, wait for tasks |
| ExecutorService shutdownNow? | Attempt immediate shutdown |
| Future get timeout? | Wait with timeout, throw TimeoutException |
| Future cancel? | Cancel task, may interrupt |
| ScheduledExecutorService? | Delayed and periodic execution |
| ThreadFactory? | Custom thread creation |
| UncaughtExceptionHandler? | Handle uncaught thread exceptions |
| Thread states? | NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, TERMINATED |
| Thread join? | Wait for thread to finish |
| Thread interrupt? | Request thread to stop, cooperative |
| Thread yield? | Hint to scheduler |
| Thread priority? | Hint to scheduler, platform-dependent |
| Thread daemon? | Background thread, JVM exits if only daemons |
| Object wait/notify? | Low-level thread coordination |
| Object wait vs sleep? | wait = release lock, notify to wake; sleep = hold lock, time wake |
| IllegalMonitorStateException? | wait/notify without owning monitor |
| Spurious wakeup? | wait() wakes without notify() |
| Always wait in loop? | while (!condition) wait(); |
| Double-checked locking? | Lazy initialization with volatile |
| Singleton pattern? | One instance globally |
| Enum singleton? | Best Java singleton, serialization-safe |
| Factory pattern? | Create objects without exposing constructor |
| Builder pattern? | Step-by-step construction |
| Strategy pattern? | Interchangeable algorithms |
| Observer pattern? | Subscribe/notify |
| Decorator pattern? | Add behavior dynamically |
| Adapter pattern? | Convert interface |
| Proxy pattern? | Control access |
| Command pattern? | Encapsulate request |
| Template method? | Skeleton algorithm |
| State pattern? | Behavior changes with state |
| Chain of Responsibility? | Pass request along chain |
| Iterator pattern? | Traverse collection |
| Memento pattern? | Capture/restore state |
| Mediator pattern? | Centralize communication |
| Flyweight pattern? | Share common state |
| Bridge pattern? | Separate abstraction from implementation |
| Composite pattern? | Tree structure, uniform interface |
| Visitor pattern? | Add operations without modifying classes |
| Interpreter pattern? | Grammar evaluation |
| Python GIL released when? | I/O operations, sleep, C extensions |
| Python __name__ == "__main__"? | Entry point check |
| Python __init__? | Constructor |
| Python __str__ vs __repr__? | __str__ = readable; __repr__ = unambiguous |
| Python __eq__? | Equality comparison |
| Python __hash__? | Hash for dict/set keys |
| Python __len__? | len() support |
| Python __getitem__? | [] indexing |
| Python __iter__? | Iterator protocol |
| Python __call__? | Make object callable |
| Python __enter__/__exit__? | Context manager protocol |
| Python __slots__? | Restrict attributes, save memory |
| Python __getattr__? | Dynamic attribute access |
| Python __setattr__? | Dynamic attribute assignment |
| Python __del__? | Destructor (avoid, use context managers) |
| Python property decorator? | Getter/setter as attribute |
| Python @staticmethod? | No instance/class access |
| Python @classmethod? | Access class, not instance |
| Python @property? | Getter decorator |
| Python descriptor? | Custom attribute access |
| Python metaclass? | Class of a class |
| Python type() vs isinstance()? | type = exact class; isinstance = inheritance-aware |
| Python deepcopy? | Recursive copy of object graph |
| Python copy? | Shallow copy |
| Python pickle? | Object serialization |
| Python json? | JSON serialization |
| Python csv? | CSV file handling |
| Python re? | Regular expressions |
| Python collections? | Specialized containers |
| Python itertools? | Iterator tools |
| Python functools? | Higher-order functions |
| Python operator? | Function versions of operators |
| Python dataclasses? | Auto-generated boilerplate classes |
| Python typing? | Type hints (not enforced at runtime) |
| Python mypy? | Static type checker |
| Python pytest? | Testing framework |
| Python unittest? | Built-in testing |
| Python mock? | Test doubles |
| Python patch? | Temporarily replace objects |
| Python contextlib? | Context manager utilities |
| Python functools.lru_cache? | Memoization decorator |
| Python functools.partial? | Pre-fill function arguments |
| Python functools.reduce? | Fold operation |
| Python itertools.chain? | Flatten iterables |
| Python itertools.groupby? | Group consecutive equal elements |
| Python itertools.permutations? | All permutations |
| Python itertools.combinations? | All combinations |
| Python collections.Counter? | Count hashable objects |
| Python collections.defaultdict? | Default value dict |
| Python collections.OrderedDict? | Remember insertion order (3.7+ built-in) |
| Python collections.deque? | Double-ended queue |
| Python collections.namedtuple? | Named tuple subclass |
| Python heapq? | Heap queue |
| Python bisect? | Binary search for lists |
| Python array? | Typed array |
| Python struct? | Parse binary data |
| Python mmap? | Memory-mapped files |
| Python socket? | Network programming |
| Python urllib? | URL handling |
| Python http? | HTTP client/server |
| Python sqlite3? | SQLite database |
| Python threading? | Thread-based parallelism |
| Python multiprocessing? | Process-based parallelism |
| Python concurrent.futures? | High-level async execution |
| Python asyncio? | Async I/O |
| Python aiohttp? | Async HTTP client/server |
| Python requests? | HTTP library |
| Python flask? | Web framework |
| Python django? | Web framework |
| Python fastapi? | Modern web framework |
| Python sqlalchemy? | ORM |
| Python pandas? | Data analysis |
| Python numpy? | Numerical computing |
| C++ Rule of Three? | Destructor, copy ctor, copy assignment |
| C++ Rule of Five? | + move ctor, move assignment |
| C++ Rule of Zero? | Use smart pointers, no manual resource management |
| C++ explicit constructor? | Prevent implicit conversion |
| C++ delete function? | = delete to disable |
| C++ default function? | = default for compiler-generated |
| C++ noexcept? | Function doesn't throw |
| C++ constexpr if? | Compile-time conditional |
| C++ static_assert? | Compile-time assertion |
| C++ decltype? | Deduce expression type |
| C++ typeid? | Runtime type information |
| C++ dynamic_cast? | Safe downcast with runtime check |
| C++ static_cast? | Compile-time cast |
| C++ reinterpret_cast? | Low-level reinterpretation |
| C++ const_cast? | Add/remove const |
| C++ SFINAE? | Substitution Failure Is Not An Error |
| C++ Concepts? | C++20 compile-time constraints |
| C++ Coroutines? | C++20 suspendable functions |
| C++ Modules? | C++20 replacement for headers |
| C++ Ranges? | C++20 composable algorithms |
| C++ std::span? | Non-owning view of contiguous data |
| C++ std::string_view? | Non-owning view of string |
| C++ std::optional? | Optional value |
| C++ std::variant? | Type-safe union |
| C++ std::any? | Type-erased container |
| C++ std::tuple? | Fixed-size collection of values |
| C++ std::function? | Type-erased callable |
| C++ std::bind? | Partial function application |
| C++ std::thread? | OS thread |
| C++ std::async? | Async task |
| C++ std::promise? | Set value for future |
| C++ std::future? | Async result |
| C++ std::shared_future? | Multiple futures from one promise |
| C++ std::mutex? | Mutual exclusion |
| C++ std::recursive_mutex? | Reentrant mutex |
| C++ std::timed_mutex? | Mutex with timeout |
| C++ std::lock_guard? | RAII mutex lock |
| C++ std::unique_lock? | Flexible mutex lock |
| C++ std::shared_lock? | Shared mutex read lock |
| C++ std::condition_variable? | Thread synchronization |
| C++ std::atomic? | Lock-free atomic operations |
| C++ std::memory_order? | Memory ordering constraints |
| C++ std::thread_local? | Per-thread storage |
| C++ std::this_thread? | Current thread operations |

---

## SKIP THESE (Unless Runtime/Compiler Role)

Java: JVM bytecode verification internals, JIT optimization algorithms, GC implementation details, Java Memory Model specification
Python: CPython source code, bytecode interpreter internals, reference counting implementation, C API
C++: Template metaprogramming, expression templates, compiler optimization internals, ABI details, placement new

---

**Revision Order:**

Java: Fundamentals -> Collections -> Generics -> Exceptions -> Streams -> JVM -> GC -> Multithreading -> Concurrency -> Java 8+
Python: Fundamentals -> Memory -> GIL -> Iterators -> Generators -> Decorators -> Context Managers -> asyncio
C++: STL -> Smart Pointers -> RAII -> Move Semantics -> Modern C++

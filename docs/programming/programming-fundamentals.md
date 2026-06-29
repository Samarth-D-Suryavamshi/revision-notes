
# PROGRAMMING FUNDAMENTALS

## PRIORITY 1 — PROGRAMMING BASICS

## Variables

**1-liner:** Variable = named box in memory that holds a value.

**Flow:**
```
Declaration: int age;          → Compiler reserves 4 bytes in memory → Label: "age"
Initialization: age = 25;       → Value 25 written into those 4 bytes
Access: print(age);            → CPU reads value from memory address → Output: 25
Reassignment: age = 30;      → Old value overwritten → Memory now holds 30
```

| Concept | What it means | Flow |
|---------|-------------|------|
| **Variable** | Named storage that can change | Create box → Put value → Change value later |
| **Constant** | Named storage that CANNOT change | Create box → Put value → Lock it → Compile-time error if changed |
| **Mutable** | Can be modified after creation | `let x = 5; x = 10;` → OK |
| **Immutable** | Cannot be modified after creation | `const x = 5; x = 10;` → Error |
| **Local** | Lives inside function/block | Function starts → Created → Function ends → Destroyed |
| **Global** | Lives everywhere | Program starts → Created → Program ends → Destroyed |

**Lifetime vs Scope:**
- **Scope:** Where can I see this variable? (visibility)
- **Lifetime:** When does this variable exist in memory? (duration)
```
{                          // Block scope starts
    int x = 5;             // x born here
    print(x);              // x visible here
}                          // x dies here (out of scope)
print(x);                  // Error: x doesn't exist anymore
```

---

## Data Types

**Primitive vs Reference:**

| | Primitive | Reference |
|---|---|---|
| **Stores** | Actual value | Memory address (pointer) |
| **Memory** | Stack | Heap |
| **Copy behavior** | Copies value | Copies reference (same object) |
| **Examples** | int, float, bool, char | Object, Array, String |

**Flow — Primitive:**
```
int a = 5;          // Stack: [a: 5]
int b = a;          // Stack: [a: 5, b: 5] → COPIED value
b = 10;             // Stack: [a: 5, b: 10] → a unchanged
```

**Flow — Reference:**
```
Person p1 = new Person("Alice");   // Heap: Person("Alice") at 0x1000
                                   // Stack: [p1: 0x1000]
Person p2 = p1;                    // Stack: [p1: 0x1000, p2: 0x1000] → Same address!
p2.name = "Bob";                   // Heap object modified → p1.name is also "Bob"
```

**Integer Overflow:**
```
8-bit unsigned: max = 255
    255 + 1 → 0 (wraps around) → Bug!
    Solution: Use larger type (int → long) or check before adding
```

**Floating Point Precision:**
```
0.1 + 0.2 → 0.30000000000000004 (not exactly 0.3!)
    Why? Binary can't precisely represent 0.1 → Small rounding error accumulates
    Fix: Use BigDecimal for money, or epsilon comparison: abs(a - b) < 0.0001
```

---

## Type Systems

| Type System | What it means | Languages | Flow |
|-------------|-------------|-----------|------|
| **Static** | Types checked at compile time | Java, C++, Go | Write code → Compiler checks types → Error before running |
| **Dynamic** | Types checked at runtime | Python, JS, Ruby | Write code → Run → Type error crashes program |
| **Strong** | Types strictly enforced | Java, Python, Rust | "5" + 3 → TypeError (can't mix types) |
| **Weak** | Types coerced automatically | JS, PHP | "5" + 3 → "53" (number coerced to string) |

**Casting Flow:**
```
Implicit: int a = 5; double b = a;     // 5 → 5.0 (safe, compiler does it)
Explicit:  double a = 5.7; int b = (int)a;  // 5.7 → 5 (truncated, you asked for it)
```

---

# PRIORITY 2 — OPERATORS

**Operator Precedence & Associativity:**
```
Expression: 2 + 3 * 4
    → * has higher precedence → 3 * 4 = 12 → 2 + 12 = 14
    → NOT (2 + 3) * 4 = 20!

Expression: 10 - 5 - 2
    → Left-to-right (left associative) → (10 - 5) - 2 = 3
    → NOT 10 - (5 - 2) = 7!
```

**Short-Circuit Evaluation:**
```
if (user != null && user.isActive())
    → user is null? → First condition false → SKIP second check → No NullPointerException!

if (user != null || user.isAdmin())
    → user is not null? → First condition true → SKIP second check
```
**Key:** `&&` stops at first false. `||` stops at first true. Prevents errors, improves performance.

---

# PRIORITY 3 — CONTROL FLOW

**if-else vs switch:**
```
if-else: Chain of boolean checks → Flexible conditions → Any expression
    if (score >= 90) → else if (score >= 80) → else if (score >= 70) → else

switch: Jump table → Direct value match → Only equality, faster for many cases
    switch(grade) { case 'A': ... case 'B': ... default: ... }
```

**Loop Flows:**
```
for (i=0; i<5; i++):    // Initialization → Condition → Body → Increment → Repeat
    i=0 → i<5? yes → print(0) → i=1 → i<5? yes → ... → i=5 → i<5? no → Exit

while (condition):       // Check first → Body → Repeat
    condition true? → Body → Check again → ... → condition false → Exit

do-while:               // Body first → Check → Repeat
    Body → condition true? → Body → ... → condition false → Exit
```

**break vs continue vs return:**

| Statement | Flow | Use |
|-----------|------|-----|
| `break` | Exit loop immediately | Found what I need, stop searching |
| `continue` | Skip rest of iteration, go to next | Skip invalid items, process rest |
| `return` | Exit function, send value back | Done with function, here's the result |

---

# PRIORITY 4 — FUNCTIONS

**Parameter vs Argument:**
```
Function definition:  void greet(String name) { ... }     // name = parameter (placeholder)
Function call:         greet("Alice");                    // "Alice" = argument (actual value)
```

**Pure Function:**
```
// Pure: Same input → Same output, No side effects
int add(int a, int b) { return a + b; }
    add(2, 3) → Always 5 → Doesn't touch anything outside

// Impure: Side effects, depends on external state
int counter = 0;
int increment() { return ++counter; }  // Different result each call! Modifies external state
```

**Function Overloading:**
```
void print(int x) { ... }       // print(5) → calls this
void print(String s) { ... }    // print("hi") → calls this
void print(int x, int y) { ... } // print(1, 2) → calls this
    → Same name, different parameters → Compiler picks based on arguments
```

---

# PRIORITY 5 — SCOPE & LIFETIME

**Scope Types:**
```
globalVar = 10;                    // Global scope: visible everywhere

function outer() {
    let outerVar = 20;           // Function scope: visible in outer() and inner()

    function inner() {
        let innerVar = 30;     // Block scope: visible only in inner()
        print(globalVar);        // 10 (global)
        print(outerVar);         // 20 (lexical/outer scope)
        print(innerVar);       // 30 (local)
    }
    inner();
}
```

**Lexical Scope:** Function remembers variables from where it was DEFINED, not where called.

**Closure:**
```
function makeCounter() {
    let count = 0;               // Enclosed variable
    return function() {         // Inner function captures count
        return ++count;          // Remembers count even after makeCounter() exits
    };
}
let counter = makeCounter();     // count = 0, function returned
counter();                       // 1 (count still alive in closure)
counter();                       // 2 (count persists!)
```

**Variable Shadowing:**
```
let x = 10;
{
    let x = 20;                // Inner x SHADOWS outer x
    print(x);                  // 20 (inner x)
}
print(x);                      // 10 (outer x unchanged)
```

---

# PRIORITY 6 — MEMORY FUNDAMENTALS

**Stack vs Heap:**

| | Stack | Heap |
|---|---|---|
| **What** | Function call frames, local variables | Objects, dynamic data |
| **Management** | Automatic (push/pop) | Manual or GC |
| **Speed** | Fast (CPU-managed) | Slower (complex allocation) |
| **Size** | Small (MBs) | Large (GBs) |
| **Lifetime** | Function scope | Until explicitly freed or GC'd |

**Stack Flow:**
```
main() calls foo() → Push foo's frame on stack → foo calls bar() → Push bar's frame → 
    bar returns → Pop bar → foo returns → Pop foo → Stack empty

Stack frame contains: Return address, local variables, parameters
```

**Heap Flow:**
```
new Person("Alice") → Request memory from heap → Allocator finds free block → 
    → Returns address (e.g., 0x7f8a) → Store in reference variable → 
    → Use object → Done? → Free memory (manual) or wait for GC (automatic)
```

**Pass by Value vs Pass by Reference:**
```
// Pass by Value (Java, C# primitives, Python immutable)
void increment(int x) { x++; }     // x is COPY → Original unchanged
int a = 5; increment(a);           // a is still 5

// Pass by Reference (C++ pointers/refs, Java objects)
void setName(Person p) { p.name = "Bob"; }  // p points to same object → Original modified!
Person alice = new Person("Alice"); setName(alice);  // alice.name is now "Bob"
```

---

# PRIORITY 7 — ARRAYS

**Memory Layout:**
```
int[] arr = new int[5];     
    // Heap: contiguous block of 5 * 4 = 20 bytes
    // Memory: [0: addr+0] [1: addr+4] [2: addr+8] [3: addr+12] [4: addr+16]

arr[2] = 10;                
    // Base address + (2 * 4) = direct jump → O(1)
    // CPU: address = base + index * size → Single calculation → Single memory access
```

**Why O(1) indexing?** Contiguous memory + fixed size = math gets exact address instantly.

**Static vs Dynamic Arrays:**

| | Static | Dynamic |
|---|---|---|
| Size | Fixed at compile time | Grows as needed |
| Memory | Stack (usually) | Heap |
| Resize | Can't | Allocate bigger array → Copy elements → Free old array |
| Example | `int arr[10]` | `ArrayList` in Java, `vector` in C++ |

**Dynamic Array Growth Flow:**
```
ArrayList: [A, B, C] → Add D → Capacity full? → 
    → Allocate new array of size 2x (6) → Copy A,B,C → Add D → Free old array
    → Amortized O(1) — occasional O(n) copy, but rare
```

---

# PRIORITY 8 — STRINGS

**String Immutability (Java/Python):**
```
String s = "Hello";          // Heap: "Hello" object created
s = s + " World";            // NEW object "Hello World" created → Old "Hello" still in memory
    // s now points to new object → Old one waits for GC

// Why immutable?
// 1. Security: String used in keys, file paths — can't be modified by malicious code
// 2. Hashing: HashCode cached → Fast HashMap lookups
// 3. Thread-safe: Multiple threads can share without synchronization
// 4. String pool: "Hello" reused → Memory savings
```

**StringBuilder Flow:**
```
// BAD: Creates N intermediate objects
String result = "";
for (String word : words) {
    result += word;          // New String object EVERY iteration!
}

// GOOD: Mutable buffer, single object
StringBuilder sb = new StringBuilder();
for (String word : words) {
    sb.append(word);         // Same object, internal buffer grows
}
String result = sb.toString();  // One final object created
```

**ASCII vs Unicode:**

| | ASCII | Unicode |
|---|---|---|
| **Bits** | 7 bits (128 chars) | 16-32 bits (millions of chars) |
| **Covers** | English only | All languages, emojis, symbols |
| **Encoding** | ASCII | UTF-8 (variable: 1-4 bytes), UTF-16 (2-4 bytes) |

**UTF-8 Flow:**
```
'A' (ASCII)     → 1 byte:  01000001
'€' (Euro)      → 3 bytes: 11100010 10000010 10101100
'😀' (Emoji)    → 4 bytes: 11110000 10011111 10011000 10000000
    → Backward compatible with ASCII → Most common encoding on web
```

---

# PRIORITY 9 — INPUT & OUTPUT

**Buffered vs Unbuffered I/O:**
```
Unbuffered: read() → System call → Disk read → 1 byte returned → Repeat for each byte
    → 1 million bytes = 1 million disk accesses → SLOW!

Buffered:   read() → Check buffer → Empty? → Read 8KB chunk from disk → Store in buffer → 
    → Return 1 byte from buffer → Next read() → Buffer has data → Return immediately → FAST!
    → 1 million bytes = ~125 disk accesses → 8000x fewer!
```

**Stream Flow:**
```
File → InputStream → BufferedReader → Program reads line by line
Program writes → BufferedWriter → OutputStream → File
```

---

# PRIORITY 10 — ERROR HANDLING

**Exception vs Error:**

| | Exception | Error |
|---|---|---|
| **Type** | Recoverable | Catastrophic |
| **Example** | FileNotFound, NullPointer | OutOfMemory, StackOverflow |
| **Catch?** | Yes, handle it | No, program dies |

**try-catch-finally Flow:**
```
try {
    riskyOperation();           // Throws FileNotFoundException
    processFile();              // Skipped if exception thrown
} catch (FileNotFoundException e) {
    log.error("File missing");    // Caught here → Handle it
} catch (IOException e) {
    log.error("IO error");       // Not reached (more specific caught first)
} finally {
    closeFile();                 // ALWAYS runs — cleanup guaranteed!
}
// Program continues normally
```

**Checked vs Unchecked (Java):**

| | Checked | Unchecked |
|---|---|---|
| **When** | Compile-time | Runtime |
| **Cause** | External factors (file, network) | Programming bugs (null, index) |
| **Handle** | Must catch or declare | Optional |
| **Examples** | IOException, SQLException | NullPointerException, ArrayIndexOutOfBounds |

> **Why finally?** Guaranteed cleanup — even if exception thrown, return called, or break used.

---

# PRIORITY 11 — MODULES & PACKAGES

**Hierarchy:**
```
Application
├── Module: Auth
│   ├── Package: auth.controller
│   │   └── LoginController.java
│   ├── Package: auth.service
│   │   └── AuthService.java
│   └── Package: auth.model
│       └── User.java
├── Module: Payment
│   ├── Package: payment.controller
│   └── Package: payment.service
└── Module: Shared
    └── Package: utils
        └── Logger.java
```

**Why modules?**
- Encapsulation: `auth.service` can't see `payment.internal`
- Reusability: Import `Shared` module in other projects
- Maintainability: Change `auth` without touching `payment`

---

# PRIORITY 12 — RECURSION

**Recursion Flow:**
```
factorial(5)
    → 5 * factorial(4)
        → 4 * factorial(3)
            → 3 * factorial(2)
                → 2 * factorial(1)
                    → 1 (base case!) → Return 1
                → Return 2 * 1 = 2
            → Return 3 * 2 = 6
        → Return 4 * 6 = 24
    → Return 5 * 24 = 120

Stack grows: [f(5)] → [f(5), f(4)] → ... → [f(5), f(4), f(3), f(2), f(1)] → Unwinds
```

**Recursion vs Iteration:**

| | Recursion | Iteration |
|---|---|---|
| **Memory** | Stack (risk overflow) | Constant |
| **Code** | Cleaner for trees/graphs | Faster for simple loops |
| **Tail Recursion** | Can be optimized to iteration | Already iteration |

**Tail Recursion:**
```
// NOT tail-recursive: multiplication happens AFTER recursive call returns
int factorial(int n) {
    if (n == 1) return 1;
    return n * factorial(n - 1);     // Must wait for result, can't optimize
}

// TAIL-recursive: recursive call is LAST operation
int factorial(int n, int acc) {
    if (n == 1) return acc;
    return factorial(n - 1, n * acc); // Nothing to do after call → Can reuse stack frame!
}
```

**Stack Overflow:**
```
recurse() → recurse() → recurse() → ... → 1 million times → 
    → Stack exceeds limit → StackOverflowError → Crash!
    Fix: Add base case, or convert to iteration
```

---

# PRIORITY 13 — BASIC OOP

**Class vs Object:**
```
Class = Blueprint (cookie cutter)    → Defines structure, no memory allocated
Object = Instance (actual cookie)    → Created from class, memory allocated

class Car {                          // Class: template
    String color;                    // Instance variable (each object has own)
    static int count = 0;            // Static variable (shared across all objects)

    Car(String c) {                  // Constructor: runs on creation
        this.color = c;
        count++;
    }

    void drive() { ... }            // Method: behavior
}

Car myCar = new Car("Red");          // Object created → Memory allocated → Constructor runs
Car yourCar = new Car("Blue");       // Another object → count is now 2 (shared)
```

**Constructor vs Method:**

| | Constructor | Method |
|---|---|---|
| **Purpose** | Initialize object | Perform action |
| **Name** | Same as class | Any name |
| **Return** | No return type | Has return type (or void) |
| **Call** | Automatic on `new` | Explicit call |
| **Count** | Can overload | Unlimited |

---

# PRIORITY 14 — FUNCTIONAL PROGRAMMING

**First-Class Functions:**
```
// Functions are values — can be assigned, passed, returned
let greet = function(name) { return "Hi " + name; };
let result = greet("Alice");                         // "Hi Alice"
```

**Higher-Order Functions:**
```
// Function that takes function as argument or returns function
function map(array, transform) {          // Higher-order
    let result = [];
    for (let item of array) {
        result.push(transform(item));      // transform is a function!
    }
    return result;
}
map([1,2,3], x => x * 2);                 // [2, 4, 6]
```

**Lambda vs Normal Function:**
```
// Normal: Named, reusable, complex logic
function square(x) { return x * x; }

// Lambda: Anonymous, inline, simple
let square = x => x * x;

// Use lambda for: callbacks, short operations, functional chains
list.filter(x => x > 5).map(x => x * 2).reduce((a,b) => a + b);
```

**Function Composition:**
```
const add5 = x => x + 5;
const multiply2 = x => x * 2;
const addThenMultiply = x => multiply2(add5(x));     // (x + 5) * 2
    // addThenMultiply(3) → add5(3)=8 → multiply2(8)=16
```

---

# PRIORITY 15 — PROGRAMMING PARADIGMS

| Paradigm | Core Idea | Flow | Example |
|----------|-----------|------|---------|
| **Procedural** | Step-by-step instructions | Top to bottom → Functions → Done | C, early Python |
| **OOP** | Objects with state + behavior | Create objects → Objects interact → Message passing | Java, C++ |
| **Functional** | Functions as first-class, immutability | Input → Function → Output → No side effects | Haskell, Lisp |
| **Event-Driven** | React to events | Wait for event → Handler runs → Back to waiting | JS, GUI apps |
| **Imperative** | HOW to do it (step-by-step) | Loop through array → Add each element → Return sum | C, Java |
| **Declarative** | WHAT to do (describe result) | Sum of array? → `array.reduce((a,b)=>a+b)` | SQL, HTML |

**Procedural vs OOP:**
```
Procedural: processOrder(data) → validate(data) → save(data) → notify(data)
    → Data passed around, functions operate on it

OOP:        Order order = new Order(data);
            order.validate();
            order.save();
            order.notify();
    → Data and behavior bundled together
```

---

# PRIORITY 16 — MEMORY MANAGEMENT

**Garbage Collection Flow:**
```
1. Allocate objects on heap
2. Program runs → Some objects no longer referenced
3. GC runs:
    a. Mark phase: Trace from roots (stack refs, static vars) → Mark reachable objects
    b. Sweep phase: Delete unmarked objects → Free memory
4. Repeat
```

**Reference Counting:**
```
Object A created → refCount = 1
Object B = A     → refCount = 2
B = null         → refCount = 1
A = null         → refCount = 0 → Free memory!
    Problem: Circular references (A→B→A) → refCount never 0 → Memory leak!
```

**Memory Leak vs Memory Corruption:**

| | Memory Leak | Memory Corruption |
|---|---|---|
| **What** | Memory allocated but never freed | Memory written where it shouldn't |
| **Result** | Gradual memory growth → OOM crash | Random crashes, data corruption |
| **Cause** | Forgotten references, static collections | Buffer overflow, use-after-free |
| **Fix** | Remove references, use weak refs | Bounds checking, smart pointers |

---

# PRIORITY 17 — CODE QUALITY

| Principle | What it means | Flow |
|-----------|-------------|------|
| **DRY** | Don't Repeat Yourself | Same logic in 3 places? → Extract function → Use everywhere |
| **KISS** | Keep It Simple, Stupid | Complex solution? → Find simpler way → Easier to maintain |
| **YAGNI** | You Ain't Gonna Need It | Future feature? → Don't build until needed → Avoid waste |
| **Single Responsibility** | One reason to change | Class does auth + email + logging? → Split into 3 classes |
| **Self-Documenting** | Code explains itself | `calculateTax()` not `calc()` → Meaningful names > comments |

**Maintainable Code Flow:**
```
Readable naming → Small functions → Single responsibility → 
    → Clear interfaces → Tests pass → Easy to modify → Low bug rate
```

---

# PRIORITY 18 — DEBUGGING

**Error Types:**

| Type | When | Example | Fix |
|------|------|---------|-----|
| **Syntax** | Compile-time | Missing `;`, unmatched `}` | Compiler tells you exactly where |
| **Runtime** | During execution | NullPointer, divide by zero | Stack trace → Find line → Add null check |
| **Logical** | Runs but wrong result | Off-by-one error, wrong formula | Debugger, unit tests, print statements |

**Production Debugging Flow:**
```
Alert fires → Check logs (timestamp, error message, stack trace) → 
    → Reproduce locally → Add breakpoints → Step through → 
    → Find root cause → Fix → Deploy → Monitor
```

**Stack Trace Reading:**
```
Exception in thread "main" java.lang.NullPointerException
    at com.app.UserService.getUser(UserService.java:42)      ← YOUR CODE (line 42)
    at com.app.Controller.handleRequest(Controller.java:15)  ← Called from here
    at com.app.Main.main(Main.java:8)                        ← Entry point

→ Start from TOP (most recent) → UserService.java:42 → user is null → Add null check
```

---

# PRIORITY 19 — TESTING BASICS

**Testing Flow:**
```
Write function → Write test: input → expected output → Run test → 
    → Pass? → Move on → Fail? → Debug → Fix → Re-run
```

**Test Types:**

| Type | What | Example |
|------|------|---------|
| **Happy Path** | Normal input → Expected output | `add(2,3) → 5` |
| **Edge Case** | Boundary values | `add(Integer.MAX_VALUE, 1) → Overflow?` |
| **Negative** | Invalid input → Proper error | `add(null, 3) → NullPointerException?` |
| **Boundary** | Min/max allowed values | Array of size 0, 1, max |

**Boundary Value Analysis:**
```
Function: isValidAge(int age) → true if 18-65
Test: 17 (just below), 18 (min), 19 (just above), 64 (just below max), 65 (max), 66 (just above)
```

---

# PRIORITY 20 — BEST PRACTICES

**Defensive Programming:**
```
// Don't trust inputs
public void process(User user) {
    if (user == null) throw new IllegalArgumentException("User required");
    if (user.email == null || !user.email.contains("@")) throw new ValidationException();
    // Now safe to process
}
```

**Fail Fast:**
```
// BAD: Process everything, fail at the end
for (Item item : items) { process(item); }  // 99 succeed, #100 fails → All wasted!

// GOOD: Validate first, fail immediately
for (Item item : items) { validate(item); } // Any invalid → Stop immediately
for (Item item : items) { process(item); } // All guaranteed valid
```

**Separation of Concerns:**
```
// BAD: One class does everything
class OrderManager { validate(); save(); sendEmail(); log(); generatePDF(); }

// GOOD: Each class has one job
class OrderValidator { validate(); }
class OrderRepository { save(); }
class EmailService { sendEmail(); }
class Logger { log(); }
```

---

# COMMON INTERVIEW SCENARIOS — QUICK ANSWERS

| # | Question | Answer |
|---|----------|--------|
| 1 | Stack vs Heap? | Stack = automatic, fast, function scope; Heap = dynamic, larger, manual/GC |
| 2 | Primitive vs Reference? | Primitive = value in variable; Reference = address pointing to object |
| 3 | Mutable vs Immutable? | Mutable = can change after creation; Immutable = can't change |
| 4 | Static vs Dynamic Typing? | Static = checked at compile time (Java); Dynamic = checked at runtime (Python) |
| 5 | Strong vs Weak Typing? | Strong = types strictly enforced ("5"+3 = error); Weak = auto-coerced ("5"+3 = "53") |
| 6 | Function vs Method? | Function = standalone; Method = attached to object/class |
| 7 | Parameter vs Argument? | Parameter = placeholder in definition; Argument = actual value passed |
| 8 | Pass by Value vs Reference? | Value = copy of data; Reference = copy of address → Original can be modified |
| 9 | Recursion vs Iteration? | Recursion = function calls itself (stack, cleaner for trees); Iteration = loop (constant memory) |
| 10 | Exception vs Error? | Exception = recoverable (catch it); Error = catastrophic (OOM, can't recover) |
| 11 | Checked vs Unchecked? | Checked = compile-time, must handle (IOException); Unchecked = runtime, optional (NullPointer) |
| 12 | Constructor vs Method? | Constructor = initializes object, no return, same name as class; Method = does work, has return type |
| 13 | Object vs Class? | Class = blueprint; Object = instance created from class |
| 14 | Module vs Package? | Module = larger unit (auth system); Package = namespace within module (auth.controller) |
| 15 | Garbage Collection? | Automatic memory cleanup → Mark reachable → Sweep unreachable → Free memory |
| 16 | Memory Leak? | Memory allocated but never freed → Gradual growth → OOM crash |
| 17 | String vs StringBuilder? | String = immutable (new object per change); StringBuilder = mutable (same object, faster) |
| 18 | ASCII vs Unicode? | ASCII = 128 English chars; Unicode = all languages + emojis; UTF-8 = most common encoding |
| 19 | Buffered vs Unbuffered I/O? | Buffered = read chunks into memory, fast; Unbuffered = read byte-by-byte from disk, slow |
| 20 | DRY vs KISS vs YAGNI? | DRY = no duplication; KISS = keep simple; YAGNI = don't build until needed |

---

# REVISION ORDER (Highest ROI)

1. Variables (mutable/immutable, scope, lifetime)
2. Data Types (primitive vs reference, overflow, float precision)
3. Type Systems (static/dynamic, strong/weak, casting)
4. Operators (precedence, associativity, short-circuit)
5. Control Flow (if/switch, loops, break/continue/return)
6. Functions (pure vs impure, parameters vs arguments, overloading)
7. Scope & Lifetime (lexical, closures, shadowing)
8. Memory (stack vs heap, pass by value/reference)
9. Arrays (O(1) indexing, static vs dynamic, memory layout)
10. Strings (immutability, StringBuilder, UTF-8)
11. I/O (buffered vs unbuffered, streams)
12. Error Handling (try-catch-finally, checked vs unchecked)
13. Modules/Packages (organization, encapsulation)
14. Recursion (base case, call stack, tail recursion, stack overflow)
15. OOP Basics (class vs object, constructor, static, access modifiers)
16. Functional Programming (first-class, higher-order, lambda, composition)
17. Paradigms (procedural vs OOP vs functional, imperative vs declarative)
18. Memory Management (GC, reference counting, leaks vs corruption)
19. Code Quality (DRY, KISS, YAGNI, single responsibility)
20. Debugging & Testing (syntax/runtime/logical, stack traces, boundary values)

---

# HANDS-ON PRACTICE

1. **Calculator:** Parse expression → Tokenize → Apply precedence → Calculate → Handle divide-by-zero
2. **To-Do CLI:** Read command → Parse args → CRUD operations → Save to file → Load on startup
3. **Student Management:** Array of students → Add → Remove → Search → Sort → Display
4. **Text Analyzer:** Read file → Count words (split on whitespace) → Count lines → Count chars → Report
5. **String Utils:** Reverse, palindrome check, anagram check, substring search → Without built-ins
6. **Recursion:** Factorial, Fibonacci, binary search, tree traversal → Trace call stack manually
7. **Custom Exceptions:** Base exception → Specific exceptions → Throw → Catch → Handle gracefully
8. **Modular App:** Separate packages → Models, Services, Controllers → Import between modules
9. **Unit Tests:** Happy path, edge cases, null inputs, boundary values → Assert expected outputs
10. **Debug Flawed Code:** Find off-by-one, null dereference, infinite loop → Fix → Verify with tests

---

## **REMEMBER:** Interviewers care about:

1. **Can you trace execution?** (What happens in memory, on stack, in heap)
2. **Do you understand trade-offs?** (Mutable vs immutable, recursion vs iteration, static vs dynamic)
3. **Can you debug?** (Read stack traces, identify error types, find root cause)
4. **Is your code clean?** (DRY, single responsibility, meaningful names, proper error handling)
5. **Do you know memory?** (Stack vs heap, GC, leaks, pass by value/reference)

> Tell the story of how your code executes — where variables live, how data flows, what happens on the stack.

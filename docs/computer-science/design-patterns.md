
# DESIGN PATTERNS

# PRIORITY 1 — FUNDAMENTALS

## 1. What are Design Patterns?
**Flow:** Common problem → Someone solved it → Named the solution → Reuse it

- **1-liner:** Reusable blueprints for recurring software problems.
- **Gang of Four (GoF):** 4 authors, 1994, 23 patterns in *Design Patterns* book.
- **Why exist:** Stop reinventing wheels; share battle-tested solutions.
- **Categories:** Creational (make objects), Structural (organize objects), Behavioral (coordinate objects).
- **Anti-patterns:** Common *bad* solutions (e.g., God Class, Spaghetti Code).
- **When to avoid:** Over-engineering simple code; YAGNI applies.

**Interview Q:**

- Mandatory? No. Use when complexity justifies it.
- Avoid when: Simple if-else works, team doesn't know it, premature optimization.

---

## 2. Design Principles Behind Patterns

**SOLID (the backbone):**

| Principle | Flow | Example |
|-----------|------|---------|
| **S**ingle Responsibility | Class has 1 job → Easy to change | `UserAuth` handles login, NOT email sending |
| **O**pen/Closed | Open for extension → Closed for modification | Add `PayPalPayment` without touching `PaymentProcessor` |
| **L**iskov Substitution | Child replaces Parent → No breakage | `PremiumCustomer` replaces `Customer` in discount calc |
| **I**nterface Segregation | Big interface → Split into small ones | `Printable`, `Scannable` instead of `AllInOneDevice` |
| **D**ependency Inversion | High-level → Depends on abstractions, NOT concrete | `OrderService` depends on `IPaymentGateway`, not `StripeAPI` |

**Other Principles:**

- **DRY:** Write once → Use everywhere (extract common logic).
- **KISS:** Simple solution → Works → Ship it.
- **YAGNI:** Don't build → What you don't need yet.
- **Composition over Inheritance:** Has-a > Is-a (flexible, no rigid hierarchy).
- **Program to Interface:** Code against `List` not `ArrayList` → Swap implementations.
- **Favor Delegation:** Object A → delegates task → Object B (A doesn't do it itself).
- **Encapsulate What Varies:** Isolate changing parts → Stable core remains.

**Interview Q:**

- Why interfaces? Decoupling. Swap implementations without breaking callers.
- Composition > Inheritance? Inheritance is rigid (compile-time); composition is flexible (runtime).

---

# PRIORITY 2 — CREATIONAL PATTERNS

## 1. Singleton
**Flow:** App starts → Checks if instance exists? → No → Create one → Yes → Return existing

**Implementation Story:**
```
User requests DB connection → SingletonDB.getInstance() 
    → First call? → new SingletonDB() 
    → Next call? → Return same object
```

**Thread-Safe Singleton (Double-Checked Locking):**
```
Thread A checks instance == null → Yes → Locks class
    → Thread B checks instance == null → BLOCKED
    → Thread A creates instance → Releases lock
    → Thread B checks again → No → Returns existing
```

**Types:**

- **Eager:** `private static Instance = new Instance()` — loads at class load.
- **Lazy:** Creates on first `getInstance()` call.
- **Enum (Java):** `enum Singleton { INSTANCE; }` — JVM guarantees single instance, thread-safe, serialization-safe.

**Why Controversial?** Hidden global state → Hard to test → Tight coupling.

**Avoid when:** You need multiple instances (testing, different configs), or DI frameworks handle it.

---

## 2. Factory Method
**Flow:** Client needs object → Doesn't know which class → Calls factory → Factory decides which class → Returns object

**Story:**
```
User clicks "Send Notification" → NotificationFactory.create("email")
    → Factory checks type → Returns new EmailNotification()
    → User clicks "Send SMS" → Returns new SMSNotification()
```

**Structure:**

- `Notification` (interface) ← `EmailNotification`, `SMSNotification`
- `NotificationFactory` (interface) ← `EmailFactory`, `SMSFactory`

**Factory vs Constructor:**

- Constructor: `new EmailNotification()` — tight coupling, hard to change.
- Factory: `factory.create()` — loose coupling, easy to add new types.

**Factory Method vs Abstract Factory:**

- Factory Method: One product family, subclasses decide which product.
- Abstract Factory: Multiple product families, factory creates related products.

---

## 3. Abstract Factory
**Flow:** Client needs a UI kit → Calls `UIFactory` → Gets `Button` + `Checkbox` + `TextField` → All match the same theme

**Story:**
```
App detects OS: Windows → WindowsFactory
    → Creates: WindowsButton + WindowsCheckbox + WindowsTextField
App detects OS: Mac → MacFactory
    → Creates: MacButton + MacCheckbox + MacTextField
```

**Key:** Factory of factories. Ensures all created objects belong to the same family.

---

## 4. Builder
**Flow:** Complex object needs many params → Step-by-step construction → Final `.build()` returns object

**Story:**
```
User orders Pizza → Pizza.Builder()
    .setCrust("thin")       // step 1
    .setSauce("tomato")     // step 2
    .setToppings(["cheese", "mushroom"])  // step 3
    .build()                // returns Pizza object
```

**Builder vs Constructor:**

- Constructor: `new Pizza("thin", "tomato", ["cheese"], null, null, ...)` — messy, param hell.
- Builder: Fluent, readable, optional params, immutable result.

**Fluent Builder:** Each method returns `this` → chain calls.

**Immutable:** Build once → Can't modify → Thread-safe.

---

## 5. Prototype
**Flow:** Need similar object → Clone existing → Modify as needed

**Story:**
```
Game spawns enemy → BaseEnemy.clone() → Modify health/position → New enemy ready
```

**Shallow Copy:** Copies object → References inside point to same objects.

**Deep Copy:** Copies object + all nested objects → Completely independent.

**When useful:** Object creation is expensive; you have a template; need many similar objects.

---

# PRIORITY 3 — STRUCTURAL PATTERNS

## 6. Adapter
**Flow:** New system expects Interface A → Legacy system provides Interface B → Adapter converts B → A

**Story:**
```
Modern App expects: JSON data
Legacy System provides: XML data
Adapter: XML → parses → converts to JSON → Modern App happy
```

**Real-world:** USB-C to USB-A dongle, Database drivers (JDBC adapts different DBs).

---

## 7. Decorator
**Flow:** Base object → Wrap with decorator → Add behavior → Can wrap again → Stack behaviors

**Story:**
```
User orders Coffee → BaseCoffee ($2)
    → Add MilkDecorator (+$0.5) → Coffee with milk ($2.5)
    → Add SugarDecorator (+$0.3) → Coffee with milk & sugar ($2.8)
    → Add WhipDecorator (+$0.7) → Coffee with milk, sugar & whip ($3.5)
```

**Decorator vs Inheritance:**

- Inheritance: `MilkSugarWhipCoffee` — rigid, compile-time, explosive class count.
- Decorator: Wrap at runtime → Flexible, mix-and-match.

**Decorator vs Proxy:**

- Decorator: Adds functionality (enhances).
- Proxy: Controls access (restricts/protects).

---

## 8. Facade
**Flow:** Client needs complex operation → Calls simple Facade method → Facade orchestrates 10 subsystems → Returns result

**Story:**
```
User presses "Watch Movie" on HomeTheaterFacade
    → Facade does:
        1. Turn on TV
        2. Set input to HDMI
        3. Turn on SoundSystem
        4. Set volume to 20
        5. Turn on DVD Player
        6. Insert disc
        7. Play movie
    → User sees: Movie playing (1 button press)
```

**Facade vs Adapter:**

- Facade: Simplifies complex subsystem (many → one simple interface).
- Adapter: Converts one interface to another (one → one different interface).

---

## 9. Proxy
**Flow:** Client requests object → Proxy intercepts → May block/cache/log → Forwards to real object → Returns result

**Types & Stories:**

**Virtual Proxy (Lazy Loading):**
```
User opens image gallery → ProxyImage shows placeholder
    → User scrolls to image → Proxy loads real image from disk
```

**Protection Proxy (Access Control):**
```
User requests admin report → Proxy checks role
    → Admin? → Forward to real report
    → Guest? → Return "Access Denied"
```

**Caching Proxy:**
```
User requests data → Proxy checks cache
    → Cache hit? → Return cached data (fast)
    → Cache miss? → Fetch from DB → Store in cache → Return
```

**Remote Proxy:** Local proxy represents remote object (RPC, RMI).

**Proxy vs Decorator:**

- Proxy: Controls access (security, lazy load, remote).
- Decorator: Adds functionality (features, enhancements).

---

## 10. Composite
**Flow:** Tree structure → Leaf and Composite both implement same interface → Client treats single object and group uniformly

**Story:**
```
File System:
    Folder "Documents" (Composite)
        ├── File "resume.pdf" (Leaf)
        ├── File "photo.jpg" (Leaf)
        └── Folder "Work" (Composite)
            ├── File "report.docx" (Leaf)
            └── File "data.xlsx" (Leaf)

Client calls folder.getSize() → Recursively sums all children
```

**Key:** Single object and collection treated the same way via common interface.

---

## 11. Bridge
**Flow:** Abstraction and Implementation evolve independently → Bridge connects them

**Story:**
```
RemoteControl (Abstraction) ──bridges──> Device (Implementation)
    │                                       │
    ├── AdvancedRemoteControl               ├── TV
    └── BasicRemoteControl                  └── Radio

Can add new remote WITHOUT touching devices
Can add new device WITHOUT touching remotes
```

**Key:** Decouple abstraction from implementation so both can vary independently.

---

## 12. Flyweight
**Flow:** Many similar objects → Extract shared state (intrinsic) → Store once → Reference it

**Story:**
```
Text Editor with 1 million characters
    → Each character has: font, size, color, position
    → Flyweight: Store font/size/color once per unique combo
    → Each character object only stores: position + reference to flyweight
    → Memory: 1M small objects + few shared flyweights
```

**Key:** Share intrinsic (shared) state; extrinsic (unique) state passed externally.

---

# PRIORITY 4 — BEHAVIORAL PATTERNS

## 13. Strategy
**Flow:** Context has behavior → Behavior is interchangeable → Set strategy at runtime → Execute

**Story:**
```
Shopping Cart → Checkout
    → User selects "Credit Card" → Set strategy = CreditCardStrategy
    → User selects "PayPal" → Set strategy = PayPalStrategy
    → User selects "Crypto" → Set strategy = CryptoStrategy
    → cart.pay() → Delegates to current strategy → Payment processed
```

**Replaces:** Giant switch/if-else statements.

**Strategy vs State:**

- Strategy: Client chooses algorithm (payment method).
- State: Object changes behavior based on its internal state (ATM states).

---

## 14. Observer
**Flow:** Subject changes state → Notifies all observers → Each observer reacts independently

**Story:**
```
YouTube Channel (Subject)
    ├── Subscriber A (Observer) → Gets notification → Opens video
    ├── Subscriber B (Observer) → Gets notification → Ignores
    └── Subscriber C (Observer) → Gets notification → Comments

Channel uploads video → notifyAll() → All subscribers updated
```

**Observer vs Pub/Sub:**

- Observer: Subject knows observers directly (tight coupling).
- Pub/Sub: Message broker sits in middle (loose coupling, async).

---

## 15. Command
**Flow:** Request encapsulated as object → Can queue, log, undo → Execute when ready

**Story:**
```
Text Editor:
    User types "Hello" → Create InsertTextCommand("Hello")
        → Execute() → Text becomes "Hello"
    User presses Ctrl+Z → command.undo() → Text becomes ""
    User presses Ctrl+Y → command.redo() → Text becomes "Hello"

Commands stored in stack → Undo = pop & undo → Redo = push & execute
```

> **Why use?** Decouple sender from receiver; support undo/redo; queue requests.

---

## 16. State
**Flow:** Object has states → State changes → Behavior changes automatically

**Story:**
```
ATM Machine:
    [NoCard] → Insert card → [HasCard] → Enter PIN → [Authorized]
        → [Authorized] → Withdraw → Check balance
            → Sufficient? → Dispense cash → [NoCard]
            → Insufficient? → Show error → [Authorized]
        → [HasCard] → Eject card → [NoCard]
```

Each state is a class with its own behavior. State transitions are handled within states.

**Strategy vs State:**

- Strategy: External choice (user picks payment method).
- State: Internal transition (ATM moves between states based on actions).

---

## 17. Template Method
**Flow:** Algorithm skeleton defined → Steps implemented by subclasses → Framework controls flow

**Story:**
```
DataMiner (abstract):
    mine(path):                    // Template method
        file = openFile(path)      // Common
        rawData = extract(file)    // Abstract — subclasses implement
        data = parse(rawData)      // Abstract — subclasses implement
        analyze(data)              // Common
        sendReport(data)           // Common
        closeFile(file)            // Common

PDFDataMiner implements extract() + parse()
CSVDataMiner implements extract() + parse()
```

**Hook methods:** Optional steps subclasses can override.

---

## 18. Iterator
**Flow:** Collection hides internal structure → Iterator provides sequential access → Client traverses without knowing internals

**Story:**
```
Social Network Graph:
    User wants friends list → profile.getFriendsIterator()
        → Could be BFS, DFS, or sorted by name
        → Client just calls: while(iterator.hasNext()) { friend = iterator.next() }
        → Client doesn't care HOW traversal works
```

**Key:** Encapsulate traversal logic; support multiple traversal strategies.

---

## 19. Chain of Responsibility
**Flow:** Request enters chain → Each handler decides: process or pass to next → Until handled or end

**Story:**
```
HTTP Request → AuthenticationFilter
    → Not authenticated? → Block & return 401
    → Authenticated? → Pass to AuthorizationFilter
        → Not authorized? → Block & return 403
        → Authorized? → Pass to RateLimitFilter
            → Rate limit exceeded? → Block & return 429
            → OK? → Pass to LoggingFilter
                → Log request → Pass to FinalHandler
                    → Process request → Return 200
```

**Key:** Decouple sender from receiver; handlers can be added/removed dynamically.

---

## 20. Mediator
**Flow:** Objects don't talk directly → All communication goes through Mediator → Reduces chaos

**Story:**
```
Chat Room (Mediator):
    User A sends "Hi" → ChatRoom.receive("Hi", UserA)
        → ChatRoom broadcasts to User B, User C
    Without Mediator: User A → User B, User A → User C, User B → User A... (N² connections)
    With Mediator: Everyone → ChatRoom only (N connections)
```

**Key:** Centralize complex communication; prevent spaghetti dependencies.

---

## 21. Memento
**Flow:** Object saves state → Stored as memento → Can restore later → Undo functionality

**Story:**
```
Game:
    Player at Level 5, Health 100 → saveGame() → Memento created (Level 5, Health 100)
    Player dies → Health 0 → loadGame(memento) → Restored to Level 5, Health 100

Caretaker stores mementos; Originator creates/restores them.
```

---

## 22. Visitor
**Flow:** New operation needed on object structure → Add Visitor → Each element accepts visitor → Visitor performs operation

**Story:**
```
Document structure: Paragraph, Image, Table
    Need "Export to PDF" → Create PDFVisitor
        → visit(Paragraph) → Render paragraph as PDF text
        → visit(Image) → Render image as PDF image
        → visit(Table) → Render table as PDF table

    Need "Export to HTML" → Create HTMLVisitor (same structure, different operations)

    Without Visitor: Add exportToPDF() to every class → Violates OCP
    With Visitor: Add new visitor class → No changes to document classes
```

---

# PRIORITY 5 — PATTERN SELECTION (Quick Map)

| Problem | Pattern | Flow |
|---------|---------|------|
| Only 1 instance allowed | **Singleton** | Check → Create once → Reuse forever |
| Object creation is complex | **Builder** | Step 1 → Step 2 → ... → Build |
| Don't know which class to create | **Factory Method** | Client → Factory → Product |
| Need family of related objects | **Abstract Factory** | Factory → ProductA + ProductB + ProductC |
| Incompatible interfaces | **Adapter** | Expected A → Got B → Adapter → A |
| Add behavior dynamically | **Decorator** | Base → Wrap → Wrap → ... |
| Complex subsystem, simple interface | **Facade** | 1 call → Orchestrates 10 things |
| Control access to object | **Proxy** | Request → Proxy checks → Real object |
| Swap algorithm at runtime | **Strategy** | Context → Set strategy → Execute |
| One-to-many notification | **Observer** | Change → Notify all → React |
| Encapsulate requests (undo) | **Command** | Action → Command object → Execute/Undo |
| Object behavior changes by state | **State** | Action → State changes → New behavior |
| Request passes through handlers | **Chain of Resp.** | Request → Handler 1 → Handler 2 → ... |
| Tree structure, uniform treatment | **Composite** | Leaf = Composite (same interface) |
| Memory optimization | **Flyweight** | Shared state once → References everywhere |

---

# PRIORITY 6 — PATTERN COMPARISONS

| Comparison | Key Difference |
|------------|---------------|
| **Singleton vs Static Class** | Singleton = object (can implement interfaces, lazy load, thread-safe); Static = class-level (no inheritance, eager, harder to mock) |
| **Factory vs Builder** | Factory = "Which class?" (creates different types); Builder = "How to build?" (constructs one type step-by-step) |
| **Factory Method vs Abstract Factory** | Factory Method = 1 product, subclasses decide; Abstract Factory = Family of products, factory creates related set |
| **Adapter vs Facade** | Adapter = Convert 1 interface to another; Facade = Simplify many interfaces into 1 |
| **Adapter vs Decorator** | Adapter = Changes interface; Decorator = Adds behavior (same interface) |
| **Decorator vs Proxy** | Decorator = Enhances functionality; Proxy = Controls access |
| **Strategy vs State** | Strategy = External choice of algorithm; State = Internal state drives behavior |
| **Strategy vs Template Method** | Strategy = Swaps entire algorithm; Template Method = Skeleton fixed, steps vary |
| **Observer vs Pub/Sub** | Observer = Direct subject-observer coupling; Pub/Sub = Broker decouples them |
| **Composition vs Decorator** | Composition = Has-a relationship (general); Decorator = Specific composition pattern for adding behavior |

---

# PRIORITY 7 — REAL-WORLD APPLICATIONS

## Java

| Framework/Feature | Pattern | Flow |
|-------------------|---------|------|
| **Collections.sort()** | Strategy | Pass Comparator → Sort uses your strategy |
| **Iterator** | Iterator | `list.iterator()` → `hasNext()` → `next()` |
| **InputStream/BufferedInputStream** | Decorator | FileInputStream → BufferedInputStream → DataInputStream |
| **Calendar.getInstance()** | Factory Method | Returns GregorianCalendar (or others) based on locale |
| **Runtime.getRuntime()** | Singleton | One Runtime instance per JVM |
| **Executors.newFixedThreadPool()** | Factory Method | Returns different thread pool types |
| **Streams API** | Builder/Strategy | `stream().filter().map().collect()` — chain of operations |

## Spring Boot

| Feature | Pattern | Flow |
|---------|---------|------|
| **Dependency Injection** | Factory + Strategy | Container creates beans → Injects based on type/qualifier |
| **BeanFactory** | Factory Method | `getBean("name")` → Returns configured object |
| **@Controller, @Service** | Singleton | One instance per container |
| **AOP (Aspects)** | Proxy | Method call → Proxy intercepts → Advice runs → Real method |
| **MVC** | Strategy | DispatcherServlet → HandlerMapping → Controller (strategy) → View |

## Backend Systems

| System | Pattern | Flow |
|--------|---------|------|
| **Payment Gateway** | Strategy | Order → PaymentContext → Set CreditCard/PayPal/Stripe → Pay |
| **Notification Service** | Observer | Event fired → EmailObserver, SMSObserver, PushObserver notified |
| **Auth Middleware** | Chain of Resp. | Request → Auth → RoleCheck → RateLimit → Handler |
| **Database Drivers** | Adapter | App uses JDBC API → Driver adapts to MySQL/PostgreSQL/Oracle |
| **Logging (SLF4J)** | Facade | `logger.info()` → SLF4J → Logback/Log4j2 (adapter pattern too) |
| **Config Manager** | Singleton | `ConfigManager.getInstance().getProperty("db.url")` |

---

# COMMON INTERVIEW SCENARIOS — QUICK ANSWERS

| # | Question | Answer |
|---|----------|--------|
| 1 | Why Design Patterns exist? | Recurring problems → Reusable solutions → Better communication |
| 2 | Singleton vs Static? | Singleton = object (flexible, testable); Static = rigid, not mockable |
| 3 | Factory vs Builder? | Factory = which class; Builder = how to construct |
| 4 | Factory Method vs Abstract Factory? | FM = 1 product; AF = family of products |
| 5 | Decorator vs Inheritance? | Decorator = runtime, flexible; Inheritance = compile-time, rigid |
| 6 | Decorator vs Proxy? | Decorator adds; Proxy controls |
| 7 | Adapter vs Facade? | Adapter converts; Facade simplifies |
| 8 | Strategy vs State? | Strategy = external choice; State = internal transition |
| 9 | Observer vs Pub/Sub? | Observer = direct; Pub/Sub = broker-mediated |
| 10 | Composition vs Inheritance? | Composition = flexible runtime; Inheritance = rigid compile-time |
| 11 | Payment system pattern? | Strategy (swap payment methods) |
| 12 | Notification service pattern? | Observer (notify multiple channels) |
| 13 | Eliminate large switch? | Strategy or Command or State |
| 14 | Thread-safe Singleton? | Enum (best), or DCL with volatile |
| 15 | Runtime behavior changes? | Strategy or State |
| 16 | Undo/redo pattern? | Command (store commands in stack) |
| 17 | Simplify complex subsystem? | Facade |
| 18 | Middleware pipeline? | Chain of Responsibility |
| 19 | When avoid patterns? | Simple code, team unfamiliar, premature optimization |
| 20 | Trade-offs of chosen pattern? | Always mention: complexity vs flexibility, learning curve, performance cost |

---

# CODING PRACTICE — IMPLEMENTATION CHECKLIST

For each pattern, implement and document:

1. **Thread-safe Singleton**

   - Flow: `getInstance()` → DCL → Return instance
   - Try: Enum version (Java)

2. **Notification System (Factory Method)**
   - Flow: `NotificationFactory.create(type)` → Returns Email/SMS/Push

3. **Pizza/Computer Builder**
   - Flow: `Builder.setX().setY().build()` → Immutable object

4. **Legacy API Integration (Adapter)**
   - Flow: New API expects JSON → Adapter converts XML → Legacy API

5. **Coffee Billing (Decorator)**
   - Flow: Coffee → +Milk → +Sugar → +Whip → Price accumulates

6. **Home Theater (Facade)**
   - Flow: `watchMovie()` → TV on → Sound on → DVD play → Movie starts

7. **Payment Gateway (Strategy)**
   - Flow: Cart → Set strategy → Pay → Strategy handles payment

8. **Event System (Observer)**
   - Flow: Event fired → All listeners notified → Each reacts

9. **Remote Control with Undo (Command)**
   - Flow: Button press → Command.execute() → Undo → Command.undo()

10. **ATM/Vending Machine (State)**
    - Flow: Insert coin → State changes → Select item → State changes → Dispense

11. **Auth Middleware (Chain of Responsibility)**
    - Flow: Request → Auth → Role → RateLimit → Handler

---

# QUICK REVISION ORDER

1. SOLID Principles → Foundation
2. Singleton → Thread-safe variants
3. Factory Method → vs Abstract Factory
4. Builder → vs Constructor
5. Adapter → Real-world (JDBC, USB dongle)
6. Decorator → vs Inheritance, Java I/O streams
7. Facade → vs Adapter
8. Strategy → vs State, Payment system
9. Observer → vs Pub/Sub, Event systems
10. Command → Undo/redo, Text editor
11. State → ATM, Vending machine
12. Proxy → Types (Virtual, Protection, Caching)
13. Composite → File system, UI trees
14. Chain of Responsibility → Middleware, Filters
15. Template Method → Data mining, Frameworks
16. Iterator → Java Collections
17. All comparisons table
18. Real-world applications (Java, Spring)

---

**REMEMBER:** Interviewers care about:

1. **Why** this pattern? (Problem it solves)
2. **How** it works? (The flow/story)
3. **Trade-offs** (When NOT to use)
4. **Real examples** (Where you've seen it)

> Never memorize UML. Tell the story of how data/request flows through the system.

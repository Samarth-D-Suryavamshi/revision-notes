# OOD/LLD Interview Notes — System Flow Approach

---

# Priority 1 — OOD Fundamentals

## 1. Introduction to Object-Oriented Design

**OOD vs OOP** → OOP is the *tool* (classes, objects), OOD is the *process* (how to design them).

**HLD vs LLD** → HLD = "How many servers?" | LLD = "What classes handle payment?"

**Design Flow** → Requirements → Identify Classes → Assign Responsibilities → Define Relationships → Apply Patterns → Evaluate

**Trade-offs** → Speed vs Maintainability, Complexity vs Flexibility, Memory vs Performance

---

## 2. Requirement Analysis

**System Flow:** Interviewer asks → You ask "Who uses it? What do they do? Any constraints?" → List actors → List use cases → Identify functional vs non-functional

**Functional** = What the system does ("User can book a ticket")
**Non-Functional** = How well it does it ("Booking completes in <2s")
**Assumptions** = Things you assume exist ("User is already registered")
**Constraints** = Limitations ("Only credit card payments")

**Ambiguous Requirements** → Ask clarifying questions, state assumptions explicitly, don't guess silently.

---

## 3. Identifying Classes

**System Flow:** Read requirement → "Who/what are the nouns?" → Categorize them

| Type | Example | Role |
|------|---------|------|
| **Entity** | User, Book, Order | Has identity, persists |
| **Value Object** | Address, Money, Date | Immutable, no identity, compared by value |
| **Service** | PaymentService, NotificationService | Stateless, business logic |
| **Manager** | OrderManager, InventoryManager | Coordinates multiple objects |
| **Controller** | BookingController, AuthController | Handles requests, delegates |
| **Repository** | UserRepository, BookRepository | Data access abstraction |
| **Utility** | DateUtils, StringUtils | Static helper methods |

**Good Class** = Single purpose, clear name, well-defined responsibility, cohesive.

---

## 4. Object Responsibilities

**System Flow:** Class created → What does it know? What can it do? → Should it do this or delegate?

**Single Responsibility** → A class should have ONE reason to change. Example: `Book` manages book data, `BookService` manages book operations.

**Information Expert (GRASP)** → Assign responsibility to the class that has the information needed. Example: `Order` calculates total price because it has `items[]`.

**Cohesion** = How related the class's responsibilities are. High cohesion = focused class.

---

## 5. Relationships Between Classes

**System Flow:** Two classes interact → How tightly are they bound?

| Relationship | Strength | Example | "Has-a" or "Is-a" |
|--------------|----------|---------|-------------------|
| **Association** | Weak | `User` has `Order` (independent) | Has-a |
| **Aggregation** | Medium | `Department` has `Employee` (employees exist without dept) | Has-a (loose) |
| **Composition** | Strong | `Car` has `Engine` (engine dies with car) | Has-a (strong) |
| **Dependency** | Very Weak | `OrderService` uses `PaymentGateway` (passed as param) | Uses-a |
| **Inheritance** | Strong | `SavingsAccount` extends `BankAccount` | Is-a |
| **Realization** | Medium | `PayPalPayment` implements `Payment` interface | Implements |

**Inheritance vs Composition** → Prefer composition. Inheritance breaks if parent changes. Composition: `Car` *has* `Engine` (can swap engines) vs `Car` *is* `Vehicle` (fixed hierarchy).

---

# Priority 2 — UML Basics

## 6. UML Fundamentals

**When to use** → Communicate design, document, plan before coding.

**Types:** Structural (Class, Object) | Behavioral (Sequence, Use Case, Activity, State) | Implementation (Component, Deployment)

---

## 7. Class Diagram (Highest Priority)

**System Flow:** Design classes → Draw boxes → Add attributes/methods → Connect with relationships

**Syntax:**
```
+------------------+
|    ClassName     |  ← Top: Name
| - privateAttr    |  ← Middle: Attributes (-private, #protected, +public)
| + publicMethod() |  ← Bottom: Methods
+------------------+
```

**Relationships in UML:**
- Association: `——` (solid line)
- Aggregation: `◇——` (empty diamond)
- Composition: `◆——` (filled diamond)
- Inheritance: `——▷` (arrow to parent)
- Realization: `---▷` (dashed arrow to interface)
- Dependency: `---▷` (dashed arrow, labeled «use»)

**Multiplicity:** `1..*` = one or more, `0..1` = optional, `1` = exactly one

**Example — Library System:**
```
[Member] 1 ———— * [Borrowing] * ———— 1 [Book]
```
One member has many borrowings. Each borrowing links one book.

---

## 8. Sequence Diagram

**System Flow:** User action → Object 1 calls Object 2 → Object 2 returns → Object 1 responds to user

**Elements:**
- **Lifeline** = Vertical dashed line (object's timeline)
- **Message** = Horizontal arrow (method call)
- **Activation Bar** = Rectangle on lifeline (object is active/processing)
- **Return Message** = Dashed arrow (return value)

**Example — Place Order:**
```
User → OrderController: placeOrder()
OrderController → OrderService: createOrder()
OrderService → PaymentService: processPayment()
PaymentService → PaymentService: validate()
PaymentService → OrderService: return paymentResult
OrderService → OrderController: return order
OrderController → User: orderConfirmation
```

---

## 9. Use Case Diagram

**System Flow:** Who interacts with the system? What do they do?

**Elements:**
- **Actor** = Stick figure (user, external system)
- **Use Case** = Oval (action: "Place Order", "Cancel Booking")
- **Relationships** = `<<include>>` (mandatory), `<<extend>>` (optional)

**Example:**
```
[Customer] ———→ (Browse Products)
[Customer] ———→ (Place Order) <<include>> (Process Payment)
[Admin] ———→ (Manage Inventory)
```

---

## 10. Activity Diagram (Basic)

**System Flow:** Start → Action → Decision → Parallel actions → End

**Elements:**
- Start/End: ● / ◉
- Action: Rectangle
- Decision: ◇ (diamond)
- Fork/Join: ▬ (horizontal bar) for parallel activities

**Example — Order Processing:**
```
● → [Receive Order] → ◇{valid?} → Yes → [Process Payment] → [Ship Order] → ◉
                      ↓ No
                    [Reject Order] → ◉
```

---

## 11. State Machine Diagram (Basic)

**System Flow:** Object created → Events change its state → Object destroyed

**Elements:**
- States: Rounded rectangles
- Transitions: Arrows labeled with event

**Example — Order States:**
```
[Created] —pay→ [Paid] —ship→ [Shipped] —deliver→ [Delivered]
   ↓
 cancel
   ↓
[Cancelled]
```

---

# Priority 3 — Design Principles

## SOLID Principles

**System Flow:** Write code → Check against SOLID → Refactor if violated

| Principle | Definition | Violation Example | Fix |
|-----------|-----------|-------------------|-----|
| **SRP** | One class, one reason to change | `User` class handles auth + profile + notifications | Split into `AuthService`, `ProfileService`, `NotificationService` |
| **OCP** | Open for extension, closed for modification | Add `if-else` for new payment type | Use `Payment` interface + new implementations |
| **LSP** | Child class should substitute parent | `Square` extends `Rectangle` (setWidth breaks area) | Redesign hierarchy or use composition |
| **ISP** | Don't force clients to depend on unused methods | `Printer` interface has `print()`, `scan()`, `fax()` | Split into `Printer`, `Scanner`, `Fax` interfaces |
| **DIP** | Depend on abstractions, not concretions | `OrderService` creates `PayPalPayment` directly | `OrderService` depends on `Payment` interface, injected at runtime |

---

## GRASP Principles

| Principle | When to Apply | Example |
|-----------|--------------|---------|
| **Information Expert** | Who should do the work? | `Order` calculates total (has items) |
| **Creator** | Who creates object X? | `Order` creates `OrderItem` (contains it) |
| **Controller** | Who handles the request? | `BookingController` handles booking requests |
| **Low Coupling** | Minimize dependencies | `OrderService` uses `Payment` interface, not `PayPalPayment` |
| **High Cohesion** | Keep related things together | `InvoiceService` only handles invoices |
| **Polymorphism** | Use interfaces for varying behavior | `Notification` interface → `EmailNotification`, `SMSNotification` |
| **Pure Fabrication** | Create a class that doesn't represent a real concept | `PaymentProcessor` (no real-world entity) |
| **Indirection** | Introduce intermediary to reduce coupling | `Repository` between service and database |
| **Protected Variations** | Protect from future changes | `Cache` interface → can swap Redis/Memcached without changing service |

---

## DRY, KISS, YAGNI

- **DRY** = Extract common logic. Don't copy-paste validation code across 5 classes.
- **KISS** = Simple solution first. Don't use microservices for a blog.
- **YAGNI** = Don't build features "just in case". No "future-proof" over-engineering.

---

## Composition Over Inheritance

**System Flow:** Need to reuse behavior → Ask: "Is-a or Has-a?" → Prefer Has-a

**Example:**
```java
// BAD: Inheritance
class Bird { void fly() {} }
class Penguin extends Bird { } // Penguins can't fly!

// GOOD: Composition
interface Flyable { void fly(); }
class Sparrow implements Flyable { public void fly() { ... } }
class Penguin { // No fly behavior
}
```

**When Inheritance is OK** = True "is-a" relationship that won't change (e.g., `SavingsAccount` is a `BankAccount`).

---

# Priority 4 — Low-Level Design Concepts

## Class Design

**System Flow:** Define class → What data? What operations? How to protect data?

- **Encapsulation** = Private fields + public getters/setters. Control access.
- **Validation** = Validate in constructor/setters. `new User("", -1)` should throw.
- **Access Modifiers** = `private` (class), `protected` (package+subclass), `public` (all)

**Example:**
```java
class User {
    private String email;          // Encapsulated
    private int age;

    public User(String email, int age) {
        if (!email.contains("@")) throw new IllegalArgumentException();
        if (age < 0) throw new IllegalArgumentException();
        this.email = email;
        this.age = age;
    }
    // getters only (immutable) or getters+setters (mutable)
}
```

---

## Interface Design

**System Flow:** Multiple implementations expected → Define interface → Code to interface

**Example:**
```java
interface Payment { void pay(double amount); }
class PayPalPayment implements Payment { ... }
class StripePayment implements Payment { ... }

// Service depends on abstraction
class OrderService {
    private Payment payment; // Not PayPalPayment!
    public OrderService(Payment payment) { this.payment = payment; }
}
```

---

## Object Collaboration

**System Flow:** Object A needs something done → Passes message to Object B → B does it or delegates further

- **Message Passing** = Calling methods on other objects
- **Delegation** = Object A asks Object B to do the work (B has the expertise)

**Example:**
```java
class Order {
    private List<Item> items;
    public double getTotal() {
        return items.stream().mapToDouble(Item::getPrice).sum(); // Delegates to Item
    }
}
```

---

## Dependency Injection

**System Flow:** Class needs dependency → Don't create it inside → Receive it from outside

| Type | How | Example |
|------|-----|---------|
| **Constructor** | Pass via constructor | `new OrderService(new PayPalPayment())` |
| **Setter** | Pass via setter | `service.setPayment(new StripePayment())` |
| **Interface** | Class implements interface that provides dependency | Rare in interviews |

**Benefit** = Easy to swap implementations, testable (mock dependencies).

---

## Error Handling

**System Flow:** Error occurs → Catch at right level → Return meaningful error or recover

- **Exceptions** = For exceptional cases (network down, invalid input)
- **Validation** = Check before operation (null checks, range checks)
- **Error Objects** = Return result+error instead of throwing (e.g., `Result<T, Error>`)

**Example:**
```java
public Result<Order> placeOrder(OrderRequest req) {
    if (req == null) return Result.error("Invalid request");
    try { ... } catch (PaymentException e) { return Result.error(e.getMessage()); }
    return Result.success(order);
}
```

---

# Priority 5 — Design Patterns

## Creational Patterns

| Pattern | When to Use | System Flow | Example |
|---------|------------|-------------|---------|
| **Singleton** | One instance only | `getInstance()` → Create if null → Return instance | `DatabaseConnection`, `Logger` |
| **Factory Method** | Don't know exact type at compile time | `createProduct()` → Returns `Product` interface | `NotificationFactory.create("email")` → `EmailNotification` |
| **Abstract Factory** | Families of related objects | `createUI()` → Returns `WindowsButton` + `WindowsTextBox` together | Cross-platform UI |
| **Builder** | Complex object with many optional params | `new Builder().setName().setAge().setAddress().build()` | `HttpRequest`, `PizzaOrder` |
| **Prototype** | Clone existing object | `original.clone()` → New object with same state | `GameCharacter` template |

---

## Structural Patterns

| Pattern | When to Use | System Flow | Example |
|---------|------------|-------------|---------|
| **Adapter** | Incompatible interfaces | `OldAPI` → `Adapter` → `NewInterface` | `LegacyPaymentAdapter` wraps old payment system |
| **Bridge** | Separate abstraction from implementation | `RemoteControl` (abstraction) → `Device` (implementation) | TV remote controls different TV brands |
| **Composite** | Tree structure, treat individual and group same | `File` and `Folder` both implement `FileSystemComponent` | File system, Organization hierarchy |
| **Decorator** | Add behavior dynamically | `Coffee` → `MilkDecorator` → `SugarDecorator` → `getCost()` | Java I/O streams (`BufferedReader` wraps `FileReader`) |
| **Facade** | Simplify complex subsystem | `User` → `BookingFacade` → (Payment + Inventory + Notification) | `HomeTheaterFacade` (turns on TV + sound + lights) |
| **Proxy** | Control access to object | `Client` → `Proxy` → (check access) → `RealSubject` | `ImageProxy` (loads image only when displayed) |

---

## Behavioral Patterns

| Pattern | When to Use | System Flow | Example |
|---------|------------|-------------|---------|
| **Strategy** | Multiple algorithms, interchangeable | `Context` → `setStrategy(A)` → `execute()` → Uses algorithm A | `PaymentContext` → `setStrategy(PayPal)` → `pay()` |
| **Observer** | One change → many notifications | `Subject` state changes → `notify()` → All `Observer`s updated | `Newsletter` → notifies all `Subscriber`s |
| **Command** | Encapsulate request as object | `Client` → `Command` → `Invoker` → `Receiver.execute()` | Undo/Redo, Job queue |
| **State** | Object behavior changes with state | `Context` → `setState(Active)` → `doAction()` behaves differently | `Order` → `PendingState` → `PaidState` → `ShippedState` |
| **Iterator** | Traverse collection without exposing internals | `collection.iterator()` → `hasNext()` → `next()` | Java `List.iterator()` |
| **Template Method** | Common skeleton, varying steps | `AbstractClass.templateMethod()` → calls `step1()` (fixed) + `step2()` (override) | `DataExporter` → `fetchData()` (common) + `format()` (CSV/JSON vary) |
| **Chain of Responsibility** | Pass request along chain until handled | `Handler1.handle()` → Can't? → `Handler2.handle()` → ... | `Logger` → `INFO` → `DEBUG` → `ERROR` handlers |

---

# Priority 6 — Common LLD Problems (System Flows)

## 1. Parking Lot System

**System Flow:**
```
Vehicle enters → Gate scans ticket/vehicle → ParkingManager finds spot 
→ SpotAllocationStrategy (nearest/available) → Assigns spot → Ticket generated
→ Vehicle parks → Later: Vehicle exits → Payment calculated (hourly/daily)
→ Payment processed → Spot freed → Ticket closed
```

**Key Classes:** `Vehicle` (car/bike/truck), `ParkingSpot` (small/medium/large), `ParkingFloor`, `Ticket`, `Payment`, `ParkingManager`, `SpotAllocationStrategy` (Strategy pattern)

**Patterns:** Strategy (allocation), Singleton (manager), Factory (spot creation)

---

## 2. Library Management System

**System Flow:**
```
Member searches book → BookCatalog checks availability → Available? 
→ Librarian issues book → BorrowingRecord created → Due date set
→ Member returns → Fine calculated (if overdue) → Book back to catalog
```

**Key Classes:** `Book`, `Member`, `Librarian`, `BorrowingRecord`, `BookCatalog`, `FineCalculator`

**Patterns:** Singleton (catalog), Strategy (fine calculation)

---

## 3. ATM System

**System Flow:**
```
User inserts card → CardReader validates → PIN entered → PIN verified 
→ Account accessed → Select transaction (withdraw/deposit/balance) 
→ Transaction processed → Cash dispensed/updated → Card ejected → Receipt
```

**Key Classes:** `Card`, `Account`, `ATM`, `CashDispenser`, `Transaction` (withdraw/deposit/balance), `PINValidator`

**Patterns:** State (ATM states: Idle → CardInserted → PINVerified → Transaction → Idle), Command (transactions)

**State Machine:**
```
[Idle] —insertCard→ [CardInserted] —enterPIN→ [PINVerified] 
—selectTransaction→ [Processing] —complete→ [Idle]
```

---

## 4. Elevator System

**System Flow:**
```
Request made (floor, direction) → Request added to queue 
→ ElevatorScheduler picks elevator (nearest/busy) → Elevator moves 
→ Stops at floor → Doors open/close → Continue to next request
```

**Key Classes:** `Elevator`, `Floor`, `Request`, `ElevatorScheduler`, `ElevatorController`

**Patterns:** Strategy (scheduling algorithm: FCFS, SCAN, LOOK), Observer (status updates)

**Scheduling:**
- **FCFS** = First come first served (simple, inefficient)
- **SCAN** = Elevator goes up, then down (like disk arm)
- **LOOK** = SCAN but only goes to last request in each direction

---

## 5. Movie Ticket Booking System

**System Flow:**
```
User selects movie → Selects theatre → Selects showtime → Seat selection 
→ Seat lock (5 min timer) → Payment → Booking confirmed → Ticket generated
→ Seat permanently booked
```

**Key Classes:** `Movie`, `Theatre`, `Screen`, `Show`, `Seat`, `Booking`, `Payment`, `SeatLock`

**Patterns:** State (booking: Pending → Locked → Paid → Confirmed → Cancelled), Observer (seat availability), Singleton (booking manager)

---

## 6. Hotel Management System

**System Flow:**
```
Guest searches → Checks room availability → Selects room type 
→ Reservation created → Payment → Booking confirmed → Check-in 
→ Room assigned → Stay → Check-out → Billing → Room freed
```

**Key Classes:** `Guest`, `Room` (types: single/double/suite), `Reservation`, `Booking`, `Payment`, `Billing`, `RoomInventory`

**Patterns:** Factory (room creation), Strategy (pricing: seasonal/loyalty)

---

## 7. Cab Booking System (Uber/Ola)

**System Flow:**
```
Rider requests ride → Location sent → Matching algorithm finds nearest drivers 
→ Driver notified → Driver accepts → Trip created → Driver arrives 
→ Ride starts → GPS tracking → Ride ends → Fare calculated (distance + time + surge) 
→ Payment → Rating
```

**Key Classes:** `Rider`, `Driver`, `Trip`, `Location`, `MatchingStrategy`, `PricingStrategy`, `Payment`

**Patterns:** Strategy (matching: nearest/rating-based, pricing: distance/time/surge), Observer (location updates), Singleton (trip manager)

---

## 8. Food Delivery System (Swiggy/Zomato)

**System Flow:**
```
User browses restaurants → Selects items → Cart created → Places order 
→ Restaurant accepts → DeliveryPartner assigned (nearest/available) 
→ Partner picks up → Real-time tracking → Delivered → Payment → Rating
```

**Key Classes:** `User`, `Restaurant`, `Menu`, `Item`, `Cart`, `Order`, `DeliveryPartner`, `Payment`, `Notification`

**Patterns:** Observer (order status updates), Strategy (delivery assignment), State (order: Placed → Accepted → Prepared → PickedUp → Delivered)

---

## 9. Online Shopping System (Amazon)

**System Flow:**
```
User browses → Adds to cart → Cart checkout → Address selection 
→ Payment → Order created → Inventory updated → Notification sent 
→ Order shipped → Delivered → Return possible (within window)
```

**Key Classes:** `User`, `Product`, `Category`, `Cart`, `CartItem`, `Order`, `OrderItem`, `Inventory`, `Payment`, `Shipment`

**Patterns:** Singleton (cart per user), Observer (inventory low stock), Strategy (payment methods), Factory (shipment types)

---

## 10. Splitwise

**System Flow:**
```
User creates group → Adds members → Adds expense → Selects split type 
→ (Equal/Exact/Percentage) → Balances calculated → Simplified debts 
→ Settlement initiated → Payment recorded → Balances updated
```

**Key Classes:** `User`, `Group`, `Expense`, `Split` (Equal/Exact/Percentage), `BalanceSheet`, `Settlement`, `Transaction`

**Patterns:** Strategy (split types), Observer (balance updates), Singleton (balance manager)

**Split Types:**
- **Equal** = Total / members
- **Exact** = Each pays specific amount
- **Percentage** = Each pays % of total

**Simplify Debts:** A owes B 100, B owes C 100 → A owes C 100 directly.

---

# Priority 7 — Design Evaluation

**System Flow:** Design complete → Ask these questions → Refactor if needed

| Criteria | Check | Example Fix |
|----------|-------|-------------|
| **Extensibility** | Can I add new feature without changing existing code? | Use interfaces for payment types |
| **Maintainability** | Can another dev understand this in 6 months? | Clear naming, single responsibility |
| **Reusability** | Can this component be used elsewhere? | Generic `Payment` interface, not `PayPalPayment` |
| **Testability** | Can I unit test this? | Dependency injection, no static dependencies |
| **Scalability** | Will this work with 10x data? | Avoid O(n²) loops, use efficient data structures |
| **Readability** | Is the code self-explanatory? | Meaningful names, small methods |
| **Low Coupling** | Do classes depend too much on each other? | Interfaces, events, message queues |
| **High Cohesion** | Are class responsibilities focused? | `InvoiceService` only handles invoices |

**Interview Response:** "My design uses Strategy for extensibility, follows SRP for maintainability, and uses DI for testability."

---

# Common Interview Scenarios — Quick Checklist

1. **Gather requirements** → Ask "Who? What? Constraints?"
2. **Identify entities** → Nouns from requirements
3. **Draw class diagram** → Boxes, attributes, relationships
4. **Define relationships** → Association/Aggregation/Composition/Inheritance
5. **Apply patterns** → Strategy? Observer? Factory? State?
6. **Sequence diagram** → For key flow (e.g., place order)
7. **Justify decisions** → "I used composition because..."
8. **Apply SOLID** → "SRP: Each class has one job"
9. **Discuss trade-offs** → "This is simple now but can extend via..."
10. **Handle new requirements** → "Add new implementation of X interface"

---

# Quick Reference: Pattern → Problem Mapping

| Problem | Pattern |
|---------|---------|
| Multiple payment methods | Strategy |
| Notification system (email/SMS/push) | Observer + Strategy |
| Undo/Redo functionality | Command |
| Object states with different behavior | State |
| Only one DB connection | Singleton |
| Complex object with optional params | Builder |
| Incompatible API needs to work | Adapter |
| Add features dynamically | Decorator |
| Simplify complex subsystem | Facade |
| Control access to expensive object | Proxy |
| One change → many updates | Observer |
| Families of related objects | Abstract Factory |
| Don't know type at compile time | Factory Method |
| Tree structure (file system) | Composite |
| Varying algorithms | Strategy |
| Common process, varying steps | Template Method |
| Pass request along handlers | Chain of Responsibility |
| Traverse collection | Iterator |

---

# Quick Reference: SOLID Violations → Fixes

| Smell | Violation | Fix |
|-------|-----------|-----|
| God class (500+ lines) | SRP | Split into focused classes |
| `if-else` for types | OCP | Use interface + polymorphism |
| `instanceof` checks | LSP | Rethink hierarchy or use composition |
| Fat interface | ISP | Split into smaller interfaces |
| `new` inside business logic | DIP | Inject dependencies |

---

# Final Tip: Interview Flow

```
1. CLARIFY (2-3 min)     → Ask questions, state assumptions
2. IDENTIFY (3-5 min)    → List classes, relationships
3. DESIGN (10-15 min)    → Class diagram, key flows
4. PATTERNS (5 min)      → Where to apply, why
5. EVALUATE (3-5 min)    → SOLID, extensibility, trade-offs
6. EXTEND (if time)      → "What if we add X?"
```

**Always think:** "How does the data flow?" not "What is the theory?"

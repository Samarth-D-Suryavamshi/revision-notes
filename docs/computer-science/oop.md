
# Object-Oriented Programming - Interview Notes (System-First Approach)

---

## 1. INTRODUCTION TO OOP

**What is OOP?**
Programming paradigm organizing code around objects (data + behavior) rather than functions.

**Why OOP?**
Real-world modeling, code reusability, maintainability, encapsulation of complexity.

**Procedural vs OOP:**
| Procedural | OOP |
|-----------|-----|
| Functions + data separate | Data + behavior bundled |
| Top-down approach | Bottom-up (objects first) |
| Code reuse via functions | Code reuse via inheritance/composition |
| No data hiding | Encapsulation protects data |
| Harder to maintain large systems | Easier to scale and maintain |

**When NOT OOP?**
Small scripts, performance-critical systems, functional data pipelines.

---

## 2. CLASS AND OBJECT

**Class:** Blueprint/template defining what an object has (data) and does (behavior).
**Object:** Instance created from class. Has state, behavior, identity.

```
Class: Car
  - attributes: color, speed, model
  - methods: accelerate(), brake()
    |
Object: myCar = new Car("red", 0, "Tesla")
  - myCar.color = "red"
  - myCar.accelerate() -> speed increases
```

**Where objects stored?**
- Stack: Reference/address of object
- Heap: Actual object data

**Can object exist without class?**
No. Object is instantiation of class. (Except prototype-based languages like JS)

---

## 3. ENCAPSULATION

**What:** Hide internal state, expose only controlled access.

```
BankAccount
  - private balance          <- hidden
  + deposit(amount)          <- controlled access
  + withdraw(amount)         <- validation inside
  + getBalance()             <- read-only access
```

**Why important?**
- Prevents invalid state (can't set balance = -1000 directly)
- Internal changes don't break external code
- Validation logic centralized

**Is it only private variables?**
No. It's about designing a protective boundary around data + behavior.

---

## 4. ABSTRACTION

**What:** Show essential features, hide implementation complexity.

```
Car interface: start(), stop(), accelerate()
    |
ElectricCar implements start() { battery.on(); motor.run(); }
PetrolCar implements start() { ignition.spark(); engine.ignite(); }
    |
Driver uses car.start() -> doesn't care HOW it starts
```

**Abstraction vs Encapsulation:**
| Abstraction | Encapsulation |
|-------------|---------------|
| WHAT an object does | HOW data is protected |
| Hides complexity | Hides data |
| Interface/Abstract class | Private fields + getters/setters |
| Design level | Implementation level |

**Why useful?**
User interacts with simple interface. Internal complexity irrelevant.

---

## 5. INHERITANCE

**What:** Child class acquires parent class properties and methods.

```
        Vehicle
       /   |   \
    Car  Bike  Truck
    |
  ElectricCar
```

**Types:**
- **Single:** One parent (Java, C#)
- **Multiple:** Two+ parents (C++ classes, Python) - Java via interfaces
- **Multilevel:** Grandparent -> Parent -> Child
- **Hierarchical:** One parent, many children
- **Hybrid:** Mix of above

**super/base:**
Refers to parent class. Used to call parent constructor/method.

**Why Java no multiple class inheritance?**
Diamond problem: two parents have same method - which one to call?
```
      A (method foo())
     / \
    B   C (both override foo())
     \
      D -> D.foo() ??? ambiguous
```

**Advantages:** Code reuse, hierarchical classification, polymorphism.
**Disadvantages:** Tight coupling, fragile base class problem, rigid hierarchy.

---

## 6. POLYMORPHISM

**What:** Same interface, different implementations.

### Compile-time (Static)
**Method Overloading:** Same name, different parameters.
```java
class Calculator {
    int add(int a, int b) { return a+b; }
    double add(double a, double b) { return a+b; }
    int add(int a, int b, int c) { return a+b+c; }
}
```
Resolved at compile time based on parameter types.

**Operator Overloading (C++):**
```cpp
Complex operator+(Complex a, Complex b) { ... }
```

### Runtime (Dynamic)
**Method Overriding:** Child provides specific implementation of parent method.
```java
class Animal { void speak() { print("sound"); } }
class Dog extends Animal { @Override void speak() { print("bark"); } }
class Cat extends Animal { @Override void speak() { print("meow"); } }

Animal a = new Dog();
a.speak(); // "bark" - resolved at runtime
```

**Dynamic Dispatch:**
```
Animal ref -> Dog object
    |
ref.speak() -> JVM looks at actual object type (Dog)
            -> Calls Dog.speak()
```
Virtual method table (vtable) maps method calls to actual implementations.

---

## 7. CONSTRUCTORS

**What:** Special method called when object created. Initializes object state.

| Type | Purpose |
|------|---------|
| Default | No args, initializes defaults |
| Parameterized | Takes args, custom initialization |
| Copy (C++) | Creates copy of existing object |

**Constructor Chaining:**
```java
class Vehicle {
    Vehicle() { print("Vehicle created"); }
}
class Car extends Vehicle {
    Car() {
        super(); // implicit - calls Vehicle()
        print("Car created");
    }
}
// Output: Vehicle created -> Car created
```

**Constructor Overloading:**
```java
class Person {
    Person() { this("Unknown", 0); } // calls parameterized
    Person(String name, int age) { ... }
}
```

**Constructor vs Method:**
| Constructor | Method |
|-------------|--------|
| Same name as class | Any name |
| No return type | Has return type |
| Called automatically | Called explicitly |
| Initializes object | Performs operations |

**Why no return type?**
Not called by programmer directly. Compiler handles it. Return type would confuse parser.

---

## 8. DESTRUCTORS / FINALIZATION

| Language | Mechanism |
|----------|-----------|
| C++ | Destructor (~ClassName) - deterministic cleanup |
| Java | Garbage Collector - automatic, non-deterministic |
| Python | __del__ + garbage collection + context managers (with) |
| C# | IDisposable pattern + finalizer |

**Garbage Collection:**
```
Object created -> referenced -> no more references -> GC marks -> GC sweeps -> memory freed
```

---

## 9. STATIC VS INSTANCE

| Static | Instance |
|--------|----------|
| Belongs to class | Belongs to object |
| One copy shared | Each object has own copy |
| Accessed via ClassName | Accessed via object reference |
| Created at class load | Created at object creation |
| Cannot access instance members | Can access static members |

```java
class Counter {
    static int count = 0;     // shared across all objects
    int instanceCount = 0;    // per object

    Counter() {
        count++;              // increments for every object created
        instanceCount++;      // always 1 for each object
    }
}
```

**Can static method access instance variables?**
No. Static method has no "this" reference. Instance variables need object context.

**Static Block (Java):**
```java
static {
    // runs once when class loads
    // initialize static resources
}
```

---

## 10. ACCESS MODIFIERS

| Modifier | Same Class | Same Package | Subclass | Anywhere |
|----------|-----------|-------------|----------|----------|
| public | Yes | Yes | Yes | Yes |
| protected | Yes | Yes | Yes | No |
| default | Yes | Yes | No | No |
| private | Yes | No | No | No |

**When public?**
API surface, constants, methods intended for external use.

**private vs protected:**
- private: Only this class
- protected: This class + subclasses + same package

---

## 11. this AND super

**this:**
- Refers to current object
- Differentiates instance var from parameter: this.name = name
- Calls constructor: this(args)
- Passes current object: someMethod(this)

**super:**
- Refers to parent class
- Calls parent constructor: super(args)
- Calls parent method: super.methodName()

```java
class Employee extends Person {
    Employee(String name, int id) {
        super(name);        // Person(name)
        this.id = id;       // this object's id
    }
}
```

---

## 12-15. OBJECT RELATIONSHIPS

### Association (Uses-a)
```
Professor --- teaches ---> Student
```
Both exist independently. One-to-one, one-to-many, many-to-many.

### Aggregation (Has-a, weak)
```
Department o---> Employee
```
Department has employees. Employees exist without department.
- Weak ownership, independent lifecycles
- Hollow diamond in UML

### Composition (Has-a, strong)
```
House *---> Room
```
House has rooms. Rooms destroyed with house.
- Strong ownership, dependent lifecycles
- Filled diamond in UML

### Dependency (Uses temporarily)
```
PaymentProcessor ---> Logger
```
PaymentProcessor uses Logger as parameter. Logger can change.

**Aggregation vs Composition:**
| Aggregation | Composition |
|-------------|-------------|
| Weak ownership | Strong ownership |
| Part can exist alone | Part cannot exist alone |
| Department-Employee | House-Room |
| Can be shared | Exclusive |

**Why composition over inheritance?**
- Inheritance = rigid hierarchy, tight coupling
- Composition = flexible, runtime behavior change, easier testing
- "Favor composition over inheritance" - Gang of Four

---

## 16-18. INTERFACES AND ABSTRACT CLASSES

### Interface
```java
interface Payment {
    void pay(double amount);    // abstract by default
    default void refund() { ... } // Java 8+ default method
}
```
- 100% abstract (pre-Java 8), can have default methods now
- No state (no instance variables)
- Multiple inheritance supported
- Contract: "What to do"

### Abstract Class
```java
abstract class Animal {
    String name;                    // state
    abstract void speak();          // abstract
    void sleep() { ... }            // concrete
}
```
- Can have state (variables)
- Can have concrete methods
- Single inheritance only
- Partial implementation: "What + some How"

### Interface vs Abstract Class
| Feature | Interface | Abstract Class |
|---------|-----------|----------------|
| State | No | Yes |
| Constructors | No | Yes |
| Multiple inheritance | Yes | No |
| Methods | Abstract + default | Abstract + concrete |
| Use case | Capability/contract | Shared base + variation |

**When interface?**
- Defining a contract multiple unrelated classes implement
- Multiple capabilities (Flyable, Swimmable, Drawable)

**When abstract class?**
- Shared code among related classes
- Common state + some default behavior
- Template method pattern

---

## 19. SOLID PRINCIPLES

### S - Single Responsibility Principle
"A class should have one reason to change."
```
BAD:  UserManager { login(); sendEmail(); generateReport(); }
GOOD: AuthService { login() }
      EmailService { sendEmail() }
      ReportService { generateReport() }
```

### O - Open/Closed Principle
"Open for extension, closed for modification."
```
BAD:  if (shape.type == "circle") { ... } else if (shape.type == "square") { ... }
GOOD: interface Shape { double area(); }
      class Circle implements Shape { ... }
      class Square implements Shape { ... }
      // New shape? Just add class, no existing code changes
```

### L - Liskov Substitution Principle
"Child class should be substitutable for parent without breaking."
```
BAD:  class Square extends Rectangle { 
        // Square setWidth() also sets height - breaks Rectangle behavior
      }
GOOD: Separate Shape interface, Rectangle and Square both implement
```

### I - Interface Segregation Principle
"Clients shouldn't depend on interfaces they don't use."
```
BAD:  interface Worker { work(); eat(); sleep(); }
      // Robot implements Worker - must implement eat() and sleep() ???
GOOD: interface Workable { work(); }
      interface Feedable { eat(); sleep(); }
      // Robot implements Workable only
```

### D - Dependency Inversion Principle
"Depend on abstractions, not concretions."
```
BAD:  class OrderService { 
        MySQLDatabase db = new MySQLDatabase(); // tight coupling
      }
GOOD: class OrderService {
        Database db; // interface
        OrderService(Database db) { this.db = db; } // injected
      }
```

---

## 20. ADVANCED CONCEPTS

### Shallow vs Deep Copy
```
Original: [A] -> [B] -> [C]
          |
Shallow:  [A'] -> [B] -> [C]    (A' references same B,C)
Deep:     [A'] -> [B'] -> [C']  (completely independent copies)
```

### Immutability
```java
final class ImmutablePerson {
    private final String name;      // final = can't reassign
    private final List<String> tags; // unmodifiable copy

    ImmutablePerson(String name, List<String> tags) {
        this.name = name;
        this.tags = List.copyOf(tags); // defensive copy
    }
    // No setters
}
```
**Benefits:** Thread-safe, hashable keys, predictable, no side effects.

### Dependency Injection
```
// Without DI
class OrderService { PaymentGateway pg = new StripeGateway(); }

// With Constructor DI
class OrderService { 
    PaymentGateway pg;
    OrderService(PaymentGateway pg) { this.pg = pg; } // injected
}
// Test: new OrderService(new MockGateway())
// Prod:  new OrderService(new StripeGateway())
```
Types: Constructor injection (preferred), Setter injection, Interface injection.

### High Cohesion + Low Coupling
```
High Cohesion: Class does ONE thing well
Low Coupling:  Classes depend minimally on each other

GOOD: AuthService { login(), logout(), verify() }  <- cohesive
      AuthService depends on UserRepository interface <- loosely coupled
```

---

## COMPLETE WORKFLOW: "What happens when you create an object?"

```
Car myCar = new Car("Tesla", "red");
    |
1. Memory Allocation
   - JVM allocates memory on heap for Car object
   - Reference 'myCar' stored on stack
    |
2. Default Initialization
   - Instance variables set to defaults (0, null, false)
    |
3. Constructor Chaining
   - Car(String, String) called
   - super() implicitly called first (Object constructor)
   - Instance variable initialization blocks run
   - Constructor body executes
    |
4. Object Ready
   - Reference returned to myCar
   - Object now usable
    |
5. Garbage Collection (eventually)
   - No more references to myCar
   - GC marks object
   - finalize() called (if overridden)
   - Memory reclaimed
```

---

## COMPLETE WORKFLOW: "How does method overriding work at runtime?"

```
Animal a = new Dog();   // reference type = Animal, object type = Dog
    |
a.speak();              // compile-time: checks Animal has speak()
    |
Runtime:
  1. JVM looks at actual object type (Dog)
  2. Checks Dog's method table for speak()
  3. Found? Call Dog.speak()
  4. Not found? Walk up inheritance chain
    |
Output: "bark"          // dynamic dispatch in action
```

---

## COMPLETE WORKFLOW: "How does encapsulation protect data?"

```
BankAccount
  private double balance = 1000;

  public void withdraw(double amount) {
      if (amount > 0 && amount <= balance) {  // validation
          balance -= amount;                   // controlled modification
          logTransaction(amount);              // side effects
      } else {
          throw new InsufficientFundsException();
      }
  }

  public double getBalance() { return balance; }  // read-only

// External code:
account.withdraw(500);   // OK, validated
// account.balance = -9999;  // COMPILE ERROR - private
// Direct access prevented, state always valid
```

---

## QUICK ANSWER CHEAT SHEET

| Question | Answer |
|----------|--------|
| Why OOP? | Real-world modeling, reusability, maintainability, encapsulation |
| OOP vs Procedural? | OOP = objects (data+behavior); Procedural = functions + separate data |
| Class vs Object? | Class = blueprint; Object = instance |
| Where objects stored? | Heap (data), Stack (reference) |
| Why encapsulation? | Data protection, validation, internal changes safe |
| Encapsulation vs Abstraction? | Encapsulation = hide data; Abstraction = hide complexity |
| Why abstraction? | Simplify interface, reduce cognitive load |
| Inheritance advantages? | Code reuse, hierarchical modeling, polymorphism |
| Inheritance disadvantages? | Tight coupling, fragile base class, rigid hierarchy |
| Why Java no multiple class inheritance? | Diamond problem - ambiguity |
| Compile-time vs Runtime polymorphism? | Overloading (static) vs Overriding (dynamic) |
| How dynamic dispatch works? | JVM checks actual object type at runtime, calls appropriate method |
| Constructor vs Method? | Constructor = initialize, no return, same name; Method = operation, has return |
| Why constructor no return type? | Compiler handles it, return type would confuse parser |
| Static vs Instance? | Static = class-level, shared; Instance = object-level, per object |
| Can static access instance? | No - no "this" reference |
| private vs protected? | private = this class only; protected = this + subclasses + package |
| this vs super? | this = current object; super = parent class |
| Association vs Aggregation? | Association = uses; Aggregation = weak has-a |
| Aggregation vs Composition? | Aggregation = weak, independent; Composition = strong, dependent |
| Why composition over inheritance? | Flexible, runtime behavior change, less coupling |
| Interface vs Abstract Class? | Interface = contract, no state, multiple; Abstract = partial impl, state, single |
| When interface? | Unrelated classes need same capability |
| When abstract class? | Related classes share code |
| SRP? | One reason to change per class |
| OCP? | Open for extension, closed for modification |
| LSP? | Child substitutable for parent |
| ISP? | Small focused interfaces |
| DIP? | Depend on abstractions |
| Shallow vs Deep copy? | Shallow = shared references; Deep = fully independent |
| Why immutability? | Thread-safe, hashable, predictable, no side effects |
| What is DI? | Inject dependencies instead of creating inside class |
| High cohesion? | Class does one thing well |
| Low coupling? | Minimal dependencies between classes |
| Why constructors not overridden? | Constructors not inherited, child has its own |
| What is constructor chaining? | Child constructor calls parent constructor via super() |
| What is method overloading? | Same name, different parameters, compile-time |
| What is method overriding? | Child redefines parent method, runtime |
| What is object lifetime? | Allocation -> initialization -> use -> destruction -> GC |
| What is garbage collection? | Automatic memory reclamation when no references |
| What is finalize? | Method called before GC (deprecated in Java) |
| What is static block? | Code running once when class loads |
| What is final class? | Cannot be inherited |
| What is final method? | Cannot be overridden |
| What is final variable? | Cannot be reassigned |
| What is abstract method? | Declared but not implemented, must override |
| What is concrete method? | Has implementation |
| What is default method? | Interface method with default implementation |
| What is functional interface? | Single abstract method interface (Java) |
| What is lambda? | Anonymous function implementing functional interface |
| What is anonymous class? | Class without name, inline implementation |
| What is inner class? | Class inside another class |
| What is nested class? | Static inner class |
| What is local class? | Class inside method |
| What is marker interface? | Empty interface (Serializable, Cloneable) |
| What is cloneable? | Marker for Object.clone() support |
| What is serializable? | Marker for object serialization |
| What is transient? | Field not serialized |
| What is volatile? | Field always read from main memory |
| What is synchronized? | Thread-safe access method/block |
| What is strictfp? | Ensures floating-point consistency |
| What is native? | Method implemented in C/C++ |
| What is instanceof? | Check if object is instance of class |
| What is type casting? | Convert reference type (upcast/downcast) |
| What is upcasting? | Child -> Parent (implicit, safe) |
| What is downcasting? | Parent -> Child (explicit, may fail) |
| What is ClassCastException? | Invalid downcast at runtime |
| What is RTTI? | Runtime Type Information |
| What is reflection? | Inspect/modify class at runtime |
| What is introspection? | Read-only reflection |
| What is annotation? | Metadata for compiler/runtime |
| What is @Override? | Compiler checks method override |
| What is @Deprecated? | Mark obsolete |
| What is @SuppressWarnings? | Ignore compiler warnings |
| What is design pattern? | Reusable solution to common problem |
| What is Singleton? | One instance globally accessible |
| What is Factory? | Create objects without exposing constructor |
| What is Builder? | Step-by-step object construction |
| What is Strategy? | Interchangeable algorithms |
| What is Observer? | Subscribe/notify pattern |
| What is Decorator? | Add behavior dynamically |
| What is Adapter? | Convert interface to another |
| What is Facade? | Simplified interface to complex subsystem |
| What is Proxy? | Control access to object |
| What is Command? | Encapsulate request as object |
| What is Template Method? | Skeleton algorithm, subclasses fill steps |
| What is State? | Behavior changes based on state |
| What is Chain of Responsibility? | Pass request along handler chain |
| What is Iterator? | Traverse collection without exposing internals |
| What is Memento? | Capture and restore object state |
| What is Mediator? | Centralize complex communications |
| What is Flyweight? | Share common state to save memory |
| What is Bridge? | Separate abstraction from implementation |
| What is Composite? | Tree structure, individual + composite same interface |
| What is Visitor? | Add operations without modifying classes |
| What is Interpreter? | Grammar-based language processing |

---

## SKIP THESE (Unless Runtime/Compiler Role)

VTable implementation details, JVM bytecode generation, CLR internals, Python MRO beyond basics, C++ object layout in memory, virtual inheritance internals, reflection implementation internals, compiler dispatch table generation, runtime metadata internals

---

**Revision Order:** OOP Fundamentals -> Class vs Object -> Encapsulation -> Abstraction -> Inheritance -> Polymorphism -> Constructors -> Static vs Instance -> Access Modifiers -> Association -> Aggregation -> Composition -> Interfaces -> Abstract Classes -> Interface vs Abstract Class -> Method Overloading vs Overriding -> SOLID -> Coupling & Cohesion -> Composition Over Inheritance -> Dependency Injection -> Design Patterns

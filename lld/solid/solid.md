# SOLID Principles — Interview Revision Guide

> Five principles of object-oriented design for **maintainable, flexible, and testable** code.
> Use this doc for a quick pre-interview revision. Examples in **Java** and **TypeScript**.

---

## Table of Contents

1. [Quick Reference](#1-quick-reference)
2. [S — Single Responsibility Principle (SRP)](#2-s--single-responsibility-principle-srp)
3. [O — Open/Closed Principle (OCP)](#3-o--openclosed-principle-ocp)
4. [L — Liskov Substitution Principle (LSP)](#4-l--liskov-substitution-principle-lsp)
5. [I — Interface Segregation Principle (ISP)](#5-i--interface-segregation-principle-isp)
6. [D — Dependency Inversion Principle (DIP)](#6-d--dependency-inversion-principle-dip)
7. [How They Work Together](#7-how-they-work-together)
8. [Common Interview Questions](#8-common-interview-questions)
9. [Revision Cheat Sheet](#9-revision-cheat-sheet)

---

## 1. Quick Reference

| Principle | One-liner | Reason to change / Key idea |
|-----------|-----------|----------------------------|
| **S**RP | One class → one job | A class should have **one reason to change** |
| **O**CP | Extend, don't modify | **Open for extension**, **closed for modification** |
| **L**SP | Subtypes must behave like parents | Subclasses must be **substitutable** without breaking callers |
| **I**SP | Small, focused interfaces | Clients shouldn't depend on **methods they don't use** |
| **D**IP | Depend on abstractions | High-level and low-level modules both depend on **interfaces**, not concretions |

**Memory hook:** *"Some Old Lady In Denmark"* → S, O, L, I, D

**Related concepts:** Coupling (lower is better), Cohesion (higher is better), Dependency Injection, Design Patterns (Strategy, Factory, Adapter)

---

## 2. S — Single Responsibility Principle (SRP)

### Definition

> A class should have **one, and only one, reason to change**.

"Reason to change" = **one actor/stakeholder** or **one axis of change**. If changing the email template forces you to touch the database class, SRP is violated.

### Why it matters

- Easier to test (mock one concern at a time)
- Smaller, focused classes → easier to read and maintain
- Changes in one area don't ripple into unrelated code

### ❌ Bad — God class doing everything

```java
class UserService {
    void createUser(String name) { /* DB logic */ }
    void sendWelcomeEmail(String email) { /* Email logic */ }
    String generateReport() { /* Report logic */ }
    void logAction(String action) { /* Logging logic */ }
}
```

**Problems:** Change email provider → modify `UserService`. Change DB → same class. Hard to unit test without real DB/email.

### ✅ Good — Separate responsibilities

```java
class UserRepository {
    void save(User user) { /* DB only */ }
    User findById(int id) { /* DB only */ }
}

class EmailService {
    void sendWelcome(String email) { /* Email only */ }
}

class UserReportGenerator {
    String generate(List<User> users) { /* Report only */ }
}

class AuditLogger {
    void log(String action) { /* Logging only */ }
}
```

```typescript
class UserRepository {
    save(user: User): void { /* DB logic */ }
    findById(id: number): User | null { /* DB logic */ }
}

class EmailService {
    sendWelcome(email: string): void { /* Email logic */ }
}

class UserReportGenerator {
    generate(users: User[]): string { /* Report logic */ }
}
```

### Real-world LLD example: Order processing

Instead of one `OrderManager` that validates, calculates tax, saves to DB, sends SMS, and generates invoice — split into:

- `OrderValidator` — business rules
- `TaxCalculator` — tax logic
- `OrderRepository` — persistence
- `NotificationService` — SMS/email
- `InvoiceGenerator` — PDF/invoice

### Interview tip

**Q: "Is SRP about one method per class?"**
**A:** No. It's about **one reason to change**. A `UserRepository` can have `save`, `findById`, `delete` — all belong to persistence. The violation is mixing persistence + email + reporting in one class.

---

## 3. O — Open/Closed Principle (OCP)

### Definition

> Software entities (classes, modules, functions) should be **open for extension** but **closed for modification**.

Add new behavior by **adding new code** (new classes/strategies), not by **editing existing, working code**.

### Why it matters

- Reduces regression risk (don't touch tested code)
- Supports plugin-like architectures
- Often achieved via **polymorphism + Strategy/Factory patterns**

### ❌ Bad — Modify class for every new type

```java
class DiscountCalculator {
    double calculate(String type, double price) {
        if (type.equals("SEASONAL")) return price * 0.1;
        if (type.equals("LOYALTY")) return price * 0.15;
        if (type.equals("BULK")) return price * 0.2;
        // Every new discount = edit this method!
        return 0;
    }
}
```

### ✅ Good — Strategy pattern: extend via new classes

```java
interface DiscountStrategy {
    double calculate(double price);
}

class SeasonalDiscount implements DiscountStrategy {
    public double calculate(double price) { return price * 0.1; }
}

class LoyaltyDiscount implements DiscountStrategy {
    public double calculate(double price) { return price * 0.15; }
}

class BulkDiscount implements DiscountStrategy {
    public double calculate(double price) { return price * 0.2; }
}

// Add new discount WITHOUT touching existing code
class PremiumDiscount implements DiscountStrategy {
    public double calculate(double price) { return price * 0.25; }
}

class DiscountCalculator {
    double calculate(DiscountStrategy strategy, double price) {
        return strategy.calculate(price);
    }
}
```

```typescript
interface DiscountStrategy {
    calculate(price: number): number;
}

class SeasonalDiscount implements DiscountStrategy {
    calculate(price: number): number { return price * 0.1; }
}

class LoyaltyDiscount implements DiscountStrategy {
    calculate(price: number): number { return price * 0.15; }
}

class DiscountCalculator {
    calculate(strategy: DiscountStrategy, price: number): number {
        return strategy.calculate(price);
    }
}
```

### Real-world LLD example: Payment methods

```java
interface PaymentProcessor {
    void pay(double amount);
}

class CreditCardProcessor implements PaymentProcessor { /* ... */ }
class UPIProcessor implements PaymentProcessor { /* ... */ }
class WalletProcessor implements PaymentProcessor { /* ... */ }

class CheckoutService {
    void checkout(PaymentProcessor processor, double amount) {
        processor.pay(amount); // closed for modification
    }
}
// New payment method? Add new class implementing PaymentProcessor.
```

### Interview tip

**Q: "Does OCP mean we can never change existing code?"**
**A:** No. It means **stable, core logic** shouldn't need changes when requirements **extend** behavior. Bug fixes and refactors are fine. The goal is to avoid `if/else` or `switch` chains that grow forever.

---

## 4. L — Liskov Substitution Principle (LSP)

### Definition

> Objects of a superclass should be replaceable with objects of its subclasses **without breaking the correctness** of the program.

If code expects a `Rectangle`, passing a `Square` must not cause surprises.

### Why it matters

- Polymorphism only works if subtypes honor the **contract** of the base type
- Violations cause subtle bugs that only appear at runtime

### ❌ Bad — Classic Rectangle/Square problem

```java
class Rectangle {
    protected int width, height;

    void setWidth(int w) { width = w; }
    void setHeight(int h) { height = h; }
    int area() { return width * height; }
}

class Square extends Rectangle {
    @Override
    void setWidth(int w) { width = w; height = w; } // side effect!
    @Override
    void setHeight(int h) { width = h; height = h; }
}

void testRectangle(Rectangle r) {
    r.setWidth(5);
    r.setHeight(4);
    assert r.area() == 20; // FAILS for Square! (area is 16)
}
```

**Problem:** `Square` changes behavior callers expect from `Rectangle`. Substitution breaks the test.

### ✅ Good — Common interface, no broken inheritance

```java
interface Shape {
    int area();
}

class Rectangle implements Shape {
    private final int width, height;
    Rectangle(int w, int h) { width = w; height = h; }
    public int area() { return width * height; }
}

class Square implements Shape {
    private final int side;
    Square(int side) { this.side = side; }
    public int area() { return side * side; }
}
```

```typescript
interface Shape {
    area(): number;
}

class Rectangle implements Shape {
    constructor(private width: number, private height: number) {}
    area(): number { return this.width * this.height; }
}

class Square implements Shape {
    constructor(private side: number) {}
    area(): number { return this.side ** 2; }
}
```

### Another common violation: Bird that can't fly

```java
// ❌ BAD
class Bird {
    void fly() { /* ... */ }
}

class Penguin extends Bird {
    @Override
    void fly() {
        throw new UnsupportedOperationException("Penguins can't fly!");
    }
}

void makeBirdFly(Bird bird) {
    bird.fly(); // crashes if bird is Penguin
}

// ✅ GOOD — segregate capabilities
interface Bird { void eat(); }
interface Flyable { void fly(); }

class Sparrow implements Bird, Flyable { /* ... */ }
class Penguin implements Bird { /* no fly() — not forced to implement it */ }
```

### LSP rules of thumb

1. Subclass **must not strengthen** preconditions (require more from caller)
2. Subclass **must not weaken** postconditions (guarantee less to caller)
3. Subclass **must preserve invariants** of the parent
4. No unexpected exceptions in methods the parent defines
5. Prefer **composition** over inheritance when behavior diverges

### Interview tip

**Q: "How is LSP different from OCP?"**
**A:** OCP is about **designing for extension**. LSP is about **correctness of inheritance** — subclasses must honor the parent's contract so polymorphism is safe.

---

## 5. I — Interface Segregation Principle (ISP)

### Definition

> No client should be forced to depend on methods it **does not use**.

Prefer **many small, specific interfaces** over one large "fat" interface.

### Why it matters

- Classes aren't forced to implement empty/stub methods
- Changes to one interface don't affect unrelated clients
- Clearer contracts → better cohesion

### ❌ Bad — Fat interface

```java
interface Worker {
    void work();
    void eat();
    void sleep();
}

class RobotWorker implements Worker {
    public void work() { /* OK */ }
    public void eat() { /* Robots don't eat! Empty or throw */ }
    public void sleep() { /* Robots don't sleep! */ }
}
```

### ✅ Good — Segregated interfaces

```java
interface Workable {
    void work();
}

interface Feedable {
    void eat();
}

interface Restable {
    void sleep();
}

class HumanWorker implements Workable, Feedable, Restable {
    public void work() { System.out.println("Working"); }
    public void eat() { System.out.println("Eating lunch"); }
    public void sleep() { System.out.println("Sleeping"); }
}

class RobotWorker implements Workable {
    public void work() { System.out.println("Working 24/7"); }
}
```

```typescript
interface Workable { work(): void; }
interface Feedable { eat(): void; }
interface Restable { sleep(): void; }

class HumanWorker implements Workable, Feedable, Restable {
    work(): void { console.log("Working"); }
    eat(): void { console.log("Eating lunch"); }
    sleep(): void { console.log("Sleeping"); }
}

class RobotWorker implements Workable {
    work(): void { console.log("Working 24/7"); }
}
```

### Real-world LLD example: Printer

```java
// ❌ BAD
interface MultiFunctionDevice {
    void print(Document doc);
    void scan(Document doc);
    void fax(Document doc);
}

class SimplePrinter implements MultiFunctionDevice {
    public void print(Document doc) { /* ... */ }
    public void scan(Document doc) { throw new UnsupportedOperationException(); }
    public void fax(Document doc) { throw new UnsupportedOperationException(); }
}

// ✅ GOOD
interface Printable { void print(Document doc); }
interface Scannable { void scan(Document doc); }
interface Faxable { void fax(Document doc); }

class SimplePrinter implements Printable { /* print only */ }
class AllInOnePrinter implements Printable, Scannable, Faxable { /* all three */ }
```

### Interview tip

**Q: "Is ISP the same as SRP for interfaces?"**
**A:** Related but different. SRP applies to **classes** (one reason to change). ISP applies to **interfaces** — don't force clients to know about methods they don't need. A fat interface violates ISP even if each implementing class has one job.

---

## 6. D — Dependency Inversion Principle (DIP)

### Definition

> **High-level modules** should not depend on **low-level modules**. Both should depend on **abstractions**.
> Abstractions should not depend on details. Details should depend on abstractions.

In practice: inject interfaces, not concrete classes.

### Why it matters

- Swap implementations (MySQL → Postgres, real email → mock) without changing business logic
- Enables unit testing with mocks/fakes
- Core domain logic stays independent of infrastructure

### ❌ Bad — High-level depends on concrete low-level

```java
class MySQLDatabase {
    void save(String data) { /* MySQL specific */ }
}

class OrderService {
    private MySQLDatabase db = new MySQLDatabase(); // tightly coupled!

    void createOrder(String order) {
        db.save(order);
    }
}
```

**Problems:** Can't test `OrderService` without MySQL. Can't switch to Postgres without editing `OrderService`.

### ✅ Good — Depend on abstraction + constructor injection

```java
interface Database {
    void save(String data);
}

class MySQLDatabase implements Database {
    public void save(String data) { System.out.println("Saved to MySQL"); }
}

class PostgresDatabase implements Database {
    public void save(String data) { System.out.println("Saved to Postgres"); }
}

class OrderService {
    private final Database db;

    OrderService(Database db) { // injected from outside
        this.db = db;
    }

    void createOrder(String order) {
        db.save(order);
    }
}

// Swap implementations easily
OrderService mysqlService = new OrderService(new MySQLDatabase());
OrderService pgService = new OrderService(new PostgresDatabase());
```

```typescript
interface Database {
    save(data: string): void;
}

class MySQLDatabase implements Database {
    save(data: string): void { console.log("Saved to MySQL"); }
}

class PostgresDatabase implements Database {
    save(data: string): void { console.log("Saved to Postgres"); }
}

class OrderService {
    constructor(private db: Database) {}

    createOrder(order: string): void {
        this.db.save(order);
    }
}

const service1 = new OrderService(new MySQLDatabase());
const service2 = new OrderService(new PostgresDatabase());
```

### Real-world LLD example: Notification service

```java
interface NotificationSender {
    void send(String message, String recipient);
}

class EmailSender implements NotificationSender { /* ... */ }
class SMSSender implements NotificationSender { /* ... */ }
class PushSender implements NotificationSender { /* ... */ }

class AlertService {
    private final NotificationSender sender;

    AlertService(NotificationSender sender) {
        this.sender = sender;
    }

    void alertUser(String userId, String message) {
        sender.send(message, userId);
    }
}
```

### DIP vs Dependency Injection (DI)

| Concept | What it is |
|---------|-----------|
| **DIP** | Design principle — depend on abstractions |
| **DI** | Technique — pass dependencies in (constructor, setter, or framework) |

DIP tells you **what** to do; DI is **how** you do it.

### Interview tip

**Q: "Is `new` inside a class always wrong?"**
**A:** Not always. DIP matters most at **module boundaries** (DB, external APIs, file I/O). Creating value objects (`new Point(x, y)`) inside a class is fine. The smell is `new ConcreteInfrastructure()` inside high-level business logic.

---

## 7. How They Work Together

```
┌─────────────────────────────────────────────────────────────┐
│  OrderService (high-level)                                  │
│  - Depends on Database interface          ← DIP             │
│  - Only handles order business logic      ← SRP             │
└──────────────────────┬──────────────────────────────────────┘
                       │ uses
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Database interface (abstraction)                           │
│  - save(), findById()                     ← ISP (focused)   │
└──────────────────────┬──────────────────────────────────────┘
                       │ implemented by
          ┌────────────┴────────────┐
          ▼                         ▼
   MySQLDatabase            PostgresDatabase
   (substitutable)          (substitutable)  ← LSP

   Add MongoDatabase without changing OrderService  ← OCP
```

**Typical flow in LLD interviews:**

1. Start with **SRP** — identify classes and their jobs
2. Use **ISP** — define small interfaces per role
3. Apply **DIP** — high-level services depend on those interfaces
4. Ensure **LSP** — all implementations honor the contract
5. Achieve **OCP** — new features = new classes, not edits to core logic

---

## 8. Common Interview Questions

### "Explain SOLID in 2 minutes"

SOLID is five guidelines for clean OOP design. **SRP**: one class, one job. **OCP**: extend behavior without modifying stable code. **LSP**: subclasses must work wherever the parent works. **ISP**: small interfaces, not fat ones. **DIP**: depend on abstractions, inject implementations. Together they reduce coupling, increase cohesion, and make code testable and extensible.

### "Give a real example where you applied SOLID"

Good answer structure:
1. **Problem** — e.g. "Payment logic had if/else for every payment type"
2. **Principle** — OCP + DIP
3. **Solution** — `PaymentProcessor` interface, one class per method, injected into `CheckoutService`
4. **Benefit** — added UPI without touching checkout logic; unit tested with mock processor

### "Which principle is most important?"

No single winner — they reinforce each other. In interviews, **SRP** and **DIP** come up most often in LLD. **LSP** is critical when using inheritance. **OCP** and **ISP** show up when discussing extensibility and interface design.

### "SOLID vs Design Patterns?"

| SOLID | Design Patterns |
|-------|-----------------|
| Principles (guidelines) | Reusable solutions (recipes) |
| Tell you *what* good design looks like | Show you *how* to implement it |
| OCP often leads to **Strategy**, **Factory** | Strategy implements OCP |
| DIP often leads to **Dependency Injection** | Adapter can fix LSP violations |

### Red flags in code reviews

| Smell | Likely violation |
|-------|------------------|
| God class with 20+ methods | SRP |
| Growing if/else or switch on type | OCP |
| `instanceof` checks everywhere | LSP / OCP |
| Empty method bodies or `throw new UnsupportedOperationException()` | ISP / LSP |
| `new ConcreteDB()` inside service classes | DIP |
| Subclass overrides parent to do nothing | LSP |

---

## 9. Revision Cheat Sheet

Read this 5 minutes before your interview:

```
S — One reason to change. Split UserService → Repository + Email + Report.
O — Add behavior via new classes (Strategy), not by editing old if/else chains.
L — Subclass must not break parent's contract. Square ≠ Rectangle. No surprise throws.
I — Small interfaces. Robot implements Workable, not eat()/sleep().
D — OrderService depends on Database interface, not MySQLDatabase. Inject deps.
```

**Patterns to mention:** Strategy (OCP), Factory (OCP), Dependency Injection (DIP), Adapter (LSP fix)

**One sentence each:**
- **SRP** → High cohesion, low coupling per class
- **OCP** → Plugin architecture, no modification of core
- **LSP** → Safe polymorphism
- **ISP** → Clients see only what they need
- **DIP** → Business logic independent of infrastructure

**If asked to design a system:** Name your classes (SRP), define interfaces (ISP/DIP), show how you'd add a feature without changing existing code (OCP), and avoid inheritance traps (LSP).

---

*Related notes: [OOPS.md](../../oops/OOPS.md) · [basics-and-roadmap.md](../basics-and-roadmap.md)*

# Object-Oriented Programming (OOP) — Complete Interview Guide

> Comprehensive notes covering every OOP concept with **Java** and **TypeScript** examples.
> Designed for FAANG & startup interview preparation.

---

## Table of Contents

1. [Classes and Objects](#1-classes-and-objects)
2. [Constructors](#2-constructors)
3. [Encapsulation](#3-encapsulation)
4. [Inheritance](#4-inheritance)
5. [Polymorphism](#5-polymorphism)
6. [Abstraction](#6-abstraction)
7. [Interfaces](#7-interfaces)
8. [Composition vs Inheritance](#8-composition-vs-inheritance)
9. [Association, Aggregation & Composition](#9-association-aggregation--composition)
10. [Method Overloading](#10-method-overloading)
11. [Method Overriding](#11-method-overriding)
12. [Static Members](#12-static-members)
13. [Final / Readonly / Const](#13-final--readonly--const)
14. [Access Modifiers](#14-access-modifiers)
15. [Getters and Setters](#15-getters-and-setters)
16. [Abstract Classes vs Interfaces](#16-abstract-classes-vs-interfaces)
17. [Generics](#17-generics)
18. [Enums](#18-enums)
19. [The `this` Keyword](#19-the-this-keyword)
20. [The `super` Keyword](#20-the-super-keyword)
21. [Object Cloning (Shallow vs Deep Copy)](#21-object-cloning-shallow-vs-deep-copy)
22. [Immutability](#22-immutability)
23. [SOLID Principles](#23-solid-principles)
24. [Design Patterns (Key Ones)](#24-design-patterns-key-ones)
25. [Diamond Problem & Multiple Inheritance](#25-diamond-problem--multiple-inheritance)
26. [Coupling and Cohesion](#26-coupling-and-cohesion)
27. [Dependency Injection](#27-dependency-injection)
28. [Common Interview Questions](#28-common-interview-questions)

---

## 1. Classes and Objects

A **class** is a blueprint/template that defines the structure (fields) and behavior (methods) of objects. An **object** is a concrete instance of a class, occupying memory at runtime.

**Key points:**
- A class defines *what* an object will look like; an object is the *actual thing*.
- Objects have **state** (fields/properties) and **behavior** (methods).
- Each object has its own copy of instance variables.

### Java

```java
class Car {
    String brand;
    int speed;

    void accelerate(int amount) {
        speed += amount;
    }

    void display() {
        System.out.println(brand + " going at " + speed + " km/h");
    }
}

public class Main {
    public static void main(String[] args) {
        Car car1 = new Car();     // object creation
        car1.brand = "Tesla";
        car1.speed = 0;
        car1.accelerate(100);
        car1.display();           // Tesla going at 100 km/h

        Car car2 = new Car();     // another independent object
        car2.brand = "BMW";
        car2.speed = 50;
        car2.display();           // BMW going at 50 km/h
    }
}
```

### TypeScript

```typescript
class Car {
    brand: string;
    speed: number;

    constructor(brand: string, speed: number = 0) {
        this.brand = brand;
        this.speed = speed;
    }

    accelerate(amount: number): void {
        this.speed += amount;
    }

    display(): void {
        console.log(`${this.brand} going at ${this.speed} km/h`);
    }
}

const car1 = new Car("Tesla");
car1.accelerate(100);
car1.display(); // Tesla going at 100 km/h

const car2 = new Car("BMW", 50);
car2.display(); // BMW going at 50 km/h
```

---

## 2. Constructors

A **constructor** is a special method that gets called when an object is created. It initializes the object's state.

**Key points:**
- In Java, the constructor name must match the class name. In TypeScript, it's always `constructor`.
- **Default constructor** — provided by the compiler if none is defined (Java only).
- **Parameterized constructor** — accepts arguments to initialize fields.
- **Constructor overloading** — multiple constructors with different parameter lists (Java). TypeScript uses optional/default params instead.
- **Constructor chaining** — one constructor calling another via `this(...)` (Java) or isn't directly supported in TS (use default params).
- Constructors **do not** have a return type.

### Java

```java
class Employee {
    String name;
    int age;
    String department;

    // Default constructor
    Employee() {
        this("Unknown", 0, "Unassigned"); // constructor chaining
    }

    // Parameterized constructor
    Employee(String name, int age, String department) {
        this.name = name;
        this.age = age;
        this.department = department;
    }

    // Overloaded constructor
    Employee(String name, int age) {
        this(name, age, "Engineering"); // chain to full constructor
    }

    void display() {
        System.out.println(name + " | Age: " + age + " | Dept: " + department);
    }
}

public class Main {
    public static void main(String[] args) {
        Employee e1 = new Employee();
        Employee e2 = new Employee("Alice", 30, "Design");
        Employee e3 = new Employee("Bob", 25);

        e1.display(); // Unknown | Age: 0 | Dept: Unassigned
        e2.display(); // Alice | Age: 30 | Dept: Design
        e3.display(); // Bob | Age: 25 | Dept: Engineering
    }
}
```

### TypeScript

```typescript
class Employee {
    name: string;
    age: number;
    department: string;

    constructor(
        name: string = "Unknown",
        age: number = 0,
        department: string = "Unassigned"
    ) {
        this.name = name;
        this.age = age;
        this.department = department;
    }

    display(): void {
        console.log(`${this.name} | Age: ${this.age} | Dept: ${this.department}`);
    }
}

const e1 = new Employee();
const e2 = new Employee("Alice", 30, "Design");
const e3 = new Employee("Bob", 25); // department defaults to "Unassigned"

e1.display(); // Unknown | Age: 0 | Dept: Unassigned
e2.display(); // Alice | Age: 30 | Dept: Design
e3.display(); // Bob | Age: 25 | Dept: Unassigned
```

> **TypeScript shorthand** — you can declare and initialize fields directly in the constructor signature:
>
> ```typescript
> class Employee {
>     constructor(
>         public name: string = "Unknown",
>         public age: number = 0,
>         public department: string = "Unassigned"
>     ) {}
> }
> ```

---

## 3. Encapsulation

**Encapsulation** = bundling data (fields) and the methods that operate on that data into a single unit (class), and **restricting direct access** to the internals.

**Key points:**
- Fields are made `private`; access is provided through `public` getters/setters.
- Protects object integrity — you control *how* data is read and modified.
- Enables **validation** inside setters.
- Hides implementation details from the outside world.

### Java

```java
class BankAccount {
    private String owner;
    private double balance;

    public BankAccount(String owner, double initialBalance) {
        this.owner = owner;
        setBalance(initialBalance);
    }

    public String getOwner() {
        return owner;
    }

    public double getBalance() {
        return balance;
    }

    private void setBalance(double amount) {
        if (amount < 0) {
            throw new IllegalArgumentException("Balance cannot be negative");
        }
        this.balance = amount;
    }

    public void deposit(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Deposit must be positive");
        this.balance += amount;
    }

    public void withdraw(double amount) {
        if (amount > balance) throw new IllegalArgumentException("Insufficient funds");
        if (amount <= 0) throw new IllegalArgumentException("Withdrawal must be positive");
        this.balance -= amount;
    }
}

public class Main {
    public static void main(String[] args) {
        BankAccount acc = new BankAccount("Alice", 1000);
        acc.deposit(500);
        acc.withdraw(200);
        System.out.println(acc.getBalance()); // 1300.0
        // acc.balance = -999; ← Compile error! Field is private.
    }
}
```

### TypeScript

```typescript
class BankAccount {
    private _owner: string;
    private _balance: number;

    constructor(owner: string, initialBalance: number) {
        this._owner = owner;
        if (initialBalance < 0) throw new Error("Balance cannot be negative");
        this._balance = initialBalance;
    }

    get owner(): string {
        return this._owner;
    }

    get balance(): number {
        return this._balance;
    }

    deposit(amount: number): void {
        if (amount <= 0) throw new Error("Deposit must be positive");
        this._balance += amount;
    }

    withdraw(amount: number): void {
        if (amount > this._balance) throw new Error("Insufficient funds");
        if (amount <= 0) throw new Error("Withdrawal must be positive");
        this._balance -= amount;
    }
}

const acc = new BankAccount("Alice", 1000);
acc.deposit(500);
acc.withdraw(200);
console.log(acc.balance); // 1300
// acc._balance = -999; ← TypeScript compiler error! Property is private.
```

> **Interview tip:** Encapsulation is NOT just "making fields private and adding getters/setters." The real value is **controlling the invariants** of your object — e.g., ensuring balance never goes negative.

---

## 4. Inheritance

**Inheritance** allows a class (child/subclass) to acquire the fields and methods of another class (parent/superclass), promoting **code reuse** and establishing an **"is-a"** relationship.

**Key points:**
- Java uses `extends` for class inheritance, TypeScript also uses `extends`.
- Java supports **single inheritance** only (one parent class). TypeScript is the same.
- The child class can **add new** fields/methods and **override** existing ones.
- `protected` members are accessible in subclasses but not outside.
- Use `super` to call the parent's constructor or methods.

### Java

```java
class Animal {
    protected String name;

    Animal(String name) {
        this.name = name;
    }

    void eat() {
        System.out.println(name + " is eating");
    }

    void makeSound() {
        System.out.println(name + " makes a generic sound");
    }
}

class Dog extends Animal {
    private String breed;

    Dog(String name, String breed) {
        super(name); // call parent constructor
        this.breed = breed;
    }

    @Override
    void makeSound() {
        System.out.println(name + " barks!");
    }

    void fetch() {
        System.out.println(name + " fetches the ball");
    }
}

class GuideDog extends Dog {
    GuideDog(String name, String breed) {
        super(name, breed);
    }

    void guide() {
        System.out.println(name + " is guiding the owner");
    }
}

public class Main {
    public static void main(String[] args) {
        Dog dog = new Dog("Rex", "Labrador");
        dog.eat();       // Rex is eating          (inherited)
        dog.makeSound(); // Rex barks!             (overridden)
        dog.fetch();     // Rex fetches the ball   (own method)

        GuideDog gd = new GuideDog("Buddy", "Golden Retriever");
        gd.eat();        // inherited from Animal
        gd.makeSound();  // inherited (overridden) from Dog
        gd.guide();      // own method
    }
}
```

### TypeScript

```typescript
class Animal {
    constructor(protected name: string) {}

    eat(): void {
        console.log(`${this.name} is eating`);
    }

    makeSound(): void {
        console.log(`${this.name} makes a generic sound`);
    }
}

class Dog extends Animal {
    constructor(name: string, private breed: string) {
        super(name);
    }

    override makeSound(): void {
        console.log(`${this.name} barks!`);
    }

    fetch(): void {
        console.log(`${this.name} fetches the ball`);
    }
}

class GuideDog extends Dog {
    constructor(name: string, breed: string) {
        super(name, breed);
    }

    guide(): void {
        console.log(`${this.name} is guiding the owner`);
    }
}

const dog = new Dog("Rex", "Labrador");
dog.eat();       // Rex is eating
dog.makeSound(); // Rex barks!
dog.fetch();     // Rex fetches the ball

const gd = new GuideDog("Buddy", "Golden Retriever");
gd.eat();        // inherited from Animal
gd.makeSound();  // inherited (overridden) from Dog
gd.guide();      // own method
```

---

## 5. Polymorphism

**Polymorphism** = "many forms." The same interface/method behaves differently depending on the actual object type.

Two types:
1. **Compile-time (Static) polymorphism** — Method **overloading** (same method name, different parameters). Resolved at compile time.
2. **Runtime (Dynamic) polymorphism** — Method **overriding** via inheritance. Resolved at runtime based on the actual object type.

### Java — Runtime Polymorphism

```java
class Shape {
    double area() {
        return 0;
    }

    String describe() {
        return "I am a shape";
    }
}

class Circle extends Shape {
    double radius;

    Circle(double radius) {
        this.radius = radius;
    }

    @Override
    double area() {
        return Math.PI * radius * radius;
    }

    @Override
    String describe() {
        return "I am a circle with radius " + radius;
    }
}

class Rectangle extends Shape {
    double width, height;

    Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }

    @Override
    double area() {
        return width * height;
    }

    @Override
    String describe() {
        return "I am a rectangle (" + width + " x " + height + ")";
    }
}

public class Main {
    // Polymorphic method — works with ANY Shape
    static void printShapeInfo(Shape shape) {
        System.out.println(shape.describe());
        System.out.println("Area: " + shape.area());
    }

    public static void main(String[] args) {
        Shape s1 = new Circle(5);        // parent reference, child object
        Shape s2 = new Rectangle(4, 6);

        printShapeInfo(s1); // I am a circle with radius 5.0 | Area: 78.54
        printShapeInfo(s2); // I am a rectangle (4.0 x 6.0)  | Area: 24.0
    }
}
```

### Java — Compile-time Polymorphism (Overloading)

```java
class Calculator {
    int add(int a, int b) {
        return a + b;
    }

    double add(double a, double b) {
        return a + b;
    }

    int add(int a, int b, int c) {
        return a + b + c;
    }
}
```

### TypeScript — Runtime Polymorphism

```typescript
class Shape {
    area(): number {
        return 0;
    }

    describe(): string {
        return "I am a shape";
    }
}

class Circle extends Shape {
    constructor(private radius: number) {
        super();
    }

    override area(): number {
        return Math.PI * this.radius ** 2;
    }

    override describe(): string {
        return `I am a circle with radius ${this.radius}`;
    }
}

class Rectangle extends Shape {
    constructor(private width: number, private height: number) {
        super();
    }

    override area(): number {
        return this.width * this.height;
    }

    override describe(): string {
        return `I am a rectangle (${this.width} x ${this.height})`;
    }
}

function printShapeInfo(shape: Shape): void {
    console.log(shape.describe());
    console.log(`Area: ${shape.area()}`);
}

const s1: Shape = new Circle(5);
const s2: Shape = new Rectangle(4, 6);

printShapeInfo(s1); // I am a circle with radius 5 | Area: 78.54
printShapeInfo(s2); // I am a rectangle (4 x 6)    | Area: 24
```

> **TypeScript note:** TypeScript doesn't have true method overloading at runtime. You can declare overload signatures, but there's only one implementation body:
>
> ```typescript
> class Calculator {
>     add(a: number, b: number): number;
>     add(a: string, b: string): string;
>     add(a: any, b: any): any {
>         return a + b;
>     }
> }
> ```

---

## 6. Abstraction

**Abstraction** = hiding complex implementation details and exposing only the essential interface. Users interact with *what* an object does, not *how* it does it.

**Key points:**
- Achieved via **abstract classes** and **interfaces**.
- Abstract classes can have both abstract (unimplemented) and concrete (implemented) methods.
- You **cannot instantiate** an abstract class directly.
- Forces subclasses to provide their own implementation of abstract methods.

### Java

```java
abstract class PaymentProcessor {
    protected String merchantId;

    PaymentProcessor(String merchantId) {
        this.merchantId = merchantId;
    }

    // Abstract — MUST be implemented by subclasses
    abstract boolean processPayment(double amount);
    abstract boolean refund(String transactionId);

    // Concrete — shared logic
    void logTransaction(String type, double amount) {
        System.out.println("[" + merchantId + "] " + type + ": $" + amount);
    }

    // Template method pattern — defines the skeleton
    boolean handlePayment(double amount) {
        logTransaction("PAYMENT", amount);
        boolean success = processPayment(amount);
        if (!success) {
            logTransaction("FAILED", amount);
        }
        return success;
    }
}

class StripeProcessor extends PaymentProcessor {
    StripeProcessor(String merchantId) {
        super(merchantId);
    }

    @Override
    boolean processPayment(double amount) {
        System.out.println("Processing via Stripe API...");
        return true;
    }

    @Override
    boolean refund(String transactionId) {
        System.out.println("Refunding via Stripe: " + transactionId);
        return true;
    }
}

class PayPalProcessor extends PaymentProcessor {
    PayPalProcessor(String merchantId) {
        super(merchantId);
    }

    @Override
    boolean processPayment(double amount) {
        System.out.println("Processing via PayPal API...");
        return true;
    }

    @Override
    boolean refund(String transactionId) {
        System.out.println("Refunding via PayPal: " + transactionId);
        return true;
    }
}

public class Main {
    public static void main(String[] args) {
        PaymentProcessor processor = new StripeProcessor("MERCH_001");
        processor.handlePayment(99.99);
        // [MERCH_001] PAYMENT: $99.99
        // Processing via Stripe API...
    }
}
```

### TypeScript

```typescript
abstract class PaymentProcessor {
    constructor(protected merchantId: string) {}

    abstract processPayment(amount: number): boolean;
    abstract refund(transactionId: string): boolean;

    logTransaction(type: string, amount: number): void {
        console.log(`[${this.merchantId}] ${type}: $${amount}`);
    }

    handlePayment(amount: number): boolean {
        this.logTransaction("PAYMENT", amount);
        const success = this.processPayment(amount);
        if (!success) {
            this.logTransaction("FAILED", amount);
        }
        return success;
    }
}

class StripeProcessor extends PaymentProcessor {
    processPayment(amount: number): boolean {
        console.log("Processing via Stripe API...");
        return true;
    }

    refund(transactionId: string): boolean {
        console.log(`Refunding via Stripe: ${transactionId}`);
        return true;
    }
}

class PayPalProcessor extends PaymentProcessor {
    processPayment(amount: number): boolean {
        console.log("Processing via PayPal API...");
        return true;
    }

    refund(transactionId: string): boolean {
        console.log(`Refunding via PayPal: ${transactionId}`);
        return true;
    }
}

const processor: PaymentProcessor = new StripeProcessor("MERCH_001");
processor.handlePayment(99.99);
```

---

## 7. Interfaces

An **interface** defines a **contract** — a set of methods (and optionally properties) that implementing classes must provide. It specifies *what* must exist, not *how*.

**Key points:**
- Java: `implements` keyword. A class can implement **multiple** interfaces.
- TypeScript: `implements` keyword. Also supports structural typing (duck typing).
- Interfaces have **no implementation** (Java 8+ allows `default` methods as an exception).
- Interfaces enable **loose coupling** — code depends on abstractions, not concrete classes.

### Java

```java
interface Flyable {
    void fly();
    double getMaxAltitude();
}

interface Swimmable {
    void swim();
    double getMaxDepth();
}

// A class implementing multiple interfaces
class Duck implements Flyable, Swimmable {
    private String name;

    Duck(String name) {
        this.name = name;
    }

    @Override
    public void fly() {
        System.out.println(name + " is flying");
    }

    @Override
    public double getMaxAltitude() {
        return 500;
    }

    @Override
    public void swim() {
        System.out.println(name + " is swimming");
    }

    @Override
    public double getMaxDepth() {
        return 2;
    }
}

class Airplane implements Flyable {
    @Override
    public void fly() {
        System.out.println("Airplane is flying");
    }

    @Override
    public double getMaxAltitude() {
        return 12000;
    }
}

public class Main {
    // Program to the interface, not the implementation
    static void makeFly(Flyable flyable) {
        flyable.fly();
        System.out.println("Max altitude: " + flyable.getMaxAltitude() + "m");
    }

    public static void main(String[] args) {
        makeFly(new Duck("Donald"));   // Donald is flying, Max altitude: 500m
        makeFly(new Airplane());       // Airplane is flying, Max altitude: 12000m
    }
}
```

### Java — Default Methods (Java 8+)

```java
interface Logger {
    void log(String message);

    default void logError(String message) {
        log("ERROR: " + message);
    }

    default void logInfo(String message) {
        log("INFO: " + message);
    }
}

class ConsoleLogger implements Logger {
    @Override
    public void log(String message) {
        System.out.println("[Console] " + message);
    }
}
```

### TypeScript

```typescript
interface Flyable {
    fly(): void;
    getMaxAltitude(): number;
}

interface Swimmable {
    swim(): void;
    getMaxDepth(): number;
}

class Duck implements Flyable, Swimmable {
    constructor(private name: string) {}

    fly(): void {
        console.log(`${this.name} is flying`);
    }

    getMaxAltitude(): number {
        return 500;
    }

    swim(): void {
        console.log(`${this.name} is swimming`);
    }

    getMaxDepth(): number {
        return 2;
    }
}

class Airplane implements Flyable {
    fly(): void {
        console.log("Airplane is flying");
    }

    getMaxAltitude(): number {
        return 12000;
    }
}

function makeFly(flyable: Flyable): void {
    flyable.fly();
    console.log(`Max altitude: ${flyable.getMaxAltitude()}m`);
}

makeFly(new Duck("Donald"));
makeFly(new Airplane());
```

> **TypeScript structural typing** — you don't even *need* `implements`. If an object has the right shape, it satisfies the interface:
>
> ```typescript
> const drone = {
>     fly() { console.log("Drone buzzing"); },
>     getMaxAltitude() { return 150; }
> };
> makeFly(drone); // Works! Duck typing in action.
> ```

---

## 8. Composition vs Inheritance

| Aspect | Inheritance | Composition |
|--------|------------|-------------|
| Relationship | "is-a" (Dog **is a** Animal) | "has-a" (Car **has an** Engine) |
| Coupling | Tight — child depends on parent | Loose — components are independent |
| Flexibility | Static — set at compile time | Dynamic — can swap at runtime |
| Reuse | Reuse by extending | Reuse by containing |
| Guideline | Use when there's a genuine type hierarchy | **Prefer this by default** |

> **"Favor composition over inheritance"** — one of the most important OOP principles.

### Java — Composition Example

```java
// Instead of: class Robot extends Walker, Shooter, Speaker (impossible in Java)
// Use composition:

interface Movable {
    void move();
}

interface Attackable {
    void attack();
}

class WalkingLegs implements Movable {
    public void move() {
        System.out.println("Walking on legs");
    }
}

class Wheels implements Movable {
    public void move() {
        System.out.println("Rolling on wheels");
    }
}

class LaserGun implements Attackable {
    public void attack() {
        System.out.println("Firing laser!");
    }
}

class MissileLauncher implements Attackable {
    public void attack() {
        System.out.println("Launching missile!");
    }
}

class Robot {
    private Movable movementSystem;
    private Attackable weaponSystem;

    Robot(Movable movementSystem, Attackable weaponSystem) {
        this.movementSystem = movementSystem;
        this.weaponSystem = weaponSystem;
    }

    void move() {
        movementSystem.move();
    }

    void attack() {
        weaponSystem.attack();
    }

    // Can swap components at runtime!
    void upgradeWeapon(Attackable newWeapon) {
        this.weaponSystem = newWeapon;
    }
}

public class Main {
    public static void main(String[] args) {
        Robot robot = new Robot(new WalkingLegs(), new LaserGun());
        robot.move();    // Walking on legs
        robot.attack();  // Firing laser!

        robot.upgradeWeapon(new MissileLauncher());
        robot.attack();  // Launching missile!
    }
}
```

### TypeScript — Composition Example

```typescript
interface Movable {
    move(): void;
}

interface Attackable {
    attack(): void;
}

class WalkingLegs implements Movable {
    move(): void {
        console.log("Walking on legs");
    }
}

class Wheels implements Movable {
    move(): void {
        console.log("Rolling on wheels");
    }
}

class LaserGun implements Attackable {
    attack(): void {
        console.log("Firing laser!");
    }
}

class MissileLauncher implements Attackable {
    attack(): void {
        console.log("Launching missile!");
    }
}

class Robot {
    constructor(
        private movementSystem: Movable,
        private weaponSystem: Attackable
    ) {}

    move(): void {
        this.movementSystem.move();
    }

    attack(): void {
        this.weaponSystem.attack();
    }

    upgradeWeapon(newWeapon: Attackable): void {
        this.weaponSystem = newWeapon;
    }
}

const robot = new Robot(new WalkingLegs(), new LaserGun());
robot.move();    // Walking on legs
robot.attack();  // Firing laser!

robot.upgradeWeapon(new MissileLauncher());
robot.attack();  // Launching missile!
```

---

## 9. Association, Aggregation & Composition

These describe the **relationships** between objects:

| Type | Relationship | Lifetime dependency | Example |
|------|-------------|-------------------|---------|
| **Association** | Uses / knows about | None | Teacher ↔ Student |
| **Aggregation** | Has-a (weak) | Child **can** exist independently | Department → Employee |
| **Composition** | Has-a (strong) | Child **cannot** exist without parent | House → Room |

### Java

```java
// ASSOCIATION — Teacher and Student know about each other, but exist independently
class Student {
    String name;
    Student(String name) { this.name = name; }
}

class Teacher {
    String name;
    Teacher(String name) { this.name = name; }

    void teach(Student student) {
        System.out.println(name + " teaches " + student.name);
    }
}

// AGGREGATION — Department has employees, but employees exist independently
class Employee {
    String name;
    Employee(String name) { this.name = name; }
}

class Department {
    String name;
    List<Employee> employees; // employees are passed in, not created here

    Department(String name, List<Employee> employees) {
        this.name = name;
        this.employees = employees;
    }
    // If Department is destroyed, employees still exist
}

// COMPOSITION — House owns its rooms; rooms don't exist without the house
class Room {
    String type;
    Room(String type) { this.type = type; }
}

class House {
    List<Room> rooms;

    House() {
        // Rooms are created BY the house — strong ownership
        rooms = new ArrayList<>();
        rooms.add(new Room("Living Room"));
        rooms.add(new Room("Bedroom"));
        rooms.add(new Room("Kitchen"));
    }
    // If House is destroyed, all rooms are destroyed too
}
```

### TypeScript

```typescript
// ASSOCIATION
class Student {
    constructor(public name: string) {}
}

class Teacher {
    constructor(public name: string) {}

    teach(student: Student): void {
        console.log(`${this.name} teaches ${student.name}`);
    }
}

// AGGREGATION — weak "has-a"
class Employee {
    constructor(public name: string) {}
}

class Department {
    constructor(public name: string, public employees: Employee[]) {}
}

const emp1 = new Employee("Alice");
const dept = new Department("Engineering", [emp1]);
// emp1 exists independently of dept

// COMPOSITION — strong "has-a"
class Room {
    constructor(public type: string) {}
}

class House {
    private rooms: Room[];

    constructor() {
        this.rooms = [
            new Room("Living Room"),
            new Room("Bedroom"),
            new Room("Kitchen"),
        ];
    }
}
```

---

## 10. Method Overloading

**Method overloading** = multiple methods with the **same name** but **different parameter lists** (number, type, or order of parameters).

**Key points:**
- This is **compile-time polymorphism** (resolved at compile time by the compiler).
- Java supports true overloading natively.
- TypeScript supports **overload signatures** but only **one implementation body**.
- Return type alone is NOT sufficient to distinguish overloaded methods in Java.

### Java

```java
class StringUtils {
    static String format(String text) {
        return text.trim();
    }

    static String format(String text, boolean uppercase) {
        String result = text.trim();
        return uppercase ? result.toUpperCase() : result.toLowerCase();
    }

    static String format(String text, int maxLength) {
        String result = text.trim();
        return result.length() > maxLength
            ? result.substring(0, maxLength) + "..."
            : result;
    }

    static String format(String text, int maxLength, boolean uppercase) {
        String result = format(text, maxLength);
        return uppercase ? result.toUpperCase() : result.toLowerCase();
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println(StringUtils.format("  Hello  "));           // "Hello"
        System.out.println(StringUtils.format("  Hello  ", true));     // "HELLO"
        System.out.println(StringUtils.format("  Hello World  ", 5));  // "Hello..."
    }
}
```

### TypeScript

```typescript
class StringUtils {
    static format(text: string): string;
    static format(text: string, uppercase: boolean): string;
    static format(text: string, maxLength: number): string;
    static format(text: string, arg?: boolean | number): string {
        let result = text.trim();

        if (typeof arg === "boolean") {
            return arg ? result.toUpperCase() : result.toLowerCase();
        }

        if (typeof arg === "number") {
            return result.length > arg
                ? result.substring(0, arg) + "..."
                : result;
        }

        return result;
    }
}

console.log(StringUtils.format("  Hello  "));           // "Hello"
console.log(StringUtils.format("  Hello  ", true));      // "HELLO"
console.log(StringUtils.format("  Hello World  ", 5));   // "Hello..."
```

---

## 11. Method Overriding

**Method overriding** = a subclass provides its **own implementation** of a method already defined in the parent class.

**Key points:**
- This is **runtime polymorphism** (resolved at runtime based on actual object type).
- The method signature must be **exactly the same** (name, parameters, return type).
- Java: use `@Override` annotation (catches typos at compile time).
- TypeScript: use the `override` keyword (TypeScript 4.3+).
- `final` methods in Java **cannot** be overridden.
- `super.methodName()` calls the parent's version.

### Java

```java
class HttpHandler {
    int maxRetries() {
        return 3;
    }

    String handleRequest(String url) {
        return "HTTP 200 OK from " + url;
    }

    void logRequest(String url) {
        System.out.println("Request to: " + url);
    }

    // final — cannot be overridden by subclasses
    final String getVersion() {
        return "1.0";
    }
}

class AuthenticatedHttpHandler extends HttpHandler {
    private String token;

    AuthenticatedHttpHandler(String token) {
        this.token = token;
    }

    @Override
    int maxRetries() {
        return 5; // more retries for authenticated requests
    }

    @Override
    String handleRequest(String url) {
        // Can call parent's version
        String baseResponse = super.handleRequest(url);
        return baseResponse + " [Authenticated with token: " + token.substring(0, 4) + "...]";
    }

    // @Override String getVersion() { ... } ← COMPILE ERROR: cannot override final
}
```

### TypeScript

```typescript
class HttpHandler {
    maxRetries(): number {
        return 3;
    }

    handleRequest(url: string): string {
        return `HTTP 200 OK from ${url}`;
    }

    logRequest(url: string): void {
        console.log(`Request to: ${url}`);
    }
}

class AuthenticatedHttpHandler extends HttpHandler {
    constructor(private token: string) {
        super();
    }

    override maxRetries(): number {
        return 5;
    }

    override handleRequest(url: string): string {
        const baseResponse = super.handleRequest(url);
        return `${baseResponse} [Authenticated with token: ${this.token.slice(0, 4)}...]`;
    }
}

const handler = new AuthenticatedHttpHandler("sk_live_abc123xyz");
console.log(handler.handleRequest("/api/data"));
// HTTP 200 OK from /api/data [Authenticated with token: sk_l...]
console.log(handler.maxRetries()); // 5
```

---

## 12. Static Members

**Static** members belong to the **class itself**, not to any particular instance. They are shared across all instances.

**Key points:**
- Accessed via the **class name**, not through instances.
- Static methods **cannot** access `this` (instance context) in Java.
- Common uses: utility/helper methods, counters, factory methods, constants.
- Static methods cannot be overridden (they can be hidden in Java).

### Java

```java
class MathUtils {
    // Static constant
    static final double PI = 3.14159265358979;

    // Static counter shared across all instances
    private static int instanceCount = 0;

    MathUtils() {
        instanceCount++;
    }

    static int getInstanceCount() {
        return instanceCount;
    }

    static double circleArea(double radius) {
        return PI * radius * radius;
    }

    static int clamp(int value, int min, int max) {
        return Math.max(min, Math.min(max, value));
    }

    // Factory method
    static MathUtils create() {
        return new MathUtils();
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println(MathUtils.circleArea(5));    // 78.539...
        System.out.println(MathUtils.clamp(15, 0, 10)); // 10
        System.out.println(MathUtils.PI);               // 3.14159...

        MathUtils.create();
        MathUtils.create();
        System.out.println(MathUtils.getInstanceCount()); // 2
    }
}
```

### TypeScript

```typescript
class MathUtils {
    static readonly PI = 3.14159265358979;
    private static instanceCount = 0;

    constructor() {
        MathUtils.instanceCount++;
    }

    static getInstanceCount(): number {
        return MathUtils.instanceCount;
    }

    static circleArea(radius: number): number {
        return MathUtils.PI * radius ** 2;
    }

    static clamp(value: number, min: number, max: number): number {
        return Math.max(min, Math.min(max, value));
    }

    static create(): MathUtils {
        return new MathUtils();
    }
}

console.log(MathUtils.circleArea(5));    // 78.539...
console.log(MathUtils.clamp(15, 0, 10)); // 10
console.log(MathUtils.PI);               // 3.14159...

MathUtils.create();
MathUtils.create();
console.log(MathUtils.getInstanceCount()); // 2
```

---

## 13. Final / Readonly / Const

Mechanisms to make things **immutable** or **non-overridable**.

| Concept | Java | TypeScript |
|---------|------|-----------|
| Constant variable | `final int X = 5;` | `readonly x = 5;` or `const x = 5;` |
| Prevent method override | `final void method()` | No direct equivalent (use composition) |
| Prevent class extension | `final class MyClass` | No direct equivalent |
| Constant in interface | Fields in interfaces are implicitly `public static final` | `readonly` in interface |

### Java

```java
// Final class — cannot be extended
final class ImmutablePoint {
    private final int x;  // final field — must be assigned once
    private final int y;

    ImmutablePoint(int x, int y) {
        this.x = x;
        this.y = y;
    }

    int getX() { return x; }
    int getY() { return y; }

    // Returns a new object instead of mutating
    ImmutablePoint translate(int dx, int dy) {
        return new ImmutablePoint(x + dx, y + dy);
    }
}

class Base {
    // final method — cannot be overridden
    final void criticalOperation() {
        System.out.println("This behavior is locked down");
    }
}

// class ExtendedPoint extends ImmutablePoint {} ← COMPILE ERROR
```

### TypeScript

```typescript
class ImmutablePoint {
    // readonly fields — assigned once in constructor
    constructor(
        readonly x: number,
        readonly y: number
    ) {}

    translate(dx: number, dy: number): ImmutablePoint {
        return new ImmutablePoint(this.x + dx, this.y + dy);
    }
}

const point = new ImmutablePoint(3, 4);
// point.x = 10; ← TypeScript compiler error!

const newPoint = point.translate(1, 2); // new object: (4, 6)

// For top-level constants
const MAX_RETRIES = 3;
const API_BASE_URL = "https://api.example.com" as const;
```

---

## 14. Access Modifiers

Control **visibility** and **accessibility** of class members.

| Modifier | Java | TypeScript | Class | Subclass | Package/Module | World |
|----------|------|-----------|-------|----------|---------------|-------|
| `public` | `public` | `public` (default) | Yes | Yes | Yes | Yes |
| `protected` | `protected` | `protected` | Yes | Yes | Yes (Java pkg) | No |
| package-private | *(no keyword)* | N/A | Yes | Yes* | Yes | No |
| `private` | `private` | `private` | Yes | No | No | No |

> *In Java, package-private is accessible in subclasses ONLY if they're in the same package.*

### Java

```java
public class AccessDemo {
    public String publicField = "anyone can see me";
    protected String protectedField = "subclasses and same package";
    String packageField = "same package only";       // package-private
    private String privateField = "only this class";

    public void publicMethod() {}
    protected void protectedMethod() {}
    void packageMethod() {}
    private void privateMethod() {}
}

class Child extends AccessDemo {
    void test() {
        System.out.println(publicField);     // OK
        System.out.println(protectedField);  // OK — we're a subclass
        System.out.println(packageField);    // OK — same package
        // System.out.println(privateField); // COMPILE ERROR
    }
}
```

### TypeScript

```typescript
class AccessDemo {
    public publicField = "anyone can see me";      // public is the default
    protected protectedField = "subclasses only";
    private privateField = "only this class";
    #hardPrivate = "truly private (ES2022)";       // runtime enforcement

    public publicMethod(): void {}
    protected protectedMethod(): void {}
    private privateMethod(): void {}
}

class Child extends AccessDemo {
    test(): void {
        console.log(this.publicField);     // OK
        console.log(this.protectedField);  // OK — we're a subclass
        // console.log(this.privateField); // TS compiler error
        // console.log(this.#hardPrivate); // TS and JS runtime error
    }
}
```

> **Interview tip:** TypeScript's `private` is only enforced at compile time. At runtime in JavaScript, the property is still accessible. Use `#privateField` (ES2022 private fields) for true runtime privacy.

---

## 15. Getters and Setters

Controlled access to object fields. Allow you to add **validation**, **computation**, or **side effects** when reading/writing properties.

### Java

```java
class Temperature {
    private double celsius;

    Temperature(double celsius) {
        setCelsius(celsius);
    }

    public double getCelsius() {
        return celsius;
    }

    public void setCelsius(double celsius) {
        if (celsius < -273.15) {
            throw new IllegalArgumentException("Below absolute zero!");
        }
        this.celsius = celsius;
    }

    // Computed/derived property — no backing field for fahrenheit
    public double getFahrenheit() {
        return celsius * 9.0 / 5.0 + 32;
    }

    public void setFahrenheit(double fahrenheit) {
        setCelsius((fahrenheit - 32) * 5.0 / 9.0);
    }
}
```

### TypeScript

```typescript
class Temperature {
    private _celsius: number;

    constructor(celsius: number) {
        this._celsius = celsius; // setter is called below
        this.celsius = celsius;
    }

    get celsius(): number {
        return this._celsius;
    }

    set celsius(value: number) {
        if (value < -273.15) {
            throw new Error("Below absolute zero!");
        }
        this._celsius = value;
    }

    // Computed property
    get fahrenheit(): number {
        return this._celsius * 9 / 5 + 32;
    }

    set fahrenheit(value: number) {
        this.celsius = (value - 32) * 5 / 9;
    }
}

const temp = new Temperature(100);
console.log(temp.fahrenheit); // 212  — accessed like a property, not a method call
temp.fahrenheit = 32;
console.log(temp.celsius);   // 0
```

---

## 16. Abstract Classes vs Interfaces

| Feature | Abstract Class | Interface |
|---------|---------------|-----------|
| Methods | Abstract + concrete | All abstract (Java 8+: default methods) |
| Fields | Instance fields allowed | Constants only (Java) / property signatures (TS) |
| Constructor | Yes | No |
| Multiple | Single inheritance only | Multiple interfaces |
| Access modifiers | Any | `public` (Java) / any (TS) |
| Use when | Shared state/behavior + some mandatory overrides | Defining a capability/contract |

### Java

```java
// Abstract class — when you have shared state and partial implementation
abstract class Vehicle {
    protected String licensePlate;
    protected int currentSpeed;

    Vehicle(String licensePlate) {
        this.licensePlate = licensePlate;
        this.currentSpeed = 0;
    }

    abstract int getMaxSpeed();

    void accelerate(int amount) {
        currentSpeed = Math.min(currentSpeed + amount, getMaxSpeed());
    }
}

// Interface — when you define a pure capability/contract
interface Electric {
    int getBatteryLevel();
    void charge(int minutes);
}

interface Autonomous {
    void enableAutoPilot();
    void disableAutoPilot();
}

// Combine: extend ONE abstract class + implement MULTIPLE interfaces
class TeslaCar extends Vehicle implements Electric, Autonomous {
    private int batteryLevel;

    TeslaCar(String licensePlate) {
        super(licensePlate);
        this.batteryLevel = 100;
    }

    @Override
    int getMaxSpeed() { return 250; }

    @Override
    public int getBatteryLevel() { return batteryLevel; }

    @Override
    public void charge(int minutes) {
        batteryLevel = Math.min(100, batteryLevel + minutes * 2);
    }

    @Override
    public void enableAutoPilot() {
        System.out.println("Autopilot engaged");
    }

    @Override
    public void disableAutoPilot() {
        System.out.println("Autopilot disengaged");
    }
}
```

### TypeScript

```typescript
abstract class Vehicle {
    protected currentSpeed = 0;

    constructor(protected licensePlate: string) {}

    abstract getMaxSpeed(): number;

    accelerate(amount: number): void {
        this.currentSpeed = Math.min(this.currentSpeed + amount, this.getMaxSpeed());
    }
}

interface Electric {
    getBatteryLevel(): number;
    charge(minutes: number): void;
}

interface Autonomous {
    enableAutoPilot(): void;
    disableAutoPilot(): void;
}

class TeslaCar extends Vehicle implements Electric, Autonomous {
    private batteryLevel = 100;

    constructor(licensePlate: string) {
        super(licensePlate);
    }

    getMaxSpeed(): number { return 250; }

    getBatteryLevel(): number { return this.batteryLevel; }

    charge(minutes: number): void {
        this.batteryLevel = Math.min(100, this.batteryLevel + minutes * 2);
    }

    enableAutoPilot(): void {
        console.log("Autopilot engaged");
    }

    disableAutoPilot(): void {
        console.log("Autopilot disengaged");
    }
}
```

---

## 17. Generics

**Generics** allow you to write classes, interfaces, and methods that work with **any type** while maintaining **type safety**. They are type parameters that get resolved at usage time.

**Key points:**
- Avoid using `any` / `Object` — generics give type safety without sacrificing flexibility.
- Common conventions: `T` (type), `K` (key), `V` (value), `E` (element).
- **Bounded generics** restrict the allowed types (`extends` in both Java and TS).
- Java uses **type erasure** (generic info removed at runtime). TypeScript generics are compile-time only.

### Java

```java
// Generic class
class Result<T> {
    private final boolean success;
    private final T data;
    private final String error;

    private Result(boolean success, T data, String error) {
        this.success = success;
        this.data = data;
        this.error = error;
    }

    static <T> Result<T> ok(T data) {
        return new Result<>(true, data, null);
    }

    static <T> Result<T> fail(String error) {
        return new Result<>(false, null, error);
    }

    boolean isSuccess() { return success; }
    T getData() { return data; }
    String getError() { return error; }
}

// Bounded generics
class NumberUtils {
    // T must be a subtype of Number
    static <T extends Number & Comparable<T>> T max(T a, T b) {
        return a.compareTo(b) >= 0 ? a : b;
    }
}

// Generic interface
interface Repository<T, ID> {
    T findById(ID id);
    List<T> findAll();
    void save(T entity);
    void delete(ID id);
}

class User {
    int id;
    String name;
    User(int id, String name) { this.id = id; this.name = name; }
}

class UserRepository implements Repository<User, Integer> {
    private Map<Integer, User> store = new HashMap<>();

    @Override
    public User findById(Integer id) { return store.get(id); }

    @Override
    public List<User> findAll() { return new ArrayList<>(store.values()); }

    @Override
    public void save(User user) { store.put(user.id, user); }

    @Override
    public void delete(Integer id) { store.remove(id); }
}

public class Main {
    public static void main(String[] args) {
        Result<String> success = Result.ok("Hello");
        Result<Integer> failure = Result.fail("Not found");

        System.out.println(success.getData());  // Hello
        System.out.println(failure.getError()); // Not found

        System.out.println(NumberUtils.max(3, 7));     // 7
        System.out.println(NumberUtils.max(3.14, 2.7)); // 3.14
    }
}
```

### TypeScript

```typescript
class Result<T> {
    private constructor(
        public readonly success: boolean,
        public readonly data: T | null,
        public readonly error: string | null
    ) {}

    static ok<T>(data: T): Result<T> {
        return new Result(true, data, null);
    }

    static fail<T>(error: string): Result<T> {
        return new Result(false, null, error);
    }

    isOk(): this is Result<T> & { data: T } {
        return this.success;
    }
}

// Bounded generics
function max<T extends number | string>(a: T, b: T): T {
    return a >= b ? a : b;
}

// Generic interface
interface Repository<T, ID> {
    findById(id: ID): T | undefined;
    findAll(): T[];
    save(entity: T): void;
    delete(id: ID): void;
}

interface User {
    id: number;
    name: string;
}

class UserRepository implements Repository<User, number> {
    private store = new Map<number, User>();

    findById(id: number): User | undefined {
        return this.store.get(id);
    }

    findAll(): User[] {
        return [...this.store.values()];
    }

    save(user: User): void {
        this.store.set(user.id, user);
    }

    delete(id: number): void {
        this.store.delete(id);
    }
}

const success = Result.ok("Hello");
const failure = Result.fail<number>("Not found");

console.log(success.data);  // Hello
console.log(failure.error); // Not found

// Utility generics (TypeScript built-ins worth knowing for interviews)
type PartialUser = Partial<User>;     // all fields optional
type ReadonlyUser = Readonly<User>;   // all fields readonly
type NameOnly = Pick<User, "name">;   // only 'name' field
type NoId = Omit<User, "id">;        // everything except 'id'
```

---

## 18. Enums

**Enums** define a set of **named constants** — a fixed set of values a variable can take.

### Java

```java
enum OrderStatus {
    PENDING("Order placed"),
    PROCESSING("Being processed"),
    SHIPPED("On the way"),
    DELIVERED("Delivered"),
    CANCELLED("Cancelled");

    private final String description;

    OrderStatus(String description) {
        this.description = description;
    }

    String getDescription() {
        return description;
    }

    boolean isTerminal() {
        return this == DELIVERED || this == CANCELLED;
    }
}

public class Main {
    public static void main(String[] args) {
        OrderStatus status = OrderStatus.SHIPPED;

        System.out.println(status);                // SHIPPED
        System.out.println(status.getDescription()); // On the way
        System.out.println(status.isTerminal());    // false

        // Enum in switch
        switch (status) {
            case PENDING -> System.out.println("Waiting...");
            case SHIPPED -> System.out.println("Check tracking!");
            case DELIVERED -> System.out.println("Enjoy!");
            default -> System.out.println("Other status");
        }

        // Iterate all values
        for (OrderStatus s : OrderStatus.values()) {
            System.out.println(s + ": " + s.getDescription());
        }
    }
}
```

### TypeScript

```typescript
// Numeric enum
enum Direction {
    Up,      // 0
    Down,    // 1
    Left,    // 2
    Right,   // 3
}

// String enum (preferred — more readable in logs/debugging)
enum OrderStatus {
    Pending = "PENDING",
    Processing = "PROCESSING",
    Shipped = "SHIPPED",
    Delivered = "DELIVERED",
    Cancelled = "CANCELLED",
}

const statusDescriptions: Record<OrderStatus, string> = {
    [OrderStatus.Pending]: "Order placed",
    [OrderStatus.Processing]: "Being processed",
    [OrderStatus.Shipped]: "On the way",
    [OrderStatus.Delivered]: "Delivered",
    [OrderStatus.Cancelled]: "Cancelled",
};

function isTerminal(status: OrderStatus): boolean {
    return status === OrderStatus.Delivered || status === OrderStatus.Cancelled;
}

const status = OrderStatus.Shipped;
console.log(status);                        // "SHIPPED"
console.log(statusDescriptions[status]);    // "On the way"
console.log(isTerminal(status));            // false

// Alternative: const enum (inlined at compile time, no runtime object)
const enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
}

// Alternative: Union types (often preferred over enums in modern TS)
type HttpStatus = 200 | 201 | 400 | 401 | 403 | 404 | 500;
type Color = "red" | "green" | "blue";
```

---

## 19. The `this` Keyword

`this` refers to the **current object instance**. It disambiguates between instance fields and local variables/parameters.

### Java

```java
class Builder {
    private String name;
    private int age;
    private String email;

    // 'this' disambiguates field from parameter
    Builder setName(String name) {
        this.name = name;
        return this; // return current instance for method chaining
    }

    Builder setAge(int age) {
        this.age = age;
        return this;
    }

    Builder setEmail(String email) {
        this.email = email;
        return this;
    }

    void display() {
        System.out.println(name + " | " + age + " | " + email);
    }
}

public class Main {
    public static void main(String[] args) {
        new Builder()
            .setName("Alice")
            .setAge(30)
            .setEmail("alice@example.com")
            .display(); // Alice | 30 | alice@example.com
    }
}
```

### TypeScript

```typescript
class Builder {
    private name = "";
    private age = 0;
    private email = "";

    setName(name: string): this {
        this.name = name;
        return this;
    }

    setAge(age: number): this {
        this.age = age;
        return this;
    }

    setEmail(email: string): this {
        this.email = email;
        return this;
    }

    display(): void {
        console.log(`${this.name} | ${this.age} | ${this.email}`);
    }
}

new Builder()
    .setName("Alice")
    .setAge(30)
    .setEmail("alice@example.com")
    .display();

// ⚠️ CRITICAL for interviews: `this` in TypeScript/JS can be lost!
class Timer {
    private seconds = 0;

    // PROBLEM: 'this' is lost when method is passed as callback
    start(): void {
        setInterval(this.tick, 1000); // ❌ 'this' will be undefined
    }

    // FIX 1: Arrow function (lexically binds 'this')
    tick = (): void => {
        this.seconds++;
        console.log(this.seconds);
    };

    // FIX 2: Bind in the call
    startFixed(): void {
        setInterval(this.tick.bind(this), 1000);
    }
}
```

---

## 20. The `super` Keyword

`super` refers to the **parent class**. Used to call the parent's constructor or methods.

### Java

```java
class Animal {
    protected String name;
    protected int energy;

    Animal(String name, int energy) {
        this.name = name;
        this.energy = energy;
    }

    String status() {
        return name + " (energy: " + energy + ")";
    }

    void eat(int amount) {
        energy += amount;
        System.out.println(name + " eats. Energy: " + energy);
    }
}

class Cat extends Animal {
    private int livesRemaining;

    Cat(String name) {
        super(name, 100); // MUST be first statement in constructor
        this.livesRemaining = 9;
    }

    @Override
    String status() {
        // Call parent's version and extend it
        return super.status() + " | Lives: " + livesRemaining;
    }

    @Override
    void eat(int amount) {
        super.eat(amount); // call parent logic first
        if (energy > 150) {
            System.out.println(name + " is full and takes a nap");
        }
    }
}
```

### TypeScript

```typescript
class Animal {
    constructor(protected name: string, protected energy: number) {}

    status(): string {
        return `${this.name} (energy: ${this.energy})`;
    }

    eat(amount: number): void {
        this.energy += amount;
        console.log(`${this.name} eats. Energy: ${this.energy}`);
    }
}

class Cat extends Animal {
    private livesRemaining = 9;

    constructor(name: string) {
        super(name, 100); // must be called before accessing 'this'
    }

    override status(): string {
        return `${super.status()} | Lives: ${this.livesRemaining}`;
    }

    override eat(amount: number): void {
        super.eat(amount);
        if (this.energy > 150) {
            console.log(`${this.name} is full and takes a nap`);
        }
    }
}

const cat = new Cat("Whiskers");
console.log(cat.status()); // Whiskers (energy: 100) | Lives: 9
cat.eat(60);               // Whiskers eats. Energy: 160 → Whiskers is full and takes a nap
```

---

## 21. Object Cloning (Shallow vs Deep Copy)

| Type | Description | Nested objects |
|------|-------------|---------------|
| **Shallow copy** | Copies field values. Reference types still point to the same object. | Shared |
| **Deep copy** | Recursively copies everything. Fully independent clone. | Independent |

### Java

```java
import java.util.ArrayList;
import java.util.List;

class Address {
    String city;
    String street;

    Address(String city, String street) {
        this.city = city;
        this.street = street;
    }

    Address deepCopy() {
        return new Address(city, street);
    }
}

class Person implements Cloneable {
    String name;
    Address address;
    List<String> hobbies;

    Person(String name, Address address, List<String> hobbies) {
        this.name = name;
        this.address = address;
        this.hobbies = hobbies;
    }

    // Shallow copy
    @Override
    protected Person clone() throws CloneNotSupportedException {
        return (Person) super.clone();
    }

    // Deep copy — manually copy all nested objects
    Person deepCopy() {
        return new Person(
            name,
            address.deepCopy(),
            new ArrayList<>(hobbies)
        );
    }
}

public class Main {
    public static void main(String[] args) throws CloneNotSupportedException {
        Person original = new Person("Alice",
            new Address("NYC", "5th Ave"),
            new ArrayList<>(List.of("Reading", "Chess"))
        );

        // Shallow clone — address is SHARED
        Person shallow = original.clone();
        shallow.address.city = "LA";
        System.out.println(original.address.city); // "LA" — original was affected!

        // Deep clone — fully independent
        Person deep = original.deepCopy();
        deep.address.city = "Chicago";
        System.out.println(original.address.city); // "LA" — original NOT affected
    }
}
```

### TypeScript

```typescript
interface Address {
    city: string;
    street: string;
}

interface Person {
    name: string;
    address: Address;
    hobbies: string[];
}

const original: Person = {
    name: "Alice",
    address: { city: "NYC", street: "5th Ave" },
    hobbies: ["Reading", "Chess"],
};

// Shallow copy — spread operator
const shallow = { ...original };
shallow.address.city = "LA";
console.log(original.address.city); // "LA" — original affected!

// Deep copy — structuredClone (modern, recommended)
const deep = structuredClone(original);
deep.address.city = "Chicago";
console.log(original.address.city); // "LA" — original NOT affected

// Deep copy — JSON method (works for simple objects, loses methods/dates/etc.)
const jsonDeep = JSON.parse(JSON.stringify(original));

// Deep copy — manual recursive (full control)
function deepCopyPerson(person: Person): Person {
    return {
        name: person.name,
        address: { ...person.address },
        hobbies: [...person.hobbies],
    };
}
```

---

## 22. Immutability

An **immutable** object cannot be modified after creation. Any "modification" returns a **new** object.

**Benefits:**
- Thread-safe by default (no synchronization needed).
- Predictable — no unexpected side effects.
- Safe to share and cache.
- Easier to reason about.

### Java

```java
import java.util.Collections;
import java.util.List;

// Immutable class checklist:
// 1. Class is final (prevent subclass from breaking immutability)
// 2. All fields are private final
// 3. No setters
// 4. Defensive copies for mutable fields (collections, dates, etc.)
// 5. Return copies from getters for mutable fields

final class ImmutableUser {
    private final String name;
    private final int age;
    private final List<String> roles;

    public ImmutableUser(String name, int age, List<String> roles) {
        this.name = name;
        this.age = age;
        this.roles = List.copyOf(roles); // defensive copy
    }

    public String getName() { return name; }
    public int getAge() { return age; }
    public List<String> getRoles() { return roles; } // already unmodifiable

    // "Modification" returns a new instance
    public ImmutableUser withName(String newName) {
        return new ImmutableUser(newName, age, roles);
    }

    public ImmutableUser withAge(int newAge) {
        return new ImmutableUser(name, newAge, roles);
    }

    public ImmutableUser addRole(String role) {
        var newRoles = new java.util.ArrayList<>(roles);
        newRoles.add(role);
        return new ImmutableUser(name, age, newRoles);
    }
}

// Java 16+ — Records are immutable by default
record Point(double x, double y) {
    Point translate(double dx, double dy) {
        return new Point(x + dx, y + dy);
    }
}
```

### TypeScript

```typescript
// Use Readonly utility type
interface UserData {
    readonly name: string;
    readonly age: number;
    readonly roles: readonly string[];
}

class ImmutableUser {
    constructor(
        readonly name: string,
        readonly age: number,
        readonly roles: readonly string[]
    ) {
        Object.freeze(this); // runtime enforcement
    }

    withName(newName: string): ImmutableUser {
        return new ImmutableUser(newName, this.age, this.roles);
    }

    withAge(newAge: number): ImmutableUser {
        return new ImmutableUser(this.name, newAge, this.roles);
    }

    addRole(role: string): ImmutableUser {
        return new ImmutableUser(this.name, this.age, [...this.roles, role]);
    }
}

const user = new ImmutableUser("Alice", 30, ["admin"]);
const updated = user.withName("Bob").addRole("editor");

console.log(user.name);          // Alice (unchanged)
console.log(updated.name);       // Bob
console.log(updated.roles);      // ["admin", "editor"]

// Utility: Deeply readonly type
type DeepReadonly<T> = {
    readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};
```

---

## 23. SOLID Principles

The five principles of object-oriented design that lead to **maintainable, flexible, and scalable** software.

### S — Single Responsibility Principle (SRP)

> A class should have **one, and only one, reason to change**.

```java
// ❌ BAD — UserService does too many things
class UserService {
    void createUser(String name) { /* DB logic */ }
    void sendWelcomeEmail(String email) { /* Email logic */ }
    String generateReport() { /* Report logic */ }
    void logAction(String action) { /* Logging logic */ }
}

// ✅ GOOD — Each class has a single responsibility
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
```

```typescript
// ✅ GOOD
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

### O — Open/Closed Principle (OCP)

> Software entities should be **open for extension** but **closed for modification**.

```java
// ❌ BAD — Adding a new discount type requires modifying this method
class DiscountCalculator {
    double calculate(String type, double price) {
        if (type.equals("SEASONAL")) return price * 0.1;
        if (type.equals("LOYALTY")) return price * 0.15;
        if (type.equals("BULK")) return price * 0.2;
        // Have to modify this every time we add a new discount type!
        return 0;
    }
}

// ✅ GOOD — Add new discount strategies without changing existing code
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

// New discounts can be added by creating new classes — no existing code modified
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
// ✅ GOOD
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

### L — Liskov Substitution Principle (LSP)

> Subclasses should be **substitutable** for their parent class without breaking the program's correctness.

```java
// ❌ BAD — Square violates LSP. Setting width changes height and vice versa,
// which is unexpected behavior when a Rectangle is expected.
class Rectangle {
    protected int width, height;

    void setWidth(int w) { width = w; }
    void setHeight(int h) { height = h; }
    int area() { return width * height; }
}

class Square extends Rectangle {
    @Override
    void setWidth(int w) { width = w; height = w; } // surprising side effect!
    @Override
    void setHeight(int h) { width = h; height = h; }
}

void testRectangle(Rectangle r) {
    r.setWidth(5);
    r.setHeight(4);
    assert r.area() == 20; // FAILS for Square! (area is 16)
}

// ✅ GOOD — Model them as separate types with a common interface
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
// ✅ GOOD
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

### I — Interface Segregation Principle (ISP)

> No client should be forced to depend on methods it doesn't use. Prefer **small, specific** interfaces over fat ones.

```java
// ❌ BAD — Forces every worker to implement eat() and sleep()
interface Worker {
    void work();
    void eat();
    void sleep();
}

class RobotWorker implements Worker {
    public void work() { /* OK */ }
    public void eat() { /* Robots don't eat! Forced to leave empty or throw */ }
    public void sleep() { /* Robots don't sleep! */ }
}

// ✅ GOOD — Segregated interfaces
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
// ✅ GOOD
interface Workable {
    work(): void;
}

interface Feedable {
    eat(): void;
}

interface Restable {
    sleep(): void;
}

class HumanWorker implements Workable, Feedable, Restable {
    work(): void { console.log("Working"); }
    eat(): void { console.log("Eating lunch"); }
    sleep(): void { console.log("Sleeping"); }
}

class RobotWorker implements Workable {
    work(): void { console.log("Working 24/7"); }
}
```

### D — Dependency Inversion Principle (DIP)

> High-level modules should not depend on low-level modules. Both should depend on **abstractions**.

```java
// ❌ BAD — High-level OrderService directly depends on low-level MySQLDatabase
class MySQLDatabase {
    void save(String data) { /* MySQL specific */ }
}

class OrderService {
    private MySQLDatabase db = new MySQLDatabase(); // tightly coupled!

    void createOrder(String order) {
        db.save(order);
    }
}

// ✅ GOOD — Both depend on an abstraction
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

    OrderService(Database db) { // depends on abstraction, injected from outside
        this.db = db;
    }

    void createOrder(String order) {
        db.save(order);
    }
}

// Can swap implementations easily
OrderService service1 = new OrderService(new MySQLDatabase());
OrderService service2 = new OrderService(new PostgresDatabase());
```

```typescript
// ✅ GOOD
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

---

## 24. Design Patterns (Key Ones)

### Singleton — Ensure only one instance exists

```java
class DatabaseConnection {
    private static volatile DatabaseConnection instance;
    private String connectionString;

    private DatabaseConnection(String connectionString) {
        this.connectionString = connectionString;
    }

    static DatabaseConnection getInstance() {
        if (instance == null) {
            synchronized (DatabaseConnection.class) {
                if (instance == null) { // double-checked locking
                    instance = new DatabaseConnection("jdbc:mysql://localhost:3306/mydb");
                }
            }
        }
        return instance;
    }

    void query(String sql) {
        System.out.println("Executing: " + sql);
    }
}
```

```typescript
class DatabaseConnection {
    private static instance: DatabaseConnection;

    private constructor(private connectionString: string) {}

    static getInstance(): DatabaseConnection {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection(
                "mongodb://localhost:27017/mydb"
            );
        }
        return DatabaseConnection.instance;
    }

    query(sql: string): void {
        console.log(`Executing: ${sql}`);
    }
}

const db1 = DatabaseConnection.getInstance();
const db2 = DatabaseConnection.getInstance();
console.log(db1 === db2); // true — same instance
```

### Factory — Create objects without exposing instantiation logic

```java
interface Notification {
    void send(String message);
}

class EmailNotification implements Notification {
    public void send(String message) {
        System.out.println("Email: " + message);
    }
}

class SMSNotification implements Notification {
    public void send(String message) {
        System.out.println("SMS: " + message);
    }
}

class PushNotification implements Notification {
    public void send(String message) {
        System.out.println("Push: " + message);
    }
}

class NotificationFactory {
    static Notification create(String channel) {
        return switch (channel.toUpperCase()) {
            case "EMAIL" -> new EmailNotification();
            case "SMS" -> new SMSNotification();
            case "PUSH" -> new PushNotification();
            default -> throw new IllegalArgumentException("Unknown channel: " + channel);
        };
    }
}

// Usage
Notification n = NotificationFactory.create("EMAIL");
n.send("Hello!"); // Email: Hello!
```

```typescript
interface Notification {
    send(message: string): void;
}

class EmailNotification implements Notification {
    send(message: string): void { console.log(`Email: ${message}`); }
}

class SMSNotification implements Notification {
    send(message: string): void { console.log(`SMS: ${message}`); }
}

class PushNotification implements Notification {
    send(message: string): void { console.log(`Push: ${message}`); }
}

class NotificationFactory {
    private static registry = new Map<string, new () => Notification>([
        ["email", EmailNotification],
        ["sms", SMSNotification],
        ["push", PushNotification],
    ]);

    static create(channel: string): Notification {
        const NotifClass = this.registry.get(channel.toLowerCase());
        if (!NotifClass) throw new Error(`Unknown channel: ${channel}`);
        return new NotifClass();
    }
}

const n = NotificationFactory.create("email");
n.send("Hello!"); // Email: Hello!
```

### Observer — Notify multiple objects when state changes

```java
import java.util.*;

interface EventListener {
    void update(String event, Object data);
}

class EventEmitter {
    private final Map<String, List<EventListener>> listeners = new HashMap<>();

    void on(String event, EventListener listener) {
        listeners.computeIfAbsent(event, k -> new ArrayList<>()).add(listener);
    }

    void off(String event, EventListener listener) {
        List<EventListener> list = listeners.get(event);
        if (list != null) list.remove(listener);
    }

    void emit(String event, Object data) {
        List<EventListener> list = listeners.get(event);
        if (list != null) {
            for (EventListener listener : list) {
                listener.update(event, data);
            }
        }
    }
}

class UserRegistrationService {
    private final EventEmitter emitter;

    UserRegistrationService(EventEmitter emitter) {
        this.emitter = emitter;
    }

    void register(String username) {
        System.out.println("User registered: " + username);
        emitter.emit("user:registered", username);
    }
}

// Usage
EventEmitter emitter = new EventEmitter();
emitter.on("user:registered", (event, data) ->
    System.out.println("Send welcome email to: " + data));
emitter.on("user:registered", (event, data) ->
    System.out.println("Log: new user " + data));

new UserRegistrationService(emitter).register("Alice");
// User registered: Alice
// Send welcome email to: Alice
// Log: new user Alice
```

```typescript
type Listener<T> = (data: T) => void;

class EventEmitter<Events extends Record<string, any>> {
    private listeners = new Map<string, Set<Listener<any>>>();

    on<K extends keyof Events & string>(event: K, listener: Listener<Events[K]>): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)!.add(listener);
    }

    off<K extends keyof Events & string>(event: K, listener: Listener<Events[K]>): void {
        this.listeners.get(event)?.delete(listener);
    }

    emit<K extends keyof Events & string>(event: K, data: Events[K]): void {
        this.listeners.get(event)?.forEach((listener) => listener(data));
    }
}

interface AppEvents {
    "user:registered": string;
    "order:placed": { orderId: number; total: number };
}

const emitter = new EventEmitter<AppEvents>();

emitter.on("user:registered", (username) => {
    console.log(`Send welcome email to: ${username}`);
});

emitter.on("user:registered", (username) => {
    console.log(`Log: new user ${username}`);
});

emitter.emit("user:registered", "Alice");
```

### Strategy — Swap algorithms at runtime

```java
interface SortStrategy<T extends Comparable<T>> {
    void sort(List<T> list);
}

class BubbleSort<T extends Comparable<T>> implements SortStrategy<T> {
    public void sort(List<T> list) {
        System.out.println("Bubble sorting...");
        // bubble sort implementation
    }
}

class QuickSort<T extends Comparable<T>> implements SortStrategy<T> {
    public void sort(List<T> list) {
        System.out.println("Quick sorting...");
        // quick sort implementation
    }
}

class Sorter<T extends Comparable<T>> {
    private SortStrategy<T> strategy;

    Sorter(SortStrategy<T> strategy) {
        this.strategy = strategy;
    }

    void setStrategy(SortStrategy<T> strategy) {
        this.strategy = strategy;
    }

    void sort(List<T> list) {
        strategy.sort(list);
    }
}
```

```typescript
interface SortStrategy<T> {
    sort(arr: T[], compareFn: (a: T, b: T) => number): T[];
}

class BubbleSort<T> implements SortStrategy<T> {
    sort(arr: T[], compareFn: (a: T, b: T) => number): T[] {
        console.log("Bubble sorting...");
        const result = [...arr];
        for (let i = 0; i < result.length; i++) {
            for (let j = 0; j < result.length - i - 1; j++) {
                if (compareFn(result[j], result[j + 1]) > 0) {
                    [result[j], result[j + 1]] = [result[j + 1], result[j]];
                }
            }
        }
        return result;
    }
}

class Sorter<T> {
    constructor(private strategy: SortStrategy<T>) {}

    setStrategy(strategy: SortStrategy<T>): void {
        this.strategy = strategy;
    }

    sort(arr: T[], compareFn: (a: T, b: T) => number): T[] {
        return this.strategy.sort(arr, compareFn);
    }
}
```

---

## 25. Diamond Problem & Multiple Inheritance

The **diamond problem** occurs when a class inherits from two classes that both inherit from a common base class, creating ambiguity about which version of a method to use.

```
       A
      / \
     B   C
      \ /
       D     ← Which A's method does D get?
```

**Java's solution:** No multiple class inheritance. Use **interfaces** (with `default` methods and explicit conflict resolution).

**TypeScript's solution:** No multiple class inheritance. Use **interfaces** + **mixins**.

### Java

```java
interface Loggable {
    default void log(String msg) {
        System.out.println("[LOG] " + msg);
    }
}

interface Auditable {
    default void log(String msg) {
        System.out.println("[AUDIT] " + msg);
    }
}

// Must resolve the conflict explicitly
class TransactionService implements Loggable, Auditable {
    @Override
    public void log(String msg) {
        Loggable.super.log(msg);  // explicitly choose which one
        Auditable.super.log(msg); // or call both
    }
}
```

### TypeScript — Mixins

```typescript
type Constructor<T = {}> = new (...args: any[]) => T;

// Mixin functions
function Timestamped<TBase extends Constructor>(Base: TBase) {
    return class extends Base {
        createdAt = new Date();
        updatedAt = new Date();

        touch() {
            this.updatedAt = new Date();
        }
    };
}

function SoftDeletable<TBase extends Constructor>(Base: TBase) {
    return class extends Base {
        deletedAt: Date | null = null;
        isDeleted = false;

        softDelete() {
            this.deletedAt = new Date();
            this.isDeleted = true;
        }

        restore() {
            this.deletedAt = null;
            this.isDeleted = false;
        }
    };
}

class BaseEntity {
    constructor(public id: number) {}
}

// Compose multiple behaviors via mixins
class User extends SoftDeletable(Timestamped(BaseEntity)) {
    constructor(id: number, public name: string) {
        super(id);
    }
}

const user = new User(1, "Alice");
console.log(user.createdAt); // Date
user.touch();                // from Timestamped
user.softDelete();           // from SoftDeletable
console.log(user.isDeleted); // true
```

---

## 26. Coupling and Cohesion

| Concept | Good | Bad |
|---------|------|-----|
| **Coupling** | Loose (low) — classes are independent | Tight (high) — classes depend heavily on each other |
| **Cohesion** | High — class does one thing well | Low — class is a grab-bag of unrelated functionality |

> **Goal: LOW coupling + HIGH cohesion**

### Example: Tight Coupling (Bad)

```java
// ❌ OrderProcessor directly instantiates and depends on concrete implementations
class OrderProcessor {
    private MySQLDatabase db = new MySQLDatabase();
    private StripePayment payment = new StripePayment();
    private SendGridEmail email = new SendGridEmail();

    void process(Order order) {
        db.save(order);
        payment.charge(order.getTotal());
        email.send(order.getCustomerEmail(), "Order confirmed");
    }
}
// Changing the database, payment provider, or email service requires modifying OrderProcessor.
```

### Example: Loose Coupling (Good)

```java
// ✅ Depends on abstractions, injected from outside
class OrderProcessor {
    private final OrderRepository repository;
    private final PaymentGateway payment;
    private final NotificationService notifications;

    OrderProcessor(OrderRepository repo, PaymentGateway payment, NotificationService notif) {
        this.repository = repo;
        this.payment = payment;
        this.notifications = notif;
    }

    void process(Order order) {
        repository.save(order);
        payment.charge(order.getTotal());
        notifications.notify(order.getCustomerEmail(), "Order confirmed");
    }
}
```

```typescript
// ✅ Loosely coupled — depends on interfaces
interface OrderRepository {
    save(order: Order): void;
}

interface PaymentGateway {
    charge(amount: number): boolean;
}

interface NotificationService {
    notify(recipient: string, message: string): void;
}

class OrderProcessor {
    constructor(
        private repository: OrderRepository,
        private payment: PaymentGateway,
        private notifications: NotificationService
    ) {}

    process(order: Order): void {
        this.repository.save(order);
        this.payment.charge(order.total);
        this.notifications.notify(order.customerEmail, "Order confirmed");
    }
}
```

---

## 27. Dependency Injection

**DI** = instead of a class creating its own dependencies, they are **provided (injected) from outside**. This is a concrete application of the **Dependency Inversion Principle**.

Three types:
1. **Constructor injection** (preferred — dependencies are clear, object is always valid)
2. **Setter injection** (optional dependencies)
3. **Interface injection** (less common)

### Java

```java
// Constructor injection
interface Logger {
    void log(String message);
}

interface Cache {
    String get(String key);
    void set(String key, String value);
}

class ConsoleLogger implements Logger {
    public void log(String message) {
        System.out.println("[LOG] " + message);
    }
}

class InMemoryCache implements Cache {
    private final Map<String, String> store = new HashMap<>();
    public String get(String key) { return store.get(key); }
    public void set(String key, String value) { store.put(key, value); }
}

class ProductService {
    private final Logger logger;
    private final Cache cache;

    // Dependencies are injected via constructor
    ProductService(Logger logger, Cache cache) {
        this.logger = logger;
        this.cache = cache;
    }

    String getProduct(String id) {
        String cached = cache.get(id);
        if (cached != null) {
            logger.log("Cache hit for: " + id);
            return cached;
        }
        logger.log("Cache miss for: " + id);
        String product = "Product-" + id; // simulate DB fetch
        cache.set(id, product);
        return product;
    }
}

// Composition root — wire everything together
public class Main {
    public static void main(String[] args) {
        Logger logger = new ConsoleLogger();
        Cache cache = new InMemoryCache();
        ProductService service = new ProductService(logger, cache);

        service.getProduct("42"); // Cache miss
        service.getProduct("42"); // Cache hit
    }
}
```

### TypeScript

```typescript
interface Logger {
    log(message: string): void;
}

interface Cache {
    get(key: string): string | undefined;
    set(key: string, value: string): void;
}

class ConsoleLogger implements Logger {
    log(message: string): void {
        console.log(`[LOG] ${message}`);
    }
}

class InMemoryCache implements Cache {
    private store = new Map<string, string>();
    get(key: string): string | undefined { return this.store.get(key); }
    set(key: string, value: string): void { this.store.set(key, value); }
}

class ProductService {
    constructor(
        private logger: Logger,
        private cache: Cache
    ) {}

    getProduct(id: string): string {
        const cached = this.cache.get(id);
        if (cached) {
            this.logger.log(`Cache hit for: ${id}`);
            return cached;
        }
        this.logger.log(`Cache miss for: ${id}`);
        const product = `Product-${id}`;
        this.cache.set(id, product);
        return product;
    }
}

// Wire up
const logger = new ConsoleLogger();
const cache = new InMemoryCache();
const service = new ProductService(logger, cache);

service.getProduct("42"); // Cache miss
service.getProduct("42"); // Cache hit
```

---

## 28. Common Interview Questions

### Q1: What is the difference between an abstract class and an interface?

| Abstract Class | Interface |
|---------------|-----------|
| Can have state (fields) | No state (Java constants only) |
| Can have constructors | No constructors |
| Partial implementation | Pure contract (Java 8+ default methods are an exception) |
| Single inheritance | Multiple interfaces |
| **Use for "is-a" with shared code** | **Use for "can-do" capabilities** |

### Q2: When would you use inheritance vs composition?

**Inheritance** when there is a clear, stable "is-a" relationship (e.g., `GuideDog` is-a `Dog`). **Composition** when you want to combine behaviors flexibly (e.g., a Robot *has* a MovementSystem). **Default to composition** — it's more flexible, avoids tight coupling, and makes testing easier.

### Q3: Explain polymorphism with a real-world example.

A `PaymentGateway` interface defines `charge(amount)`. `StripeGateway`, `PayPalGateway`, and `SquareGateway` all implement it differently. The checkout service calls `gateway.charge(total)` without knowing which provider is used — the correct implementation is called at runtime based on the actual object type.

### Q4: What are the four pillars of OOP?

1. **Encapsulation** — bundle data + methods, restrict direct access
2. **Inheritance** — child classes acquire parent behavior
3. **Polymorphism** — same interface, different behavior at runtime
4. **Abstraction** — hide complexity, expose only what's necessary

### Q5: What is the Liskov Substitution Principle?

If class `B` extends class `A`, then you should be able to replace `A` with `B` anywhere without breaking the program. The subclass must honor the contract of the parent — same preconditions, same postconditions, no surprises.

### Q6: How does TypeScript's type system differ from Java's?

| Java | TypeScript |
|------|-----------|
| **Nominal typing** — types are identified by name | **Structural typing** — types are identified by shape |
| `implements` required to satisfy interface | Any object with matching structure works |
| True runtime type checking (`instanceof`) | Types erased at compile time (JS has no types) |
| Checked exceptions | No checked exceptions |
| Method overloading (real) | Overload signatures (single body) |

### Q7: What is the difference between shallow and deep copy?

**Shallow copy** copies only top-level fields. If a field references an object, both copies share the same nested object (changing one affects the other). **Deep copy** recursively clones all nested objects, producing a fully independent copy.

### Q8: Why is immutability important?

Immutable objects are **thread-safe** (no races), **predictable** (no surprise mutations), **cacheable** (safe to share), and easier to debug. Functional programming heavily favors immutability. In Java, `String`, `Integer`, and records are immutable. In TypeScript, use `readonly`, `Readonly<T>`, and `Object.freeze()`.

### Q9: Explain the Strategy Pattern.

The Strategy pattern defines a family of algorithms, encapsulates each one as an object, and makes them interchangeable. The context object delegates to the strategy object. Example: a `Sorter` that can switch between `BubbleSort`, `QuickSort`, and `MergeSort` at runtime.

### Q10: What is Dependency Injection and why use it?

DI means passing dependencies into a class from outside (typically via constructor), rather than having the class create them internally. Benefits: **testability** (inject mocks), **flexibility** (swap implementations), **loose coupling** (depends on abstractions), and adherence to the **Dependency Inversion Principle**.

---

## Quick Reference Cheat Sheet

```
┌─────────────────────────────────────────────────────────────────┐
│                    OOP CONCEPT MAP                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CLASS ──creates──> OBJECT (instance)                           │
│    │                                                            │
│    ├── ENCAPSULATION (private fields + public methods)          │
│    ├── CONSTRUCTOR (initializes state)                          │
│    ├── STATIC MEMBERS (belong to class, not instances)          │
│    └── ACCESS MODIFIERS (public/protected/private)              │
│                                                                 │
│  INHERITANCE (is-a)         COMPOSITION (has-a)                 │
│    │                           │                                │
│    ├── extends                 ├── Favor this by default        │
│    ├── super / override        ├── Flexible, loosely coupled    │
│    └── Single class only       └── Swap at runtime              │
│                                                                 │
│  POLYMORPHISM                                                   │
│    ├── Compile-time: Method overloading (same name, diff params)│
│    └── Runtime: Method overriding (parent ref, child behavior)  │
│                                                                 │
│  ABSTRACTION                                                    │
│    ├── Abstract class (partial impl + abstract methods)         │
│    └── Interface (pure contract / capability)                   │
│                                                                 │
│  SOLID                                                          │
│    S — Single Responsibility (one reason to change)             │
│    O — Open/Closed (extend, don't modify)                       │
│    L — Liskov Substitution (subtypes are substitutable)         │
│    I — Interface Segregation (small, focused interfaces)        │
│    D — Dependency Inversion (depend on abstractions)            │
│                                                                 │
│  KEY PATTERNS                                                   │
│    ├── Singleton (one instance)                                 │
│    ├── Factory (create without exposing how)                    │
│    ├── Observer (event-driven notifications)                    │
│    └── Strategy (swappable algorithms)                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

*Last updated: March 2026*

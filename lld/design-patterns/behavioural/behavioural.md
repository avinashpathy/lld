# Behavioral Design Patterns — Interview Revision Guide

> Behavioral patterns deal with **how objects communicate and distribute responsibility**.
> They focus on algorithms, notifications, and state-driven behavior — not object structure.
>
> Runnable examples: [`strategy.ts`](strategy.ts) · [`observer.ts`](observer.ts) · [`state.ts`](state.ts)

---

## Table of Contents

1. [What Are Behavioral Patterns?](#1-what-are-behavioral-patterns)
2. [Quick Reference](#2-quick-reference)
3. [Strategy Pattern](#3-strategy-pattern)
4. [Observer Pattern](#4-observer-pattern)
5. [State Pattern](#5-state-pattern)
6. [Strategy vs State vs Observer](#6-strategy-vs-state-vs-observer)
7. [Common Interview Questions](#7-common-interview-questions)
8. [Revision Cheat Sheet](#8-revision-cheat-sheet)

---

## 1. What Are Behavioral Patterns?

Behavioral patterns answer: **"How do objects talk to each other and who does what?"**

| Category | Focus | Examples |
|----------|-------|----------|
| **Creational** | How objects are created | Factory, Builder, Singleton |
| **Structural** | How objects are composed | Facade, Decorator, Adapter |
| **Behavioral** | How objects communicate | Strategy, Observer, State, Command |

**When interviewers ask behavioral patterns**, they usually want you to:
- Explain the **problem** (if/else chains, tight coupling, missed updates)
- Describe **who holds the behavior** (context, subject, state object)
- Give a **real-world analogy**
- Compare similar patterns (**Strategy vs State** is very common)

---

## 2. Quick Reference

| Pattern | One-liner | Real-world analogy |
|---------|-----------|-------------------|
| **Strategy** | Swap algorithms at runtime | Payment at checkout — credit card, PayPal, UPI |
| **Observer** | One-to-many notification on change | YouTube subscribers notified when a new video drops |
| **State** | Object behavior changes with internal state | Vending machine — different actions allowed in "no coin" vs "has coin" vs "dispensing" |

| | Strategy | Observer | State |
|---|----------|----------|-------|
| **Problem solved** | Many interchangeable algorithms | Notify dependents when data changes | Behavior depends on current mode/state |
| **Key move** | Inject/swap strategy object | Subject notifies list of observers | Delegate to current state object |
| **Who changes?** | Client picks strategy | Subject pushes updates | Object transitions between states |
| **OCP link** | Add new strategy class | Add new observer class | Add new state class |

---

## 3. Strategy Pattern

### Definition

> Define a family of algorithms, encapsulate each one, and make them **interchangeable**.
> Strategy lets the algorithm vary **independently** from the clients that use it.

The context (`ShoppingCart`) doesn't know *how* payment works — it delegates to a `PaymentStrategy`.

### Problem

Payment logic buried in if/else:

```typescript
// ❌ BAD — grows forever, violates OCP
checkout(amount: number, method: string) {
    if (method === "credit") { /* card logic */ }
    else if (method === "paypal") { /* paypal logic */ }
    else if (method === "upi") { /* upi logic */ }
}
```

Every new payment method = edit `checkout()`. Hard to test each method in isolation.

### Solution

Extract each algorithm into its own class implementing a common interface. Context holds a reference and delegates.

```
┌─────────────────┐         uses          ┌──────────────────────┐
│  ShoppingCart   │ ────────────────────→ │  PaymentStrategy     │ (interface)
│   (Context)     │                       └──────────┬───────────┘
└─────────────────┘                                  │
                                          ┌──────────┼──────────┐
                                          ▼          ▼          ▼
                                   CreditCard    PayPal      UPIPayment
```

### TypeScript Example (Payment)

Run: `npx tsx lld/design-patterns/behavioural/strategy.ts`

```typescript
interface PaymentStrategy {
    pay(amount: number): boolean;
}

class CreditCardPayment implements PaymentStrategy {
    constructor(private cardNumber: string) {}

    pay(amount: number): boolean {
        console.log(`Paid ${amount} with credit card`);
        return true;
    }
}

class PayPalPayment implements PaymentStrategy {
    constructor(private email: string) {}

    pay(amount: number): boolean {
        console.log(`Paid ${amount} with PayPal`);
        return true;
    }
}

class ShoppingCart {
    private paymentStrategy?: PaymentStrategy;

    setPaymentStrategy(strategy: PaymentStrategy): void {
        this.paymentStrategy = strategy;
    }

    checkout(amount: number): void {
        this.paymentStrategy!.pay(amount);
    }
}

// Swap strategy at runtime
const cart = new ShoppingCart();

cart.setPaymentStrategy(new CreditCardPayment("1234-5678"));
cart.checkout(100.00);  // Paid 100 with credit card

cart.setPaymentStrategy(new PayPalPayment("user@example.com"));
cart.checkout(50.00);   // Paid 50 with PayPal
```

### Structure (3 roles)

| Role | In payment example |
|------|-------------------|
| **Strategy** (interface) | `PaymentStrategy` |
| **Concrete Strategies** | `CreditCardPayment`, `PayPalPayment` |
| **Context** | `ShoppingCart` — holds strategy, delegates `checkout()` |

### Real-world examples

| Domain | Context | Strategies |
|--------|---------|------------|
| E-commerce | `ShoppingCart` | Credit card, PayPal, UPI |
| Navigation app | `RoutePlanner` | Fastest, Shortest, Scenic |
| Compression | `FileCompressor` | Zip, Rar, Gzip |
| Sorting | `Sorter` | QuickSort, MergeSort, BubbleSort |
| Discount engine | `DiscountCalculator` | Seasonal, Loyalty, Bulk |

### Key properties

- **Open/Closed** — add `UPIPayment` without touching `ShoppingCart`
- **Runtime switching** — client chooses strategy via setter or constructor injection
- **Eliminates conditionals** — no `if/else` on payment type in context
- Works well with **Dependency Injection**

### When to use

- Multiple ways to perform a task (algorithms vary)
- Want to switch behavior at **runtime**
- Need to isolate algorithm code for testing

### When NOT to use

- Only one algorithm, never changes
- Strategies need heavy shared state with context (consider simpler approach)

### Interview tip

**Q: "Strategy vs if/else?"**
**A:** if/else couples the context to every algorithm. Strategy moves each algorithm into its own class — add new ones without modifying existing code (OCP).

**Q: "Strategy vs Factory?"**
**A:** **Factory** creates the right object. **Strategy** uses the right algorithm. Often used together: factory creates `PaymentStrategy`, cart uses it.

---

## 4. Observer Pattern

### Definition

> Define a **one-to-many dependency** between objects so that when one object (subject) changes state,
> all its dependents (observers) are **notified and updated automatically**.

Also called **Publish-Subscribe** (pub/sub) in distributed systems.

### Problem

When stock price changes, multiple UI components need updating:

```typescript
// ❌ BAD — subject knows about every display type
setPrice(price: number) {
    this.price = price;
    this.display.refresh(price);
    this.alert.check(price);
    this.chart.redraw(price);
    // Add new widget? Edit this method every time!
}
```

Subject becomes tightly coupled to all dependents. Hard to add/remove listeners dynamically.

### Solution

Subject maintains a list of observers. On change, it loops and calls `update()` on each — subject doesn't know observer details.

```
                    ┌──────────────┐
                    │    Stock     │  (Subject)
                    │  setPrice()  │
                    └──────┬───────┘
                           │ notifyObservers()
              ┌────────────┼────────────┐
              ▼            ▼            ▼
       PriceDisplay   PriceAlert    ChartWidget
        (Observer)    (Observer)    (Observer)
```

### TypeScript Example (Stock price)

Run: `npx tsx lld/design-patterns/behavioural/observer.ts`

```typescript
interface Observer {
    update(symbol: string, price: number): void;
}

interface Subject {
    attach(observer: Observer): void;
    detach(observer: Observer): void;
    notifyObservers(): void;
}

class Stock implements Subject {
    private observers: Observer[] = [];
    private symbol: string;
    private price: number = 0;

    constructor(symbol: string) {
        this.symbol = symbol;
    }

    attach(observer: Observer): void {
        this.observers.push(observer);
    }

    detach(observer: Observer): void {
        const index = this.observers.indexOf(observer);
        if (index > -1) this.observers.splice(index, 1);
    }

    setPrice(price: number): void {
        this.price = price;
        this.notifyObservers();  // push update to all subscribers
    }

    notifyObservers(): void {
        for (const observer of this.observers) {
            observer.update(this.symbol, this.price);
        }
    }
}

class PriceDisplay implements Observer {
    update(symbol: string, price: number): void {
        console.log(`Display updated: ${symbol} = $${price}`);
    }
}

class PriceAlert implements Observer {
    constructor(private threshold: number) {}

    update(symbol: string, price: number): void {
        if (price > this.threshold) {
            console.log(`Alert! ${symbol} exceeded $${this.threshold}`);
        }
    }
}

// Usage
const stock = new Stock("AAPL");
stock.attach(new PriceDisplay());
stock.attach(new PriceAlert(150.00));

stock.setPrice(145.00);  // Display updated
stock.setPrice(155.00);  // Display updated + Alert triggered
```

### Structure (4 roles)

| Role | In stock example |
|------|-----------------|
| **Subject** | `Stock` — maintains observer list, notifies on change |
| **Observer** (interface) | `update(symbol, price)` |
| **Concrete Observers** | `PriceDisplay`, `PriceAlert` |
| **Client** | Attaches/detaches observers, triggers `setPrice()` |

### Real-world examples

| Domain | Subject | Observers |
|--------|---------|-----------|
| Stock market | `Stock` | Display, Alert, Chart |
| Social media | `User` / `Channel` | Followers, NotificationService |
| Event systems | `EventEmitter` | Logger, EmailSender, Metrics |
| MVC UI | `Model` | View components |
| Message queues | Topic | Multiple consumer services |

### Key properties

- **Loose coupling** — subject doesn't know observer implementation details
- **Dynamic subscription** — attach/detach at runtime
- **Broadcast** — one change → many reactions
- Watch for **memory leaks** if observers aren't detached

### Push vs Pull

| Style | Who decides what data to send |
|-------|------------------------------|
| **Push** | Subject sends all data in `update(data)` |
| **Pull** | Observer calls back to subject for what it needs |

Our example uses **push** — subject passes `symbol` and `price` to `update()`.

### When to use

- Change in one object must update many others
- Don't know how many dependents upfront
- Want decoupled event notification (UI, logging, alerts)

### When NOT to use

- Simple one-to-one updates (overkill)
- Order of notification matters critically (observer order is often undefined)
- Observers cause circular updates (A notifies B, B notifies A)

### Interview tip

**Q: "Observer vs Event Emitter / pub-sub?"**
**A:** Same idea. Classic Observer is in-process OOP (subject holds observer list). Pub/sub often adds a **message broker** (Redis, Kafka) for decoupling across services.

**Q: "How is this used in React?"**
**A:** State management (Redux, Context) — state change notifies subscribed components to re-render. Same publish-notify model.

---

## 5. State Pattern

### Definition

> Allow an object to **alter its behavior when its internal state changes**.
> The object will appear to change its class.

Instead of giant if/else on `currentState`, delegate each action to the **current state object**.

### Problem

Vending machine behavior depends on state — lots of conditionals:

```typescript
// ❌ BAD — state checks everywhere
insertCoin() {
    if (this.state === "NO_COIN") { /* ... */ }
    else if (this.state === "HAS_COIN") { console.log("Coin already inserted"); }
    else if (this.state === "DISPENSING") { /* ... */ }
}
```

Every new state or action = more branches. Logic for one state scattered across methods.

### Solution

Each state is its own class implementing a common interface. Context (`VendingMachine`) holds `currentState` and delegates all actions to it. States transition by calling `machine.setState(new NextState())`.

```
┌─────────────────────┐
│   VendingMachine    │  (Context)
│   currentState ───────────────┐
└─────────────────────┘          │
                                 ▼
                    ┌────────────────────────┐
                    │  VendingMachineState   │ (interface)
                    └───────────┬────────────┘
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                 ▼
         NoCoinState      HasCoinState      DispenseState
```

**State transitions:**

```
NoCoin ──insertCoin──→ HasCoin ──selectProduct──→ Dispense ──dispense──→ NoCoin
  │                       │                            │
  selectProduct           insertCoin                   insertCoin
  dispense                dispense                     selectProduct
  → "Insert coin first"   → "Coin already..."          → "Please wait..."
```

### TypeScript Example (Vending machine)

Run: `npx tsx lld/design-patterns/behavioural/state.ts`

```typescript
interface VendingMachineState {
    insertCoin(machine: VendingMachine): void;
    selectProduct(machine: VendingMachine): void;
    dispense(machine: VendingMachine): void;
}

class NoCoinState implements VendingMachineState {
    insertCoin(machine: VendingMachine): void {
        console.log("Coin inserted");
        machine.setState(new HasCoinState());
    }
    selectProduct(): void { console.log("Insert coin first"); }
    dispense(): void { console.log("Insert coin first"); }
}

class HasCoinState implements VendingMachineState {
    insertCoin(): void { console.log("Coin already inserted"); }
    selectProduct(machine: VendingMachine): void {
        console.log("Product selected");
        machine.setState(new DispenseState());
    }
    dispense(): void { console.log("Select product first"); }
}

class DispenseState implements VendingMachineState {
    insertCoin(): void { console.log("Please wait, dispensing"); }
    selectProduct(): void { console.log("Please wait, dispensing"); }
    dispense(machine: VendingMachine): void {
        console.log("Dispensing product");
        machine.setState(new NoCoinState());
    }
}

class VendingMachine {
    private currentState: VendingMachineState = new NoCoinState();

    insertCoin(): void { this.currentState.insertCoin(this); }
    selectProduct(): void { this.currentState.selectProduct(this); }
    dispense(): void { this.currentState.dispense(this); }

    setState(state: VendingMachineState): void {
        this.currentState = state;
    }
}

// Usage
const machine = new VendingMachine();
machine.selectProduct();  // "Insert coin first"
machine.insertCoin();     // "Coin inserted"
machine.selectProduct();  // "Product selected"
machine.dispense();       // "Dispensing product"
```

### Structure (3 roles)

| Role | In vending machine |
|------|-------------------|
| **State** (interface) | `VendingMachineState` — one method per context action |
| **Concrete States** | `NoCoinState`, `HasCoinState`, `DispenseState` |
| **Context** | `VendingMachine` — delegates to `currentState`, exposes `setState()` |

### Real-world examples

| Domain | Context | States |
|--------|---------|--------|
| Vending machine | `VendingMachine` | NoCoin, HasCoin, Dispense |
| Order workflow | `Order` | Placed, Shipped, Delivered, Cancelled |
| Media player | `Player` | Stopped, Playing, Paused |
| TCP connection | `Connection` | Established, Listening, Closed |
| Document editor | `Document` | Draft, Moderation, Published |

### Key properties

- **Localizes state-specific behavior** — all "HasCoin" logic lives in `HasCoinState`
- **Explicit transitions** — `setState()` makes flow visible
- **Eliminates big switch/if on state enum**
- State objects can be **singletons** (stateless) or new instances per transition

### When to use

- Object behavior changes significantly based on internal state
- Many conditionals on state enum/string across methods
- State-specific behavior is complex and grows over time

### When NOT to use

- Only 2 simple states with minimal logic (enum + if may suffice)
- States don't drive different behavior — just data flags

### Interview tip

**Q: "State vs Strategy?"**
**A:** See [section 6](#6-strategy-vs-state-vs-observer) — this is the #1 comparison for these patterns.

**Q: "State vs State Machine / FSM?"**
**A:** State pattern **is** an OOP implementation of a finite state machine. States = nodes, transitions = `setState()` calls.

---

## 6. Strategy vs State vs Observer

### Strategy vs State (most asked)

| Aspect | Strategy | State |
|--------|----------|-------|
| **Who picks behavior?** | **Client** sets strategy explicitly | **State object** transitions internally |
| **Awareness** | Context knows it's using a strategy | Context often doesn't know which state is active (just delegates) |
| **Relationship** | Strategies are **independent** | States know about **other states** (transitions) |
| **Purpose** | Swap algorithms | Model lifecycle / mode |
| **Example** | User picks PayPal at checkout | Machine auto-moves NoCoin → HasCoin on insertCoin |

```
Strategy:  Client → setPaymentStrategy(PayPal) → checkout()

State:     insertCoin() → NoCoinState handles → setState(HasCoinState)
           (client didn't choose HasCoin — state transition did)
```

**Rule of thumb:**
- User **chooses** the algorithm → **Strategy**
- Object **moves through modes** on its own → **State**

### Observer vs Strategy

| Observer | Strategy |
|----------|----------|
| One subject, many listeners react | One context, one active algorithm |
| **Push** notification on change | **Pull** delegation on demand |
| Stock price → display + alert | Cart → payment method |

### Observer vs State

| Observer | State |
|----------|-------|
| External objects react to subject | Internal behavior changes with state |
| Subject doesn't change class | Context behaves differently per state |
| Many-to-one (many observers, one subject) | One context, one current state |

---

## 7. Common Interview Questions

### "Explain Strategy with an example"

1. **Problem** — checkout with growing if/else for payment types
2. **Solution** — `PaymentStrategy` interface, one class per method, `ShoppingCart` delegates
3. **Benefit** — add UPI without touching cart; easy to mock in tests

### "Explain Observer with an example"

1. **Problem** — stock price change must update display, alerts, charts
2. **Solution** — `Stock` maintains observer list, calls `update()` on price change
3. **Benefit** — add new observer without editing `Stock`; loose coupling

### "Explain State with an example"

1. **Problem** — vending machine with invalid actions per phase (dispense before coin)
2. **Solution** — `NoCoinState`, `HasCoinState`, `DispenseState` each define valid transitions
3. **Benefit** — state logic in one class each; no giant switch statement

### "Design a traffic light system — which pattern?"

- **State** — Red, Yellow, Green each define `next()` transition and allowed behavior

### "Design a notification system when order status changes — which pattern?"

- **Observer** — `Order` (subject) notifies EmailService, SMSService, PushService (observers)

### "Design multiple shipping cost calculators — which pattern?"

- **Strategy** — `StandardShipping`, `ExpressShipping`, `OvernightShipping`

### How they relate to SOLID

| Pattern | SOLID connection |
|---------|------------------|
| **Strategy** | **OCP** — new strategies without modifying context |
| **Observer** | **SRP** + loose coupling — subject notifies, observers handle their job |
| **State** | **OCP** + **SRP** — new states as new classes, each state one responsibility |

### Red flags in code

| Smell | Pattern hint |
|-------|--------------|
| Growing if/else on `paymentType` | Strategy |
| Object edits 5 widgets on every field change | Observer |
| Methods full of `if (state === X)` | State |
| Enum state + switch in every method | State |

---

## 8. Revision Cheat Sheet

Read this 3 minutes before your interview:

```
BEHAVIORAL = how objects communicate and behave

STRATEGY
  → Swap algorithms at runtime (client chooses)
  → PaymentStrategy: CreditCard, PayPal
  → ShoppingCart.setPaymentStrategy() → checkout()
  → Run: npx tsx lld/design-patterns/behavioural/strategy.ts

OBSERVER
  → One subject notifies many observers on change
  → Stock.setPrice() → PriceDisplay + PriceAlert.update()
  → attach / detach / notifyObservers
  → Run: npx tsx lld/design-patterns/behavioural/observer.ts

STATE
  → Behavior changes with internal state (auto transitions)
  → VendingMachine delegates to NoCoin / HasCoin / Dispense
  → setState(new HasCoinState()) inside state classes
  → Run: npx tsx lld/design-patterns/behavioural/state.ts

STRATEGY vs STATE
  → Strategy: client picks algorithm (PayPal vs Card)
  → State: object transitions modes (NoCoin → HasCoin → Dispense)
```

**One sentence each:**
- **Strategy** — "Pick how to do it; swap anytime."
- **Observer** — "Something changed; tell everyone watching."
- **State** — "What I can do depends on what mode I'm in."

**If asked to whiteboard:**
- **Strategy** — Context box → Strategy interface → 3 concrete strategy boxes
- **Observer** — Subject in center → arrows to multiple Observer boxes
- **State** — Context with `currentState` → state circle diagram with transition arrows

---

*Related: [structural.md](../structural/structural.md) · [solid.md](../../solid/solid.md)*

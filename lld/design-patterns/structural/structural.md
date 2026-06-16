# Structural Design Patterns — Interview Revision Guide

> Structural patterns deal with **how classes and objects are composed** to form larger structures.
> They simplify relationships between components — making systems easier to build, extend, and understand.
>
> Runnable examples: [`facade.ts`](facade.ts) · [`decorator.ts`](decorator.ts)

---

## Table of Contents

1. [What Are Structural Patterns?](#1-what-are-structural-patterns)
2. [Quick Reference](#2-quick-reference)
3. [Facade Pattern](#3-facade-pattern)
4. [Decorator Pattern](#4-decorator-pattern)
5. [Facade vs Decorator](#5-facade-vs-decorator)
6. [Common Interview Questions](#6-common-interview-questions)
7. [Revision Cheat Sheet](#7-revision-cheat-sheet)

---

## 1. What Are Structural Patterns?

Structural patterns answer: **"How do we wire classes together?"**

| Category | Focus | Examples |
|----------|-------|----------|
| **Creational** | How objects are created | Factory, Builder, Singleton |
| **Structural** | How objects are composed | Facade, Decorator, Adapter, Proxy |
| **Behavioral** | How objects communicate | Strategy, Observer, Command |

**When interviewers ask structural patterns**, they usually want you to:
- Explain the **problem** the pattern solves
- Draw or describe the **structure** (who wraps whom)
- Give a **real-world analogy**
- Compare with a similar pattern (Facade vs Decorator is very common)

---

## 2. Quick Reference

| Pattern | One-liner | Real-world analogy |
|---------|-----------|-------------------|
| **Facade** | One simple interface over a complex subsystem | Hotel concierge — you say "check out", they handle billing + keys + luggage |
| **Decorator** | Wrap an object to add behavior dynamically | Coffee order — base espresso + add milk + add caramel, stack toppings |

| | Facade | Decorator |
|---|--------|-----------|
| **Goal** | Simplify access | Extend behavior |
| **Direction** | Many subsystems → one entry point | One object → wrapped layers |
| **Client knows about** | Only the facade | Only the outer wrapper (via common interface) |
| **When to use** | Subsystem is complex, client shouldn't care | Need flexible, runtime add-ons without subclass explosion |

---

## 3. Facade Pattern

### Definition

> Provide a **unified, simplified interface** to a set of interfaces in a subsystem.
> The facade defines a higher-level interface that makes the subsystem **easier to use**.

Facade does **not** add new functionality — it **hides complexity** and coordinates existing subsystems.

### Problem

Client code must talk to many subsystems directly:

```
Client → Lights.on/off
       → Thermostat.setMode/setTemperature
       → Security.arm/disarm
```

Every "leave home" or "arrive home" scenario repeats the same multi-step orchestration. Clients become tightly coupled to subsystem details.

### Solution

Introduce a **Facade** that exposes high-level methods (`leaveHome`, `arriveHome`) and delegates to subsystems internally.

```
                    ┌─────────────────────┐
                    │   SmartHomeFacade   │  ← simple API
                    └──────────┬──────────┘
           ┌───────────────────┼───────────────────┐
           ▼                   ▼                   ▼
   SmartLightsSystem     Thermostat         SecuritySystem
      (subsystem)        (subsystem)         (subsystem)
```

### TypeScript Example (Smart Home)

Run: `npx tsx lld/design-patterns/structural/facade.ts`

```typescript
// Subsystems — each handles one domain
class SmartLightsSystem {
    on(): void { console.log("Lights: Turned on."); }
    off(): void { console.log("Lights: Turned off."); }
}

class Thermostat {
    private mode: string = "";

    setTemperature(degrees: number): void {
        console.log(`Thermostat: Mode set to ${this.mode}. Temperature set to ${degrees}C.`);
    }

    setMode(mode: string): void { this.mode = mode; }
}

class SecuritySystem {
    arm(): void { console.log("Security: System armed."); }
    disarm(): void { console.log("Security: System disarmed."); }
}

// Facade — one entry point for the client
class SmartHomeFacade {
    constructor(
        private lights: SmartLightsSystem,
        private thermostat: Thermostat,
        private security: SecuritySystem
    ) {}

    leaveHome(): void {
        this.lights.off();
        this.thermostat.setMode("eco");
        this.thermostat.setTemperature(18);
        this.security.arm();
    }

    arriveHome(): void {
        this.lights.on();
        this.thermostat.setMode("comfort");
        this.thermostat.setTemperature(22);
        this.security.disarm();
    }
}

const home = new SmartHomeFacade(new SmartLightsSystem(), new Thermostat(), new SecuritySystem());
home.leaveHome();
home.arriveHome();
```

### Real-world examples

| Domain | Facade | Hidden subsystems |
|--------|--------|-------------------|
| Smart home | `SmartHomeFacade` | lights, thermostat, security |
| E-commerce checkout | `CheckoutFacade` | inventory, payment, shipping, notification |
| Video conversion | `VideoConverterFacade` | decode, encode, mux, write file |
| Database ORM | `UserRepository.find()` | connection pool, query builder, mapper |

### Key properties

- **Does not prevent** direct access to subsystems — it's a convenience layer, not a gatekeeper
- **Reduces coupling** between client and subsystem classes
- Often used at **module boundaries** (API layer over internal services)
- Aligns with **Law of Demeter** — client talks to facade, not to facade's internals

### When to use

- Subsystem has many interdependent classes
- Client only needs a few common workflows
- You want to **layer** your architecture (presentation → facade → domain)

### When NOT to use

- Subsystem is already simple (facade adds unnecessary indirection)
- You need fine-grained control over every subsystem call from the client

### Interview tip

**Q: "Is Facade the same as Adapter?"**
**A:** No. **Facade** simplifies a complex subsystem (same intent, easier API). **Adapter** makes an incompatible interface work with your code (different interface, same capability).

---

## 4. Decorator Pattern

### Definition

> Attach **additional responsibilities** to an object **dynamically**.
> Decorators provide a flexible alternative to subclassing for extending functionality.

Decorator wraps an object that shares the **same interface**, adding behavior layer by layer — like stacking wrappers.

### Problem

You want to add toppings/features to a base object at **runtime**, in any combination:

- Plain pizza
- Plain + cheese
- Plain + cheese + olives
- Plain + cheese + olives + mushrooms

Using inheritance alone → class explosion:

```
PlainPizza, CheesePizza, OlivePizza, CheeseOlivePizza, CheeseOliveMushroomPizza, ...
```

Every new topping combination potentially needs a new subclass. Violates **Open/Closed Principle**.

### Solution

Wrap the base object in **decorator classes** that implement the same interface and delegate to the wrapped object, adding their own behavior.

```
         ┌──────────────────────────────────────────┐
         │  MushroomDecorator                       │
         │  ┌────────────────────────────────────┐  │
         │  │  OliveDecorator                    │  │
         │  │  ┌──────────────────────────────┐  │  │
         │  │  │  CheeseDecorator             │  │  │
         │  │  │  ┌────────────────────────┐  │  │  │
         │  │  │  │     PlainPizza         │  │  │  │
         │  │  │  └────────────────────────┘  │  │  │
         │  │  └──────────────────────────────┘  │  │
         │  └────────────────────────────────────┘  │
         └──────────────────────────────────────────┘
                    all implement Pizza
```

### TypeScript Example (Pizza toppings)

Run: `npx tsx lld/design-patterns/structural/decorator.ts`

```typescript
interface Pizza {
    getCost(): number;
    getDescription(): string;
}

class PlainPizza implements Pizza {
    getCost(): number { return 5.00; }
    getDescription(): string { return "Plain pizza"; }
}

abstract class PizzaDecorator implements Pizza {
    constructor(protected pizza: Pizza) {}

    getCost(): number { return this.pizza.getCost(); }
    getDescription(): string { return this.pizza.getDescription(); }
}

class CheeseDecorator extends PizzaDecorator {
    getCost(): number { return this.pizza.getCost() + 1.50; }
    getDescription(): string { return this.pizza.getDescription() + ", cheese"; }
}

class OliveDecorator extends PizzaDecorator {
    getCost(): number { return this.pizza.getCost() + 2.00; }
    getDescription(): string { return this.pizza.getDescription() + ", olives"; }
}

class MushroomDecorator extends PizzaDecorator {
    getCost(): number { return this.pizza.getCost() + 1.00; }
    getDescription(): string { return this.pizza.getDescription() + ", mushrooms"; }
}

// Stack decorators at runtime — any combination, any order of wrapping
const plain: Pizza = new PlainPizza();
// Plain pizza | $5.00

const cheeseOlive: Pizza = new OliveDecorator(new CheeseDecorator(new PlainPizza()));
// Plain pizza, cheese, olives | $8.50

const loaded: Pizza = new MushroomDecorator(
    new OliveDecorator(new CheeseDecorator(new PlainPizza())));
// Plain pizza, cheese, olives, mushrooms | $9.50
```

### Structure (4 roles)

| Role | In pizza example |
|------|------------------|
| **Component** (interface) | `Pizza` |
| **Concrete Component** | `PlainPizza` |
| **Decorator** (abstract wrapper) | `PizzaDecorator` |
| **Concrete Decorators** | `CheeseDecorator`, `OliveDecorator`, `MushroomDecorator` |

Each decorator:
1. Implements the same interface as the component
2. Holds a reference to a `Pizza` (wrapped object)
3. Delegates to wrapped object, then adds its own logic

### Real-world examples

| Domain | Base | Decorators |
|--------|------|------------|
| Coffee shop | Espresso | Milk, Caramel, Whip |
| I/O streams (Java) | `FileInputStream` | `BufferedInputStream`, `GzipInputStream` |
| UI components | `TextView` | `BorderDecorator`, `ScrollDecorator` |
| HTTP middleware | Base handler | Auth, Logging, RateLimit layers |
| Notifications | Email | SMS decorator, Push decorator |

### Key properties

- **Open/Closed** — add new decorators without changing existing code
- **Single Responsibility** — each decorator adds one concern
- **Composable** — stack decorators in any order/combination at runtime
- Client treats decorated object same as base (polymorphism via shared interface)

### When to use

- Extend behavior **at runtime**, not compile time
- Many optional features / combinations (avoid subclass explosion)
- Adding features should not modify the core class

### When NOT to use

- You need to remove decorators frequently (decorator chains can get hard to debug)
- Object identity matters and wrappers change `instanceof` checks
- Simple fixed variants — inheritance or strategy may be enough

### Interview tip

**Q: "Decorator vs Inheritance?"**
**A:** Inheritance is **static** (fixed at compile time, one layer). Decorator is **dynamic** (compose at runtime, stack multiple layers). Inheritance gives you `CheesePizza`; decorator gives you `new CheeseDecorator(new PlainPizza())` and any combo on the fly.

**Q: "Decorator vs Chain of Responsibility?"**
**A:** Decorator **wraps and returns** the same interface — all layers contribute to the final result (cost, description). Chain of Responsibility **passes a request along** until one handler processes it (middleware that may or may not handle).

---

## 5. Facade vs Decorator

This comparison comes up often. Know the difference cold.

| Aspect | Facade | Decorator |
|--------|--------|-----------|
| **Purpose** | Simplify a complex subsystem | Add behavior to an object |
| **Interface** | New, simpler API (may differ from subsystems) | Same interface as wrapped object |
| **Structure** | One class coordinates many subsystems | Nested wrappers around one object |
| **Client sees** | One facade method | One object (doesn't know how many layers) |
| **Adds functionality?** | No — just orchestrates existing calls | Yes — each layer adds something |
| **Analogy** | Remote control with "Movie Mode" button | Gift box inside gift box inside gift box |

```
Facade:     Client ──→ Facade ──→ [Subsystem A, B, C]

Decorator:  Client ──→ Decorator C ──→ Decorator B ──→ Decorator A ──→ Core Object
                        (same interface all the way down)
```

**Rule of thumb:**
- Too many classes to call? → **Facade**
- Need to add features without subclassing? → **Decorator**

---

## 6. Common Interview Questions

### "Explain Facade with an example"

**Answer structure:**
1. **Problem** — checkout touches inventory, payment, shipping, email separately
2. **Solution** — `CheckoutFacade.placeOrder()` orchestrates all four
3. **Benefit** — client gets one call; subsystems can change internally

### "Explain Decorator with an example"

**Answer structure:**
1. **Problem** — pizza toppings in every combination would need dozens of subclasses
2. **Solution** — `Pizza` interface + `PlainPizza` + topping decorators that wrap and delegate
3. **Benefit** — compose any topping combo at runtime; add new toppings without touching `PlainPizza`

### "Design a coffee ordering system — which pattern?"

- **Base drink + add-ons (milk, whip, caramel)** → **Decorator**
- **Order placement touching payment, inventory, receipt** → **Facade**

Both can appear in the same system for different problems.

### "How does Decorator relate to SOLID?"

- **OCP** — extend via new decorator classes, don't modify `PlainPizza`
- **SRP** — each decorator handles one topping/feature
- **LSP** — any `Pizza` (plain or decorated) works wherever `Pizza` is expected

### Red flags / smells

| Smell | Pattern hint |
|-------|--------------|
| Client calls 5+ services for one user action | Missing Facade |
| `if (hasCheese && hasOlives && hasMushrooms)` everywhere | Use Decorator |
| `CheeseOliveMushroomPizza extends Pizza` explosion | Use Decorator |
| God class that knows every subsystem detail | Extract Facade |

---

## 7. Revision Cheat Sheet

Read this 3 minutes before your interview:

```
STRUCTURAL = how objects are composed together

FACADE
  → One simple API over many subsystems
  → SmartHomeFacade.leaveHome() → lights + thermostat + security
  → Simplifies, does NOT add new behavior
  → Run: npx tsx lld/design-patterns/structural/facade.ts

DECORATOR
  → Wrap object to add behavior dynamically (same interface)
  → PlainPizza → +Cheese → +Olives → +Mushrooms
  → Avoids subclass explosion, supports OCP
  → Run: npx tsx lld/design-patterns/structural/decorator.ts

FACADE vs DECORATOR
  → Facade = simplify access (many → one)
  → Decorator = extend behavior (one → wrapped layers)
```

**One sentence each:**
- **Facade** — "Give me a simple button; I'll handle the messy stuff behind it."
- **Decorator** — "Start with the base; wrap it with extras, stack as many as you want."

**If asked to whiteboard:** Draw boxes. Facade = one box pointing to three subsystem boxes. Decorator = nested boxes all labeled with the same interface.

---

*Related: [creational.md](../creational/creational.md) · [solid.md](../../solid/solid.md)*

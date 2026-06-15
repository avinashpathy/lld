# Node.js, JavaScript & TypeScript — Backend Interview Guide (4 YOE)

> Complete interview preparation covering **conceptual**, **coding**, and **output-based** questions.
> Targeted at **4 years experienced backend developers** interviewing at FAANG & startups.

---

## Table of Contents

### JavaScript
1. [Event Loop & Asynchronous Model](#1-event-loop--asynchronous-model)
2. [Closures](#2-closures)
3. [Hoisting](#3-hoisting)
4. [Scope & Scope Chain](#4-scope--scope-chain)
5. [`var` vs `let` vs `const`](#5-var-vs-let-vs-const)
6. [`this` Keyword](#6-this-keyword)
7. [Prototypes & Prototypal Inheritance](#7-prototypes--prototypal-inheritance)
8. [Promises, async/await & Callbacks](#8-promises-asyncawait--callbacks)
9. [Event Delegation & Bubbling](#9-event-delegation--bubbling)
10. [`call`, `apply`, `bind`](#10-call-apply-bind)
11. [Debounce & Throttle](#11-debounce--throttle)
12. [Currying & Partial Application](#12-currying--partial-application)
13. [Deep vs Shallow Copy](#13-deep-vs-shallow-copy)
14. [WeakMap, WeakSet, Map, Set](#14-weakmap-weakset-map-set)
15. [Generators & Iterators](#15-generators--iterators)
16. [Proxy & Reflect](#16-proxy--reflect)
17. [Symbols](#17-symbols)
18. [Error Handling Patterns](#18-error-handling-patterns)
19. [Modules: CommonJS vs ESM](#19-modules-commonjs-vs-esm)
20. [Coercion & Comparison Quirks](#20-coercion--comparison-quirks)

### Node.js
21. [Node.js Architecture & V8](#21-nodejs-architecture--v8)
22. [Event Loop Deep Dive (Node.js Phases)](#22-event-loop-deep-dive-nodejs-phases)
23. [Streams](#23-streams)
24. [Cluster & Worker Threads](#24-cluster--worker-threads)
25. [Buffer](#25-buffer)
26. [Child Processes](#26-child-processes)
27. [Error Handling in Node.js](#27-error-handling-in-nodejs)
28. [Memory Leaks & Debugging](#28-memory-leaks--debugging)
29. [Middleware Pattern (Express)](#29-middleware-pattern-express)
30. [Security Best Practices](#30-security-best-practices)
31. [Process & Environment](#31-process--environment)
32. [Event Emitter](#32-event-emitter)
33. [File System & Path](#33-file-system--path)
34. [REST API Design & HTTP](#34-rest-api-design--http)
35. [Database Patterns (Connection Pooling, ORMs)](#35-database-patterns)
36. [Caching Strategies](#36-caching-strategies)
37. [Rate Limiting & Backpressure](#37-rate-limiting--backpressure)
38. [Logging & Monitoring](#38-logging--monitoring)
39. [Testing (Unit, Integration, Mocking)](#39-testing)
40. [Deployment & Scaling](#40-deployment--scaling)

### TypeScript
41. [Type System Fundamentals](#41-type-system-fundamentals)
42. [Interfaces vs Types](#42-interfaces-vs-types)
43. [Generics](#43-generics)
44. [Utility Types](#44-utility-types)
45. [Union, Intersection & Discriminated Unions](#45-union-intersection--discriminated-unions)
46. [Type Guards & Narrowing](#46-type-guards--narrowing)
47. [Enums & Const Assertions](#47-enums--const-assertions)
48. [Declaration Merging](#48-declaration-merging)
49. [Decorators](#49-decorators)
50. [Conditional Types & `infer`](#50-conditional-types--infer)
51. [Mapped Types](#51-mapped-types)
52. [Template Literal Types](#52-template-literal-types)
53. [Module Augmentation](#53-module-augmentation)
54. [`any` vs `unknown` vs `never`](#54-any-vs-unknown-vs-never)
55. [Strict Mode Flags](#55-strict-mode-flags)

### Output-Based Questions
56. [Output Questions — JavaScript](#56-output-questions--javascript)
57. [Output Questions — Promises & async/await](#57-output-questions--promises--asyncawait)
58. [Output Questions — Event Loop & Timers](#58-output-questions--event-loop--timers)
59. [Output Questions — `this` & Closures](#59-output-questions--this--closures)
60. [Output Questions — TypeScript](#60-output-questions--typescript)
61. [Output Questions — Node.js](#61-output-questions--nodejs)

---

# JAVASCRIPT

---

## 1. Event Loop & Asynchronous Model

### Q: How does the JavaScript event loop work?

JavaScript is **single-threaded** but handles concurrency through the event loop. The event loop continuously checks whether the **call stack** is empty, then picks the next task from the **task queue** (macrotask) or **microtask queue**.

**Execution order:**
1. Execute all **synchronous code** (call stack).
2. Drain the **microtask queue** (Promises, `queueMicrotask`, `MutationObserver`).
3. Execute **one macrotask** (setTimeout, setInterval, I/O callbacks).
4. Repeat step 2 (microtasks again).
5. Render (browser only).
6. Go to step 3.

```
┌───────────────────────────┐
│        Call Stack          │  ← Sync code runs here
└──────────┬────────────────┘
           │ (empty?)
           ▼
┌───────────────────────────┐
│    Microtask Queue         │  ← Promise.then, queueMicrotask
│    (drain ALL)             │     Process.nextTick (Node.js)
└──────────┬────────────────┘
           │ (empty?)
           ▼
┌───────────────────────────┐
│    Macrotask Queue         │  ← setTimeout, setInterval, I/O
│    (pick ONE)              │     setImmediate (Node.js)
└──────────┬────────────────┘
           │
           └──→ Back to microtask check
```

### Q: What is the difference between microtask and macrotask?

| Microtasks | Macrotasks |
|-----------|-----------|
| `Promise.then/catch/finally` | `setTimeout` |
| `queueMicrotask()` | `setInterval` |
| `process.nextTick()` (Node) | `setImmediate()` (Node) |
| `MutationObserver` (Browser) | I/O callbacks |
| **ALL** drained before next macrotask | **ONE** per event loop tick |

```javascript
console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve().then(() => console.log("3"));

queueMicrotask(() => console.log("4"));

console.log("5");

// Output: 1, 5, 3, 4, 2
// Sync first (1, 5) → microtasks (3, 4) → macrotask (2)
```

### Q: What is starvation in the event loop?

If microtasks keep scheduling more microtasks, macrotasks will **never** execute — this is **starvation**.

```javascript
function starve() {
    Promise.resolve().then(starve); // infinite microtask loop
}
starve();
// setTimeout callbacks will NEVER run
```

---

## 2. Closures

### Q: What is a closure?

A **closure** is a function that **remembers and accesses variables from its outer (lexical) scope**, even after the outer function has returned.

Every function in JavaScript forms a closure. The inner function maintains a reference to the outer scope's variable object.

```javascript
function createCounter() {
    let count = 0; // enclosed in the closure

    return {
        increment() { return ++count; },
        decrement() { return --count; },
        getCount() { return count; },
    };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.decrement()); // 1
// 'count' is not accessible directly — it's private via closure
```

### Q: What are practical use cases for closures?

1. **Data privacy / encapsulation** (module pattern)
2. **Function factories**
3. **Memoization**
4. **Partial application / currying**
5. **Maintaining state** in callbacks and event handlers

```javascript
// Memoization via closure
function memoize(fn) {
    const cache = new Map();
    return function (...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) return cache.get(key);
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

const expensiveAdd = memoize((a, b) => {
    console.log("Computing...");
    return a + b;
});

expensiveAdd(1, 2); // "Computing..." → 3
expensiveAdd(1, 2); // 3 (cached, no log)
```

### Q: Classic closure trap with `var` in loops

```javascript
// BUG: All callbacks print 3
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100);
}
// Output: 3, 3, 3 — because 'var' is function-scoped, not block-scoped

// FIX 1: Use 'let' (block-scoped)
for (let i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100);
}
// Output: 0, 1, 2

// FIX 2: IIFE (creates a new scope per iteration)
for (var i = 0; i < 3; i++) {
    ((j) => {
        setTimeout(() => console.log(j), 100);
    })(i);
}
// Output: 0, 1, 2
```

---

## 3. Hoisting

### Q: What is hoisting?

Hoisting is JavaScript's behavior of **moving declarations to the top of their scope** during the compilation phase (before code execution).

| Declaration | Hoisted? | Initialized? | Accessible before declaration? |
|------------|---------|-------------|-------------------------------|
| `var` | Yes | `undefined` | Yes (value is `undefined`) |
| `let` / `const` | Yes | **No** (TDZ) | No — `ReferenceError` |
| `function` declaration | Yes | **Full body** | Yes — fully callable |
| `function` expression | As `var`/`let` | No | No |
| `class` | Yes | **No** (TDZ) | No — `ReferenceError` |

```javascript
console.log(a); // undefined (var is hoisted, initialized to undefined)
console.log(b); // ReferenceError: Cannot access 'b' before initialization
console.log(c); // ReferenceError

var a = 10;
let b = 20;
const c = 30;

// Function declaration — fully hoisted
greet(); // "Hello!" — works before declaration
function greet() {
    console.log("Hello!");
}

// Function expression — NOT fully hoisted
sayBye(); // TypeError: sayBye is not a function
var sayBye = function () {
    console.log("Bye!");
};
```

### Q: What is the Temporal Dead Zone (TDZ)?

The TDZ is the period between entering a scope and the variable's declaration being evaluated. Accessing `let`/`const` variables in the TDZ throws a `ReferenceError`.

```javascript
{
    // TDZ starts for 'x'
    console.log(x); // ReferenceError
    let x = 10;     // TDZ ends
    console.log(x); // 10
}
```

---

## 4. Scope & Scope Chain

### Q: What are the different types of scope in JavaScript?

1. **Global scope** — accessible everywhere.
2. **Function scope** — variables declared with `var` inside a function.
3. **Block scope** — variables declared with `let`/`const` inside `{}`.
4. **Module scope** — variables in an ES module are scoped to the module.

```javascript
var globalVar = "I'm global";

function outer() {
    var outerVar = "I'm in outer";

    function inner() {
        let innerVar = "I'm in inner";
        console.log(globalVar); // ✅ found via scope chain
        console.log(outerVar);  // ✅ found via scope chain
        console.log(innerVar);  // ✅ found in current scope
    }

    inner();
    // console.log(innerVar); // ❌ ReferenceError
}

outer();
```

### Q: What is lexical scoping?

Lexical scoping means a function's scope is determined by **where it is defined**, not where it is called.

```javascript
let name = "Global";

function printName() {
    console.log(name); // looks up where printName was DEFINED
}

function wrapper() {
    let name = "Wrapper";
    printName(); // prints "Global", NOT "Wrapper"
}

wrapper(); // "Global"
```

---

## 5. `var` vs `let` vs `const`

| Feature | `var` | `let` | `const` |
|---------|-------|-------|---------|
| Scope | Function | Block | Block |
| Hoisted | Yes (→ `undefined`) | Yes (TDZ) | Yes (TDZ) |
| Re-declaration | Allowed | Not allowed | Not allowed |
| Re-assignment | Allowed | Allowed | **Not allowed** |
| `window` property (browser) | Yes | No | No |

```javascript
// var — function scoped, leaks out of blocks
if (true) {
    var x = 10;
}
console.log(x); // 10 — leaked!

// let — block scoped
if (true) {
    let y = 20;
}
// console.log(y); // ReferenceError

// const — block scoped, binding is immutable (value may be mutable)
const obj = { a: 1 };
obj.a = 2;     // ✅ mutating the object is fine
// obj = {};   // ❌ TypeError: Assignment to constant variable

const arr = [1, 2, 3];
arr.push(4);   // ✅ [1, 2, 3, 4]
// arr = [];   // ❌ TypeError
```

### Q: Why should you avoid `var`?

1. No block scoping — leads to bugs in loops and conditionals.
2. Hoisted with `undefined` — silent bugs instead of errors.
3. Can be re-declared — accidentally overwriting variables.
4. Pollutes `window` object in browsers.

---

## 6. `this` Keyword

### Q: How does `this` work in JavaScript?

`this` is determined by **how a function is called**, not where it is defined.

| Call pattern | `this` value |
|-------------|-------------|
| Regular function call `fn()` | `undefined` (strict) / `globalThis` (sloppy) |
| Method call `obj.fn()` | `obj` |
| `new fn()` | Newly created object |
| `fn.call(ctx)` / `fn.apply(ctx)` | `ctx` |
| `fn.bind(ctx)()` | `ctx` |
| Arrow function `() => {}` | Inherited from enclosing lexical scope |

```javascript
const user = {
    name: "Alice",

    // Regular method — 'this' is the caller object
    greet() {
        console.log(`Hi, I'm ${this.name}`);
    },

    // Arrow function — 'this' is from the enclosing scope (NOT user)
    greetArrow: () => {
        console.log(`Hi, I'm ${this.name}`); // 'this' is outer scope
    },

    // Common interview scenario: losing 'this'
    delayedGreet() {
        setTimeout(function () {
            console.log(this.name); // undefined — 'this' is global/undefined
        }, 100);
    },

    // Fix: arrow function preserves 'this'
    delayedGreetFixed() {
        setTimeout(() => {
            console.log(this.name); // "Alice" — arrow uses lexical 'this'
        }, 100);
    },
};

user.greet();            // "Hi, I'm Alice"
user.greetArrow();       // "Hi, I'm undefined"
user.delayedGreetFixed(); // "Alice"

const greet = user.greet;
greet(); // undefined (lost context — 'this' is global/undefined)
```

---

## 7. Prototypes & Prototypal Inheritance

### Q: How does prototypal inheritance work?

Every JavaScript object has an internal `[[Prototype]]` link (accessible via `__proto__` or `Object.getPrototypeOf()`). When you access a property, the engine walks up the **prototype chain** until it finds it or reaches `null`.

```javascript
const animal = {
    alive: true,
    eat() {
        console.log(`${this.name} is eating`);
    },
};

const dog = Object.create(animal); // dog's prototype is animal
dog.name = "Rex";
dog.bark = function () {
    console.log("Woof!");
};

dog.eat();  // "Rex is eating" — found on animal (prototype)
dog.bark(); // "Woof!" — found on dog itself

console.log(dog.alive);                      // true — from animal
console.log(dog.hasOwnProperty("name"));     // true — own property
console.log(dog.hasOwnProperty("alive"));    // false — inherited
console.log(dog.hasOwnProperty("eat"));      // false — inherited
```

### Q: How do `class` and `prototype` relate?

`class` in JavaScript is **syntactic sugar** over prototypal inheritance:

```javascript
class Animal {
    constructor(name) {
        this.name = name;
    }
    eat() {
        console.log(`${this.name} eats`);
    }
}

// Under the hood, this is equivalent to:
function AnimalFn(name) {
    this.name = name;
}
AnimalFn.prototype.eat = function () {
    console.log(`${this.name} eats`);
};

const a = new Animal("Cat");
const b = new AnimalFn("Cat");

console.log(typeof Animal);   // "function" (classes ARE functions)
console.log(a.__proto__ === Animal.prototype); // true
```

---

## 8. Promises, async/await & Callbacks

### Q: What is a Promise? What are its states?

A Promise is an object representing the **eventual completion or failure** of an async operation.

| State | Description | Transition |
|-------|------------|-----------|
| **Pending** | Initial state | → Fulfilled or Rejected |
| **Fulfilled** | Operation completed successfully | Terminal |
| **Rejected** | Operation failed | Terminal |

```javascript
const fetchData = (shouldFail) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) reject(new Error("Network error"));
            else resolve({ id: 1, name: "Alice" });
        }, 1000);
    });
};

// Promise chaining
fetchData(false)
    .then((data) => {
        console.log(data);
        return data.name.toUpperCase();
    })
    .then((name) => console.log(name))
    .catch((err) => console.error(err.message))
    .finally(() => console.log("Done"));

// async/await (syntactic sugar over Promises)
async function getData() {
    try {
        const data = await fetchData(false);
        console.log(data);
    } catch (err) {
        console.error(err.message);
    } finally {
        console.log("Done");
    }
}
```

### Q: `Promise.all` vs `Promise.allSettled` vs `Promise.race` vs `Promise.any`

```javascript
const p1 = Promise.resolve(1);
const p2 = Promise.reject("error");
const p3 = Promise.resolve(3);

// Promise.all — resolves when ALL succeed, rejects on FIRST failure
Promise.all([p1, p2, p3])
    .then(console.log)       // never called
    .catch(console.error);   // "error"

// Promise.allSettled — waits for ALL to settle (no short-circuit)
Promise.allSettled([p1, p2, p3]).then(console.log);
// [
//   { status: 'fulfilled', value: 1 },
//   { status: 'rejected', reason: 'error' },
//   { status: 'fulfilled', value: 3 }
// ]

// Promise.race — resolves/rejects with FIRST settled promise
Promise.race([p1, p2, p3]).then(console.log); // 1

// Promise.any — resolves with FIRST fulfilled, ignores rejections
Promise.any([p2, p1, p3]).then(console.log); // 1
// If ALL reject → AggregateError
```

### Q: How to run Promises in series vs parallel?

```javascript
const tasks = [1, 2, 3, 4, 5];
const asyncTask = (n) => new Promise((r) => setTimeout(() => r(n * 2), 100));

// PARALLEL — all start at the same time
const parallel = await Promise.all(tasks.map(asyncTask));
// [2, 4, 6, 8, 10] — ~100ms total

// SEQUENTIAL — one after another
const sequential = [];
for (const task of tasks) {
    sequential.push(await asyncTask(task));
}
// [2, 4, 6, 8, 10] — ~500ms total

// CONCURRENT with limit (e.g., max 2 at a time)
async function concurrentLimit(tasks, fn, limit) {
    const results = [];
    const executing = new Set();

    for (const task of tasks) {
        const p = fn(task).then((result) => {
            executing.delete(p);
            return result;
        });
        executing.add(p);
        results.push(p);
        if (executing.size >= limit) {
            await Promise.race(executing);
        }
    }
    return Promise.all(results);
}
```

---

## 9. Event Delegation & Bubbling

### Q: What is event delegation and why is it useful?

Instead of attaching event listeners to each child element, you attach **one listener to the parent** and use `event.target` to determine which child was clicked. Works because events **bubble up** from target to root.

**Benefits:** Fewer listeners (memory), works for dynamically added elements.

```javascript
// Instead of adding click handler to every <li>:
document.querySelector("ul").addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
        console.log("Clicked:", e.target.textContent);
    }
});
```

### Q: `stopPropagation` vs `preventDefault` vs `stopImmediatePropagation`

| Method | Effect |
|--------|--------|
| `e.preventDefault()` | Prevents default browser action (e.g., form submit, link navigation) |
| `e.stopPropagation()` | Stops event from bubbling to parent elements |
| `e.stopImmediatePropagation()` | Stops bubbling AND prevents other listeners on the same element |

---

## 10. `call`, `apply`, `bind`

### Q: What's the difference?

All three explicitly set the `this` context.

| Method | Invokes immediately? | Arguments |
|--------|---------------------|-----------|
| `call` | Yes | Individual args: `fn.call(ctx, a, b)` |
| `apply` | Yes | Array of args: `fn.apply(ctx, [a, b])` |
| `bind` | No (returns new fn) | Individual args: `fn.bind(ctx, a)(b)` |

```javascript
function introduce(greeting, punctuation) {
    console.log(`${greeting}, I'm ${this.name}${punctuation}`);
}

const person = { name: "Alice" };

introduce.call(person, "Hello", "!");   // "Hello, I'm Alice!"
introduce.apply(person, ["Hi", "."]); // "Hi, I'm Alice."

const bound = introduce.bind(person, "Hey");
bound("?"); // "Hey, I'm Alice?"
```

### Q: Implement `bind` from scratch

```javascript
Function.prototype.myBind = function (context, ...boundArgs) {
    const fn = this;
    return function (...callArgs) {
        return fn.apply(context, [...boundArgs, ...callArgs]);
    };
};

const bound2 = introduce.myBind(person, "Yo");
bound2("!!"); // "Yo, I'm Alice!!"
```

---

## 11. Debounce & Throttle

### Q: What's the difference?

| Pattern | Fires | Use case |
|---------|-------|---------|
| **Debounce** | After caller **stops** for N ms | Search input, resize handler |
| **Throttle** | At most once every N ms | Scroll handler, rate limiting |

```javascript
// DEBOUNCE — waits until the user stops calling for 'delay' ms
function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

// THROTTLE — runs at most once every 'limit' ms
function throttle(fn, limit) {
    let lastCall = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastCall >= limit) {
            lastCall = now;
            fn.apply(this, args);
        }
    };
}

// Usage
const searchAPI = debounce((query) => console.log("Searching:", query), 300);
const scrollHandler = throttle(() => console.log("Scroll event"), 200);
```

---

## 12. Currying & Partial Application

### Q: What is currying?

**Currying** transforms a function that takes multiple arguments into a chain of functions, each taking **one argument at a time**: `f(a, b, c)` → `f(a)(b)(c)`.

```javascript
// Regular function
function add(a, b, c) {
    return a + b + c;
}

// Curried version
function curriedAdd(a) {
    return function (b) {
        return function (c) {
            return a + b + c;
        };
    };
}

curriedAdd(1)(2)(3); // 6

// Generic curry utility
function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        }
        return function (...moreArgs) {
            return curried.apply(this, [...args, ...moreArgs]);
        };
    };
}

const curriedSum = curry(add);
curriedSum(1)(2)(3);  // 6
curriedSum(1, 2)(3);  // 6
curriedSum(1)(2, 3);  // 6
```

### Q: What is partial application?

**Partial application** fixes some arguments upfront and returns a function taking the rest. Unlike currying, it doesn't require one arg at a time.

```javascript
function partial(fn, ...preset) {
    return function (...later) {
        return fn(...preset, ...later);
    };
}

const addTax = partial(
    (rate, price) => price * (1 + rate),
    0.18 // fix rate at 18%
);

addTax(100); // 118
addTax(200); // 236
```

---

## 13. Deep vs Shallow Copy

```javascript
const original = {
    name: "Alice",
    address: { city: "NYC" },
    hobbies: ["chess", "reading"],
};

// SHALLOW COPIES — nested objects are SHARED
const spread = { ...original };
const assigned = Object.assign({}, original);

spread.address.city = "LA";
console.log(original.address.city); // "LA" — MUTATED!

// DEEP COPIES — fully independent
const deep1 = structuredClone(original); // ✅ Modern (Node 17+)
const deep2 = JSON.parse(JSON.stringify(original)); // ⚠️ Loses functions, dates, undefined

deep1.address.city = "Chicago";
console.log(original.address.city); // "LA" — NOT affected
```

### Q: What are the limitations of `JSON.parse(JSON.stringify())`?

- Drops `undefined`, `Symbol`, functions
- Converts `Date` to string
- Fails on circular references
- Converts `Map`, `Set`, `RegExp` to `{}`
- `NaN` and `Infinity` become `null`

Use `structuredClone()` instead — handles `Date`, `Map`, `Set`, `ArrayBuffer`, circular refs, but still can't clone functions.

---

## 14. WeakMap, WeakSet, Map, Set

| Feature | `Map` | `WeakMap` | `Set` | `WeakSet` |
|---------|-------|----------|-------|----------|
| Keys | Any type | **Objects only** | N/A | **Objects only** |
| Values | Any | Any | Any type | N/A |
| Iterable | Yes | **No** | Yes | **No** |
| `.size` | Yes | **No** | Yes | **No** |
| Garbage collection | Prevents GC of keys | **Allows** GC of keys | Prevents GC | **Allows** GC |
| Use case | General key-value | Private data, caches | Unique values | Object tagging |

```javascript
// WeakMap — perfect for private data attached to objects
const privateData = new WeakMap();

class User {
    constructor(name, password) {
        this.name = name;
        privateData.set(this, { password }); // truly private
    }

    checkPassword(input) {
        return privateData.get(this).password === input;
    }
}

let user = new User("Alice", "secret");
console.log(user.checkPassword("secret")); // true
// When 'user' is garbage collected, the WeakMap entry is automatically removed
```

---

## 15. Generators & Iterators

### Q: What is a generator function?

A generator is a function that can **pause** and **resume** execution, yielding multiple values over time.

```javascript
function* idGenerator() {
    let id = 1;
    while (true) {
        yield id++;
    }
}

const gen = idGenerator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }

// Practical: paginated API fetcher
function* paginate(items, pageSize) {
    for (let i = 0; i < items.length; i += pageSize) {
        yield items.slice(i, i + pageSize);
    }
}

const pages = paginate([1, 2, 3, 4, 5, 6, 7], 3);
console.log(pages.next().value); // [1, 2, 3]
console.log(pages.next().value); // [4, 5, 6]
console.log(pages.next().value); // [7]
console.log(pages.next().done);  // true

// Async generators (Node.js streams use this heavily)
async function* fetchPages(baseUrl) {
    let page = 1;
    while (true) {
        const res = await fetch(`${baseUrl}?page=${page}`);
        const data = await res.json();
        if (data.length === 0) return;
        yield data;
        page++;
    }
}
```

---

## 16. Proxy & Reflect

### Q: What is a Proxy?

A `Proxy` wraps an object and intercepts fundamental operations (get, set, delete, etc.) via **traps**.

```javascript
const validator = {
    set(target, prop, value) {
        if (prop === "age" && (typeof value !== "number" || value < 0)) {
            throw new TypeError("Age must be a positive number");
        }
        target[prop] = value;
        return true;
    },
    get(target, prop) {
        if (!(prop in target)) {
            throw new ReferenceError(`Property "${prop}" does not exist`);
        }
        return target[prop];
    },
};

const user = new Proxy({}, validator);
user.name = "Alice"; // OK
user.age = 30;       // OK
// user.age = -5;    // TypeError: Age must be a positive number
// user.phone;       // ReferenceError: Property "phone" does not exist

// Real-world use: reactive state (like Vue.js)
function reactive(obj, onChange) {
    return new Proxy(obj, {
        set(target, prop, value) {
            const oldValue = target[prop];
            target[prop] = value;
            if (oldValue !== value) {
                onChange(prop, oldValue, value);
            }
            return true;
        },
    });
}

const state = reactive({ count: 0 }, (prop, oldVal, newVal) => {
    console.log(`${prop}: ${oldVal} → ${newVal}`);
});
state.count = 1; // "count: 0 → 1"
```

---

## 17. Symbols

### Q: What is a Symbol and when would you use it?

A `Symbol` is a **unique, immutable primitive**. No two symbols are ever equal. They are used as property keys that won't collide with other keys.

```javascript
const id = Symbol("id");
const anotherId = Symbol("id");
console.log(id === anotherId); // false — always unique

const user = {
    [id]: 123,       // symbol-keyed property
    name: "Alice",
};

console.log(user[id]);            // 123
console.log(Object.keys(user));   // ["name"] — symbols are NOT enumerable
console.log(JSON.stringify(user)); // {"name":"Alice"} — symbols excluded

// Well-known symbols — customize built-in behavior
class Range {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }

    [Symbol.iterator]() {
        let current = this.start;
        const end = this.end;
        return {
            next() {
                return current <= end
                    ? { value: current++, done: false }
                    : { done: true };
            },
        };
    }
}

console.log([...new Range(1, 5)]); // [1, 2, 3, 4, 5]
```

---

## 18. Error Handling Patterns

```javascript
// Custom error classes
class AppError extends Error {
    constructor(message, statusCode, code) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}

class NotFoundError extends AppError {
    constructor(resource) {
        super(`${resource} not found`, 404, "NOT_FOUND");
    }
}

class ValidationError extends AppError {
    constructor(message) {
        super(message, 400, "VALIDATION_ERROR");
    }
}

// Async error handling wrapper for Express
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Global error middleware
function errorMiddleware(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error: {
            code: err.code || "INTERNAL_ERROR",
            message: err.message,
        },
    });
}

// Graceful error pattern for async functions
async function safeAsync(promise) {
    try {
        const data = await promise;
        return [data, null];
    } catch (err) {
        return [null, err];
    }
}

const [user, error] = await safeAsync(fetchUser(42));
if (error) console.error("Failed:", error.message);
```

---

## 19. Modules: CommonJS vs ESM

| Feature | CommonJS (`require`) | ESM (`import`) |
|---------|---------------------|---------------|
| Syntax | `const x = require('./x')` | `import x from './x'` |
| Loading | **Synchronous** | **Asynchronous** |
| Evaluation | **Runtime** | **Compile-time (static)** |
| `this` at top level | `module.exports` | `undefined` |
| Tree-shaking | Not possible | Supported (dead code elimination) |
| Default in Node | `.js` files (until recently) | `.mjs` files or `"type": "module"` in package.json |
| Circular deps | Returns partial export | Live bindings (reference to binding) |

```javascript
// CommonJS
const fs = require("fs");
const { readFile } = require("fs");
module.exports = { myFunc };
module.exports.named = myFunc;

// ESM
import fs from "fs";
import { readFile } from "fs";
export function myFunc() {}
export default myFunc;

// Dynamic import (works in both, returns Promise)
const module = await import("./heavy-module.js");
```

### Q: How do circular dependencies behave differently?

```javascript
// CommonJS: a.js gets PARTIAL export of b.js (whatever was exported BEFORE the cycle)
// a.js
const b = require("./b");
console.log("a: b.loaded =", b.loaded); // might be undefined
module.exports.loaded = true;

// b.js
const a = require("./a"); // gets partial 'a' (loaded might not exist yet)
console.log("b: a.loaded =", a.loaded); // undefined
module.exports.loaded = true;

// ESM: uses LIVE bindings — both see the final value (but TDZ issues possible)
```

---

## 20. Coercion & Comparison Quirks

### Q: `==` vs `===`

- `==` performs **type coercion** before comparison.
- `===` checks both **type and value** (strict equality).

```javascript
0 == ""        // true  (both coerce to 0)
0 == "0"       // true
"" == "0"      // false
false == "0"   // true  (false → 0, "0" → 0)
false == null  // false
null == undefined // true (special rule)
null === undefined // false
NaN == NaN     // false (NaN is not equal to anything, including itself)
NaN === NaN    // false

// Rule: ALWAYS use === unless you have a specific reason for ==
```

### Q: Type coercion rules

```javascript
// To Number
Number(true)       // 1
Number(false)      // 0
Number(null)       // 0
Number(undefined)  // NaN
Number("")         // 0
Number("  ")       // 0
Number("123")      // 123
Number("123abc")   // NaN

// To Boolean (falsy values)
Boolean(0)         // false
Boolean(-0)        // false
Boolean("")        // false
Boolean(null)      // false
Boolean(undefined) // false
Boolean(NaN)       // false
// Everything else is truthy, including: "0", " ", [], {}, -1

// To String
String(null)       // "null"
String(undefined)  // "undefined"
String(true)       // "true"
String([1, 2])     // "1,2"
String({})         // "[object Object]"

// + operator coercion
1 + "2"            // "12"  (number → string when one is string)
"3" - 1            // 2     (string → number for -, *, /)
true + true        // 2
[] + []            // ""    (both toString → "" + "")
[] + {}            // "[object Object]"
{} + []            // 0     ({} is parsed as empty block, +[] → 0)
```

---

# NODE.JS

---

## 21. Node.js Architecture & V8

### Q: What is Node.js and how does it work?

Node.js is a **JavaScript runtime** built on:
1. **V8 engine** (Google) — compiles JS to machine code.
2. **libuv** — provides the event loop, async I/O, thread pool.
3. **C/C++ bindings** — for OS-level operations (file system, networking).

```
┌─────────────────────────────────────────┐
│              Your JS Code               │
├─────────────────────────────────────────┤
│          Node.js Bindings (C++)         │
├──────────────────┬──────────────────────┤
│     V8 Engine    │       libuv          │
│  (JS → Machine   │  (Event loop,       │
│   Code)          │   Thread Pool,      │
│                  │   Async I/O)        │
├──────────────────┴──────────────────────┤
│        Operating System (Linux, etc.)   │
└─────────────────────────────────────────┘
```

### Q: Is Node.js single-threaded?

**Yes and No.** The **event loop and JS execution** run on a single thread. But **libuv's thread pool** (default 4 threads) handles blocking operations: file I/O, DNS lookups, crypto. Network I/O is truly async (non-blocking via epoll/kqueue).

```javascript
// You can increase the thread pool:
process.env.UV_THREADPOOL_SIZE = 8; // must be set before any I/O
```

### Q: V8's memory model

```
┌─────────────────── V8 Heap ───────────────────┐
│                                                │
│  ┌──────────────┐   ┌─────────────────────┐   │
│  │  New Space    │   │    Old Space         │   │
│  │  (Young Gen)  │   │    (Old Gen)         │   │
│  │  ~1-8 MB      │   │    ~1.5 GB (64-bit)  │   │
│  │  Scavenge GC  │   │    Mark-Sweep-Compact│   │
│  └──────────────┘   └─────────────────────┘   │
│                                                │
│  Default heap: ~1.5 GB (64-bit), ~750 MB (32) │
│  Override: --max-old-space-size=4096 (4 GB)    │
└────────────────────────────────────────────────┘
```

---

## 22. Event Loop Deep Dive (Node.js Phases)

### Q: What are the phases of the Node.js event loop?

```
   ┌───────────────────────────┐
┌─>│         timers             │  ← setTimeout, setInterval callbacks
│  └──────────┬────────────────┘
│  ┌──────────▼────────────────┐
│  │     pending callbacks      │  ← System-level callbacks (TCP errors, etc.)
│  └──────────┬────────────────┘
│  ┌──────────▼────────────────┐
│  │      idle, prepare         │  ← Internal use only
│  └──────────┬────────────────┘
│  ┌──────────▼────────────────┐
│  │         poll               │  ← I/O callbacks, incoming connections
│  └──────────┬────────────────┘      (blocks here if nothing else to do)
│  ┌──────────▼────────────────┐
│  │         check              │  ← setImmediate callbacks
│  └──────────┬────────────────┘
│  ┌──────────▼────────────────┐
│  │    close callbacks         │  ← socket.on('close'), etc.
│  └──────────┬────────────────┘
│             │
└─────────────┘ (next iteration)

Between EVERY phase: drain process.nextTick queue, then Promise microtasks
```

### Q: `process.nextTick` vs `setImmediate` vs `setTimeout(fn, 0)`

| API | When it runs | Queue |
|-----|-------------|-------|
| `process.nextTick(fn)` | **Before** any I/O / next phase | Microtask (special) |
| `Promise.then(fn)` | After `nextTick`, before macrotasks | Microtask |
| `setImmediate(fn)` | **Check** phase (after I/O poll) | Macrotask |
| `setTimeout(fn, 0)` | **Timers** phase (min ~1ms delay) | Macrotask |

```javascript
setImmediate(() => console.log("setImmediate"));
setTimeout(() => console.log("setTimeout"), 0);
process.nextTick(() => console.log("nextTick"));
Promise.resolve().then(() => console.log("Promise"));

// Guaranteed order:
// nextTick
// Promise
// setTimeout OR setImmediate (order between these two is non-deterministic
//   at the top level — depends on system timer resolution)
```

```javascript
// Inside an I/O callback, setImmediate ALWAYS fires before setTimeout:
const fs = require("fs");
fs.readFile(__filename, () => {
    setImmediate(() => console.log("setImmediate"));  // 1st
    setTimeout(() => console.log("setTimeout"), 0);    // 2nd
});
```

---

## 23. Streams

### Q: What are streams and why use them?

Streams process data **chunk by chunk** instead of loading everything into memory. Essential for large files, network data, and real-time processing.

Four types:

| Type | Description | Example |
|------|------------|---------|
| **Readable** | Source of data | `fs.createReadStream`, `http.IncomingMessage` |
| **Writable** | Destination for data | `fs.createWriteStream`, `http.ServerResponse` |
| **Duplex** | Both readable and writable | TCP socket, `net.Socket` |
| **Transform** | Duplex that modifies data | `zlib.createGzip()`, `crypto.createCipher` |

```javascript
const fs = require("fs");
const zlib = require("zlib");
const { pipeline } = require("stream/promises");

// BAD — loads entire file into memory
const data = fs.readFileSync("huge-file.csv"); // 2GB → OOM crash

// GOOD — streams process chunk by chunk
await pipeline(
    fs.createReadStream("huge-file.csv"),
    zlib.createGzip(),
    fs.createWriteStream("huge-file.csv.gz")
);

// Custom transform stream
const { Transform } = require("stream");

class UpperCaseTransform extends Transform {
    _transform(chunk, encoding, callback) {
        this.push(chunk.toString().toUpperCase());
        callback();
    }
}

await pipeline(
    fs.createReadStream("input.txt"),
    new UpperCaseTransform(),
    fs.createWriteStream("output.txt")
);
```

### Q: What is backpressure?

When a writable stream can't consume data as fast as the readable produces it. The readable must **pause** until the writable catches up.

```javascript
const readable = fs.createReadStream("large-file.dat");
const writable = fs.createWriteStream("copy.dat");

readable.on("data", (chunk) => {
    const canContinue = writable.write(chunk);
    if (!canContinue) {
        readable.pause(); // backpressure: stop reading
    }
});

writable.on("drain", () => {
    readable.resume(); // writable caught up, resume reading
});

// pipeline() handles this automatically — always prefer it
```

---

## 24. Cluster & Worker Threads

### Q: How to utilize multiple CPU cores in Node.js?

| Approach | Use Case | Shared Memory | Communication |
|----------|---------|---------------|--------------|
| `cluster` | Multiple server processes | No | IPC |
| `worker_threads` | CPU-intensive tasks | Yes (SharedArrayBuffer) | `postMessage` |
| `child_process` | Run external commands/scripts | No | stdin/stdout/IPC |

```javascript
// CLUSTER — one process per CPU core
const cluster = require("cluster");
const os = require("os");

if (cluster.isPrimary) {
    const numCPUs = os.cpus().length;
    console.log(`Primary ${process.pid} forking ${numCPUs} workers`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });
} else {
    const http = require("http");
    http.createServer((req, res) => {
        res.end(`Handled by worker ${process.pid}\n`);
    }).listen(3000);
}
```

```javascript
// WORKER THREADS — for CPU-heavy tasks
const { Worker, isMainThread, parentPort, workerData } = require("worker_threads");

if (isMainThread) {
    function runWorker(data) {
        return new Promise((resolve, reject) => {
            const worker = new Worker(__filename, { workerData: data });
            worker.on("message", resolve);
            worker.on("error", reject);
        });
    }

    (async () => {
        const result = await runWorker({ numbers: [1, 2, 3, 4, 5] });
        console.log("Sum:", result); // 15
    })();
} else {
    const sum = workerData.numbers.reduce((a, b) => a + b, 0);
    parentPort.postMessage(sum);
}
```

---

## 25. Buffer

### Q: What is a Buffer?

A `Buffer` is a fixed-size chunk of **raw binary data** (outside the V8 heap). Used for I/O operations — file reading, network packets, crypto.

```javascript
// Creating buffers
const buf1 = Buffer.alloc(10);          // 10 bytes, filled with 0
const buf2 = Buffer.from("Hello");      // from string (UTF-8)
const buf3 = Buffer.from([72, 101, 108]); // from byte array

console.log(buf2.toString());      // "Hello"
console.log(buf2.toString("hex")); // "48656c6c6f"
console.log(buf2.length);          // 5 (bytes, not characters)
console.log(buf2[0]);              // 72 (ASCII for 'H')

// Buffer comparison
const a = Buffer.from("abc");
const b = Buffer.from("abc");
console.log(a.equals(b));    // true
console.log(Buffer.compare(a, b)); // 0

// ⚠️ Buffer.allocUnsafe(10) — faster but contains old memory data (security risk)
```

---

## 26. Child Processes

```javascript
const { exec, execFile, spawn, fork } = require("child_process");

// exec — runs command in shell, buffers output (small output)
exec("ls -la", (error, stdout, stderr) => {
    console.log(stdout);
});

// spawn — streams output (large output, long-running processes)
const child = spawn("find", ["/", "-name", "*.log"]);
child.stdout.on("data", (data) => console.log(`stdout: ${data}`));
child.stderr.on("data", (data) => console.error(`stderr: ${data}`));
child.on("close", (code) => console.log(`Exited with code ${code}`));

// fork — spawns a new Node.js process with IPC channel
const worker = fork("./worker.js");
worker.send({ task: "process", data: [1, 2, 3] });
worker.on("message", (result) => console.log("Result:", result));

// execFile — like exec but doesn't spawn a shell (safer, faster)
execFile("node", ["--version"], (error, stdout) => {
    console.log(stdout); // v20.x.x
});
```

| Method | Shell? | Output | IPC | Best for |
|--------|--------|--------|-----|---------|
| `exec` | Yes | Buffered | No | Small commands |
| `execFile` | No | Buffered | No | Run binaries safely |
| `spawn` | No | Streamed | No | Large output / long-running |
| `fork` | No | Streamed | **Yes** | Node.js child scripts |

---

## 27. Error Handling in Node.js

### Q: What are the different error handling patterns?

```javascript
// 1. Synchronous — try/catch
try {
    JSON.parse("invalid json");
} catch (err) {
    console.error(err.message);
}

// 2. Callback pattern — error-first callback
const fs = require("fs");
fs.readFile("file.txt", (err, data) => {
    if (err) {
        console.error("Failed:", err.message);
        return;
    }
    console.log(data.toString());
});

// 3. Promise — .catch()
fetch("/api")
    .then((res) => res.json())
    .catch((err) => console.error(err));

// 4. async/await — try/catch
async function getData() {
    try {
        const res = await fetch("/api");
        return await res.json();
    } catch (err) {
        console.error(err);
    }
}

// 5. Event emitter errors
const EventEmitter = require("events");
const emitter = new EventEmitter();
emitter.on("error", (err) => console.error("Emitter error:", err));
emitter.emit("error", new Error("Something broke"));

// 6. Uncaught exceptions & unhandled rejections (last resort)
process.on("uncaughtException", (err) => {
    console.error("Uncaught:", err);
    process.exit(1); // exit is recommended — state may be corrupted
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled rejection:", reason);
});
```

### Q: Why should you exit after `uncaughtException`?

An uncaught exception means the application is in an **undefined state**. Continuing could lead to data corruption, memory leaks, or security vulnerabilities. The correct approach: log the error, flush logs, and restart the process (e.g., via PM2 or Kubernetes).

---

## 28. Memory Leaks & Debugging

### Q: Common causes of memory leaks in Node.js?

1. **Global variables** — never garbage collected.
2. **Closures** holding references to large objects.
3. **Event listeners** not removed (especially in long-lived servers).
4. **Timers** (`setInterval`) not cleared.
5. **Caches** without eviction (unbounded Maps/objects).
6. **Circular references** in some edge cases.
7. **Forgotten streams** not properly closed/destroyed.

```javascript
// LEAK: Event listeners accumulate
class Leaky {
    constructor() {
        setInterval(() => this.doWork(), 1000); // never cleared
        process.on("data", this.handler);       // never removed
    }
}

// FIX: Clean up resources
class Fixed {
    constructor() {
        this.timer = setInterval(() => this.doWork(), 1000);
        this.handler = this.handleData.bind(this);
        process.on("data", this.handler);
    }

    destroy() {
        clearInterval(this.timer);
        process.off("data", this.handler);
    }
}

// LEAK: Unbounded cache
const cache = {};
function addToCache(key, value) {
    cache[key] = value; // grows forever!
}

// FIX: Use LRU cache with max size
class LRUCache {
    constructor(maxSize) {
        this.maxSize = maxSize;
        this.cache = new Map();
    }

    get(key) {
        if (!this.cache.has(key)) return undefined;
        const value = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, value); // move to end (most recent)
        return value;
    }

    set(key, value) {
        if (this.cache.has(key)) this.cache.delete(key);
        this.cache.set(key, value);
        if (this.cache.size > this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey); // evict oldest
        }
    }
}
```

### Debugging tools:

```bash
# Heap snapshot
node --inspect app.js          # Chrome DevTools
node --heapsnapshot-signal=SIGUSR2 app.js

# Memory usage
node -e "console.log(process.memoryUsage())"
# { rss, heapTotal, heapUsed, external, arrayBuffers }

# Profiling
node --prof app.js
node --prof-process isolate-*.log
```

---

## 29. Middleware Pattern (Express)

### Q: How does Express middleware work?

Middleware functions have access to `req`, `res`, and `next`. They execute in the **order they are registered**. Calling `next()` passes control to the next middleware.

```javascript
const express = require("express");
const app = express();

// Execution order: logger → auth → route handler → errorHandler

// 1. Logger middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    const start = Date.now();
    res.on("finish", () => {
        console.log(`${res.statusCode} - ${Date.now() - start}ms`);
    });
    next();
});

// 2. Auth middleware
function authenticate(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }
    try {
        req.user = verifyToken(token);
        next();
    } catch {
        res.status(401).json({ error: "Invalid token" });
    }
}

// 3. Route-specific middleware
app.get("/api/profile", authenticate, (req, res) => {
    res.json({ user: req.user });
});

// 4. Error-handling middleware (4 params!)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        error: err.message || "Internal Server Error",
    });
});
```

### Q: What's the difference between `app.use()` and `app.get()`?

- `app.use()` matches **all HTTP methods** and matches the **start** of the path.
- `app.get()` matches only GET and requires an **exact** path match.

```javascript
app.use("/api", middleware);      // matches /api, /api/users, /api/foo/bar
app.get("/api", handler);         // matches only GET /api (exact)
app.get("/api/users", handler);   // matches only GET /api/users (exact)
```

---

## 30. Security Best Practices

### Q: What security concerns should a Node.js backend address?

```javascript
// 1. SQL/NoSQL Injection — Use parameterized queries
// ❌ BAD
db.query(`SELECT * FROM users WHERE id = '${req.params.id}'`);
// ✅ GOOD
db.query("SELECT * FROM users WHERE id = $1", [req.params.id]);

// 2. XSS — Sanitize output, use Content-Security-Policy headers
const helmet = require("helmet");
app.use(helmet());

// 3. CSRF — Use tokens for state-changing requests
const csrf = require("csurf");
app.use(csrf({ cookie: true }));

// 4. Rate limiting
const rateLimit = require("express-rate-limit");
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// 5. Input validation
const Joi = require("joi");
const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(128).required(),
});

// 6. Secure headers (Helmet sets these)
// X-Content-Type-Options: nosniff
// X-Frame-Options: DENY
// Strict-Transport-Security: max-age=...

// 7. Never expose stack traces in production
app.use((err, req, res, next) => {
    res.status(500).json({
        error: process.env.NODE_ENV === "production"
            ? "Internal Server Error"
            : err.message,
    });
});

// 8. Secrets management — use env variables, never hardcode
const dbPassword = process.env.DB_PASSWORD;

// 9. Dependency auditing
// npm audit
// npm audit fix
```

---

## 31. Process & Environment

```javascript
// Process info
console.log(process.pid);          // current process ID
console.log(process.ppid);         // parent process ID
console.log(process.version);      // Node.js version
console.log(process.platform);     // 'linux', 'darwin', 'win32'
console.log(process.arch);         // 'x64', 'arm64'
console.log(process.cwd());        // current working directory
console.log(process.argv);         // command-line arguments

// Environment variables
console.log(process.env.NODE_ENV); // 'development', 'production'
console.log(process.env.PORT);

// Memory usage
const mem = process.memoryUsage();
console.log(`Heap Used: ${Math.round(mem.heapUsed / 1024 / 1024)} MB`);
console.log(`RSS: ${Math.round(mem.rss / 1024 / 1024)} MB`);

// CPU usage
const startUsage = process.cpuUsage();
// ... some work ...
const elapsed = process.cpuUsage(startUsage);
console.log(`User CPU: ${elapsed.user / 1000}ms`);
console.log(`System CPU: ${elapsed.system / 1000}ms`);

// Graceful shutdown
process.on("SIGTERM", async () => {
    console.log("SIGTERM received. Shutting down gracefully...");
    await server.close();
    await db.disconnect();
    process.exit(0);
});

process.on("SIGINT", async () => {
    console.log("SIGINT received (Ctrl+C)");
    process.exit(0);
});
```

---

## 32. Event Emitter

### Q: How does EventEmitter work? Implement one.

```javascript
const EventEmitter = require("events");

class OrderService extends EventEmitter {
    placeOrder(order) {
        console.log(`Order placed: ${order.id}`);
        this.emit("order:placed", order);
    }
}

const service = new OrderService();

service.on("order:placed", (order) => {
    console.log(`Sending confirmation email for order ${order.id}`);
});

service.on("order:placed", (order) => {
    console.log(`Updating inventory for order ${order.id}`);
});

service.once("order:placed", (order) => {
    console.log(`First order bonus for ${order.id}`); // fires only once
});

service.placeOrder({ id: "ORD-001", total: 99.99 });
service.placeOrder({ id: "ORD-002", total: 149.99 }); // "once" listener won't fire
```

### Q: Implement a simplified EventEmitter from scratch

```javascript
class MyEventEmitter {
    #listeners = new Map();

    on(event, fn) {
        if (!this.#listeners.has(event)) {
            this.#listeners.set(event, []);
        }
        this.#listeners.get(event).push(fn);
        return this;
    }

    off(event, fn) {
        const fns = this.#listeners.get(event);
        if (fns) {
            this.#listeners.set(event, fns.filter((f) => f !== fn && f._original !== fn));
        }
        return this;
    }

    once(event, fn) {
        const wrapper = (...args) => {
            fn.apply(this, args);
            this.off(event, wrapper);
        };
        wrapper._original = fn;
        return this.on(event, wrapper);
    }

    emit(event, ...args) {
        const fns = this.#listeners.get(event);
        if (!fns || fns.length === 0) return false;
        fns.slice().forEach((fn) => fn.apply(this, args));
        return true;
    }
}
```

---

## 33. File System & Path

```javascript
const fs = require("fs");
const fsPromises = require("fs/promises");
const path = require("path");

// Always use async in servers
const data = await fsPromises.readFile("config.json", "utf-8");
const parsed = JSON.parse(data);

await fsPromises.writeFile("output.json", JSON.stringify(parsed, null, 2));
await fsPromises.appendFile("log.txt", "New entry\n");

// Check existence
const exists = await fsPromises.access("file.txt").then(() => true).catch(() => false);

// Directory operations
await fsPromises.mkdir("logs/2024", { recursive: true });
const files = await fsPromises.readdir("./src", { recursive: true }); // Node 18.17+

// File stats
const stats = await fsPromises.stat("package.json");
console.log(stats.size);       // bytes
console.log(stats.isFile());   // true
console.log(stats.mtime);      // last modified time

// Watch for changes
const watcher = fs.watch("./src", { recursive: true }, (eventType, filename) => {
    console.log(`${eventType}: ${filename}`);
});

// Path utilities
path.join("/users", "alice", "docs", "file.txt");    // /users/alice/docs/file.txt
path.resolve("src", "index.js");                      // /absolute/path/to/src/index.js
path.basename("/users/alice/photo.png");               // photo.png
path.extname("photo.png");                             // .png
path.dirname("/users/alice/photo.png");                // /users/alice
path.parse("/users/alice/photo.png");
// { root: '/', dir: '/users/alice', base: 'photo.png', ext: '.png', name: 'photo' }
```

---

## 34. REST API Design & HTTP

### Q: What are RESTful API best practices?

```
GET    /api/v1/users          → List users (paginated)
GET    /api/v1/users/:id      → Get single user
POST   /api/v1/users          → Create user
PUT    /api/v1/users/:id      → Full update
PATCH  /api/v1/users/:id      → Partial update
DELETE /api/v1/users/:id      → Delete user

GET    /api/v1/users/:id/orders      → Nested resource
GET    /api/v1/users?role=admin&page=2&limit=20  → Filtering, pagination
```

**Best practices:**
- Use **nouns** for resources (not verbs): `/users` not `/getUsers`
- Use **HTTP status codes** correctly: 200, 201, 204, 400, 401, 403, 404, 409, 422, 500
- **Versioning**: `/api/v1/...`
- **Pagination**: `?page=2&limit=20` or cursor-based `?cursor=abc&limit=20`
- **Idempotency**: GET, PUT, DELETE should be idempotent
- **HATEOAS**: Include links to related resources (advanced)

```javascript
// Consistent response format
// Success
{ "data": { ... }, "meta": { "page": 1, "total": 100 } }

// Error
{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [...] } }
```

### Q: HTTP status codes you should know

| Code | Meaning | When to use |
|------|---------|-------------|
| 200 | OK | Successful GET/PUT/PATCH |
| 201 | Created | Successful POST (resource created) |
| 204 | No Content | Successful DELETE |
| 301 | Moved Permanently | URL changed permanently |
| 304 | Not Modified | Cached response is still valid |
| 400 | Bad Request | Invalid input/syntax |
| 401 | Unauthorized | Missing/invalid auth |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource / version conflict |
| 422 | Unprocessable | Valid syntax but semantic errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server failure |
| 502 | Bad Gateway | Upstream server error |
| 503 | Service Unavailable | Server overloaded / maintenance |

---

## 35. Database Patterns

### Q: What is connection pooling and why is it important?

Creating a new DB connection for every request is **expensive** (~20-50ms). A **pool** maintains a set of reusable connections.

```javascript
// PostgreSQL with connection pool
const { Pool } = require("pg");
const pool = new Pool({
    host: "localhost",
    port: 5432,
    database: "myapp",
    user: "admin",
    password: process.env.DB_PASSWORD,
    max: 20,                    // max connections in pool
    idleTimeoutMillis: 30000,   // close idle connections after 30s
    connectionTimeoutMillis: 2000,
});

async function getUser(id) {
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT * FROM users WHERE id = $1", [id]);
        return result.rows[0];
    } finally {
        client.release(); // return connection to pool
    }
}

// Transactions
async function transferFunds(fromId, toId, amount) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        await client.query("UPDATE accounts SET balance = balance - $1 WHERE id = $2", [amount, fromId]);
        await client.query("UPDATE accounts SET balance = balance + $1 WHERE id = $2", [amount, toId]);
        await client.query("COMMIT");
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
}
```

### Q: ORM vs Query Builder vs Raw SQL?

| Approach | Pros | Cons | Example |
|----------|------|------|---------|
| **Raw SQL** | Full control, best performance | Verbose, SQL injection risk if not careful | `pg`, `mysql2` |
| **Query Builder** | Composable, safe, close to SQL | Learning curve | Knex.js |
| **ORM** | Productive, model-driven | Abstraction leak, N+1 queries, magic | Prisma, TypeORM, Sequelize |

---

## 36. Caching Strategies

```javascript
// In-memory cache (single-process only)
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 300 }); // 5 min TTL

// Redis cache (distributed, multi-process)
const Redis = require("ioredis");
const redis = new Redis();

// Cache-Aside (Lazy Loading) — most common
async function getUser(id) {
    const cacheKey = `user:${id}`;

    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const user = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    await redis.set(cacheKey, JSON.stringify(user), "EX", 300);
    return user;
}

// Write-Through — write to cache AND DB together
async function updateUser(id, data) {
    const user = await db.query("UPDATE users SET ... WHERE id = $1 RETURNING *", [id]);
    await redis.set(`user:${id}`, JSON.stringify(user), "EX", 300);
    return user;
}

// Cache Invalidation on mutation
async function deleteUser(id) {
    await db.query("DELETE FROM users WHERE id = $1", [id]);
    await redis.del(`user:${id}`);
}
```

| Strategy | Reads | Writes | Consistency |
|----------|-------|--------|-------------|
| Cache-Aside | Fast (if cached) | Write to DB, invalidate cache | Eventual |
| Write-Through | Fast | Write to cache + DB | Strong |
| Write-Behind | Fast | Write to cache, async DB write | Weak |
| Read-Through | Fast | Cache handles DB reads | Eventual |

---

## 37. Rate Limiting & Backpressure

```javascript
// Token Bucket rate limiter (from scratch)
class TokenBucket {
    constructor(capacity, refillRate) {
        this.capacity = capacity;
        this.tokens = capacity;
        this.refillRate = refillRate; // tokens per second
        this.lastRefill = Date.now();
    }

    consume(tokens = 1) {
        this.refill();
        if (this.tokens >= tokens) {
            this.tokens -= tokens;
            return true;
        }
        return false;
    }

    refill() {
        const now = Date.now();
        const elapsed = (now - this.lastRefill) / 1000;
        this.tokens = Math.min(this.capacity, this.tokens + elapsed * this.refillRate);
        this.lastRefill = now;
    }
}

// Sliding window rate limiter with Redis
async function slidingWindowRateLimit(userId, maxRequests, windowMs) {
    const key = `ratelimit:${userId}`;
    const now = Date.now();
    const windowStart = now - windowMs;

    const multi = redis.multi();
    multi.zremrangebyscore(key, 0, windowStart); // remove old entries
    multi.zadd(key, now, `${now}`);              // add current request
    multi.zcard(key);                             // count requests in window
    multi.expire(key, Math.ceil(windowMs / 1000));

    const results = await multi.exec();
    const requestCount = results[2][1];

    return requestCount <= maxRequests;
}
```

---

## 38. Logging & Monitoring

```javascript
// Structured logging with Winston
const winston = require("winston");

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: "user-service" },
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.File({ filename: "combined.log" }),
    ],
});

// Request logging middleware
function requestLogger(req, res, next) {
    const start = Date.now();
    res.on("finish", () => {
        logger.info("HTTP Request", {
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            duration: Date.now() - start,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
        });
    });
    next();
}

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: new Date().toISOString(),
    });
});
```

---

## 39. Testing

```javascript
// Jest — unit test example
describe("UserService", () => {
    let userService;
    let mockRepo;

    beforeEach(() => {
        mockRepo = {
            findById: jest.fn(),
            save: jest.fn(),
        };
        userService = new UserService(mockRepo);
    });

    it("should return user by id", async () => {
        const mockUser = { id: 1, name: "Alice" };
        mockRepo.findById.mockResolvedValue(mockUser);

        const user = await userService.getUser(1);

        expect(user).toEqual(mockUser);
        expect(mockRepo.findById).toHaveBeenCalledWith(1);
        expect(mockRepo.findById).toHaveBeenCalledTimes(1);
    });

    it("should throw when user not found", async () => {
        mockRepo.findById.mockResolvedValue(null);

        await expect(userService.getUser(999)).rejects.toThrow("User not found");
    });
});

// Integration test with supertest
const request = require("supertest");
const app = require("../app");

describe("POST /api/users", () => {
    it("should create a user", async () => {
        const res = await request(app)
            .post("/api/users")
            .send({ name: "Alice", email: "alice@example.com" })
            .expect(201);

        expect(res.body.data).toHaveProperty("id");
        expect(res.body.data.name).toBe("Alice");
    });

    it("should return 400 for invalid input", async () => {
        await request(app)
            .post("/api/users")
            .send({ name: "" })
            .expect(400);
    });
});
```

---

## 40. Deployment & Scaling

### Q: How to scale a Node.js application?

```
                   ┌──────────────┐
                   │ Load Balancer│  (Nginx, ALB, HAProxy)
                   │  (Layer 7)   │
                   └──────┬───────┘
                          │
            ┌─────────────┼─────────────┐
            │             │             │
      ┌─────▼─────┐ ┌────▼──────┐ ┌───▼───────┐
      │ Node (PM2) │ │ Node (PM2)│ │ Node (PM2)│   (Horizontal scaling)
      │ Cluster x4 │ │ Cluster x4│ │ Cluster x4│   (Vertical: cluster mode)
      └─────┬─────┘ └────┬──────┘ └───┬───────┘
            │             │             │
            └─────────────┼─────────────┘
                          │
                   ┌──────▼───────┐
                   │  Redis Cache  │
                   │  + Sessions   │
                   └──────┬───────┘
                          │
                   ┌──────▼───────┐
                   │   Database    │
                   │   (Primary +  │
                   │    Replicas)  │
                   └──────────────┘
```

**Scaling strategies:**
1. **Vertical** — cluster mode (PM2/cluster module) to use all CPU cores.
2. **Horizontal** — multiple servers behind a load balancer.
3. **Stateless design** — store sessions in Redis, not in memory.
4. **Microservices** — split into smaller, independently deployable services.
5. **Message queues** — decouple services with RabbitMQ, SQS, or Redis Streams.
6. **CDN** — offload static assets.
7. **Database read replicas** — distribute read load.

```bash
# PM2 production deployment
pm2 start app.js -i max    # cluster mode, one process per CPU
pm2 reload app              # zero-downtime restart
pm2 monit                   # monitor CPU/memory
```

---

# TYPESCRIPT

---

## 41. Type System Fundamentals

### Q: What is TypeScript's type system?

TypeScript uses a **structural type system** (duck typing) — types are compatible if their structures match, regardless of name.

```typescript
interface Point {
    x: number;
    y: number;
}

interface Coordinate {
    x: number;
    y: number;
}

const p: Point = { x: 1, y: 2 };
const c: Coordinate = p; // ✅ Works! Same structure = compatible

// Excess property checking (only on object literals)
const p2: Point = { x: 1, y: 2, z: 3 }; // ❌ Error: 'z' doesn't exist
const obj = { x: 1, y: 2, z: 3 };
const p3: Point = obj; // ✅ OK! No excess check on variables
```

### Q: What are the basic types in TypeScript?

```typescript
// Primitives
let str: string = "hello";
let num: number = 42;
let bool: boolean = true;
let big: bigint = 100n;
let sym: symbol = Symbol("id");
let undef: undefined = undefined;
let nul: null = null;

// Object types
let arr: number[] = [1, 2, 3];
let arr2: Array<string> = ["a", "b"];
let tuple: [string, number] = ["age", 30];
let obj: { name: string; age: number } = { name: "Alice", age: 30 };

// Special types
let anything: any = "no type checking";     // escape hatch, avoid
let unknown1: unknown = "type-safe any";    // must narrow before use
let nothing: never = (() => { throw new Error() })(); // impossible type
let empty: void = undefined;                // no return value

// Literal types
let direction: "north" | "south" | "east" | "west" = "north";
let httpStatus: 200 | 400 | 500 = 200;
```

---

## 42. Interfaces vs Types

| Feature | `interface` | `type` |
|---------|-----------|--------|
| Object shapes | ✅ | ✅ |
| Extend/inherit | `extends` | `&` (intersection) |
| Union types | ❌ | ✅ `string \| number` |
| Mapped types | ❌ | ✅ |
| Declaration merging | ✅ (auto-merge) | ❌ |
| Primitives, tuples, unions | ❌ | ✅ |
| Computed properties | ❌ | ✅ |
| `implements` in class | ✅ | ✅ |

```typescript
// Interface — best for object shapes and public APIs
interface User {
    id: number;
    name: string;
}

interface Admin extends User {
    permissions: string[];
}

// Declaration merging (interfaces only)
interface User {
    email: string; // automatically merged with above
}
// Now User = { id, name, email }

// Type alias — best for unions, intersections, complex types
type ID = string | number;
type Status = "active" | "inactive" | "banned";
type Result<T> = { success: true; data: T } | { success: false; error: string };

type Admin2 = User & { permissions: string[] }; // intersection

// Guideline: use `interface` for objects/classes, `type` for everything else
```

---

## 43. Generics

### Q: What are generics and why are they useful?

Generics let you write reusable code that works with **any type** while preserving type safety.

```typescript
// Generic function
function identity<T>(value: T): T {
    return value;
}

identity<string>("hello"); // type: string
identity(42);              // type: number (inferred)

// Generic constraints
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

const user = { name: "Alice", age: 30 };
getProperty(user, "name"); // string
getProperty(user, "age");  // number
// getProperty(user, "email"); // ❌ Error: "email" not in keyof User

// Generic class
class ApiResponse<T> {
    constructor(
        public data: T,
        public statusCode: number,
        public message: string
    ) {}

    isSuccess(): boolean {
        return this.statusCode >= 200 && this.statusCode < 300;
    }
}

const userResponse = new ApiResponse<User>({ id: 1, name: "Alice" }, 200, "OK");
// userResponse.data is typed as User

// Default generic types
interface PaginatedResult<T, M = { page: number; total: number }> {
    data: T[];
    meta: M;
}
```

---

## 44. Utility Types

```typescript
interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
}

// Partial<T> — all properties optional
type UpdateUser = Partial<User>;
// { id?: number; name?: string; email?: string; ... }

// Required<T> — all properties required
type FullUser = Required<Partial<User>>;

// Pick<T, K> — select specific properties
type UserPreview = Pick<User, "id" | "name">;
// { id: number; name: string }

// Omit<T, K> — exclude specific properties
type SafeUser = Omit<User, "password">;
// { id: number; name: string; email: string; createdAt: Date }

// Record<K, V> — construct object type
type Roles = Record<"admin" | "user" | "guest", string[]>;
// { admin: string[]; user: string[]; guest: string[] }

// Readonly<T> — all properties readonly
type FrozenUser = Readonly<User>;

// ReturnType<T> — extract return type of function
function createUser() { return { id: 1, name: "Alice" }; }
type CreatedUser = ReturnType<typeof createUser>;
// { id: number; name: string }

// Parameters<T> — extract parameter types as tuple
type CreateUserParams = Parameters<typeof createUser>;
// []

// Exclude<T, U> — remove types from union
type NonNull = Exclude<string | number | null | undefined, null | undefined>;
// string | number

// Extract<T, U> — extract types from union
type Strings = Extract<string | number | boolean, string | boolean>;
// string | boolean

// NonNullable<T>
type Safe = NonNullable<string | null | undefined>; // string

// Awaited<T> — unwrap Promise type
type ResolvedData = Awaited<Promise<Promise<string>>>; // string
```

---

## 45. Union, Intersection & Discriminated Unions

```typescript
// Union — A OR B
type StringOrNumber = string | number;

// Intersection — A AND B (combine properties)
type Employee = { name: string; department: string };
type Manager = Employee & { reports: Employee[] };

// Discriminated Unions — the MOST important pattern for backend TS
// Each variant has a common "discriminant" property with a literal type

type ApiResult<T> =
    | { status: "success"; data: T; timestamp: Date }
    | { status: "error"; error: string; code: number }
    | { status: "loading" };

function handleResult(result: ApiResult<User>) {
    switch (result.status) {
        case "success":
            console.log(result.data.name); // TS knows 'data' exists here
            break;
        case "error":
            console.log(result.error);     // TS knows 'error' exists here
            break;
        case "loading":
            console.log("Loading...");
            break;
    }
}

// Exhaustive checking with 'never'
function assertNever(x: never): never {
    throw new Error(`Unexpected value: ${x}`);
}

function handleStatus(result: ApiResult<User>) {
    switch (result.status) {
        case "success": return result.data;
        case "error": throw new Error(result.error);
        case "loading": return null;
        default: return assertNever(result); // compile error if a case is missing
    }
}
```

---

## 46. Type Guards & Narrowing

```typescript
// typeof guard
function processValue(value: string | number) {
    if (typeof value === "string") {
        console.log(value.toUpperCase()); // TS knows it's string
    } else {
        console.log(value.toFixed(2));    // TS knows it's number
    }
}

// instanceof guard
function handleError(err: Error | string) {
    if (err instanceof Error) {
        console.log(err.stack);
    } else {
        console.log(err);
    }
}

// 'in' operator guard
interface Bird { fly(): void; layEggs(): void; }
interface Fish { swim(): void; layEggs(): void; }

function move(animal: Bird | Fish) {
    if ("fly" in animal) {
        animal.fly();   // Bird
    } else {
        animal.swim();  // Fish
    }
}

// Custom type guard (type predicate)
interface Admin { role: "admin"; permissions: string[]; }
interface User { role: "user"; name: string; }

function isAdmin(person: Admin | User): person is Admin {
    return person.role === "admin";
}

function greet(person: Admin | User) {
    if (isAdmin(person)) {
        console.log(`Admin with permissions: ${person.permissions}`);
    } else {
        console.log(`User: ${person.name}`);
    }
}

// Assertion function (throws if false)
function assertIsString(value: unknown): asserts value is string {
    if (typeof value !== "string") {
        throw new TypeError(`Expected string, got ${typeof value}`);
    }
}

function process(input: unknown) {
    assertIsString(input);
    console.log(input.toUpperCase()); // TS knows it's string after assertion
}
```

---

## 47. Enums & Const Assertions

```typescript
// String enum
enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
}

// Const enum (inlined at compile time — no runtime object)
const enum Direction {
    Up = "UP",
    Down = "DOWN",
}

// 'as const' — immutable and narrow types
const config = {
    api: "https://api.example.com",
    timeout: 5000,
    retries: 3,
} as const;
// type: { readonly api: "https://api.example.com"; readonly timeout: 5000; readonly retries: 3 }

// Using 'as const' instead of enum (often preferred)
const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
} as const;

type HttpStatus = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];
// 200 | 201 | 404 | 500
```

### Q: Why do many TS projects avoid enums?

1. Enums generate runtime code (increase bundle size).
2. Numeric enums have reverse mappings that can be confusing.
3. `as const` objects + union types achieve the same result with less magic.
4. Enums don't tree-shake well.

---

## 48. Declaration Merging

```typescript
// Interface merging — same name interfaces auto-merge
interface Box {
    height: number;
    width: number;
}

interface Box {
    depth: number;     // merged: Box now has height, width, AND depth
}

const box: Box = { height: 1, width: 2, depth: 3 }; // all three required

// Module augmentation (extending third-party types)
// e.g., adding a 'user' property to Express Request
declare module "express-serve-static-core" {
    interface Request {
        user?: {
            id: string;
            role: string;
        };
    }
}

// Now req.user is recognized by TypeScript everywhere
```

---

## 49. Decorators

```typescript
// Class decorator (experimental — enabled with experimentalDecorators)
function Controller(basePath: string) {
    return function (target: Function) {
        Reflect.defineMetadata("basePath", basePath, target);
    };
}

// Method decorator
function Log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = function (...args: any[]) {
        console.log(`Calling ${propertyKey} with:`, args);
        const result = original.apply(this, args);
        console.log(`${propertyKey} returned:`, result);
        return result;
    };
    return descriptor;
}

// Property decorator
function MinLength(min: number) {
    return function (target: any, propertyKey: string) {
        let value: string;
        Object.defineProperty(target, propertyKey, {
            get: () => value,
            set: (newValue: string) => {
                if (newValue.length < min) {
                    throw new Error(`${propertyKey} must be at least ${min} chars`);
                }
                value = newValue;
            },
        });
    };
}

class UserService {
    @Log
    getUser(id: number): string {
        return `User_${id}`;
    }
}
```

> **Note**: TC39 Stage 3 decorators (2023+) have a different syntax. The `experimentalDecorators` flag in TypeScript uses the older Stage 2 proposal used by NestJS, Angular, etc.

---

## 50. Conditional Types & `infer`

```typescript
// Basic conditional type
type IsString<T> = T extends string ? "yes" : "no";
type A = IsString<string>;  // "yes"
type B = IsString<number>;  // "no"

// Distributive conditional types (distributes over unions)
type ToArray<T> = T extends any ? T[] : never;
type C = ToArray<string | number>; // string[] | number[]

// 'infer' — extract types from within other types
type ReturnOf<T> = T extends (...args: any[]) => infer R ? R : never;
type D = ReturnOf<() => string>; // string
type E = ReturnOf<(x: number) => boolean>; // boolean

// Extract Promise result type
type UnwrapPromise<T> = T extends Promise<infer U> ? UnwrapPromise<U> : T;
type F = UnwrapPromise<Promise<Promise<string>>>; // string

// Extract array element type
type ElementOf<T> = T extends (infer E)[] ? E : never;
type G = ElementOf<string[]>; // string

// Practical: extract route params from a path string
type ExtractParams<T extends string> =
    T extends `${string}:${infer Param}/${infer Rest}`
        ? { [K in Param | keyof ExtractParams<Rest>]: string }
        : T extends `${string}:${infer Param}`
            ? { [K in Param]: string }
            : {};

type Params = ExtractParams<"/users/:userId/posts/:postId">;
// { userId: string; postId: string }
```

---

## 51. Mapped Types

```typescript
// Basic mapped type
type Readonly2<T> = {
    readonly [K in keyof T]: T[K];
};

type Optional<T> = {
    [K in keyof T]?: T[K];
};

// Key remapping (TS 4.1+)
type Getters<T> = {
    [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface Person {
    name: string;
    age: number;
}

type PersonGetters = Getters<Person>;
// { getName: () => string; getAge: () => number }

// Filter properties by type
type OnlyStrings<T> = {
    [K in keyof T as T[K] extends string ? K : never]: T[K];
};

type StringProps = OnlyStrings<{ name: string; age: number; email: string }>;
// { name: string; email: string }

// Make specific properties required
type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

type UserWithEmail = RequireFields<Partial<User>, "email">;
```

---

## 52. Template Literal Types

```typescript
// Basic template literals
type Greeting = `Hello, ${string}`;
type EventName = `${"click" | "focus" | "blur"}Handler`;
// "clickHandler" | "focusHandler" | "blurHandler"

// CSS-like values
type CSSValue = `${number}${"px" | "em" | "rem" | "%"}`;
const width: CSSValue = "100px";  // ✅
// const bad: CSSValue = "100vw";  // ❌

// API route builder
type Method = "GET" | "POST" | "PUT" | "DELETE";
type Version = "v1" | "v2";
type Resource = "users" | "orders" | "products";
type APIRoute = `/${Version}/${Resource}`;
// "/v1/users" | "/v1/orders" | "/v1/products" | "/v2/users" | ...

// Intrinsic string manipulation types
type Upper = Uppercase<"hello">;     // "HELLO"
type Lower = Lowercase<"HELLO">;     // "hello"
type Cap = Capitalize<"hello">;      // "Hello"
type Uncap = Uncapitalize<"Hello">;  // "hello"
```

---

## 53. Module Augmentation

```typescript
// Augmenting Express types for auth middleware
import "express";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                roles: string[];
            };
            requestId?: string;
        }
    }
}

// Augmenting a third-party module
declare module "jsonwebtoken" {
    export interface JwtPayload {
        userId: string;
        role: "admin" | "user";
    }
}

// Augmenting global types
declare global {
    interface Array<T> {
        customGroupBy(key: keyof T): Record<string, T[]>;
    }
}
```

---

## 54. `any` vs `unknown` vs `never`

| Type | Meaning | Assignability | Use case |
|------|---------|--------------|---------|
| `any` | Opt out of type checking | Assign to/from anything | Migration, escape hatch |
| `unknown` | Type-safe "any" | Assign anything TO it, but must narrow BEFORE using | External data, user input |
| `never` | Impossible / bottom type | Nothing assignable to it | Exhaustive checks, throw functions |

```typescript
// any — dangerous, bypasses all checks
let dangerous: any = "hello";
dangerous.nonExistent.method(); // No error at compile time! Runtime crash.

// unknown — safe, must narrow before use
let safe: unknown = "hello";
// safe.toUpperCase(); // ❌ Error: 'unknown' type
if (typeof safe === "string") {
    safe.toUpperCase(); // ✅ narrowed to string
}

// never — used for exhaustive checks and functions that never return
function throwError(msg: string): never {
    throw new Error(msg);
}

type Shape = "circle" | "square";
function getArea(shape: Shape): number {
    switch (shape) {
        case "circle": return Math.PI;
        case "square": return 1;
        default:
            const _exhaustive: never = shape; // ❌ Error if a case is missing
            return _exhaustive;
    }
}
```

---

## 55. Strict Mode Flags

```jsonc
// tsconfig.json
{
    "compilerOptions": {
        "strict": true, // enables ALL below:

        "strictNullChecks": true,       // null/undefined not assignable to other types
        "strictFunctionTypes": true,    // stricter function type checking
        "strictBindCallApply": true,    // type-check bind/call/apply
        "strictPropertyInitialization": true, // class properties must be initialized
        "noImplicitAny": true,          // error on implicit 'any'
        "noImplicitThis": true,         // error on implicit 'this' type
        "alwaysStrict": true,           // emit "use strict" in every file
        "useUnknownInCatchVariables": true, // catch(e) → e is 'unknown' not 'any'

        // Additional strict-ish flags (not part of 'strict'):
        "noUncheckedIndexedAccess": true,  // arr[0] is T | undefined
        "exactOptionalPropertyTypes": true, // { x?: string } ≠ { x: string | undefined }
        "noImplicitReturns": true,
        "noFallthroughCasesInSwitch": true,
        "noImplicitOverride": true         // require 'override' keyword
    }
}
```

---

# OUTPUT-BASED QUESTIONS

---

## 56. Output Questions — JavaScript

### Q1: Variable Hoisting & Scope

```javascript
var x = 1;
function foo() {
    console.log(x); // ?
    var x = 2;
    console.log(x); // ?
}
foo();
console.log(x);     // ?
```

<details>
<summary>Answer</summary>

```
undefined
2
1
```

**Explanation:** Inside `foo()`, `var x` is hoisted to the top of the function. So the first `console.log(x)` sees the local `x` which is `undefined` (hoisted but not yet assigned). After `x = 2`, it prints `2`. The outer `x` is unaffected.

</details>

### Q2: typeof Quirks

```javascript
console.log(typeof undefined);  // ?
console.log(typeof null);       // ?
console.log(typeof NaN);        // ?
console.log(typeof []);         // ?
console.log(typeof {});         // ?
console.log(typeof function(){}); // ?
```

<details>
<summary>Answer</summary>

```
"undefined"
"object"      ← famous JS bug (null is NOT an object)
"number"      ← NaN stands for "Not a Number" but its type IS number
"object"
"object"
"function"
```

</details>

### Q3: Comparison Madness

```javascript
console.log([] == false);     // ?
console.log([] == ![]);       // ?
console.log("" == false);     // ?
console.log(null == undefined); // ?
console.log(null === undefined); // ?
console.log(NaN === NaN);    // ?
```

<details>
<summary>Answer</summary>

```
true    — [] → "" → 0, false → 0, 0 == 0
true    — ![] is false, [] → 0, false → 0
true    — "" → 0, false → 0
true    — special rule: null == undefined is true
false   — different types
false   — NaN is not equal to anything
```

</details>

### Q4: Object Reference

```javascript
let a = { name: "Alice" };
let b = a;
b.name = "Bob";
console.log(a.name); // ?

let c = { name: "Charlie" };
let d = c;
d = { name: "Dave" };
console.log(c.name); // ?
```

<details>
<summary>Answer</summary>

```
"Bob"
"Charlie"
```

**Explanation:** `b = a` makes both point to the same object. Modifying `b.name` affects `a`. But `d = { name: "Dave" }` reassigns `d` to a **new object**; `c` still points to the original.

</details>

### Q5: Rest & Spread

```javascript
function test(...args) {
    console.log(typeof args);  // ?
    console.log(Array.isArray(args)); // ?
}
test(1, 2, 3);

function test2() {
    console.log(typeof arguments);     // ?
    console.log(Array.isArray(arguments)); // ?
}
test2(1, 2, 3);
```

<details>
<summary>Answer</summary>

```
"object"
true        ← rest params give a real Array
"object"
false       ← arguments is an array-LIKE object, not a real Array
```

</details>

### Q6: String Immutability

```javascript
let str = "hello";
str[0] = "H";
console.log(str); // ?

let str2 = "hello";
str2 = "H" + str2.slice(1);
console.log(str2); // ?
```

<details>
<summary>Answer</summary>

```
"hello"     ← strings are immutable, individual characters can't be changed
"Hello"     ← creates a new string entirely
```

</details>

### Q7: Array Methods

```javascript
const arr = [1, 2, 3, 4, 5];

console.log(arr.slice(1, 3));  // ?
console.log(arr);              // ?

console.log(arr.splice(1, 2)); // ?
console.log(arr);              // ?
```

<details>
<summary>Answer</summary>

```
[2, 3]            ← slice returns new array, does NOT mutate
[1, 2, 3, 4, 5]  ← original unchanged
[2, 3]            ← splice returns removed elements
[1, 4, 5]         ← original IS mutated
```

</details>

### Q8: Short-circuit Evaluation

```javascript
console.log(0 || "hello");       // ?
console.log(0 ?? "hello");       // ?
console.log("" || "default");    // ?
console.log("" ?? "default");    // ?
console.log(null || "fallback"); // ?
console.log(null ?? "fallback"); // ?
console.log(false || true);      // ?
console.log(false ?? true);      // ?
```

<details>
<summary>Answer</summary>

```
"hello"       ← || returns first truthy (0 is falsy)
"hello"       ← ?? returns right if left is null/undefined (0 is NOT nullish)

Wait — correction:
0 ?? "hello" → 0     ← ?? only triggers on null/undefined, 0 is NOT nullish!
```

Corrected output:

```
"hello"       ← 0 is falsy
0             ← 0 is NOT null/undefined, so ?? returns 0
"default"     ← "" is falsy
""            ← "" is NOT null/undefined
"fallback"    ← null is both falsy and nullish
"fallback"    ← null IS nullish
true          ← false is falsy
false         ← false is NOT null/undefined
```

**Key**: `||` checks **falsy** (0, "", false, null, undefined, NaN). `??` only checks **nullish** (null, undefined).

</details>

---

## 57. Output Questions — Promises & async/await

### Q9: Promise Execution Order

```javascript
console.log("1");

const p = new Promise((resolve) => {
    console.log("2");
    resolve("3");
    console.log("4");
});

p.then((val) => console.log(val));

console.log("5");
```

<details>
<summary>Answer</summary>

```
1
2
4
5
3
```

**Explanation:** The Promise executor runs **synchronously**. `resolve("3")` doesn't stop execution — `console.log("4")` runs next. `.then()` is a microtask, executed after all sync code (`"5"`).

</details>

### Q10: Promise Chain

```javascript
Promise.resolve(1)
    .then((x) => x + 1)
    .then((x) => { throw new Error("fail"); })
    .then((x) => console.log("A:", x))
    .catch((err) => {
        console.log("B:", err.message);
        return 10;
    })
    .then((x) => console.log("C:", x));
```

<details>
<summary>Answer</summary>

```
B: fail
C: 10
```

**Explanation:** The `throw` skips the next `.then` (A) and goes to `.catch`. The `.catch` returns `10`, which becomes the resolved value for the next `.then` (C).

</details>

### Q11: async/await vs .then Ordering

```javascript
async function foo() {
    console.log("foo start");
    const result = await Promise.resolve("foo result");
    console.log(result);
    console.log("foo end");
}

console.log("script start");
foo();
console.log("script end");
```

<details>
<summary>Answer</summary>

```
script start
foo start
script end
foo result
foo end
```

**Explanation:** `foo()` runs synchronously until the first `await`. The `await` pauses `foo` and returns control to the caller. `"script end"` prints. Then the microtask resolves and `foo` resumes.

</details>

### Q12: Promise.all Failure

```javascript
const p1 = new Promise((res) => setTimeout(() => res("p1"), 100));
const p2 = new Promise((_, rej) => setTimeout(() => rej("p2 error"), 50));
const p3 = new Promise((res) => setTimeout(() => res("p3"), 200));

Promise.all([p1, p2, p3])
    .then((results) => console.log("Success:", results))
    .catch((err) => console.log("Error:", err));
```

<details>
<summary>Answer</summary>

```
Error: p2 error
```

**Explanation:** `Promise.all` rejects as soon as ANY promise rejects. `p2` rejects at 50ms, before `p1` and `p3` resolve.

</details>

### Q13: Return in .then vs throw in .then

```javascript
Promise.resolve("start")
    .then((val) => {
        console.log(val);
        return Promise.reject("rejected");
    })
    .then((val) => console.log("then:", val))
    .catch((err) => console.log("catch:", err))
    .then((val) => console.log("after catch:", val));
```

<details>
<summary>Answer</summary>

```
start
catch: rejected
after catch: undefined
```

**Explanation:** Returning `Promise.reject` causes the chain to skip to `.catch`. The `.catch` doesn't return anything, so the next `.then` receives `undefined`.

</details>

### Q14: Microtask Nesting

```javascript
Promise.resolve()
    .then(() => {
        console.log("then1");
        Promise.resolve().then(() => console.log("then1-inner"));
    })
    .then(() => console.log("then2"));
```

<details>
<summary>Answer</summary>

```
then1
then1-inner
then2
```

**Explanation:** After `then1` executes, `then1-inner` is queued as a microtask. `then2` is also queued (as the next chain step). But `then1-inner` was queued first (during `then1`'s execution), so it runs before `then2`.

</details>

---

## 58. Output Questions — Event Loop & Timers

### Q15: setTimeout vs Promise vs Sync

```javascript
console.log("A");

setTimeout(() => console.log("B"), 0);

Promise.resolve().then(() => console.log("C"));

setTimeout(() => console.log("D"), 0);

Promise.resolve().then(() => console.log("E"));

console.log("F");
```

<details>
<summary>Answer</summary>

```
A
F
C
E
B
D
```

**Explanation:** Sync (A, F) → Microtasks (C, E) → Macrotasks (B, D).

</details>

### Q16: Nested setTimeout

```javascript
setTimeout(() => {
    console.log("timeout1");
    Promise.resolve().then(() => console.log("promise inside timeout"));
}, 0);

setTimeout(() => {
    console.log("timeout2");
}, 0);

Promise.resolve().then(() => {
    console.log("promise1");
    setTimeout(() => console.log("timeout inside promise"), 0);
});
```

<details>
<summary>Answer</summary>

```
promise1
timeout1
promise inside timeout
timeout2
timeout inside promise
```

**Explanation:**
1. Microtask: `promise1` runs, schedules "timeout inside promise".
2. Macrotask: `timeout1` runs, schedules microtask "promise inside timeout".
3. Microtask: `promise inside timeout` runs.
4. Macrotask: `timeout2` runs.
5. Macrotask: `timeout inside promise` runs.

</details>

### Q17: process.nextTick vs setImmediate (Node.js)

```javascript
setImmediate(() => console.log("setImmediate"));
process.nextTick(() => console.log("nextTick"));
Promise.resolve().then(() => console.log("promise"));
setTimeout(() => console.log("setTimeout"), 0);
console.log("sync");
```

<details>
<summary>Answer</summary>

```
sync
nextTick
promise
setTimeout (or setImmediate — order between these two is non-deterministic at top level)
setImmediate (or setTimeout)
```

**Guaranteed:** sync → nextTick → promise. Then setTimeout and setImmediate race (non-deterministic at the top level).

</details>

### Q18: setTimeout Accuracy

```javascript
const start = Date.now();

setTimeout(() => {
    console.log("Elapsed:", Date.now() - start, "ms");
}, 100);

// Heavy sync work
for (let i = 0; i < 1e9; i++) {} // blocks for ~1-2 seconds

console.log("Loop done at:", Date.now() - start, "ms");
```

<details>
<summary>Answer</summary>

```
Loop done at: ~1500 ms  (depends on CPU)
Elapsed: ~1500 ms       (NOT 100ms!)
```

**Explanation:** `setTimeout(fn, 100)` means "no sooner than 100ms." The callback can't run until the call stack is clear. The blocking loop prevents the event loop from checking timers.

</details>

---

## 59. Output Questions — `this` & Closures

### Q19: `this` in Arrow vs Regular

```javascript
const obj = {
    name: "Alice",
    regular: function () {
        console.log("regular:", this.name);
    },
    arrow: () => {
        console.log("arrow:", this.name);
    },
    delayed: function () {
        setTimeout(function () {
            console.log("delayed regular:", this.name);
        }, 0);
        setTimeout(() => {
            console.log("delayed arrow:", this.name);
        }, 0);
    },
};

obj.regular();
obj.arrow();
obj.delayed();
```

<details>
<summary>Answer</summary>

```
regular: Alice
arrow: undefined        (arrow 'this' is from enclosing scope — global/module)
delayed regular: undefined  (regular function in setTimeout loses 'this')
delayed arrow: Alice        (arrow captures 'this' from delayed's scope = obj)
```

</details>

### Q20: Closure in Loop

```javascript
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log("var:", i), 0);
}

for (let j = 0; j < 3; j++) {
    setTimeout(() => console.log("let:", j), 0);
}
```

<details>
<summary>Answer</summary>

```
var: 3
var: 3
var: 3
let: 0
let: 1
let: 2
```

**Explanation:** `var` is function-scoped — all 3 callbacks share the same `i`, which is `3` after the loop. `let` is block-scoped — each iteration creates a new binding.

</details>

### Q21: IIFE and Closures

```javascript
var result = [];
for (var i = 0; i < 3; i++) {
    result.push(function () {
        return i;
    });
}
console.log(result[0]()); // ?
console.log(result[1]()); // ?
console.log(result[2]()); // ?
```

<details>
<summary>Answer</summary>

```
3
3
3
```

All functions close over the **same** `i` (which is `3` after the loop).

**Fix with IIFE:**

```javascript
for (var i = 0; i < 3; i++) {
    result.push(
        (function (j) {
            return function () { return j; };
        })(i)
    );
}
// result[0]() → 0, result[1]() → 1, result[2]() → 2
```

</details>

### Q22: Tricky `this` with method extraction

```javascript
class Counter {
    count = 0;

    increment() {
        this.count++;
    }

    incrementArrow = () => {
        this.count++;
    };
}

const c = new Counter();

const inc = c.increment;
const incArrow = c.incrementArrow;

try { inc(); } catch (e) { console.log("A:", e.message); }
incArrow();
console.log("B:", c.count);
```

<details>
<summary>Answer</summary>

```
A: Cannot read properties of undefined (reading 'count')
B: 1
```

**Explanation:** Extracting `increment` loses `this` (it becomes `undefined` in strict mode). The arrow function `incrementArrow` keeps `this` bound to the instance.

</details>

---

## 60. Output Questions — TypeScript

### Q23: Type Narrowing

```typescript
function process(value: string | number | null) {
    if (value) {
        console.log(typeof value); // What types are possible here?
    } else {
        console.log(typeof value); // What types are possible here?
    }
}

process("hello");
process(42);
process(0);
process("");
process(null);
```

<details>
<summary>Answer</summary>

```
string    (for "hello" — truthy)
number    (for 42 — truthy)
number    (for 0 — falsy! Goes to else branch)
string    (for "" — falsy! Goes to else branch)
object    (for null — typeof null is "object")
```

**Trap:** `if (value)` eliminates `null` but also eliminates `0` and `""` — which are valid values! Use `if (value !== null)` for safer narrowing.

</details>

### Q24: Interface Merging

```typescript
interface Config {
    host: string;
}

interface Config {
    port: number;
}

interface Config {
    host: string; // re-declaring same type is OK
    debug: boolean;
}

const config: Config = ???  // What fields are required?
```

<details>
<summary>Answer</summary>

All three declarations merge. The required fields are:
```typescript
const config: Config = {
    host: "localhost",   // from first & third
    port: 3000,         // from second
    debug: true,        // from third
};
```

</details>

### Q25: Readonly Depth

```typescript
const user = {
    name: "Alice",
    address: {
        city: "NYC",
    },
} as const;

user.name = "Bob";        // ?
user.address.city = "LA"; // ?
user.address = {};         // ?
```

<details>
<summary>Answer</summary>

All three lines produce TypeScript **compile errors**.

`as const` makes the entire object deeply readonly:
- `user.name` is `readonly "Alice"` (literal type)
- `user.address` is `readonly { readonly city: "NYC" }`

**Note:** At runtime (JavaScript), the mutations WOULD work since `as const` is compile-time only. Use `Object.freeze()` for runtime immutability (shallow only).

</details>

---

## 61. Output Questions — Node.js

### Q26: Event Emitter Order

```javascript
const EventEmitter = require("events");
const emitter = new EventEmitter();

emitter.on("data", () => console.log("listener 1"));
emitter.on("data", () => console.log("listener 2"));
emitter.prependListener("data", () => console.log("listener 3"));

emitter.emit("data");
```

<details>
<summary>Answer</summary>

```
listener 3
listener 1
listener 2
```

**Explanation:** `prependListener` adds the listener to the **beginning** of the array. Normal `on` appends. So order is: 3, 1, 2.

</details>

### Q27: Stream Events

```javascript
const { Readable } = require("stream");

const readable = new Readable({
    read() {
        this.push("hello");
        this.push(null); // signal end
    },
});

readable.on("data", (chunk) => console.log("data:", chunk.toString()));
readable.on("end", () => console.log("end"));
readable.on("close", () => console.log("close"));
```

<details>
<summary>Answer</summary>

```
data: hello
end
close
```

**Explanation:** `push("hello")` emits a "data" event. `push(null)` signals the end. "end" fires when no more data. "close" fires when the stream and its resources are fully released.

</details>

### Q28: require() Caching

```javascript
// counter.js
let count = 0;
module.exports = {
    increment: () => ++count,
    getCount: () => count,
};
```

```javascript
// main.js
const counter1 = require("./counter");
const counter2 = require("./counter");

counter1.increment();
counter1.increment();

console.log(counter1.getCount()); // ?
console.log(counter2.getCount()); // ?
console.log(counter1 === counter2); // ?
```

<details>
<summary>Answer</summary>

```
2
2
true
```

**Explanation:** `require()` caches modules after the first load. `counter1` and `counter2` are the **exact same object**. They share the same `count` variable via closure.

</details>

### Q29: Error in EventEmitter

```javascript
const EventEmitter = require("events");
const emitter = new EventEmitter();

// What happens if we emit 'error' without a listener?
emitter.emit("error", new Error("boom"));
```

<details>
<summary>Answer</summary>

**The process crashes** with an unhandled error.

If an EventEmitter emits an `"error"` event and there's no listener for it, Node.js throws the error as an **uncaught exception**, crashing the process.

Fix:
```javascript
emitter.on("error", (err) => console.error("Handled:", err.message));
```

</details>

### Q30: Buffer Gotcha

```javascript
const buf = Buffer.from("Hello");
const slice = buf.slice(0, 3);

slice[0] = 74; // ASCII for 'J'

console.log(buf.toString());   // ?
console.log(slice.toString()); // ?
```

<details>
<summary>Answer</summary>

```
"Jello"
"Jel"
```

**Explanation:** `Buffer.slice()` returns a **view** of the same memory (NOT a copy). Modifying `slice` also modifies `buf`. Use `Buffer.from(buf.subarray(0, 3))` for a copy.

> **Note:** `buf.slice()` is deprecated in favor of `buf.subarray()`, which also returns a view (same behavior).

</details>

---

## Quick Reference Card

```
┌──────────────────────────── JAVASCRIPT ────────────────────────────┐
│                                                                     │
│  EXECUTION:  Sync → nextTick → Promises → setTimeout → setImmediate│
│                                                                     │
│  SCOPE:      var=function  let/const=block  arrow=lexical this      │
│                                                                     │
│  CLOSURE:    function + its lexical environment                     │
│  HOISTING:   var→undefined  let/const→TDZ  function→full body      │
│                                                                     │
│  COPY:       {...obj}=shallow  structuredClone()=deep               │
│  EQUALITY:   ===always  ==coerces  Object.is(NaN,NaN)=true         │
│                                                                     │
│  ASYNC:      callback → Promise → async/await → generators         │
│                                                                     │
├──────────────────────────── NODE.JS ───────────────────────────────┤
│                                                                     │
│  ARCH:       V8 + libuv (single-threaded event loop + thread pool) │
│  SCALE:      cluster (multi-process) / worker_threads (CPU tasks)  │
│  STREAMS:    Readable | Writable | Duplex | Transform              │
│  ERRORS:     try/catch | .catch | error-first cb | process.on      │
│  SECURITY:   parameterized queries, helmet, rate limit, validate   │
│                                                                     │
├─────────────────────────── TYPESCRIPT ─────────────────────────────┤
│                                                                     │
│  TYPE SYSTEM: Structural (duck typing), not nominal                │
│  BASICS:      interface=objects  type=unions/intersections/complex  │
│  GUARDS:      typeof | instanceof | in | custom (is) | asserts     │
│  GENERICS:    <T>, constraints (extends), defaults, infer          │
│  UTILITIES:   Partial Pick Omit Record Readonly ReturnType         │
│  ADVANCED:    conditional types, mapped types, template literals   │
│  SAFETY:      unknown>any  never=exhaustive  strict=always on      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

# MORE TRICKY OUTPUT QUESTIONS

---

## 62. Tricky Closures & Scope

### Q31: IIFE + Block Scope Combo

```javascript
for (var i = 0; i < 3; i++) {
    (function () {
        setTimeout(() => console.log("A:", i), 0);
    })();
}

for (var i = 0; i < 3; i++) {
    (function (j) {
        setTimeout(() => console.log("B:", j), 0);
    })(i);
}
```

<details>
<summary>Answer</summary>

```
A: 3
A: 3
A: 3
B: 0
B: 1
B: 2
```

**Explanation:** In the first loop, the IIFE creates a new function scope but `i` is still the **outer** `var i` — the arrow function closes over it. By the time timeouts fire, `i` is 3. In the second loop, `i` is passed as argument `j`, so each IIFE captures its **own copy** of the value.

</details>

### Q32: Closure Over let in Nested Blocks

```javascript
let fns = [];
{
    let x = 1;
    fns.push(() => x);
}
{
    let x = 2;
    fns.push(() => x);
}
console.log(fns[0]()); // ?
console.log(fns[1]()); // ?
```

<details>
<summary>Answer</summary>

```
1
2
```

**Explanation:** Each block `{}` creates its own `let x`. Each arrow function closes over its respective block-scoped `x`.

</details>

### Q33: Tricky Reassignment in Closure

```javascript
function outer() {
    let x = 10;
    function inner() {
        console.log(x);
    }
    x = 20;
    return inner;
}

outer()(); // ?
```

<details>
<summary>Answer</summary>

```
20
```

**Explanation:** The closure captures a **reference** to the variable `x`, not the value at the time of function creation. When `inner()` is called, `x` is already `20`.

</details>

### Q34: Double Function Call

```javascript
function foo() {
    let a = (b = 5);
    console.log(typeof a); // ?
    console.log(typeof b); // ?
}
foo();
console.log(typeof a); // ?
console.log(typeof b); // ?
```

<details>
<summary>Answer</summary>

```
"number"
"number"
"undefined"
"number"
```

**Explanation:** `let a = (b = 5)` — the `b = 5` assignment creates a **global** variable `b` (no `let`/`var`/`const` declaration for `b`!). `a` is block-scoped with `let`. Outside `foo`, `a` doesn't exist but `b` leaked to global.

> In strict mode, `b = 5` would throw `ReferenceError`.

</details>

---

## 63. Tricky `this` Questions

### Q35: Chained Method Loss

```javascript
const calculator = {
    value: 0,
    add(n) {
        this.value += n;
        return this;
    },
    getValue() {
        return this.value;
    },
};

const { add, getValue } = calculator;

try {
    add(5);
} catch (e) {
    console.log("A:", e.message); // ?
}

console.log("B:", calculator.add(5).add(3).getValue()); // ?
```

<details>
<summary>Answer</summary>

```
A: Cannot read properties of undefined (reading 'value')
B: 8
```

**Explanation:** Destructuring `add` and `getValue` out of the object loses the `this` binding — `this` is `undefined` in strict mode. But chaining directly on the object (`calculator.add(5).add(3)`) preserves `this` because each call returns `this` (the object).

</details>

### Q36: `this` in Nested Functions

```javascript
const obj = {
    name: "outer",
    print() {
        console.log("A:", this.name);
        function nested() {
            console.log("B:", this?.name);
        }
        const arrowNested = () => {
            console.log("C:", this.name);
        };
        nested();
        arrowNested();
    },
};

obj.print();
```

<details>
<summary>Answer</summary>

```
A: outer
B: undefined
C: outer
```

**Explanation:** `nested()` is a regular function call inside a method — `this` reverts to `undefined` (strict) or `globalThis` (sloppy). The arrow function `arrowNested` inherits `this` from `print()`'s scope, which is `obj`.

</details>

### Q37: Class with Arrow vs Normal Methods

```javascript
class Dog {
    name = "Rex";

    bark() {
        return `${this.name} says Woof`;
    }

    barkArrow = () => {
        return `${this.name} says Woof (arrow)`;
    };
}

const dog = new Dog();
const bark = dog.bark;
const barkArrow = dog.barkArrow;

try { console.log(bark()); } catch (e) { console.log("A:", e.message); }
console.log("B:", barkArrow());
```

<details>
<summary>Answer</summary>

```
A: Cannot read properties of undefined (reading 'name')
B: Rex says Woof (arrow)
```

**Explanation:** Extracting `bark` loses `this`. The arrow function field `barkArrow` was bound to the instance at construction time, so it works even when extracted.

</details>

---

## 64. Tricky Promise Questions

### Q38: Resolve After Reject

```javascript
const p = new Promise((resolve, reject) => {
    resolve("first");
    reject("second");
    resolve("third");
});

p.then(console.log).catch(console.log);
```

<details>
<summary>Answer</summary>

```
first
```

**Explanation:** A promise can only be settled **once**. The first `resolve("first")` wins. Subsequent `reject` and `resolve` calls are silently ignored.

</details>

### Q39: Return vs Resolve Inside then

```javascript
Promise.resolve(1)
    .then((val) => {
        console.log("A:", val);
        return new Promise((resolve) => {
            resolve(2);
            console.log("B:", 3);
        });
    })
    .then((val) => console.log("C:", val));
```

<details>
<summary>Answer</summary>

```
A: 1
B: 3
C: 2
```

**Explanation:** Inside the first `.then`, a new Promise is returned. Its executor runs synchronously — `resolve(2)` is called, then `console.log("B:", 3)` runs. The resolved value `2` is passed to the next `.then` as a microtask.

</details>

### Q40: Thenable Objects

```javascript
const thenable = {
    then(resolve) {
        console.log("A");
        resolve(42);
    },
};

Promise.resolve(thenable).then((val) => console.log("B:", val));
console.log("C");
```

<details>
<summary>Answer</summary>

```
C
A
B: 42
```

Wait — let me reconsider. `Promise.resolve(thenable)` invokes `thenable.then()` as a microtask.

Corrected:

```
A
C
B: 42
```

Wait — actually `Promise.resolve` with a thenable calls `.then()` in a microtask. Let me trace carefully:

1. `Promise.resolve(thenable)` — detects thenable, schedules calling `thenable.then()` as a microtask.
2. `console.log("C")` — sync.
3. Microtask: `thenable.then(resolve)` runs → prints "A", calls resolve(42).
4. Microtask: `.then` callback → prints "B: 42".

```
C
A
B: 42
```

</details>

### Q41: async Function Return Value

```javascript
async function foo() {
    return "hello";
}

async function bar() {
    return Promise.resolve("world");
}

foo().then(console.log);
bar().then(console.log);
console.log("sync");
```

<details>
<summary>Answer</summary>

```
sync
hello
world
```

**Explanation:** Both `foo()` and `bar()` return Promises. The `.then` callbacks are microtasks, so `"sync"` prints first. `foo` returns a plain value wrapped in a promise — resolves in one microtask. `bar` returns `Promise.resolve("world")` — the async function unwraps it, which may take an extra microtask tick, but both print after sync.

</details>

### Q42: Error Swallowing

```javascript
Promise.resolve("ok")
    .then((val) => {
        console.log(val);
        throw new Error("oops");
    })
    .then(
        (val) => console.log("then:", val),
        (err) => console.log("inline catch:", err.message)
    )
    .catch((err) => console.log("chain catch:", err.message))
    .then(() => console.log("finally"));
```

<details>
<summary>Answer</summary>

```
ok
inline catch: oops
finally
```

**Explanation:** The `throw` in the first `.then` is caught by the **inline rejection handler** (second argument of the next `.then`), NOT by the `.catch`. Since the inline handler doesn't throw, the chain continues normally. The `.catch` is never triggered. `"finally"` prints from the last `.then`.

</details>

### Q43: Promise Constructor is Synchronous

```javascript
console.log("1");

new Promise((resolve) => {
    console.log("2");
    setTimeout(() => {
        console.log("3");
        resolve("4");
    }, 0);
    console.log("5");
}).then((val) => console.log(val));

console.log("6");
```

<details>
<summary>Answer</summary>

```
1
2
5
6
3
4
```

**Explanation:** Promise constructor executes synchronously: prints 2, schedules setTimeout, prints 5. Then 6 (sync). Then macrotask: prints 3, resolves with "4". Then microtask: prints 4.

</details>

---

## 65. Tricky Event Loop Questions

### Q44: Mixed Microtasks and Macrotasks

```javascript
setTimeout(() => console.log("T1"), 0);

Promise.resolve()
    .then(() => {
        console.log("P1");
        setTimeout(() => console.log("T2"), 0);
    })
    .then(() => console.log("P2"));

setTimeout(() => console.log("T3"), 0);

Promise.resolve().then(() => {
    console.log("P3");
    Promise.resolve().then(() => console.log("P4"));
});

console.log("S1");
```

<details>
<summary>Answer</summary>

```
S1
P1
P3
P2
P4
T1
T3
T2
```

**Explanation:**
1. **Sync:** `S1`
2. **Microtask queue drains** (all microtasks, including newly added ones):
   - `P1` (first .then of chain 1)
   - `P3` (first .then of chain 2)
   - `P2` (second .then of chain 1 — queued after P1 ran)
   - `P4` (queued by P3)
3. **Macrotask queue** (one per tick, but microtask drain between each):
   - `T1` (first setTimeout)
   - `T3` (third setTimeout — registered before T2)
   - `T2` (registered during P1 microtask)

</details>

### Q45: process.nextTick Starvation

```javascript
// Node.js only
const start = Date.now();

setTimeout(() => {
    console.log("setTimeout:", Date.now() - start, "ms");
}, 0);

function flood(count) {
    if (count <= 0) return;
    process.nextTick(() => {
        flood(count - 1);
    });
}

flood(100000);
console.log("sync done");
```

<details>
<summary>Answer</summary>

```
sync done
setTimeout: ~200-500 ms   (way more than 0ms!)
```

**Explanation:** `process.nextTick` is processed before I/O and timers. 100,000 recursive `nextTick` calls starve the event loop — the `setTimeout` can't fire until all nextTick callbacks complete. This is why `setImmediate` is often preferred for deferring work.

</details>

### Q46: queueMicrotask vs Promise.resolve().then

```javascript
queueMicrotask(() => console.log("qM1"));
Promise.resolve().then(() => console.log("P1"));
queueMicrotask(() => console.log("qM2"));
Promise.resolve().then(() => console.log("P2"));
```

<details>
<summary>Answer</summary>

```
qM1
P1
qM2
P2
```

**Explanation:** Both `queueMicrotask` and `Promise.then` go to the same microtask queue. They execute in the **order they were queued** — FIFO. No priority difference between them.

</details>

### Q47: setImmediate vs setTimeout Inside I/O

```javascript
const fs = require("fs");

fs.readFile(__filename, () => {
    setTimeout(() => console.log("timeout"), 0);
    setImmediate(() => console.log("immediate"));
    process.nextTick(() => console.log("nextTick"));
    Promise.resolve().then(() => console.log("promise"));
});
```

<details>
<summary>Answer</summary>

```
nextTick
promise
immediate
timeout
```

**Explanation:** Inside an I/O callback: `nextTick` → `promise` (microtasks first), then `immediate` (check phase comes right after poll phase), then `timeout` (timers phase is in the next iteration). Inside I/O, `setImmediate` **always** fires before `setTimeout(fn, 0)`.

</details>

---

## 66. Tricky Type Coercion & Equality

### Q48: The Plus Operator Madness

```javascript
console.log(1 + "2" + "2");   // ?
console.log(1 + +"2" + "2");  // ?
console.log(1 + -"1" + "2");  // ?
console.log(+"1" + "1" + "2"); // ?
console.log("A" - "B" + "2"); // ?
console.log("A" - "B" + 2);   // ?
```

<details>
<summary>Answer</summary>

```
"122"
"32"
"02"
"112"
"NaN2"
NaN
```

**Explanation:**
- `1 + "2"` → `"12"` → `"12" + "2"` → `"122"`
- `1 + +"2"` → `1 + 2` = `3` → `3 + "2"` → `"32"` (unary `+` converts to number)
- `1 + -"1"` → `1 + (-1)` = `0` → `0 + "2"` → `"02"`
- `+"1"` = `1` → `1 + "1"` → `"11"` → `"11" + "2"` → `"112"`
- `"A" - "B"` → `NaN - NaN` = `NaN` → `NaN + "2"` → `"NaN2"` (string concat)
- `"A" - "B"` → `NaN` → `NaN + 2` → `NaN` (number addition, not string)

</details>

### Q49: Equality Table of Doom

```javascript
console.log(false == "0");     // ?
console.log(false == 0);       // ?
console.log(false == "");      // ?
console.log(false == []);      // ?
console.log(false == null);    // ?
console.log("" == 0);          // ?
console.log("" == []);         // ?
console.log(0 == []);          // ?
console.log("" == null);       // ?
console.log([] == ![]);        // ?
```

<details>
<summary>Answer</summary>

```
true     false→0, "0"→0
true     false→0
true     false→0, ""→0
true     false→0, []→""→0
false    null only == undefined
true     ""→0
true     []→""
true     []→""→0
false    null only == undefined
true     ![]→false→0, []→""→0
```

**Key rules:**
1. `null == undefined` is true. `null`/`undefined` don't coerce to anything else.
2. Boolean is converted to number first (`false→0`, `true→1`).
3. Object (including `[]`) is converted via `.toString()` → `""` → `0`.
4. `![]` is `false` (all objects are truthy, negation gives false).

</details>

### Q50: Tricky typeof and instanceof

```javascript
console.log(typeof NaN);                // ?
console.log(typeof null);               // ?
console.log(typeof undefined);          // ?
console.log(typeof typeof 1);           // ?
console.log(typeof (() => {}));         // ?
console.log(typeof Symbol());           // ?

console.log(NaN instanceof Number);     // ?
console.log("hello" instanceof String); // ?
console.log(null instanceof Object);    // ?

console.log(NaN === NaN);              // ?
console.log(Object.is(NaN, NaN));      // ?
console.log(Object.is(0, -0));         // ?
console.log(0 === -0);                 // ?
```

<details>
<summary>Answer</summary>

```
"number"
"object"
"undefined"
"string"    ← typeof 1 is "number", typeof "number" is "string"
"function"
"symbol"

false       ← NaN is a primitive, not an instance of Number
false       ← "hello" is a primitive string, not new String("hello")
false       ← null is not an instance of anything

false       ← NaN !== NaN (the only value not equal to itself)
true        ← Object.is handles NaN correctly
false       ← Object.is distinguishes +0 and -0
true        ← === considers 0 and -0 equal
```

</details>

---

## 67. Tricky Object & Array Questions

### Q51: Object Key Coercion

```javascript
const obj = {};
const a = { key: "a" };
const b = { key: "b" };

obj[a] = "valueA";
obj[b] = "valueB";

console.log(obj[a]); // ?
console.log(obj[b]); // ?
console.log(Object.keys(obj)); // ?
```

<details>
<summary>Answer</summary>

```
"valueB"
"valueB"
["[object Object]"]
```

**Explanation:** Object keys must be strings or Symbols. `a` and `b` are both plain objects — `.toString()` gives `"[object Object]"` for both. So `obj[a]` and `obj[b]` point to the **same key**. The second write overwrites the first.

</details>

### Q52: Array Holes & Sparse Arrays

```javascript
const arr = [1, , 3];
console.log(arr.length);           // ?
console.log(arr[1]);               // ?
console.log(1 in arr);             // ?

const arr2 = new Array(3);
console.log(arr2.length);          // ?
console.log(arr2[0]);              // ?

console.log([1, , 3].map(x => x * 2));      // ?
console.log([1, , 3].filter(x => true));     // ?
console.log([1, , 3].forEach(x => console.log(x))); // prints?
```

<details>
<summary>Answer</summary>

```
3
undefined
false         ← the slot doesn't exist, it's a HOLE not undefined
3
undefined
[2, empty, 6] ← map preserves holes
[1, 3]         ← filter skips holes
1              ← forEach skips holes too
3
undefined
```

**Key:** A hole (`[1, , 3]`) is NOT the same as `[1, undefined, 3]`. Holes are skipped by `forEach`, `map` preserves them, `filter` removes them. `in` returns `false` for holes.

</details>

### Q53: Object Property Order

```javascript
const obj = {};
obj["2"] = "two";
obj["1"] = "one";
obj["b"] = "bee";
obj["a"] = "ay";
obj["3"] = "three";

console.log(Object.keys(obj)); // ?
```

<details>
<summary>Answer</summary>

```
["1", "2", "3", "b", "a"]
```

**Explanation:** JavaScript objects order keys as:
1. **Integer-like keys** in ascending numeric order (`"1"`, `"2"`, `"3"`)
2. **String keys** in insertion order (`"b"`, `"a"`)
3. **Symbol keys** in insertion order

This is per the ECMAScript spec since ES2015.

</details>

### Q54: Array Comparison

```javascript
console.log([] == []);    // ?
console.log([] === []);   // ?
console.log({} == {});    // ?
console.log({} === {});   // ?

const a = [1, 2, 3];
const b = a;
console.log(a == b);      // ?
console.log(a === b);     // ?

b.push(4);
console.log(a);            // ?
console.log(a.length);     // ?
```

<details>
<summary>Answer</summary>

```
false    ← different object references
false
false
false

true     ← same reference
true

[1, 2, 3, 4]   ← a and b point to the same array
4
```

</details>

---

## 68. Tricky Async Patterns

### Q55: for...of with await

```javascript
const delay = (ms, val) => new Promise(r => setTimeout(() => r(val), ms));

async function sequential() {
    const arr = [delay(100, "a"), delay(50, "b"), delay(75, "c")];
    for (const p of arr) {
        console.log(await p);
    }
}

async function parallel() {
    const arr = [delay(100, "a"), delay(50, "b"), delay(75, "c")];
    const results = await Promise.all(arr);
    console.log(results);
}

console.time("seq");
await sequential();
console.timeEnd("seq");

console.time("par");
await parallel();
console.timeEnd("par");
```

<details>
<summary>Answer</summary>

```
a
b
c
seq: ~100ms    (NOT 225ms! Because all promises started together)

["a", "b", "c"]
par: ~100ms
```

**Trap:** Even in the `for...of` loop, all three promises were already **created** (and started) before the loop. `await` just waits for each in order. Since they all started at the same time and the longest is 100ms, the total is ~100ms, not 100+50+75.

If you wanted **truly sequential** execution, you'd need to create the promise **inside** the loop:

```javascript
for (const ms of [100, 50, 75]) {
    console.log(await delay(ms, ms)); // THIS is truly sequential: ~225ms
}
```

</details>

### Q56: Error Handling in Promise.all vs Promise.allSettled

```javascript
const tasks = [
    Promise.resolve("ok1"),
    Promise.reject("fail1"),
    new Promise((_, reject) => setTimeout(() => reject("fail2"), 100)),
    new Promise((resolve) => setTimeout(() => resolve("ok2"), 50)),
];

try {
    const results = await Promise.all(tasks);
    console.log("All:", results);
} catch (err) {
    console.log("All error:", err); // ?
}

const settled = await Promise.allSettled(tasks);
console.log("Settled:", settled.map(r => r.status)); // ?
```

<details>
<summary>Answer</summary>

```
All error: fail1

Settled: ["fulfilled", "rejected", "rejected", "fulfilled"]
```

**Explanation:** `Promise.all` rejects immediately with the first rejection (`"fail1"`). The other promises still run but their results are ignored. `Promise.allSettled` waits for ALL promises to settle and reports each one's status.

</details>

### Q57: Async Iterator / for await...of

```javascript
async function* generate() {
    yield 1;
    await new Promise(r => setTimeout(r, 100));
    yield 2;
    await new Promise(r => setTimeout(r, 100));
    yield 3;
}

const results = [];
for await (const val of generate()) {
    results.push(val);
}
console.log(results); // ?
```

<details>
<summary>Answer</summary>

```
[1, 2, 3]
```

**Explanation:** `for await...of` works with async generators. It awaits each yielded value in sequence. Total time is ~200ms (two 100ms delays).

</details>

---

## 69. Tricky Hoisting & Variable Questions

### Q58: Function vs Variable Hoisting Priority

```javascript
console.log(typeof foo); // ?
var foo = "hello";
function foo() { return "world"; }
console.log(typeof foo); // ?
```

<details>
<summary>Answer</summary>

```
"function"
"string"
```

**Explanation:** Both `var foo` and `function foo` are hoisted. **Function declarations take priority** over variable declarations during hoisting. So at the top, `foo` is the function. Then the assignment `foo = "hello"` overwrites it at runtime.

</details>

### Q59: Arguments Object Quirks

```javascript
function test(a, b, c) {
    console.log(arguments.length); // ?
    arguments[0] = 100;
    console.log(a);                 // ?
    a = 200;
    console.log(arguments[0]);      // ?
}

test(1, 2);
```

<details>
<summary>Answer</summary>

```
2      ← arguments.length reflects actual args passed, not params declared
100    ← in sloppy mode, arguments[0] and 'a' are LINKED
200    ← they stay linked both ways
```

> **In strict mode**, `arguments` and named parameters are **NOT linked** — modifying one doesn't affect the other.

</details>

### Q60: Named Function Expression Scope

```javascript
var foo = function bar() {
    console.log(typeof bar); // ?
};
foo();
console.log(typeof bar);     // ?
```

<details>
<summary>Answer</summary>

```
"function"
"undefined"
```

**Explanation:** In a named function expression, the name (`bar`) is only visible **inside** the function body. Outside, `bar` is not defined. Only `foo` (the variable) is accessible outside.

</details>

### Q61: let vs var in Same Scope

```javascript
function test() {
    console.log(a); // ?
    console.log(b); // ?
    var a = 1;
    let b = 2;
}
test();
```

<details>
<summary>Answer</summary>

```
undefined
ReferenceError: Cannot access 'b' before initialization
```

Execution stops at the `ReferenceError` — the second `console.log` never even tries to run. `var a` is hoisted with `undefined`. `let b` is hoisted but in the TDZ (Temporal Dead Zone).

</details>

---

## 70. Tricky Class & Prototype Questions

### Q62: Property Shadowing on Prototype

```javascript
function Animal() {}
Animal.prototype.sound = "generic";

const dog = new Animal();
console.log(dog.sound);           // ?
console.log(dog.hasOwnProperty("sound")); // ?

dog.sound = "woof";
console.log(dog.sound);           // ?
console.log(dog.hasOwnProperty("sound")); // ?
console.log(Animal.prototype.sound);      // ?
```

<details>
<summary>Answer</summary>

```
"generic"     ← from prototype
false         ← not own property yet

"woof"        ← own property shadows prototype
true          ← now it's own
"generic"     ← prototype unchanged
```

**Explanation:** Reading goes up the prototype chain. **Writing** always creates/modifies an **own** property — it never modifies the prototype. This is called property shadowing.

</details>

### Q63: Static vs Instance Method Priority

```javascript
class Foo {
    static greet() {
        return "static hello";
    }

    greet() {
        return "instance hello";
    }
}

console.log(Foo.greet());          // ?
console.log(new Foo().greet());    // ?
console.log(Foo.prototype.greet()); // ?
```

<details>
<summary>Answer</summary>

```
"static hello"
"instance hello"
"instance hello"
```

**Explanation:** `Foo.greet()` calls the static method (on the class itself). `new Foo().greet()` calls the instance method (on the prototype). `Foo.prototype.greet()` directly calls the instance method (but `this` would be `Foo.prototype`, not an instance).

</details>

### Q64: `new` with Return Value

```javascript
function MyClass() {
    this.name = "from constructor";
    return { name: "from return" };
}

function MyClass2() {
    this.name = "from constructor";
    return 42;
}

const a = new MyClass();
const b = new MyClass2();

console.log(a.name); // ?
console.log(b.name); // ?
```

<details>
<summary>Answer</summary>

```
"from return"
"from constructor"
```

**Explanation:** If a constructor returns an **object**, that object replaces the `new`-created instance. If it returns a **primitive** (like `42`), the return value is **ignored** and the normal instance is used.

</details>

---

## 71. Tricky Destructuring & Spread

### Q65: Default Values in Destructuring

```javascript
const { a = 10, b = 20, c = 30 } = { a: undefined, b: null, c: 0 };
console.log(a); // ?
console.log(b); // ?
console.log(c); // ?
```

<details>
<summary>Answer</summary>

```
10      ← undefined triggers default
null    ← null does NOT trigger default
0       ← 0 does NOT trigger default
```

**Explanation:** Default values in destructuring only kick in when the value is **`undefined`**, not when it's `null`, `0`, `""`, or `false`.

</details>

### Q66: Nested Destructuring

```javascript
const data = {
    users: [
        { name: "Alice", scores: [90, 85, 92] },
        { name: "Bob", scores: [78, 82, 88] },
    ],
};

const {
    users: [
        { name: firstName, scores: [, secondScore] },
        { name: secondName },
    ],
} = data;

console.log(firstName);    // ?
console.log(secondScore);  // ?
console.log(secondName);   // ?
// console.log(users);     // ?
```

<details>
<summary>Answer</summary>

```
"Alice"
85
"Bob"
// ReferenceError: users is not defined
```

**Explanation:** `users:` in the destructuring is a **path**, not a variable declaration. Only `firstName`, `secondScore`, and `secondName` are declared. `[, secondScore]` skips the first element (90) and takes the second (85).

</details>

### Q67: Spread in Unexpected Places

```javascript
const str = "hello";
console.log([...str]);         // ?
console.log({...str});         // ?

const arr = [1, 2, 3];
console.log({...arr});         // ?

console.log(Math.max(...arr)); // ?
console.log(Math.max(arr));    // ?
```

<details>
<summary>Answer</summary>

```
["h", "e", "l", "l", "o"]
{ "0": "h", "1": "e", "2": "l", "3": "l", "4": "o" }

{ "0": 1, "1": 2, "2": 3 }

3
NaN    ← Math.max([1,2,3]) gets the array object, not its elements
```

</details>

---

## 72. Tricky Node.js Questions

### Q68: Module Resolution Order

```javascript
// Given this directory structure:
// project/
//   ├── foo.js
//   ├── foo/
//   │   └── index.js

// What does require('./foo') load?
```

<details>
<summary>Answer</summary>

**`foo.js`** (the file takes priority over the directory).

Node.js `require('./foo')` resolution order:
1. `./foo.js`
2. `./foo.json`
3. `./foo.node`
4. `./foo/index.js`
5. `./foo/index.json`
6. `./foo/index.node`

The **file** always wins over the **directory/index**.

</details>

### Q69: Event Emitter Memory Leak Warning

```javascript
const EventEmitter = require("events");
const emitter = new EventEmitter();

for (let i = 0; i < 15; i++) {
    emitter.on("data", () => {});
}
// What happens?
```

<details>
<summary>Answer</summary>

```
(node:1234) MaxListenersExceededWarning: Possible EventEmitter memory leak detected.
11 data listeners added to [EventEmitter]. Use emitter.setMaxListeners() to increase limit
```

**Explanation:** Node.js warns when more than **10 listeners** (default) are added to a single event. This is a safety net to catch memory leaks. Fix:

```javascript
emitter.setMaxListeners(20);   // increase
emitter.setMaxListeners(0);    // unlimited (use with caution)
```

</details>

### Q70: Callback Error Pattern

```javascript
const fs = require("fs");

try {
    fs.readFile("nonexistent.txt", (err, data) => {
        if (err) throw err;
    });
} catch (e) {
    console.log("Caught:", e.message);
}
```

<details>
<summary>Answer</summary>

The try/catch does **NOT** catch the error. The process crashes with an uncaught exception.

**Explanation:** `fs.readFile` is async. By the time the callback runs, the `try/catch` block has already exited. The `throw err` inside the callback becomes an **uncaught exception** because there's no surrounding try/catch at the time of execution.

**Fix:** Handle the error inside the callback:

```javascript
fs.readFile("nonexistent.txt", (err, data) => {
    if (err) {
        console.error("Error:", err.message);
        return;
    }
    console.log(data);
});
```

Or use the Promise-based API with async/await:

```javascript
try {
    const data = await fs.promises.readFile("nonexistent.txt");
} catch (e) {
    console.log("Caught:", e.message); // this works!
}
```

</details>

---

## 73. Tricky Miscellaneous Questions

### Q71: `delete` Operator

```javascript
var a = 1;
let b = 2;
c = 3;

console.log(delete a); // ?
console.log(delete b); // ?
console.log(delete c); // ?

console.log(typeof a); // ?
console.log(typeof b); // ?
console.log(typeof c); // ?
```

<details>
<summary>Answer</summary>

```
false    ← can't delete var declarations
false    ← can't delete let declarations
true     ← CAN delete undeclared globals

"number" ← still exists
"number" ← still exists
"undefined" ← deleted successfully
```

**Explanation:** `delete` only works on **object properties**. `var` and `let` declarations create non-configurable bindings. `c = 3` (without declaration) creates a configurable property on `globalThis`.

</details>

### Q72: Labels and Loops

```javascript
outer: for (let i = 0; i < 3; i++) {
    inner: for (let j = 0; j < 3; j++) {
        if (i === 1 && j === 1) continue outer;
        if (i === 2 && j === 1) break outer;
        console.log(i, j);
    }
}
```

<details>
<summary>Answer</summary>

```
0 0
0 1
0 2
1 0
2 0
```

**Explanation:**
- `i=0`: all j values print (0,0), (0,1), (0,2).
- `i=1, j=0`: prints (1,0). `j=1`: `continue outer` — skips rest of inner loop, goes to `i=2`.
- `i=2, j=0`: prints (2,0). `j=1`: `break outer` — exits both loops entirely.

</details>

### Q73: Optional Chaining Gotchas

```javascript
const obj = {
    a: {
        b: {
            c: 42,
        },
    },
    d: null,
};

console.log(obj.a?.b?.c);        // ?
console.log(obj.d?.e?.f);        // ?
console.log(obj.x?.y?.z);        // ?
console.log(obj.a?.b?.c?.());    // ?
console.log(delete obj?.a?.b);   // ?
console.log(obj.a?.b);           // ?
```

<details>
<summary>Answer</summary>

```
42
undefined    ← d is null, short-circuits to undefined
undefined    ← x is undefined, short-circuits
TypeError: obj.a?.b?.c is not a function  ← 42 is not callable
true         ← delete returns true, removes obj.a.b
undefined    ← b was just deleted
```

**Trap:** `obj.a?.b?.c?.()` — `?.()` calls as a function. Since `c` is `42`, not a function, it throws TypeError. The `?.` before `()` only guards against `null`/`undefined`, not against non-functions.

</details>

### Q74: Comma Operator

```javascript
const x = (1, 2, 3);
console.log(x); // ?

const y = (a = 1, b = 2, a + b);
console.log(y); // ?

for (var i = 0, j = 10; i < 3; i++, j--) {}
console.log(i, j); // ?
```

<details>
<summary>Answer</summary>

```
3      ← comma operator evaluates all, returns the LAST
3      ← a=1, b=2, then a+b=3 returned
3 7
```

**Explanation:** The comma operator evaluates each expression left to right and returns the **last** one. In `for` loops, it's commonly used to increment/decrement multiple variables.

</details>

### Q75: WeakRef and FinalizationRegistry

```javascript
let obj = { data: "important" };
const weakRef = new WeakRef(obj);

console.log(weakRef.deref()?.data); // ?
obj = null; // remove strong reference
// After GC runs:
// console.log(weakRef.deref()); // ?
```

<details>
<summary>Answer</summary>

```
"important"

// After GC: undefined (the object may have been garbage collected)
```

**Explanation:** `WeakRef` holds a weak reference that doesn't prevent garbage collection. `deref()` returns the object if it's still alive, or `undefined` if GC has reclaimed it. You can't predict exactly when GC runs — the second output depends on timing.

</details>

---

## Quick Reference — Output Question Patterns

```
┌────────────────────────────────────────────────────────────────────┐
│              OUTPUT QUESTION CHEAT SHEET                           │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  EXECUTION ORDER:                                                  │
│    sync → process.nextTick → Promise.then → setTimeout             │
│    → setImmediate (inside I/O: immediate BEFORE timeout)           │
│                                                                    │
│  VAR vs LET:                                                       │
│    var = function scope + hoisted to undefined                     │
│    let = block scope + TDZ (ReferenceError before declaration)     │
│                                                                    │
│  THIS RULES:                                                       │
│    obj.method()     → this = obj                                   │
│    method()         → this = undefined (strict) / globalThis       │
│    () => {}         → this = enclosing lexical scope               │
│    new Constructor  → this = new object                            │
│    .call/.apply     → this = first argument                        │
│                                                                    │
│  CLOSURES:                                                         │
│    Close over REFERENCE, not value (changes visible)               │
│    var in loop = shared | let in loop = per-iteration copy         │
│                                                                    │
│  COERCION:                                                         │
│    + with string → concat | - * / with string → toNumber           │
│    [] → "" → 0  |  {} → "[object Object]"                         │
│    null == undefined is true | NaN === NaN is false                │
│    Default params trigger on undefined ONLY (not null/0/"")        │
│                                                                    │
│  PROMISES:                                                         │
│    Constructor runs SYNC | .then is async (microtask)              │
│    resolve/reject once only | return in .then chains               │
│    inline reject handler catches BEFORE .catch                     │
│                                                                    │
│  OBJECTS:                                                          │
│    Key order: integer keys (sorted) → string keys (insertion)      │
│    Object keys coerce to string: {}.toString = "[object Object]"   │
│    [] !== [] (different references)                                 │
│    Writing creates own property, never modifies prototype           │
│    delete works on global undeclared vars, not var/let              │
│                                                                    │
│  NODE.JS:                                                          │
│    require() caches modules (same reference)                       │
│    File > directory for require resolution                         │
│    try/catch can't catch errors in async callbacks                  │
│    EventEmitter warns at >10 listeners per event                   │
│    Buffer.slice is a VIEW (shared memory), not a copy              │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

# EVEN MORE TRICKY INTERVIEW QUESTIONS

---

## 74. Async/Await Execution Traps

### Q76: Multiple Awaits vs Promise.all

```javascript
async function serial() {
    const a = await fetch1(); // 1 second
    const b = await fetch2(); // 1 second
    return a + b;
}
// Total time: ~2 seconds (sequential)

async function parallel() {
    const aPromise = fetch1(); // start immediately
    const bPromise = fetch2(); // start immediately
    const a = await aPromise;
    const b = await bPromise;
    return a + b;
}
// Total time: ~1 second (parallel)

// But what's the difference vs Promise.all?
async function parallelSafe() {
    const [a, b] = await Promise.all([fetch1(), fetch2()]);
    return a + b;
}
```

<details>
<summary>What's the TRAP in `parallel()`?</summary>

If `fetch2()` rejects while we're `await`-ing `fetch1()`, the rejection of `fetch2` becomes an **unhandled rejection** until `await bPromise` is reached. But we never reach it because `fetch1` might still be pending!

`Promise.all` handles this correctly — if **any** promise rejects, it immediately rejects the whole group, and no unhandled rejections occur.

**Rule:** When running async tasks in parallel, **always use `Promise.all`** — don't just start promises early and `await` them later.

</details>

### Q77: await in a non-async Context

```javascript
function foo() {
    return await Promise.resolve(42); // ?
}
```

<details>
<summary>Answer</summary>

**SyntaxError: await is only valid in async functions and the top level body of a module**

`await` can only be used inside an `async` function or at the top level of an ES module. Using it in a regular function is a syntax error.

</details>

### Q78: Top-level await Behavior

```javascript
// file: module.mjs (ES module)
console.log("A");

const data = await new Promise((r) => setTimeout(() => r("B"), 100));
console.log(data);

console.log("C");
```

<details>
<summary>Answer</summary>

```
A
B
C
```

**Explanation:** Top-level `await` (available in ES modules) pauses the entire module's evaluation. `"A"` prints first, then the module pauses for 100ms, resolves `"B"`, prints it, then prints `"C"`. Any module importing this one also **waits** until this one finishes loading.

</details>

### Q79: Return await vs Return Promise

```javascript
async function returnAwait() {
    try {
        return await Promise.reject("error1");
    } catch (e) {
        console.log("Caught:", e);
        return "recovered1";
    }
}

async function returnPromise() {
    try {
        return Promise.reject("error2");
    } catch (e) {
        console.log("Caught:", e);
        return "recovered2";
    }
}

console.log(await returnAwait());   // ?
console.log(await returnPromise()); // ?
```

<details>
<summary>Answer</summary>

```
Caught: error1
recovered1
// Then the second call:
// UnhandledPromiseRejection: error2   (process may crash)
```

Or more precisely, `returnPromise()` returns a rejected promise, so the outer `await` receives the rejection:

```
Caught: error1
recovered1
```

Then `await returnPromise()` throws, but we didn't wrap that in try/catch either. Let me reconsider — the caller does `console.log(await returnPromise())` so it throws.

Actually let me re-trace:

- `returnAwait()`: the `await` inside the try block **unwraps** the rejection, so the `catch` block catches it, returns `"recovered1"`.
- `returnPromise()`: `return Promise.reject("error2")` — the rejected promise is returned **without awaiting**, so the try/catch **never catches it**. The async function returns a rejected promise. The outer `await` will throw.

So the output depends on error handling at the call site. As written:

```
Caught: error1
recovered1
```

Then the second `await` throws `"error2"` as an unhandled rejection.

**Key lesson:** `return await` inside try/catch is NOT redundant! Without `await`, the rejection bypasses the try/catch entirely.

</details>

---

## 75. Tricky setTimeout & Timer Questions

### Q80: setTimeout with 0 vs Negative vs Large Delay

```javascript
setTimeout(() => console.log("A"), 0);
setTimeout(() => console.log("B"), -1);
setTimeout(() => console.log("C"), 1.5);
setTimeout(() => console.log("D"), NaN);
setTimeout(() => console.log("E"), Infinity);

console.log("F");
```

<details>
<summary>Answer</summary>

```
F
A
B
D
C
E
```

Wait — let me re-examine. All non-positive and invalid delays are clamped to **0** (or the minimum timer resolution, typically 1ms). Let's trace:

- `0` → minimum delay (~1ms)
- `-1` → clamped to 0
- `1.5` → truncated/rounded, effectively ~2ms
- `NaN` → treated as 0
- `Infinity` → the spec says delay is clamped to a 32-bit int max (2147483647ms ≈ 24.8 days). It does NOT execute after sync, but after ~24.8 days!

Actually, `Infinity` gets converted to `0` because `Infinity | 0` is `0` in the browser spec's integer conversion. Let me check: the HTML spec converts delay with `ToInt32` — `Infinity` becomes `0`.

In **Node.js**, `setTimeout(fn, Infinity)` — the timer value is set to `1` (clamped). So all fire at roughly the same time.

Practically:

```
F
A
B
D
E
C
```

**Explanation:** `F` is sync. Then all timers with delay 0 or clamped to 0 fire first (A, B, D, E in order). `C` with 1.5ms fires slightly later. The exact order among 0ms timers depends on registration order.

Corrected:

```
F
A
B
D
E
C
```

The main trap: **negative, NaN, and Infinity all get clamped to 0 or 1ms** — they don't behave as you'd expect mathematically.

</details>

### Q81: setTimeout Inside a Promise

```javascript
const p = new Promise((resolve) => {
    setTimeout(() => resolve("timeout"), 0);
    console.log("A");
});

p.then((val) => {
    console.log("B:", val);
    return new Promise((resolve) => {
        console.log("C");
        setTimeout(() => resolve("done"), 0);
    });
}).then((val) => console.log("D:", val));

console.log("E");
```

<details>
<summary>Answer</summary>

```
A
E
B: timeout
C
D: done
```

**Execution trace:**
1. Promise constructor runs synchronously → prints `A`, schedules setTimeout.
2. `.then` is registered (microtask when resolved).
3. `"E"` prints (sync).
4. **Macrotask:** setTimeout fires → resolves promise with `"timeout"`.
5. **Microtask:** first `.then` → prints `"B: timeout"`, executes new Promise constructor → prints `"C"`, schedules setTimeout, returns new promise.
6. **Macrotask:** second setTimeout fires → resolves with `"done"`.
7. **Microtask:** second `.then` → prints `"D: done"`.

</details>

### Q82: Recursive setTimeout vs setInterval Drift

```javascript
let count = 0;
const start = Date.now();

// setInterval fires every 100ms REGARDLESS of execution time
const interval = setInterval(() => {
    count++;
    const work = Date.now();
    while (Date.now() - work < 50) {} // 50ms of work
    if (count >= 3) {
        clearInterval(interval);
        console.log("Interval total:", Date.now() - start, "ms"); // ?
    }
}, 100);
```

<details>
<summary>Answer</summary>

```
Interval total: ~300ms
```

**Explanation:** `setInterval` tries to fire every 100ms from the **start of the previous call**. Even though each callback takes 50ms, the next one is still scheduled at the 100ms mark. So 3 callbacks ≈ 300ms.

If we used recursive `setTimeout` instead:

```javascript
function tick() {
    // 50ms work
    while (Date.now() - Date.now() < 50) {}
    count++;
    if (count < 3) setTimeout(tick, 100);
}
setTimeout(tick, 100);
// Total: ~450ms (100 + 50 + 100 + 50 + 100 + 50)
```

Recursive `setTimeout` waits 100ms **after** each callback finishes, so it's 150ms per iteration.

</details>

---

## 76. Tricky Generator Questions

### Q83: Generator with Return

```javascript
function* gen() {
    yield 1;
    return 2;
    yield 3; // unreachable
}

const g = gen();
console.log(g.next()); // ?
console.log(g.next()); // ?
console.log(g.next()); // ?

console.log([...gen()]); // ?
```

<details>
<summary>Answer</summary>

```
{ value: 1, done: false }
{ value: 2, done: true }     ← return value, but done is TRUE
{ value: undefined, done: true }

[1]                            ← return value is NOT included in spread!
```

**Explanation:** `return` in a generator sets `done: true` with the return value. But iterators (spread, `for...of`) stop when `done` is true and **do NOT include** the return value. So `[...gen()]` only gets `[1]`.

</details>

### Q84: Generator Two-way Communication

```javascript
function* conversation() {
    const a = yield "What is your name?";
    const b = yield `Hello ${a}! How old are you?`;
    return `${a} is ${b} years old`;
}

const chat = conversation();
console.log(chat.next());          // ?
console.log(chat.next("Alice"));   // ?
console.log(chat.next(30));        // ?
```

<details>
<summary>Answer</summary>

```
{ value: "What is your name?", done: false }
{ value: "Hello Alice! How old are you?", done: false }
{ value: "Alice is 30 years old", done: true }
```

**Explanation:** `yield` is two-way: it **sends** a value out and **receives** a value back. The first `next()` starts the generator. The second `next("Alice")` sends `"Alice"` as the result of the first `yield`, so `a = "Alice"`. The third `next(30)` sends `30` as the result of the second `yield`, so `b = 30`.

The very first `.next()` call's argument is always ignored (there's no `yield` waiting to receive it).

</details>

### Q85: Generator Error Handling

```javascript
function* safe() {
    try {
        const val = yield "request";
        console.log("Got:", val);
    } catch (e) {
        console.log("Error:", e.message);
    }
    yield "recovered";
}

const g = safe();
console.log(g.next());                         // ?
console.log(g.throw(new Error("network")));     // ?
console.log(g.next());                          // ?
```

<details>
<summary>Answer</summary>

```
{ value: "request", done: false }
Error: network
{ value: "recovered", done: false }
{ value: undefined, done: true }
```

**Explanation:** `g.throw()` injects an error at the point where the generator is paused (at `yield "request"`). The try/catch inside the generator catches it, prints the error, and execution continues to `yield "recovered"`.

</details>

---

## 77. Tricky Map/Set/WeakMap Questions

### Q86: Map vs Object — Key Differences

```javascript
const map = new Map();
const obj = {};

map.set(1, "number key");
map.set("1", "string key");
map.set(true, "boolean key");

obj[1] = "number key";
obj["1"] = "string key";
obj[true] = "boolean key";

console.log(map.size);      // ?
console.log(Object.keys(obj).length); // ?

console.log(map.get(1));    // ?
console.log(map.get("1"));  // ?
console.log(obj[1]);        // ?
console.log(obj["1"]);      // ?
```

<details>
<summary>Answer</summary>

```
3              ← Map preserves key types: 1, "1", true are distinct
1              ← Object coerces all keys to strings: "1", "1", "true" → last 2 overwrite

"number key"   ← Map distinguishes number 1 from string "1"
"string key"
"boolean key"  ← obj[1] coerced to obj["1"] which was overwritten by obj[true]→obj["true"]
```

Wait — let me re-trace the object:

```javascript
obj[1] = "number key";   // key is "1"
obj["1"] = "string key"; // key is "1" — overwrites!
obj[true] = "boolean key"; // key is "true"
```

So `Object.keys(obj)` → `["1", "true"]` → length is **2**.

```
3
2

"number key"
"string key"
"string key"   ← obj[1] is obj["1"] which is "string key"
"string key"
```

</details>

### Q87: NaN as a Map Key

```javascript
const map = new Map();
map.set(NaN, "value1");
map.set(NaN, "value2");
map.set(0, "zero");
map.set(-0, "negative zero");

console.log(map.size);       // ?
console.log(map.get(NaN));   // ?
console.log(map.get(0));     // ?
console.log(map.get(-0));    // ?

console.log(NaN === NaN);    // ?

const set = new Set([NaN, NaN, NaN]);
console.log(set.size);       // ?
```

<details>
<summary>Answer</summary>

```
2               ← NaN→NaN is same key, 0 and -0 are same key
"value2"        ← second set overwrote first
"negative zero" ← 0 and -0 are treated as the same key
"negative zero"

false           ← NaN !== NaN with ===

1               ← Set also treats NaN as equal to NaN
```

**Key insight:** Map and Set use the **SameValueZero** algorithm, which treats `NaN === NaN` (unlike `===`) and `+0 === -0`. This is the only place in JS where `NaN` equals `NaN`.

</details>

### Q88: WeakMap Gotcha

```javascript
const wm = new WeakMap();

wm.set("hello", 1); // ?
```

<details>
<summary>Answer</summary>

**TypeError: Invalid value used as weak map key**

WeakMap keys must be **objects** (or Symbols in newer engines). Primitives like strings, numbers, booleans cannot be WeakMap keys because they can't be garbage collected.

</details>

---

## 78. Tricky String & RegExp Questions

### Q89: String Comparison Surprises

```javascript
console.log("10" > "9");        // ?
console.log("10" > 9);          // ?
console.log("abc" > "abd");     // ?
console.log("a" > "A");         // ?
console.log("" > null);         // ?
console.log("" == false);       // ?
```

<details>
<summary>Answer</summary>

```
false   ← string comparison is LEXICOGRAPHIC: "1" (49) < "9" (57)
true    ← one is number, so "10" → 10, 10 > 9
false   ← "c" (99) < "d" (100)
true    ← "a" (97) > "A" (65) — lowercase > uppercase in ASCII
false   ← "" → 0, null → 0, 0 > 0 is false
true    ← "" → 0, false → 0
```

**Trap:** When **both** operands are strings, comparison is **lexicographic** (character by character). When one is a number, the string is converted to a number.

</details>

### Q90: Tagged Template Literals

```javascript
function tag(strings, ...values) {
    console.log(strings); // ?
    console.log(values);  // ?
    return "custom";
}

const a = 10, b = 20;
const result = tag`Sum of ${a} and ${b} is ${a + b}`;
console.log(result); // ?
```

<details>
<summary>Answer</summary>

```
["Sum of ", " and ", " is ", ""]   ← always one more string than values
[10, 20, 30]
"custom"
```

**Explanation:** Tagged templates split the template at interpolation points. `strings` array always has `values.length + 1` elements. The tag function can return anything — here it returns `"custom"`, ignoring the template entirely. This is how `styled-components`, `graphql-tag`, and `lit-html` work.

</details>

### Q91: RegExp with Global Flag — Stateful!

```javascript
const regex = /ab/g;

console.log(regex.test("abc"));  // ?
console.log(regex.lastIndex);    // ?
console.log(regex.test("abc"));  // ?
console.log(regex.lastIndex);    // ?
console.log(regex.test("abc"));  // ?
```

<details>
<summary>Answer</summary>

```
true
2        ← lastIndex advanced past the match
false    ← starts searching from index 2, no match at position 2+
0        ← reset to 0 after failed match
true     ← starts from 0 again, finds match
```

**Trap:** Regular expressions with the `g` (global) or `y` (sticky) flag are **stateful** — they remember `lastIndex` between calls. This is a common source of bugs when reusing regex objects. Fix: either create a new RegExp each time, or manually reset `regex.lastIndex = 0`.

</details>

---

## 79. Tricky Error & Exception Questions

### Q92: Error in Promise Constructor

```javascript
const p = new Promise((resolve, reject) => {
    throw new Error("constructor error");
});

p.then(() => console.log("then"))
 .catch((e) => console.log("catch:", e.message));
```

<details>
<summary>Answer</summary>

```
catch: constructor error
```

**Explanation:** Errors thrown synchronously inside a Promise constructor are automatically caught and turn into a rejection. This is equivalent to calling `reject(new Error(...))`.

</details>

### Q93: Error After Resolve

```javascript
const p = new Promise((resolve) => {
    resolve("ok");
    throw new Error("after resolve");
});

p.then((v) => console.log("then:", v))
 .catch((e) => console.log("catch:", e.message));
```

<details>
<summary>Answer</summary>

```
then: ok
```

**Explanation:** The promise is already resolved when the `throw` happens. A resolved/rejected promise cannot change state. The thrown error is **silently swallowed** — it doesn't become an unhandled exception, and the `.catch` is never called.

</details>

### Q94: Error in setTimeout Inside a Promise

```javascript
const p = new Promise((resolve) => {
    setTimeout(() => {
        throw new Error("timeout error");
    }, 0);
    resolve("ok");
});

p.then((v) => console.log("then:", v))
 .catch((e) => console.log("catch:", e.message));
```

<details>
<summary>Answer</summary>

```
then: ok
// Plus: Uncaught Error: timeout error (crashes the process)
```

**Explanation:** The `setTimeout` callback runs **outside** the Promise constructor's try/catch scope. The promise is already resolved with `"ok"`. The `throw` inside setTimeout is a completely separate context — it becomes an **uncaught exception** that is NOT caught by `.catch()`.

</details>

### Q95: Finally Return Value

```javascript
function test() {
    try {
        return 1;
    } finally {
        return 2;
    }
}

console.log(test()); // ?

function test2() {
    try {
        return 1;
    } finally {
        console.log("finally");
    }
}

console.log(test2()); // ?
```

<details>
<summary>Answer</summary>

```
2

finally
1
```

**Explanation:** In `test()`, the `return 2` in `finally` **overrides** the `return 1` from the try block. A `return` in `finally` always wins. In `test2()`, `finally` runs (prints "finally") but doesn't return anything, so the original `return 1` is preserved.

> **Rule:** Never put `return` in a `finally` block — it silently swallows both return values AND thrown errors.

</details>

### Q96: finally Swallowing Errors

```javascript
function dangerous() {
    try {
        throw new Error("critical");
    } finally {
        return "safe"; // swallows the error!
    }
}

try {
    console.log(dangerous()); // ?
} catch (e) {
    console.log("Caught:", e.message);
}
```

<details>
<summary>Answer</summary>

```
safe
```

The `catch` block is **never reached**! The `return "safe"` in `finally` completely swallows the thrown error. The function returns `"safe"` as if nothing went wrong.

</details>

---

## 80. Tricky Property & Accessor Questions

### Q97: Getter That Mutates

```javascript
const obj = {
    _count: 0,
    get count() {
        return ++this._count;
    },
};

console.log(obj.count);  // ?
console.log(obj.count);  // ?
console.log(obj.count);  // ?

console.log(JSON.stringify(obj)); // ?
```

<details>
<summary>Answer</summary>

```
1
2
3
{"_count":4,"count":5}
```

Wait — `JSON.stringify` calls getters. Let me re-check:

Actually, `JSON.stringify` does invoke getters. When serializing, it accesses `obj.count` which calls the getter again.

```
1
2
3
{"_count":3,"count":4}
```

`_count` is 3 after three reads. Then `JSON.stringify` reads `_count` (3) and triggers `count` getter → `_count` becomes 4, returns 4. But `JSON.stringify` reads `_count` first at current value 3, then `count` reads and increments... Actually, order depends on key enumeration:

`_count` is defined first, so it's serialized first as `3`. Then `count` getter fires → increments to `4`, returns `4`. So: `{"_count":3,"count":4}`.

Wait, but `_count` is serialized as its value AT THAT POINT. The serializer accesses keys in order. When it reads `_count`, it gets `3`. Then when it reads `count` (the getter), `_count` becomes `4` and `count` returns `4`. But `_count` was already serialized as `3`.

```
1
2
3
{"_count":3,"count":4}
```

</details>

### Q98: defineProperty Traps

```javascript
const obj = {};

Object.defineProperty(obj, "x", {
    value: 42,
    writable: false,
    enumerable: false,
    configurable: false,
});

obj.x = 100;
console.log(obj.x);            // ?
console.log(Object.keys(obj));  // ?
console.log("x" in obj);        // ?
delete obj.x;
console.log(obj.x);            // ?
```

<details>
<summary>Answer</summary>

```
42              ← writable: false — assignment silently fails (or TypeError in strict)
[]              ← enumerable: false — not visible in Object.keys/for...in
true            ← 'in' operator still finds non-enumerable properties
42              ← configurable: false — delete silently fails
```

**Explanation:** `Object.defineProperty` gives fine-grained control. `writable: false` prevents changes, `enumerable: false` hides from iteration, `configurable: false` prevents deletion and further property descriptor changes.

</details>

### Q99: Property Enumeration Differences

```javascript
const parent = { a: 1 };
const child = Object.create(parent);
child.b = 2;

Object.defineProperty(child, "c", { value: 3, enumerable: false });

const sym = Symbol("d");
child[sym] = 4;

console.log(Object.keys(child));                  // ?
console.log(Object.getOwnPropertyNames(child));   // ?
console.log(Object.getOwnPropertySymbols(child)); // ?
console.log(Reflect.ownKeys(child));               // ?

const forIn = [];
for (const key in child) forIn.push(key);
console.log(forIn);                                // ?
```

<details>
<summary>Answer</summary>

```
["b"]                        ← own enumerable string keys only
["b", "c"]                   ← own string keys (including non-enumerable)
[Symbol(d)]                  ← own symbol keys only
["b", "c", Symbol(d)]       ← ALL own keys (strings + symbols)
["b", "a"]                   ← own + inherited enumerable string keys
```

| Method | Own? | Inherited? | Non-enumerable? | Symbols? |
|--------|------|-----------|----------------|---------|
| `Object.keys` | Own | No | No | No |
| `Object.getOwnPropertyNames` | Own | No | **Yes** | No |
| `Object.getOwnPropertySymbols` | Own | No | Yes | **Yes** |
| `Reflect.ownKeys` | Own | No | **Yes** | **Yes** |
| `for...in` | Own | **Yes** | No | No |

</details>

---

## 81. Tricky Promise Scheduling Deep Dive

### Q100: Interleaved Promise Chains

```javascript
Promise.resolve()
    .then(() => console.log("A1"))
    .then(() => console.log("A2"))
    .then(() => console.log("A3"));

Promise.resolve()
    .then(() => console.log("B1"))
    .then(() => console.log("B2"))
    .then(() => console.log("B3"));
```

<details>
<summary>Answer</summary>

```
A1
B1
A2
B2
A3
B3
```

**Explanation:** This is a common interview trick. The two chains **interleave**! Here's why:

1. Both `Promise.resolve().then(...)` schedule their first callbacks as microtasks: `[A1, B1]`.
2. `A1` runs → its `.then` schedules `A2` as a new microtask: `[B1, A2]`.
3. `B1` runs → its `.then` schedules `B2`: `[A2, B2]`.
4. `A2` runs → schedules `A3`: `[B2, A3]`.
5. `B2` runs → schedules `B3`: `[A3, B3]`.
6. `A3` runs, then `B3` runs.

Each `.then` in a chain only schedules the **next** callback after the **current** one completes.

</details>

### Q101: Three Chains Interleaving

```javascript
Promise.resolve()
    .then(() => console.log(1))
    .then(() => console.log(2))
    .then(() => console.log(3));

Promise.resolve()
    .then(() => console.log("a"))
    .then(() => console.log("b"))
    .then(() => console.log("c"));

Promise.resolve()
    .then(() => console.log("X"))
    .then(() => console.log("Y"))
    .then(() => console.log("Z"));
```

<details>
<summary>Answer</summary>

```
1
a
X
2
b
Y
3
c
Z
```

**Explanation:** Same interleaving principle. Initial microtask queue: `[1, a, X]`. After first round: `[2, b, Y]`. After second: `[3, c, Z]`. Round-robin-style execution.

</details>

### Q102: Nested Promise.resolve

```javascript
Promise.resolve()
    .then(() => {
        console.log("A");
        return Promise.resolve("inner");
    })
    .then((val) => console.log("B:", val));

Promise.resolve()
    .then(() => console.log("C"))
    .then(() => console.log("D"));
```

<details>
<summary>Answer</summary>

```
A
C
D
B: inner
```

**Explanation:** When you return a `Promise.resolve("inner")` from a `.then`, the engine needs **2 extra microtask ticks** to unwrap it (this is per the Promises/A+ spec — it calls `.then` on the returned thenable). So `"B"` is delayed by 2 ticks after `"A"`, allowing `C` and `D` to slip in.

This is a well-known V8 behavior and a **very popular interview question** at top companies.

</details>

---

## 82. Tricky Comparison & Sorting

### Q103: Array.sort Without Comparator

```javascript
console.log([10, 9, 8, 1, 2, 3].sort());     // ?
console.log([1, 30, 4, 21, 100000].sort());   // ?
console.log([undefined, null, 0, "", false, NaN].sort()); // ?
```

<details>
<summary>Answer</summary>

```
[1, 10, 2, 3, 8, 9]            ← sorted as STRINGS ("10" < "2")!
[1, 100000, 21, 30, 4]         ← string comparison
[0, NaN, "", false, null, undefined]  ← undefined always sorts to the end
```

**Explanation:** `Array.sort()` without a comparator converts all elements to **strings** and sorts lexicographically. `"10" < "2"` because `"1" < "2"`. `undefined` values are always placed at the end regardless of comparator.

**Fix:** Always provide a comparator for numbers:

```javascript
[10, 9, 8, 1, 2, 3].sort((a, b) => a - b); // [1, 2, 3, 8, 9, 10]
```

</details>

### Q104: Weird Comparisons

```javascript
console.log(null > 0);        // ?
console.log(null < 0);        // ?
console.log(null == 0);       // ?
console.log(null >= 0);       // ?

console.log(undefined > 0);   // ?
console.log(undefined < 0);   // ?
console.log(undefined == 0);  // ?
```

<details>
<summary>Answer</summary>

```
false    ← null → 0, 0 > 0 is false
false    ← null → 0, 0 < 0 is false
false    ← special rule: null only == undefined
true     ← null → 0, 0 >= 0 is TRUE!

false    ← undefined → NaN, NaN > 0 is false
false    ← NaN < 0 is false
false    ← undefined only == null
```

**Key trap:** `null >= 0` is `true` but `null > 0` is `false` and `null == 0` is `false`. This is because `>=` and `>` use **numeric conversion** (null → 0), but `==` uses **special rules** (null only equals undefined).

</details>

---

## 83. Tricky Logical Operators & Nullish

### Q105: Assignment Operators

```javascript
let a = null;
let b = undefined;
let c = 0;
let d = "";
let e = false;

a ??= "default";   // ?
b ??= "default";   // ?
c ??= "default";   // ?
d ||= "default";   // ?
e &&= "truthy";    // ?
```

<details>
<summary>Answer</summary>

```
a = "default"    ← null is nullish, so assign
b = "default"    ← undefined is nullish, so assign
c = 0            ← 0 is NOT nullish, so keep
d = "default"    ← "" is falsy, so ||= assigns
e = false        ← false is falsy, so &&= does NOT assign (short-circuits)
```

| Operator | Assigns when current value is... |
|---------|--------------------------------|
| `??=` | `null` or `undefined` only |
| `\|\|=` | Any falsy value (0, "", false, null, undefined, NaN) |
| `&&=` | Any truthy value |

</details>

### Q106: Short-Circuit Side Effects

```javascript
let x = 0;

true || x++;
false || x++;
true && x++;
false && x++;

console.log(x); // ?
```

<details>
<summary>Answer</summary>

```
2
```

**Trace:**
- `true || x++` → short-circuits, `x++` **not** evaluated. x = 0.
- `false || x++` → evaluates right side, `x++` runs. x = 1.
- `true && x++` → evaluates right side, `x++` runs. x = 2.
- `false && x++` → short-circuits, `x++` **not** evaluated. x = 2.

</details>

---

## 84. Tricky TypeScript Runtime Questions

### Q107: Enum Reverse Mapping

```typescript
enum Color {
    Red,    // 0
    Green,  // 1
    Blue,   // 2
}

console.log(Color.Red);     // ?
console.log(Color[0]);      // ?
console.log(Color["Red"]);  // ?
console.log(Object.keys(Color)); // ?
```

<details>
<summary>Answer</summary>

```
0
"Red"      ← numeric enums have REVERSE mapping
0
["0", "1", "2", "Red", "Green", "Blue"]  ← 6 keys (both directions)
```

**Explanation:** TypeScript numeric enums create a **bidirectional mapping**. `Color[0]` gives `"Red"` and `Color.Red` gives `0`. This means `Object.keys` returns **twice the number of entries** — the numeric keys AND the string keys. This is a common gotcha.

String enums do NOT have reverse mapping:

```typescript
enum StringColor { Red = "RED" }
console.log(Object.keys(StringColor)); // ["Red"] — only 1 key
```

</details>

### Q108: Type Assertions at Runtime

```typescript
interface User {
    name: string;
    age: number;
}

const data: any = { name: "Alice" };
const user = data as User;

console.log(user.name); // ?
console.log(user.age);  // ?
```

<details>
<summary>Answer</summary>

```
"Alice"
undefined
```

**Explanation:** `as User` is a **compile-time only** assertion. It does NOT validate or transform the data at runtime. TypeScript types are erased during compilation. `user.age` is `undefined` because the actual object doesn't have that property. This is why runtime validation (Zod, Joi, io-ts) is important for external data.

</details>

---

## 85. Tricky Bitwise & Number Questions

### Q109: Floating Point Madness

```javascript
console.log(0.1 + 0.2);            // ?
console.log(0.1 + 0.2 === 0.3);    // ?
console.log(0.1 + 0.2 > 0.3);      // ?

console.log(9999999999999999);      // ?
console.log(Number.MAX_SAFE_INTEGER); // ?
console.log(Number.MAX_SAFE_INTEGER + 1 === Number.MAX_SAFE_INTEGER + 2); // ?
```

<details>
<summary>Answer</summary>

```
0.30000000000000004
false
true

10000000000000000    ← 16 nines becomes 10^16 — precision lost!
9007199254740991
true                 ← beyond MAX_SAFE_INTEGER, arithmetic breaks
```

**Fix for floating point comparison:**

```javascript
Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON // true
```

**Fix for large integers:** Use `BigInt`:

```javascript
9999999999999999n  // exact
```

</details>

### Q110: Bitwise Operators as Floor/Truncate

```javascript
console.log(~~3.7);       // ?
console.log(~~(-3.7));    // ?
console.log(3.7 | 0);     // ?
console.log((-3.7) | 0);  // ?
console.log(3.7 >> 0);    // ?

console.log(Math.floor(3.7));    // ?
console.log(Math.floor(-3.7));   // ?
console.log(Math.trunc(3.7));    // ?
console.log(Math.trunc(-3.7));   // ?
```

<details>
<summary>Answer</summary>

```
3       ← ~~ truncates toward zero
-3      ← truncates toward zero (NOT floor!)
3
-3
3

3       ← Math.floor rounds toward -infinity
-4      ← Math.floor(-3.7) = -4, NOT -3!
3       ← Math.trunc toward zero
-3      ← Math.trunc toward zero
```

**Key trap:** `~~`, `| 0`, and `>> 0` all truncate toward zero (like `Math.trunc`). `Math.floor` rounds toward **negative infinity**. For negative numbers, they give **different results**: `Math.floor(-3.7) = -4` but `~~(-3.7) = -3`.

Also, bitwise operators convert to **32-bit int**, so they fail for large numbers:

```javascript
~~(2 ** 31)  // -2147483648  ← overflow!
```

</details>

### Q111: parseInt Surprises

```javascript
console.log(parseInt("10"));       // ?
console.log(parseInt("10", 2));    // ?
console.log(parseInt("10", 8));    // ?
console.log(parseInt("10", 16));   // ?

console.log(parseInt("0x10"));     // ?
console.log(parseInt("010"));      // ?
console.log(parseInt("11", 2));    // ?

console.log(parseInt("abc", 16));  // ?
console.log(parseInt(""));         // ?
console.log(parseInt(null));       // ?
console.log(parseInt(undefined));  // ?
console.log(parseInt(Infinity));   // ?

console.log(parseInt(0.0000005)); // ?
```

<details>
<summary>Answer</summary>

```
10
2       ← "10" in base 2 = 2
8       ← "10" in base 8 = 8
16      ← "10" in base 16 = 16

16      ← "0x" prefix → auto base 16
10      ← modern JS treats as decimal (no auto-octal)
3       ← "11" in binary = 3

2748    ← abc in hex = 10*256 + 11*16 + 12 = 2748
NaN
NaN
NaN
NaN     ← "Infinity" — "I" is not a digit

5       ← THIS IS THE TRAP!
```

**The `parseInt(0.0000005)` trap:** `0.0000005` is converted to string first → `"5e-7"`. Then `parseInt` parses `"5e-7"` → reads `5`, stops at `e`. Result: `5`!

```javascript
String(0.0000005)    // "5e-7"
String(0.000005)     // "0.000005"  ← this one works fine
parseInt(0.000005)   // 0
parseInt(0.0000005)  // 5  ← surprise!
```

</details>

---

## Total Question Count

```
┌──────────────────────────────────────────────────┐
│  Original Q1–Q30:   30 questions                 │
│  Batch 2 Q31–Q75:   45 questions                 │
│  Batch 3 Q76–Q111:  36 questions                 │
│  ─────────────────────────────                   │
│  TOTAL:             111 output-based questions    │
└──────────────────────────────────────────────────┘
```

---

*Last updated: March 2026*

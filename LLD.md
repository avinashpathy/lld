# Low-Level Design (LLD) — Machine Coding Round Questions

> Real interview coding round problems with complete solutions in **TypeScript** and **Java**.
> Each problem focuses on OOP design, clean APIs, edge cases, and extensibility.

---

## Table of Contents

1. [MyCounter (Frequency Counter)](#1-mycounter-frequency-counter)
2. [LRU Cache](#2-lru-cache)
3. [Event Emitter / PubSub](#3-event-emitter--pubsub)
4. [Rate Limiter (Token Bucket)](#4-rate-limiter-token-bucket)
5. [In-Memory Key-Value Store with TTL](#5-in-memory-key-value-store-with-ttl)
6. [Task Scheduler / Job Queue](#6-task-scheduler--job-queue)
7. [Snake and Ladder Game](#7-snake-and-ladder-game)
8. [Parking Lot System](#8-parking-lot-system)
9. [Splitwise (Expense Sharing)](#9-splitwise-expense-sharing)
10. [Tic-Tac-Toe](#10-tic-tac-toe)
11. [Elevator System](#11-elevator-system)
12. [Logger Library](#12-logger-library)
13. [Promise.all / Promise Implementation](#13-promiseall--promise-implementation)
14. [HashMap from Scratch](#14-hashmap-from-scratch)
15. [Debounce & Throttle with Cancel](#15-debounce--throttle-with-cancel)
16. [Vending Machine (State Machine)](#16-vending-machine-state-machine)
17. [URL Shortener (In-Memory)](#17-url-shortener-in-memory)
18. [Middleware Pipeline (Express-like)](#18-middleware-pipeline-express-like)
19. [Pub/Sub Message Broker](#19-pubsub-message-broker)
20. [Cron Expression Parser](#20-cron-expression-parser)

---

## 1. MyCounter (Frequency Counter)

**Problem:** Implement a class `MyCounter` that behaves like Python's `collections.Counter`.
- Initialize with any iterable (array or string).
- `.most_common(n)` returns top n elements by frequency.
- Support `+` operator to combine two counters.
- Access counts like a dictionary; return `0` for missing keys.

### TypeScript

```typescript
class MyCounter<T = string> {
    private _counts: Map<T, number> = new Map();

    constructor(iterable: Iterable<T> = []) {
        for (const item of iterable) {
            this._counts.set(item, (this._counts.get(item) ?? 0) + 1);
        }
    }

    get counts(): Record<string, number> {
        const result: Record<string, number> = {};
        for (const [key, value] of this._counts) {
            result[String(key)] = value;
        }
        return result;
    }

    get(key: T): number {
        return this._counts.get(key) ?? 0;
    }

    set(key: T, value: number): void {
        if (value <= 0) {
            this._counts.delete(key);
        } else {
            this._counts.set(key, value);
        }
    }

    mostCommon(n?: number): [T, number][] {
        const sorted = [...this._counts.entries()].sort((a, b) => b[1] - a[1]);
        return n !== undefined ? sorted.slice(0, n) : sorted;
    }

    add(other: MyCounter<T>): MyCounter<T> {
        const result = new MyCounter<T>();
        for (const [key, count] of this._counts) {
            result.set(key, count);
        }
        for (const [key, count] of other._counts) {
            result.set(key, result.get(key) + count);
        }
        return result;
    }

    subtract(other: MyCounter<T>): MyCounter<T> {
        const result = new MyCounter<T>();
        for (const [key, count] of this._counts) {
            result.set(key, count);
        }
        for (const [key, count] of other._counts) {
            const diff = result.get(key) - count;
            result.set(key, diff);
        }
        return result;
    }

    total(): number {
        let sum = 0;
        for (const count of this._counts.values()) sum += count;
        return sum;
    }

    keys(): IterableIterator<T> {
        return this._counts.keys();
    }

    values(): IterableIterator<number> {
        return this._counts.values();
    }

    entries(): IterableIterator<[T, number]> {
        return this._counts.entries();
    }

    [Symbol.iterator](): IterableIterator<[T, number]> {
        return this._counts.entries();
    }

    toString(): string {
        const pairs = [...this._counts.entries()]
            .map(([k, v]) => `'${k}': ${v}`)
            .join(", ");
        return `MyCounter({${pairs}})`;
    }
}

// --- Usage ---

const c1 = new MyCounter(["a", "b", "a", "c", "a", "b"]);
console.log(c1.counts);         // { a: 3, b: 2, c: 1 }
console.log(c1.get("a"));       // 3
console.log(c1.get("z"));       // 0 (not an error)
console.log(c1.mostCommon(2));   // [['a', 3], ['b', 2]]

const c2 = new MyCounter(["b", "b", "d"]);
const c3 = c1.add(c2);
console.log(c3.counts);         // { a: 3, b: 4, c: 1, d: 1 }

const fromString = new MyCounter("mississippi");
console.log(fromString.mostCommon(3)); // [['s', 4], ['i', 4], ['p', 2]]
```

### Java

```java
import java.util.*;
import java.util.stream.Collectors;

public class MyCounter<T> implements Iterable<Map.Entry<T, Integer>> {
    private final Map<T, Integer> counts = new HashMap<>();

    public MyCounter() {}

    public MyCounter(Iterable<T> iterable) {
        for (T item : iterable) {
            counts.merge(item, 1, Integer::sum);
        }
    }

    public MyCounter(T[] array) {
        this(Arrays.asList(array));
    }

    // Factory for strings
    public static MyCounter<Character> fromString(String str) {
        MyCounter<Character> counter = new MyCounter<>();
        for (char c : str.toCharArray()) {
            counter.counts.merge(c, 1, Integer::sum);
        }
        return counter;
    }

    public int get(T key) {
        return counts.getOrDefault(key, 0);
    }

    public void set(T key, int value) {
        if (value <= 0) counts.remove(key);
        else counts.put(key, value);
    }

    public Map<T, Integer> getCounts() {
        return Collections.unmodifiableMap(counts);
    }

    public List<Map.Entry<T, Integer>> mostCommon(int n) {
        return counts.entrySet().stream()
            .sorted((a, b) -> b.getValue() - a.getValue())
            .limit(n)
            .collect(Collectors.toList());
    }

    public MyCounter<T> add(MyCounter<T> other) {
        MyCounter<T> result = new MyCounter<>();
        result.counts.putAll(this.counts);
        for (Map.Entry<T, Integer> entry : other.counts.entrySet()) {
            result.counts.merge(entry.getKey(), entry.getValue(), Integer::sum);
        }
        return result;
    }

    public MyCounter<T> subtract(MyCounter<T> other) {
        MyCounter<T> result = new MyCounter<>();
        result.counts.putAll(this.counts);
        for (Map.Entry<T, Integer> entry : other.counts.entrySet()) {
            int diff = result.get(entry.getKey()) - entry.getValue();
            result.set(entry.getKey(), diff);
        }
        return result;
    }

    public int total() {
        return counts.values().stream().mapToInt(Integer::intValue).sum();
    }

    @Override
    public Iterator<Map.Entry<T, Integer>> iterator() {
        return counts.entrySet().iterator();
    }

    @Override
    public String toString() {
        return "MyCounter(" + counts + ")";
    }

    // --- Demo ---
    public static void main(String[] args) {
        MyCounter<String> c1 = new MyCounter<>(
            Arrays.asList("a", "b", "a", "c", "a", "b")
        );
        System.out.println(c1.getCounts());     // {a=3, b=2, c=1}
        System.out.println(c1.get("a"));         // 3
        System.out.println(c1.get("z"));         // 0
        System.out.println(c1.mostCommon(2));     // [a=3, b=2]

        MyCounter<String> c2 = new MyCounter<>(Arrays.asList("b", "b", "d"));
        MyCounter<String> c3 = c1.add(c2);
        System.out.println(c3.getCounts());       // {a=3, b=4, c=1, d=1}

        MyCounter<Character> fromStr = MyCounter.fromString("mississippi");
        System.out.println(fromStr.mostCommon(3)); // [s=4, i=4, p=2]
    }
}
```

---

## 2. LRU Cache

**Problem:** Design a Least Recently Used (LRU) cache with O(1) `get` and `put`.
- `get(key)` returns the value or -1 if not found.
- `put(key, value)` inserts or updates. If capacity exceeded, evict the least recently used entry.
- Both operations should mark the key as recently used.

### TypeScript

```typescript
class LRUNode<K, V> {
    prev: LRUNode<K, V> | null = null;
    next: LRUNode<K, V> | null = null;
    constructor(public key: K, public value: V) {}
}

class LRUCache<K, V> {
    private map = new Map<K, LRUNode<K, V>>();
    private head: LRUNode<K, V>;  // most recent
    private tail: LRUNode<K, V>;  // least recent
    private size = 0;

    constructor(private capacity: number) {
        this.head = new LRUNode<K, V>(null as any, null as any);
        this.tail = new LRUNode<K, V>(null as any, null as any);
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    get(key: K): V | -1 {
        const node = this.map.get(key);
        if (!node) return -1;
        this.moveToHead(node);
        return node.value;
    }

    put(key: K, value: V): void {
        const existing = this.map.get(key);
        if (existing) {
            existing.value = value;
            this.moveToHead(existing);
            return;
        }

        const node = new LRUNode(key, value);
        this.map.set(key, node);
        this.addToHead(node);
        this.size++;

        if (this.size > this.capacity) {
            const evicted = this.removeTail();
            this.map.delete(evicted.key);
            this.size--;
        }
    }

    delete(key: K): boolean {
        const node = this.map.get(key);
        if (!node) return false;
        this.removeNode(node);
        this.map.delete(key);
        this.size--;
        return true;
    }

    getSize(): number {
        return this.size;
    }

    private addToHead(node: LRUNode<K, V>): void {
        node.prev = this.head;
        node.next = this.head.next;
        this.head.next!.prev = node;
        this.head.next = node;
    }

    private removeNode(node: LRUNode<K, V>): void {
        node.prev!.next = node.next;
        node.next!.prev = node.prev;
    }

    private moveToHead(node: LRUNode<K, V>): void {
        this.removeNode(node);
        this.addToHead(node);
    }

    private removeTail(): LRUNode<K, V> {
        const node = this.tail.prev!;
        this.removeNode(node);
        return node;
    }
}

// --- Usage ---
const cache = new LRUCache<string, number>(3);
cache.put("a", 1);
cache.put("b", 2);
cache.put("c", 3);
console.log(cache.get("a"));  // 1 (moves 'a' to most recent)
cache.put("d", 4);            // evicts 'b' (least recently used)
console.log(cache.get("b"));  // -1 (evicted)
console.log(cache.get("c"));  // 3
console.log(cache.get("d"));  // 4
```

### Java

```java
import java.util.HashMap;
import java.util.Map;

public class LRUCache<K, V> {
    private static class Node<K, V> {
        K key;
        V value;
        Node<K, V> prev, next;

        Node(K key, V value) {
            this.key = key;
            this.value = value;
        }
    }

    private final int capacity;
    private final Map<K, Node<K, V>> map = new HashMap<>();
    private final Node<K, V> head = new Node<>(null, null);
    private final Node<K, V> tail = new Node<>(null, null);
    private int size = 0;

    public LRUCache(int capacity) {
        this.capacity = capacity;
        head.next = tail;
        tail.prev = head;
    }

    public V get(K key) {
        Node<K, V> node = map.get(key);
        if (node == null) return null;
        moveToHead(node);
        return node.value;
    }

    public void put(K key, V value) {
        Node<K, V> existing = map.get(key);
        if (existing != null) {
            existing.value = value;
            moveToHead(existing);
            return;
        }
        Node<K, V> node = new Node<>(key, value);
        map.put(key, node);
        addToHead(node);
        size++;

        if (size > capacity) {
            Node<K, V> evicted = removeTail();
            map.remove(evicted.key);
            size--;
        }
    }

    private void addToHead(Node<K, V> node) {
        node.prev = head;
        node.next = head.next;
        head.next.prev = node;
        head.next = node;
    }

    private void removeNode(Node<K, V> node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    private void moveToHead(Node<K, V> node) {
        removeNode(node);
        addToHead(node);
    }

    private Node<K, V> removeTail() {
        Node<K, V> node = tail.prev;
        removeNode(node);
        return node;
    }

    public static void main(String[] args) {
        LRUCache<String, Integer> cache = new LRUCache<>(3);
        cache.put("a", 1);
        cache.put("b", 2);
        cache.put("c", 3);
        System.out.println(cache.get("a")); // 1
        cache.put("d", 4);                   // evicts 'b'
        System.out.println(cache.get("b")); // null
        System.out.println(cache.get("c")); // 3
    }
}
```

---

## 3. Event Emitter / PubSub

**Problem:** Implement an `EventEmitter` class supporting:
- `on(event, listener)` — register a listener.
- `off(event, listener)` — unregister a listener.
- `once(event, listener)` — listener fires only once.
- `emit(event, ...args)` — invoke all listeners for the event.
- Return count of listeners invoked.

### TypeScript

```typescript
type Listener = (...args: any[]) => void;

class EventEmitter {
    private listeners = new Map<string, Listener[]>();

    on(event: string, listener: Listener): () => void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)!.push(listener);

        return () => this.off(event, listener); // return unsubscribe function
    }

    off(event: string, listener: Listener): void {
        const fns = this.listeners.get(event);
        if (!fns) return;
        const idx = fns.indexOf(listener);
        if (idx !== -1) fns.splice(idx, 1);
        if (fns.length === 0) this.listeners.delete(event);
    }

    once(event: string, listener: Listener): () => void {
        const wrapper: Listener = (...args) => {
            listener(...args);
            this.off(event, wrapper);
        };
        return this.on(event, wrapper);
    }

    emit(event: string, ...args: any[]): number {
        const fns = this.listeners.get(event);
        if (!fns || fns.length === 0) return 0;
        const snapshot = [...fns]; // snapshot to avoid mutation during iteration
        for (const fn of snapshot) {
            fn(...args);
        }
        return snapshot.length;
    }

    listenerCount(event: string): number {
        return this.listeners.get(event)?.length ?? 0;
    }

    removeAllListeners(event?: string): void {
        if (event) {
            this.listeners.delete(event);
        } else {
            this.listeners.clear();
        }
    }
}

// --- Usage ---
const emitter = new EventEmitter();

const unsub = emitter.on("message", (text) => console.log("Received:", text));
emitter.once("message", (text) => console.log("Once:", text));

emitter.emit("message", "hello");
// Received: hello
// Once: hello

emitter.emit("message", "world");
// Received: world        (once listener is gone)

unsub(); // unsubscribe
emitter.emit("message", "test");
// (nothing — all listeners removed)
```

### Java

```java
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.function.Consumer;

public class EventEmitter {
    @FunctionalInterface
    public interface Listener {
        void handle(Object... args);
    }

    private final Map<String, List<Listener>> listeners = new HashMap<>();

    public Runnable on(String event, Listener listener) {
        listeners.computeIfAbsent(event, k -> new CopyOnWriteArrayList<>()).add(listener);
        return () -> off(event, listener);
    }

    public void off(String event, Listener listener) {
        List<Listener> fns = listeners.get(event);
        if (fns != null) {
            fns.remove(listener);
            if (fns.isEmpty()) listeners.remove(event);
        }
    }

    public Runnable once(String event, Listener listener) {
        Listener[] wrapperHolder = new Listener[1];
        wrapperHolder[0] = (args) -> {
            listener.handle(args);
            off(event, wrapperHolder[0]);
        };
        return on(event, wrapperHolder[0]);
    }

    public int emit(String event, Object... args) {
        List<Listener> fns = listeners.get(event);
        if (fns == null || fns.isEmpty()) return 0;
        List<Listener> snapshot = new ArrayList<>(fns);
        for (Listener fn : snapshot) {
            fn.handle(args);
        }
        return snapshot.size();
    }

    public int listenerCount(String event) {
        List<Listener> fns = listeners.get(event);
        return fns == null ? 0 : fns.size();
    }

    public static void main(String[] args) {
        EventEmitter emitter = new EventEmitter();
        Runnable unsub = emitter.on("data", (a) -> System.out.println("Got: " + a[0]));
        emitter.once("data", (a) -> System.out.println("Once: " + a[0]));

        emitter.emit("data", "hello"); // Got: hello \n Once: hello
        emitter.emit("data", "world"); // Got: world
        unsub.run();
        emitter.emit("data", "test");  // (nothing)
    }
}
```

---

## 4. Rate Limiter (Token Bucket)

**Problem:** Implement a rate limiter using the Token Bucket algorithm.
- `tryConsume()` returns `true` if request is allowed, `false` otherwise.
- Configurable capacity and refill rate.
- Tokens refill over time automatically.

### TypeScript

```typescript
class TokenBucketRateLimiter {
    private tokens: number;
    private lastRefillTime: number;

    constructor(
        private capacity: number,
        private refillRatePerSecond: number
    ) {
        this.tokens = capacity;
        this.lastRefillTime = Date.now();
    }

    tryConsume(tokensNeeded: number = 1): boolean {
        this.refill();
        if (this.tokens >= tokensNeeded) {
            this.tokens -= tokensNeeded;
            return true;
        }
        return false;
    }

    private refill(): void {
        const now = Date.now();
        const elapsedSeconds = (now - this.lastRefillTime) / 1000;
        const newTokens = elapsedSeconds * this.refillRatePerSecond;
        this.tokens = Math.min(this.capacity, this.tokens + newTokens);
        this.lastRefillTime = now;
    }

    getAvailableTokens(): number {
        this.refill();
        return Math.floor(this.tokens);
    }
}

// Per-user rate limiter
class RateLimiterService {
    private limiters = new Map<string, TokenBucketRateLimiter>();

    constructor(
        private capacity: number,
        private refillRate: number
    ) {}

    isAllowed(userId: string): boolean {
        if (!this.limiters.has(userId)) {
            this.limiters.set(userId, new TokenBucketRateLimiter(this.capacity, this.refillRate));
        }
        return this.limiters.get(userId)!.tryConsume();
    }
}

// Sliding Window variant
class SlidingWindowRateLimiter {
    private timestamps: number[] = [];

    constructor(
        private maxRequests: number,
        private windowMs: number
    ) {}

    tryConsume(): boolean {
        const now = Date.now();
        const windowStart = now - this.windowMs;

        // Remove timestamps outside the window
        while (this.timestamps.length > 0 && this.timestamps[0] <= windowStart) {
            this.timestamps.shift();
        }

        if (this.timestamps.length < this.maxRequests) {
            this.timestamps.push(now);
            return true;
        }
        return false;
    }
}

// --- Usage ---
const limiter = new RateLimiterService(5, 1); // 5 capacity, refill 1/sec

for (let i = 0; i < 8; i++) {
    console.log(`Request ${i + 1}: ${limiter.isAllowed("user1") ? "ALLOWED" : "BLOCKED"}`);
}
// First 5: ALLOWED, last 3: BLOCKED
```

### Java

```java
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class TokenBucketRateLimiter {
    private double tokens;
    private long lastRefillTime;
    private final int capacity;
    private final double refillRatePerSecond;

    public TokenBucketRateLimiter(int capacity, double refillRatePerSecond) {
        this.capacity = capacity;
        this.refillRatePerSecond = refillRatePerSecond;
        this.tokens = capacity;
        this.lastRefillTime = System.currentTimeMillis();
    }

    public synchronized boolean tryConsume(int tokensNeeded) {
        refill();
        if (tokens >= tokensNeeded) {
            tokens -= tokensNeeded;
            return true;
        }
        return false;
    }

    public synchronized boolean tryConsume() {
        return tryConsume(1);
    }

    private void refill() {
        long now = System.currentTimeMillis();
        double elapsed = (now - lastRefillTime) / 1000.0;
        tokens = Math.min(capacity, tokens + elapsed * refillRatePerSecond);
        lastRefillTime = now;
    }

    // Per-user service
    public static class Service {
        private final Map<String, TokenBucketRateLimiter> limiters = new ConcurrentHashMap<>();
        private final int capacity;
        private final double refillRate;

        public Service(int capacity, double refillRate) {
            this.capacity = capacity;
            this.refillRate = refillRate;
        }

        public boolean isAllowed(String userId) {
            return limiters
                .computeIfAbsent(userId, k -> new TokenBucketRateLimiter(capacity, refillRate))
                .tryConsume();
        }
    }

    public static void main(String[] args) {
        Service service = new Service(5, 1);
        for (int i = 1; i <= 8; i++) {
            System.out.println("Request " + i + ": " +
                (service.isAllowed("user1") ? "ALLOWED" : "BLOCKED"));
        }
    }
}
```

---

## 5. In-Memory Key-Value Store with TTL

**Problem:** Design an in-memory key-value store (like a simplified Redis) supporting:
- `set(key, value, ttlMs?)` — set a key with optional TTL.
- `get(key)` — returns value or `null` if expired/missing.
- `delete(key)` — remove a key.
- `keys()` — return all non-expired keys.
- Auto-expire entries.

### TypeScript

```typescript
interface StoreEntry<V> {
    value: V;
    expiresAt: number | null;
}

class KVStore<V = any> {
    private store = new Map<string, StoreEntry<V>>();
    private cleanupTimer: ReturnType<typeof setInterval>;

    constructor(cleanupIntervalMs: number = 5000) {
        this.cleanupTimer = setInterval(() => this.cleanup(), cleanupIntervalMs);
    }

    set(key: string, value: V, ttlMs?: number): void {
        this.store.set(key, {
            value,
            expiresAt: ttlMs ? Date.now() + ttlMs : null,
        });
    }

    get(key: string): V | null {
        const entry = this.store.get(key);
        if (!entry) return null;
        if (this.isExpired(entry)) {
            this.store.delete(key);
            return null;
        }
        return entry.value;
    }

    delete(key: string): boolean {
        return this.store.delete(key);
    }

    has(key: string): boolean {
        return this.get(key) !== null;
    }

    keys(): string[] {
        const result: string[] = [];
        for (const [key, entry] of this.store) {
            if (!this.isExpired(entry)) {
                result.push(key);
            }
        }
        return result;
    }

    ttl(key: string): number | null {
        const entry = this.store.get(key);
        if (!entry || this.isExpired(entry)) return null;
        if (entry.expiresAt === null) return -1; // no expiry
        return Math.max(0, entry.expiresAt - Date.now());
    }

    size(): number {
        this.cleanup();
        return this.store.size;
    }

    setExpiry(key: string, ttlMs: number): boolean {
        const entry = this.store.get(key);
        if (!entry || this.isExpired(entry)) return false;
        entry.expiresAt = Date.now() + ttlMs;
        return true;
    }

    private isExpired(entry: StoreEntry<V>): boolean {
        return entry.expiresAt !== null && Date.now() > entry.expiresAt;
    }

    private cleanup(): void {
        for (const [key, entry] of this.store) {
            if (this.isExpired(entry)) {
                this.store.delete(key);
            }
        }
    }

    destroy(): void {
        clearInterval(this.cleanupTimer);
        this.store.clear();
    }
}

// --- Usage ---
const store = new KVStore();

store.set("name", "Alice");
store.set("session", "abc123", 3000); // expires in 3 seconds

console.log(store.get("name"));     // "Alice"
console.log(store.get("session"));  // "abc123"
console.log(store.keys());          // ["name", "session"]
console.log(store.ttl("session"));  // ~3000

setTimeout(() => {
    console.log(store.get("session"));  // null (expired)
    console.log(store.keys());          // ["name"]
    store.destroy();
}, 4000);
```

### Java

```java
import java.util.*;
import java.util.concurrent.*;

public class KVStore<V> {
    private static class Entry<V> {
        V value;
        Long expiresAt; // null = no expiry

        Entry(V value, Long expiresAt) {
            this.value = value;
            this.expiresAt = expiresAt;
        }

        boolean isExpired() {
            return expiresAt != null && System.currentTimeMillis() > expiresAt;
        }
    }

    private final ConcurrentHashMap<String, Entry<V>> store = new ConcurrentHashMap<>();
    private final ScheduledExecutorService cleaner = Executors.newSingleThreadScheduledExecutor();

    public KVStore(long cleanupIntervalMs) {
        cleaner.scheduleAtFixedRate(this::cleanup, cleanupIntervalMs, cleanupIntervalMs,
            TimeUnit.MILLISECONDS);
    }

    public KVStore() { this(5000); }

    public void set(String key, V value) {
        store.put(key, new Entry<>(value, null));
    }

    public void set(String key, V value, long ttlMs) {
        store.put(key, new Entry<>(value, System.currentTimeMillis() + ttlMs));
    }

    public V get(String key) {
        Entry<V> entry = store.get(key);
        if (entry == null || entry.isExpired()) {
            store.remove(key);
            return null;
        }
        return entry.value;
    }

    public boolean delete(String key) {
        return store.remove(key) != null;
    }

    public Set<String> keys() {
        Set<String> result = new HashSet<>();
        for (Map.Entry<String, Entry<V>> e : store.entrySet()) {
            if (!e.getValue().isExpired()) result.add(e.getKey());
        }
        return result;
    }

    private void cleanup() {
        store.entrySet().removeIf(e -> e.getValue().isExpired());
    }

    public void destroy() {
        cleaner.shutdown();
        store.clear();
    }

    public static void main(String[] args) throws InterruptedException {
        KVStore<String> store = new KVStore<>();
        store.set("name", "Alice");
        store.set("token", "xyz", 2000);

        System.out.println(store.get("name"));  // Alice
        System.out.println(store.get("token")); // xyz
        System.out.println(store.keys());        // [name, token]

        Thread.sleep(3000);
        System.out.println(store.get("token")); // null
        store.destroy();
    }
}
```

---

## 6. Task Scheduler / Job Queue

**Problem:** Implement a simple task scheduler that:
- Accepts tasks with a delay (run after N ms).
- Supports recurring tasks (run every N ms).
- Can cancel scheduled tasks.
- Processes tasks in order of their scheduled time.

### TypeScript

```typescript
interface ScheduledTask {
    id: string;
    fn: () => void | Promise<void>;
    runAt: number;
    intervalMs: number | null;
    cancelled: boolean;
}

class TaskScheduler {
    private tasks = new Map<string, ScheduledTask>();
    private timers = new Map<string, ReturnType<typeof setTimeout>>();
    private idCounter = 0;

    schedule(fn: () => void | Promise<void>, delayMs: number): string {
        const id = `task_${++this.idCounter}`;
        const task: ScheduledTask = {
            id,
            fn,
            runAt: Date.now() + delayMs,
            intervalMs: null,
            cancelled: false,
        };
        this.tasks.set(id, task);
        this.timers.set(
            id,
            setTimeout(async () => {
                if (!task.cancelled) {
                    await task.fn();
                }
                this.tasks.delete(id);
                this.timers.delete(id);
            }, delayMs)
        );
        return id;
    }

    scheduleRecurring(fn: () => void | Promise<void>, intervalMs: number): string {
        const id = `task_${++this.idCounter}`;
        const task: ScheduledTask = {
            id,
            fn,
            runAt: Date.now() + intervalMs,
            intervalMs,
            cancelled: false,
        };
        this.tasks.set(id, task);
        const timer = setInterval(async () => {
            if (task.cancelled) {
                clearInterval(timer);
                this.tasks.delete(id);
                this.timers.delete(id);
                return;
            }
            await task.fn();
        }, intervalMs);
        this.timers.set(id, timer as any);
        return id;
    }

    cancel(taskId: string): boolean {
        const task = this.tasks.get(taskId);
        if (!task) return false;
        task.cancelled = true;
        const timer = this.timers.get(taskId);
        if (timer) {
            clearTimeout(timer);
            clearInterval(timer as any);
        }
        this.tasks.delete(taskId);
        this.timers.delete(taskId);
        return true;
    }

    getPending(): { id: string; runsIn: number }[] {
        const now = Date.now();
        return [...this.tasks.values()]
            .filter((t) => !t.cancelled)
            .map((t) => ({ id: t.id, runsIn: Math.max(0, t.runAt - now) }))
            .sort((a, b) => a.runsIn - b.runsIn);
    }

    cancelAll(): void {
        for (const id of this.tasks.keys()) {
            this.cancel(id);
        }
    }
}

// --- Usage ---
const scheduler = new TaskScheduler();

const id1 = scheduler.schedule(() => console.log("Task 1: runs once after 1s"), 1000);
const id2 = scheduler.scheduleRecurring(() => console.log("Task 2: every 500ms"), 500);

setTimeout(() => {
    scheduler.cancel(id2);
    console.log("Cancelled recurring task");
}, 2200);
```

---

## 7. Snake and Ladder Game

**Problem:** Implement a Snake and Ladder game for multiple players.
- Configurable board size, snakes, and ladders.
- Auto dice roll. Players take turns.
- Win condition: reach or exceed the last cell.

### TypeScript

```typescript
class Board {
    private transitions = new Map<number, number>(); // position → new position

    constructor(
        readonly size: number,
        snakes: [number, number][], // [head, tail]
        ladders: [number, number][] // [bottom, top]
    ) {
        for (const [head, tail] of snakes) {
            if (head <= tail) throw new Error(`Invalid snake: ${head} → ${tail}`);
            this.transitions.set(head, tail);
        }
        for (const [bottom, top] of ladders) {
            if (bottom >= top) throw new Error(`Invalid ladder: ${bottom} → ${top}`);
            this.transitions.set(bottom, top);
        }
    }

    getTransition(position: number): number {
        return this.transitions.get(position) ?? position;
    }

    isWinningPosition(position: number): boolean {
        return position >= this.size;
    }
}

class Player {
    position = 0;
    constructor(readonly name: string) {}
}

class Dice {
    static roll(faces: number = 6): number {
        return Math.floor(Math.random() * faces) + 1;
    }
}

class SnakeAndLadderGame {
    private players: Player[];
    private currentPlayerIndex = 0;
    private winner: Player | null = null;
    private moveLog: string[] = [];

    constructor(
        playerNames: string[],
        private board: Board
    ) {
        this.players = playerNames.map((name) => new Player(name));
    }

    playTurn(): string {
        if (this.winner) return `Game over! ${this.winner.name} already won.`;

        const player = this.players[this.currentPlayerIndex];
        const roll = Dice.roll();
        const oldPos = player.position;
        let newPos = oldPos + roll;

        let log = `${player.name} rolled ${roll}: ${oldPos}`;

        if (newPos > this.board.size) {
            log += ` → can't move (would exceed ${this.board.size})`;
            this.advanceTurn();
            this.moveLog.push(log);
            return log;
        }

        const finalPos = this.board.getTransition(newPos);

        if (finalPos !== newPos) {
            const type = finalPos < newPos ? "Snake" : "Ladder";
            log += ` → ${newPos} → ${type}! → ${finalPos}`;
        } else {
            log += ` → ${newPos}`;
        }

        player.position = finalPos;

        if (this.board.isWinningPosition(finalPos)) {
            this.winner = player;
            log += ` 🏆 ${player.name} WINS!`;
        }

        this.moveLog.push(log);
        this.advanceTurn();
        return log;
    }

    private advanceTurn(): void {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    }

    isGameOver(): boolean {
        return this.winner !== null;
    }

    getWinner(): Player | null {
        return this.winner;
    }

    play(): string[] {
        while (!this.isGameOver()) {
            this.playTurn();
        }
        return this.moveLog;
    }
}

// --- Usage ---
const board = new Board(
    100,
    [[99, 2], [65, 40], [52, 10], [35, 6]],   // snakes
    [[3, 22], [8, 34], [20, 77], [32, 68]]     // ladders
);

const game = new SnakeAndLadderGame(["Alice", "Bob"], board);
const log = game.play();
log.forEach((entry) => console.log(entry));
```

---

## 8. Parking Lot System

**Problem:** Design a parking lot system.
- Multiple floors, each with different spot sizes (Small, Medium, Large).
- Vehicles: Bike, Car, Truck — each needs a specific spot size.
- Park a vehicle, unpark it, find available spots.
- Generate a ticket on parking.

### TypeScript

```typescript
enum VehicleType {
    Bike = "BIKE",
    Car = "CAR",
    Truck = "TRUCK",
}

enum SpotSize {
    Small = "SMALL",
    Medium = "MEDIUM",
    Large = "LARGE",
}

const VEHICLE_TO_SPOT: Record<VehicleType, SpotSize> = {
    [VehicleType.Bike]: SpotSize.Small,
    [VehicleType.Car]: SpotSize.Medium,
    [VehicleType.Truck]: SpotSize.Large,
};

class Vehicle {
    constructor(
        readonly licensePlate: string,
        readonly type: VehicleType
    ) {}
}

class ParkingSpot {
    vehicle: Vehicle | null = null;

    constructor(
        readonly id: string,
        readonly floor: number,
        readonly size: SpotSize
    ) {}

    isAvailable(): boolean {
        return this.vehicle === null;
    }

    park(vehicle: Vehicle): void {
        this.vehicle = vehicle;
    }

    unpark(): Vehicle | null {
        const v = this.vehicle;
        this.vehicle = null;
        return v;
    }
}

interface ParkingTicket {
    ticketId: string;
    licensePlate: string;
    spotId: string;
    floor: number;
    entryTime: Date;
}

class ParkingLot {
    private spots: ParkingSpot[] = [];
    private tickets = new Map<string, ParkingTicket>(); // licensePlate → ticket
    private ticketCounter = 0;

    constructor(
        readonly name: string,
        floorConfig: { floor: number; small: number; medium: number; large: number }[]
    ) {
        for (const config of floorConfig) {
            this.createSpots(config.floor, SpotSize.Small, config.small);
            this.createSpots(config.floor, SpotSize.Medium, config.medium);
            this.createSpots(config.floor, SpotSize.Large, config.large);
        }
    }

    private createSpots(floor: number, size: SpotSize, count: number): void {
        for (let i = 0; i < count; i++) {
            const id = `F${floor}-${size[0]}${this.spots.length + 1}`;
            this.spots.push(new ParkingSpot(id, floor, size));
        }
    }

    park(vehicle: Vehicle): ParkingTicket | null {
        if (this.tickets.has(vehicle.licensePlate)) {
            throw new Error(`Vehicle ${vehicle.licensePlate} is already parked`);
        }

        const requiredSize = VEHICLE_TO_SPOT[vehicle.type];
        const spot = this.spots.find(
            (s) => s.isAvailable() && s.size === requiredSize
        );

        if (!spot) return null; // no available spot

        spot.park(vehicle);
        const ticket: ParkingTicket = {
            ticketId: `T-${++this.ticketCounter}`,
            licensePlate: vehicle.licensePlate,
            spotId: spot.id,
            floor: spot.floor,
            entryTime: new Date(),
        };
        this.tickets.set(vehicle.licensePlate, ticket);
        return ticket;
    }

    unpark(licensePlate: string): { ticket: ParkingTicket; duration: number } | null {
        const ticket = this.tickets.get(licensePlate);
        if (!ticket) return null;

        const spot = this.spots.find((s) => s.id === ticket.spotId);
        if (spot) spot.unpark();

        this.tickets.delete(licensePlate);
        const duration = Date.now() - ticket.entryTime.getTime();
        return { ticket, duration };
    }

    getAvailableSpots(): Record<string, number> {
        const counts: Record<string, number> = {};
        for (const spot of this.spots) {
            if (spot.isAvailable()) {
                const key = `Floor ${spot.floor} - ${spot.size}`;
                counts[key] = (counts[key] ?? 0) + 1;
            }
        }
        return counts;
    }

    isFull(): boolean {
        return this.spots.every((s) => !s.isAvailable());
    }
}

// --- Usage ---
const lot = new ParkingLot("City Mall Parking", [
    { floor: 1, small: 5, medium: 10, large: 3 },
    { floor: 2, small: 5, medium: 10, large: 3 },
]);

const car = new Vehicle("KA-01-1234", VehicleType.Car);
const bike = new Vehicle("KA-02-5678", VehicleType.Bike);

const ticket1 = lot.park(car);
console.log("Parked:", ticket1);
console.log("Available:", lot.getAvailableSpots());

const result = lot.unpark("KA-01-1234");
console.log("Unparked:", result?.ticket.ticketId, "Duration:", result?.duration, "ms");
```

---

## 9. Splitwise (Expense Sharing)

**Problem:** Implement a simplified Splitwise.
- Users can add expenses (split equally or by exact amounts).
- Track who owes whom.
- Simplify debts (minimize transactions).
- Show balances.

### TypeScript

```typescript
interface Expense {
    id: string;
    paidBy: string;
    amount: number;
    splitBetween: string[];
    description: string;
}

class Splitwise {
    private users = new Set<string>();
    private expenses: Expense[] = [];
    private balances = new Map<string, Map<string, number>>(); // who → owes → amount
    private expenseCounter = 0;

    addUser(name: string): void {
        this.users.add(name);
        if (!this.balances.has(name)) {
            this.balances.set(name, new Map());
        }
    }

    addExpense(paidBy: string, amount: number, splitBetween: string[], description: string): string {
        for (const user of [paidBy, ...splitBetween]) {
            if (!this.users.has(user)) this.addUser(user);
        }

        const id = `EXP-${++this.expenseCounter}`;
        const expense: Expense = { id, paidBy, amount, splitBetween, description };
        this.expenses.push(expense);

        const perPerson = amount / splitBetween.length;

        for (const user of splitBetween) {
            if (user === paidBy) continue;
            this.addDebt(user, paidBy, perPerson);
        }

        return id;
    }

    addExpenseExact(
        paidBy: string,
        splits: { user: string; amount: number }[],
        description: string
    ): string {
        const totalSplit = splits.reduce((sum, s) => sum + s.amount, 0);
        const id = `EXP-${++this.expenseCounter}`;
        const expense: Expense = {
            id,
            paidBy,
            amount: totalSplit,
            splitBetween: splits.map((s) => s.user),
            description,
        };
        this.expenses.push(expense);

        for (const split of splits) {
            if (split.user === paidBy) continue;
            if (!this.users.has(split.user)) this.addUser(split.user);
            this.addDebt(split.user, paidBy, split.amount);
        }

        return id;
    }

    private addDebt(from: string, to: string, amount: number): void {
        if (!this.balances.has(from)) this.balances.set(from, new Map());
        if (!this.balances.has(to)) this.balances.set(to, new Map());

        // Check if 'to' already owes 'from' (net off)
        const reverseDebt = this.balances.get(to)!.get(from) ?? 0;
        if (reverseDebt > 0) {
            if (reverseDebt >= amount) {
                this.balances.get(to)!.set(from, reverseDebt - amount);
                return;
            } else {
                this.balances.get(to)!.set(from, 0);
                amount -= reverseDebt;
            }
        }

        const current = this.balances.get(from)!.get(to) ?? 0;
        this.balances.get(from)!.set(to, current + amount);
    }

    getBalances(): { from: string; to: string; amount: number }[] {
        const debts: { from: string; to: string; amount: number }[] = [];
        for (const [from, owes] of this.balances) {
            for (const [to, amount] of owes) {
                if (amount > 0) {
                    debts.push({ from, to, amount: Math.round(amount * 100) / 100 });
                }
            }
        }
        return debts;
    }

    getSimplifiedDebts(): { from: string; to: string; amount: number }[] {
        const netBalance = new Map<string, number>();

        for (const user of this.users) {
            netBalance.set(user, 0);
        }

        for (const { from, to, amount } of this.getBalances()) {
            netBalance.set(from, (netBalance.get(from) ?? 0) - amount);
            netBalance.set(to, (netBalance.get(to) ?? 0) + amount);
        }

        const debtors: { user: string; amount: number }[] = [];
        const creditors: { user: string; amount: number }[] = [];

        for (const [user, balance] of netBalance) {
            if (balance < -0.01) debtors.push({ user, amount: -balance });
            else if (balance > 0.01) creditors.push({ user, amount: balance });
        }

        debtors.sort((a, b) => b.amount - a.amount);
        creditors.sort((a, b) => b.amount - a.amount);

        const simplified: { from: string; to: string; amount: number }[] = [];
        let i = 0, j = 0;

        while (i < debtors.length && j < creditors.length) {
            const transfer = Math.min(debtors[i].amount, creditors[j].amount);
            simplified.push({
                from: debtors[i].user,
                to: creditors[j].user,
                amount: Math.round(transfer * 100) / 100,
            });
            debtors[i].amount -= transfer;
            creditors[j].amount -= transfer;
            if (debtors[i].amount < 0.01) i++;
            if (creditors[j].amount < 0.01) j++;
        }

        return simplified;
    }

    showBalances(): void {
        const debts = this.getSimplifiedDebts();
        if (debts.length === 0) {
            console.log("All settled up!");
            return;
        }
        for (const { from, to, amount } of debts) {
            console.log(`${from} owes ${to}: $${amount.toFixed(2)}`);
        }
    }
}

// --- Usage ---
const app = new Splitwise();

app.addExpense("Alice", 600, ["Alice", "Bob", "Charlie"], "Dinner");
app.addExpense("Bob", 300, ["Alice", "Bob", "Charlie"], "Taxi");
app.addExpense("Charlie", 150, ["Alice", "Charlie"], "Coffee");

console.log("--- All Debts ---");
console.log(app.getBalances());

console.log("\n--- Simplified ---");
app.showBalances();
// Alice owes: 200 to Alice (dinner share), but also owed 100 by Bob, etc.
// The simplified version minimizes the number of transactions
```

---

## 10. Tic-Tac-Toe

**Problem:** Implement an N×N Tic-Tac-Toe with O(1) move validation for a win.

### TypeScript

```typescript
class TicTacToe {
    private board: (string | null)[][];
    private rows: number[][];  // [player0 count, player1 count] per row
    private cols: number[][];
    private diag: number[];    // [player0, player1]
    private antiDiag: number[];
    private players: [string, string];
    private currentPlayer = 0;
    private movesCount = 0;
    private winner: string | null = null;

    constructor(private n: number, player1 = "X", player2 = "O") {
        this.board = Array.from({ length: n }, () => Array(n).fill(null));
        this.rows = Array.from({ length: n }, () => [0, 0]);
        this.cols = Array.from({ length: n }, () => [0, 0]);
        this.diag = [0, 0];
        this.antiDiag = [0, 0];
        this.players = [player1, player2];
    }

    move(row: number, col: number): string | null {
        if (this.winner) throw new Error(`Game already won by ${this.winner}`);
        if (row < 0 || row >= this.n || col < 0 || col >= this.n) {
            throw new Error("Invalid position");
        }
        if (this.board[row][col] !== null) throw new Error("Cell already occupied");

        const p = this.currentPlayer;
        this.board[row][col] = this.players[p];
        this.movesCount++;

        this.rows[row][p]++;
        this.cols[col][p]++;
        if (row === col) this.diag[p]++;
        if (row + col === this.n - 1) this.antiDiag[p]++;

        if (
            this.rows[row][p] === this.n ||
            this.cols[col][p] === this.n ||
            this.diag[p] === this.n ||
            this.antiDiag[p] === this.n
        ) {
            this.winner = this.players[p];
            return this.winner;
        }

        if (this.movesCount === this.n * this.n) {
            this.winner = "DRAW";
            return "DRAW";
        }

        this.currentPlayer = 1 - this.currentPlayer;
        return null;
    }

    getBoard(): string {
        return this.board
            .map((row) => row.map((cell) => cell ?? ".").join(" | "))
            .join("\n" + "-".repeat(this.n * 4 - 3) + "\n");
    }

    getCurrentPlayer(): string {
        return this.players[this.currentPlayer];
    }

    isGameOver(): boolean {
        return this.winner !== null;
    }

    getWinner(): string | null {
        return this.winner;
    }
}

// --- Usage ---
const game = new TicTacToe(3);

const moves: [number, number][] = [
    [0, 0], // X
    [1, 1], // O
    [0, 1], // X
    [1, 0], // O
    [0, 2], // X wins! (top row)
];

for (const [r, c] of moves) {
    const result = game.move(r, c);
    console.log(`${game.getCurrentPlayer()} plays (${r},${c})`);
    if (result) {
        console.log(result === "DRAW" ? "It's a draw!" : `${result} wins!`);
        break;
    }
}

console.log("\n" + game.getBoard());
```

---

## 11. Elevator System

**Problem:** Design an elevator system for a building.
- Multiple elevators.
- Handle external requests (floor + direction) and internal requests (destination floor).
- Pick the best elevator using Nearest-First strategy.

### TypeScript

```typescript
enum Direction {
    Up = "UP",
    Down = "DOWN",
    Idle = "IDLE",
}

class Elevator {
    currentFloor = 0;
    direction: Direction = Direction.Idle;
    private destinations = new Set<number>();

    constructor(readonly id: number) {}

    addDestination(floor: number): void {
        this.destinations.add(floor);
    }

    step(): void {
        if (this.destinations.size === 0) {
            this.direction = Direction.Idle;
            return;
        }

        if (this.destinations.has(this.currentFloor)) {
            this.destinations.delete(this.currentFloor);
            console.log(`  Elevator ${this.id}: doors open at floor ${this.currentFloor}`);
        }

        if (this.destinations.size === 0) {
            this.direction = Direction.Idle;
            return;
        }

        const hasAbove = [...this.destinations].some((f) => f > this.currentFloor);
        const hasBelow = [...this.destinations].some((f) => f < this.currentFloor);

        if (this.direction === Direction.Up && hasAbove) {
            this.currentFloor++;
        } else if (this.direction === Direction.Down && hasBelow) {
            this.currentFloor--;
        } else if (hasAbove) {
            this.direction = Direction.Up;
            this.currentFloor++;
        } else if (hasBelow) {
            this.direction = Direction.Down;
            this.currentFloor--;
        }
    }

    distanceTo(floor: number): number {
        return Math.abs(this.currentFloor - floor);
    }

    isIdle(): boolean {
        return this.direction === Direction.Idle;
    }

    getDestinations(): number[] {
        return [...this.destinations].sort((a, b) => a - b);
    }

    status(): string {
        return `Elevator ${this.id}: Floor ${this.currentFloor}, ${this.direction}, Dest: [${this.getDestinations()}]`;
    }
}

class ElevatorSystem {
    private elevators: Elevator[];

    constructor(
        numElevators: number,
        private totalFloors: number
    ) {
        this.elevators = Array.from({ length: numElevators }, (_, i) => new Elevator(i + 1));
    }

    requestElevator(fromFloor: number, direction: Direction): Elevator {
        let best = this.elevators[0];
        let bestScore = Infinity;

        for (const elevator of this.elevators) {
            let score = elevator.distanceTo(fromFloor);

            // Prefer idle elevators
            if (elevator.isIdle()) score -= 0.5;

            // Prefer elevators moving towards the request
            if (elevator.direction === direction) {
                if (
                    (direction === Direction.Up && elevator.currentFloor <= fromFloor) ||
                    (direction === Direction.Down && elevator.currentFloor >= fromFloor)
                ) {
                    score -= 1; // bonus for being on the way
                }
            }

            if (score < bestScore) {
                bestScore = score;
                best = elevator;
            }
        }

        best.addDestination(fromFloor);
        console.log(`Assigned Elevator ${best.id} to floor ${fromFloor}`);
        return best;
    }

    pressFloor(elevatorId: number, floor: number): void {
        const elevator = this.elevators.find((e) => e.id === elevatorId);
        if (!elevator) throw new Error(`Elevator ${elevatorId} not found`);
        elevator.addDestination(floor);
    }

    tick(): void {
        for (const elevator of this.elevators) {
            elevator.step();
        }
    }

    status(): void {
        for (const elevator of this.elevators) {
            console.log(elevator.status());
        }
    }
}

// --- Usage ---
const system = new ElevatorSystem(3, 10);

const elevator = system.requestElevator(5, Direction.Up);
system.pressFloor(elevator.id, 8);

system.requestElevator(2, Direction.Down);

system.status();
for (let i = 0; i < 10; i++) {
    console.log(`\n--- Tick ${i + 1} ---`);
    system.tick();
    system.status();
}
```

---

## 12. Logger Library

**Problem:** Implement a configurable logger supporting:
- Log levels: DEBUG, INFO, WARN, ERROR.
- Multiple output sinks (console, file, custom).
- Formatting with timestamps.
- Log level filtering (set minimum level).

### TypeScript

```typescript
enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
}

interface LogSink {
    write(level: LogLevel, message: string, timestamp: Date, context?: Record<string, any>): void;
}

class ConsoleSink implements LogSink {
    write(level: LogLevel, message: string, timestamp: Date, context?: Record<string, any>): void {
        const color = { [LogLevel.DEBUG]: "\x1b[36m", [LogLevel.INFO]: "\x1b[32m",
            [LogLevel.WARN]: "\x1b[33m", [LogLevel.ERROR]: "\x1b[31m" }[level];
        const levelName = LogLevel[level].padEnd(5);
        const ts = timestamp.toISOString();
        const ctx = context ? " " + JSON.stringify(context) : "";
        console.log(`${color}[${ts}] ${levelName}\x1b[0m ${message}${ctx}`);
    }
}

class FileSink implements LogSink {
    private buffer: string[] = [];

    constructor(private filename: string) {}

    write(level: LogLevel, message: string, timestamp: Date, context?: Record<string, any>): void {
        const entry = JSON.stringify({ level: LogLevel[level], message, timestamp, ...context });
        this.buffer.push(entry);
    }

    getBuffer(): string[] {
        return this.buffer;
    }
}

class Logger {
    private sinks: LogSink[] = [];
    private minLevel: LogLevel = LogLevel.DEBUG;
    private defaultContext: Record<string, any> = {};

    constructor(private name: string) {}

    addSink(sink: LogSink): this {
        this.sinks.push(sink);
        return this;
    }

    setLevel(level: LogLevel): this {
        this.minLevel = level;
        return this;
    }

    setContext(context: Record<string, any>): this {
        this.defaultContext = { ...this.defaultContext, ...context };
        return this;
    }

    child(name: string, context?: Record<string, any>): Logger {
        const child = new Logger(`${this.name}:${name}`);
        child.sinks = [...this.sinks];
        child.minLevel = this.minLevel;
        child.defaultContext = { ...this.defaultContext, ...context };
        return child;
    }

    private log(level: LogLevel, message: string, context?: Record<string, any>): void {
        if (level < this.minLevel) return;

        const merged = { logger: this.name, ...this.defaultContext, ...context };
        const timestamp = new Date();

        for (const sink of this.sinks) {
            sink.write(level, message, timestamp, merged);
        }
    }

    debug(msg: string, ctx?: Record<string, any>): void { this.log(LogLevel.DEBUG, msg, ctx); }
    info(msg: string, ctx?: Record<string, any>): void { this.log(LogLevel.INFO, msg, ctx); }
    warn(msg: string, ctx?: Record<string, any>): void { this.log(LogLevel.WARN, msg, ctx); }
    error(msg: string, ctx?: Record<string, any>): void { this.log(LogLevel.ERROR, msg, ctx); }
}

// --- Usage ---
const logger = new Logger("app")
    .addSink(new ConsoleSink())
    .setLevel(LogLevel.INFO)
    .setContext({ service: "user-api" });

logger.info("Server started", { port: 3000 });
logger.debug("This won't show — below INFO level");
logger.error("Database connection failed", { host: "localhost" });

const childLogger = logger.child("auth", { module: "auth" });
childLogger.warn("Token expired", { userId: "u123" });
```

---

## 13. Promise.all / Promise Implementation

**Problem:** Implement `Promise.all`, `Promise.race`, and a basic `MyPromise` from scratch.

### TypeScript

```typescript
// --- Promise.all from scratch ---
function promiseAll<T>(promises: Promise<T>[]): Promise<T[]> {
    return new Promise((resolve, reject) => {
        if (promises.length === 0) return resolve([]);

        const results: T[] = new Array(promises.length);
        let completed = 0;

        promises.forEach((promise, index) => {
            Promise.resolve(promise)
                .then((value) => {
                    results[index] = value;
                    completed++;
                    if (completed === promises.length) resolve(results);
                })
                .catch(reject);
        });
    });
}

// --- Promise.race from scratch ---
function promiseRace<T>(promises: Promise<T>[]): Promise<T> {
    return new Promise((resolve, reject) => {
        for (const promise of promises) {
            Promise.resolve(promise).then(resolve, reject);
        }
    });
}

// --- Promise.allSettled from scratch ---
type SettledResult<T> =
    | { status: "fulfilled"; value: T }
    | { status: "rejected"; reason: any };

function promiseAllSettled<T>(promises: Promise<T>[]): Promise<SettledResult<T>[]> {
    return new Promise((resolve) => {
        if (promises.length === 0) return resolve([]);

        const results: SettledResult<T>[] = new Array(promises.length);
        let completed = 0;

        promises.forEach((promise, index) => {
            Promise.resolve(promise)
                .then((value) => {
                    results[index] = { status: "fulfilled", value };
                })
                .catch((reason) => {
                    results[index] = { status: "rejected", reason };
                })
                .finally(() => {
                    completed++;
                    if (completed === promises.length) resolve(results);
                });
        });
    });
}

// --- Full MyPromise implementation ---
type PromiseState = "pending" | "fulfilled" | "rejected";

class MyPromise<T> {
    private state: PromiseState = "pending";
    private value: T | undefined;
    private reason: any;
    private onFulfilledCallbacks: ((value: T) => void)[] = [];
    private onRejectedCallbacks: ((reason: any) => void)[] = [];

    constructor(executor: (resolve: (value: T) => void, reject: (reason: any) => void) => void) {
        const resolve = (value: T) => {
            if (this.state !== "pending") return;
            this.state = "fulfilled";
            this.value = value;
            this.onFulfilledCallbacks.forEach((cb) => cb(value));
        };

        const reject = (reason: any) => {
            if (this.state !== "pending") return;
            this.state = "rejected";
            this.reason = reason;
            this.onRejectedCallbacks.forEach((cb) => cb(reason));
        };

        try {
            executor(resolve, reject);
        } catch (err) {
            reject(err);
        }
    }

    then<U>(
        onFulfilled?: (value: T) => U | MyPromise<U>,
        onRejected?: (reason: any) => U | MyPromise<U>
    ): MyPromise<U> {
        return new MyPromise<U>((resolve, reject) => {
            const handleFulfilled = (value: T) => {
                queueMicrotask(() => {
                    try {
                        if (onFulfilled) {
                            const result = onFulfilled(value);
                            if (result instanceof MyPromise) {
                                result.then(resolve, reject);
                            } else {
                                resolve(result);
                            }
                        } else {
                            resolve(value as any);
                        }
                    } catch (err) {
                        reject(err);
                    }
                });
            };

            const handleRejected = (reason: any) => {
                queueMicrotask(() => {
                    try {
                        if (onRejected) {
                            const result = onRejected(reason);
                            if (result instanceof MyPromise) {
                                result.then(resolve, reject);
                            } else {
                                resolve(result);
                            }
                        } else {
                            reject(reason);
                        }
                    } catch (err) {
                        reject(err);
                    }
                });
            };

            if (this.state === "fulfilled") handleFulfilled(this.value!);
            else if (this.state === "rejected") handleRejected(this.reason);
            else {
                this.onFulfilledCallbacks.push(handleFulfilled);
                this.onRejectedCallbacks.push(handleRejected);
            }
        });
    }

    catch<U>(onRejected: (reason: any) => U | MyPromise<U>): MyPromise<U> {
        return this.then(undefined, onRejected);
    }

    static resolve<T>(value: T): MyPromise<T> {
        return new MyPromise((res) => res(value));
    }

    static reject(reason: any): MyPromise<never> {
        return new MyPromise((_, rej) => rej(reason));
    }
}

// --- Usage ---
const p = new MyPromise<number>((resolve) => {
    setTimeout(() => resolve(42), 100);
});

p.then((val) => {
    console.log("Value:", val);    // Value: 42
    return val * 2;
})
.then((val) => console.log("Doubled:", val)) // Doubled: 84
.catch((err) => console.error(err));
```

---

## 14. HashMap from Scratch

**Problem:** Implement a HashMap with:
- `put(key, value)`, `get(key)`, `remove(key)`.
- Handle collisions (separate chaining).
- Auto-resize when load factor exceeds threshold.

### TypeScript

```typescript
class HashMapNode<K, V> {
    next: HashMapNode<K, V> | null = null;
    constructor(public key: K, public value: V) {}
}

class MyHashMap<K, V> {
    private buckets: (HashMapNode<K, V> | null)[];
    private _size = 0;
    private readonly LOAD_FACTOR = 0.75;

    constructor(private capacity = 16) {
        this.buckets = new Array(capacity).fill(null);
    }

    private hash(key: K): number {
        const str = String(key);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
        }
        return Math.abs(hash) % this.capacity;
    }

    put(key: K, value: V): void {
        if (this._size / this.capacity >= this.LOAD_FACTOR) {
            this.resize();
        }

        const index = this.hash(key);
        let node = this.buckets[index];

        while (node) {
            if (node.key === key) {
                node.value = value; // update existing
                return;
            }
            if (!node.next) break;
            node = node.next;
        }

        const newNode = new HashMapNode(key, value);
        if (!this.buckets[index]) {
            this.buckets[index] = newNode;
        } else {
            node!.next = newNode;
        }
        this._size++;
    }

    get(key: K): V | undefined {
        const index = this.hash(key);
        let node = this.buckets[index];
        while (node) {
            if (node.key === key) return node.value;
            node = node.next;
        }
        return undefined;
    }

    remove(key: K): boolean {
        const index = this.hash(key);
        let node = this.buckets[index];
        let prev: HashMapNode<K, V> | null = null;

        while (node) {
            if (node.key === key) {
                if (prev) prev.next = node.next;
                else this.buckets[index] = node.next;
                this._size--;
                return true;
            }
            prev = node;
            node = node.next;
        }
        return false;
    }

    has(key: K): boolean {
        return this.get(key) !== undefined;
    }

    get size(): number {
        return this._size;
    }

    keys(): K[] {
        const result: K[] = [];
        for (const bucket of this.buckets) {
            let node = bucket;
            while (node) {
                result.push(node.key);
                node = node.next;
            }
        }
        return result;
    }

    private resize(): void {
        const oldBuckets = this.buckets;
        this.capacity *= 2;
        this.buckets = new Array(this.capacity).fill(null);
        this._size = 0;

        for (const bucket of oldBuckets) {
            let node = bucket;
            while (node) {
                this.put(node.key, node.value);
                node = node.next;
            }
        }
    }
}

// --- Usage ---
const map = new MyHashMap<string, number>();
map.put("apple", 5);
map.put("banana", 3);
map.put("cherry", 8);
console.log(map.get("banana"));  // 3
console.log(map.has("grape"));   // false
map.remove("banana");
console.log(map.size);           // 2
console.log(map.keys());         // ["apple", "cherry"]
```

---

## 15. Debounce & Throttle with Cancel

**Problem:** Implement production-quality `debounce` and `throttle` with:
- Cancel capability.
- Flush (execute immediately).
- Leading/trailing edge options.

### TypeScript

```typescript
interface DebouncedFn<T extends (...args: any[]) => any> {
    (...args: Parameters<T>): void;
    cancel(): void;
    flush(): void;
}

function debounce<T extends (...args: any[]) => any>(
    fn: T,
    delayMs: number,
    options: { leading?: boolean } = {}
): DebouncedFn<T> {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let lastArgs: Parameters<T> | null = null;
    let lastThis: any;
    let hasLeadingInvoked = false;

    function invoke() {
        if (lastArgs) {
            fn.apply(lastThis, lastArgs);
            lastArgs = null;
            lastThis = null;
        }
    }

    const debounced = function (this: any, ...args: Parameters<T>) {
        lastArgs = args;
        lastThis = this;

        if (options.leading && !hasLeadingInvoked && !timer) {
            invoke();
            hasLeadingInvoked = true;
        }

        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            if (!options.leading || (options.leading && lastArgs)) {
                invoke();
            }
            timer = null;
            hasLeadingInvoked = false;
        }, delayMs);
    } as DebouncedFn<T>;

    debounced.cancel = () => {
        if (timer) clearTimeout(timer);
        timer = null;
        lastArgs = null;
        hasLeadingInvoked = false;
    };

    debounced.flush = () => {
        if (timer) clearTimeout(timer);
        invoke();
        timer = null;
        hasLeadingInvoked = false;
    };

    return debounced;
}

interface ThrottledFn<T extends (...args: any[]) => any> {
    (...args: Parameters<T>): void;
    cancel(): void;
}

function throttle<T extends (...args: any[]) => any>(
    fn: T,
    limitMs: number,
    options: { leading?: boolean; trailing?: boolean } = { leading: true, trailing: true }
): ThrottledFn<T> {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let lastArgs: Parameters<T> | null = null;
    let lastThis: any;
    let lastCallTime = 0;

    const throttled = function (this: any, ...args: Parameters<T>) {
        const now = Date.now();
        const elapsed = now - lastCallTime;

        lastArgs = args;
        lastThis = this;

        if (elapsed >= limitMs) {
            if (options.leading !== false) {
                lastCallTime = now;
                fn.apply(lastThis, lastArgs);
                lastArgs = null;
            }
        }

        if (!timer && options.trailing !== false) {
            timer = setTimeout(() => {
                lastCallTime = Date.now();
                timer = null;
                if (lastArgs) {
                    fn.apply(lastThis, lastArgs);
                    lastArgs = null;
                }
            }, limitMs - elapsed);
        }
    } as ThrottledFn<T>;

    throttled.cancel = () => {
        if (timer) clearTimeout(timer);
        timer = null;
        lastArgs = null;
        lastCallTime = 0;
    };

    return throttled;
}

// --- Usage ---
const debouncedSearch = debounce((query: string) => {
    console.log("Searching:", query);
}, 300);

debouncedSearch("h");
debouncedSearch("he");
debouncedSearch("hel");
debouncedSearch("hello"); // Only this one fires after 300ms

// debouncedSearch.cancel(); // prevent execution
// debouncedSearch.flush();  // execute immediately
```

---

## 16. Vending Machine (State Machine)

**Problem:** Implement a vending machine using the State pattern.
- States: Idle, HasMoney, Dispensing, OutOfStock.
- Operations: insert money, select product, dispense, return change.

### TypeScript

```typescript
interface Product {
    name: string;
    price: number;
    stock: number;
}

enum MachineState {
    Idle = "IDLE",
    HasMoney = "HAS_MONEY",
    Dispensing = "DISPENSING",
}

class VendingMachine {
    private state: MachineState = MachineState.Idle;
    private balance = 0;
    private products = new Map<string, Product>();
    private selectedProduct: string | null = null;

    addProduct(code: string, name: string, price: number, stock: number): void {
        this.products.set(code, { name, price, stock });
    }

    insertMoney(amount: number): string {
        if (amount <= 0) return "Invalid amount";
        this.balance += amount;
        this.state = MachineState.HasMoney;
        return `Balance: $${this.balance.toFixed(2)}`;
    }

    selectProduct(code: string): string {
        const product = this.products.get(code);

        if (!product) return `Product ${code} not found`;
        if (product.stock <= 0) return `${product.name} is out of stock`;
        if (this.state === MachineState.Idle) return "Please insert money first";
        if (this.balance < product.price) {
            return `Insufficient funds. ${product.name} costs $${product.price}. Balance: $${this.balance}`;
        }

        this.selectedProduct = code;
        return this.dispense();
    }

    private dispense(): string {
        const product = this.products.get(this.selectedProduct!)!;
        this.state = MachineState.Dispensing;

        product.stock--;
        this.balance -= product.price;

        let message = `Dispensing ${product.name}...`;

        if (this.balance > 0) {
            message += ` Returning change: $${this.balance.toFixed(2)}`;
            this.balance = 0;
        }

        this.selectedProduct = null;
        this.state = MachineState.Idle;
        return message;
    }

    returnMoney(): string {
        if (this.balance === 0) return "No money to return";
        const returned = this.balance;
        this.balance = 0;
        this.state = MachineState.Idle;
        return `Returned $${returned.toFixed(2)}`;
    }

    getStatus(): string {
        const items = [...this.products.entries()]
            .map(([code, p]) => `  ${code}: ${p.name} - $${p.price} (${p.stock} left)`)
            .join("\n");
        return `State: ${this.state} | Balance: $${this.balance.toFixed(2)}\nProducts:\n${items}`;
    }
}

// --- Usage ---
const machine = new VendingMachine();
machine.addProduct("A1", "Cola", 1.50, 5);
machine.addProduct("A2", "Chips", 2.00, 3);
machine.addProduct("B1", "Water", 1.00, 10);

console.log(machine.getStatus());

console.log(machine.selectProduct("A1"));  // "Please insert money first"
console.log(machine.insertMoney(2.00));    // "Balance: $2.00"
console.log(machine.selectProduct("A1"));  // "Dispensing Cola... Returning change: $0.50"
console.log(machine.selectProduct("A2"));  // "Please insert money first"
console.log(machine.insertMoney(1.00));
console.log(machine.selectProduct("A2"));  // "Insufficient funds..."
console.log(machine.returnMoney());        // "Returned $1.00"
```

---

## 17. URL Shortener (In-Memory)

**Problem:** Design an in-memory URL shortener.
- `shorten(longUrl)` → returns short URL.
- `resolve(shortUrl)` → returns original URL.
- Track click counts.
- Same long URL should return the same short URL.

### TypeScript

```typescript
class URLShortener {
    private longToShort = new Map<string, string>();
    private shortToLong = new Map<string, string>();
    private clickCounts = new Map<string, number>();
    private counter = 0;
    private readonly BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    constructor(private baseUrl: string = "https://short.ly/") {}

    shorten(longUrl: string): string {
        if (!this.isValidUrl(longUrl)) throw new Error("Invalid URL");

        if (this.longToShort.has(longUrl)) {
            return this.baseUrl + this.longToShort.get(longUrl)!;
        }

        const code = this.encode(++this.counter);
        this.longToShort.set(longUrl, code);
        this.shortToLong.set(code, longUrl);
        this.clickCounts.set(code, 0);

        return this.baseUrl + code;
    }

    resolve(shortUrl: string): string | null {
        const code = shortUrl.startsWith(this.baseUrl)
            ? shortUrl.slice(this.baseUrl.length)
            : shortUrl;

        const longUrl = this.shortToLong.get(code);
        if (!longUrl) return null;

        this.clickCounts.set(code, (this.clickCounts.get(code) ?? 0) + 1);
        return longUrl;
    }

    getStats(shortUrl: string): { longUrl: string; clicks: number } | null {
        const code = shortUrl.startsWith(this.baseUrl)
            ? shortUrl.slice(this.baseUrl.length)
            : shortUrl;

        const longUrl = this.shortToLong.get(code);
        if (!longUrl) return null;

        return {
            longUrl,
            clicks: this.clickCounts.get(code) ?? 0,
        };
    }

    private encode(num: number): string {
        if (num === 0) return this.BASE62[0];
        let result = "";
        while (num > 0) {
            result = this.BASE62[num % 62] + result;
            num = Math.floor(num / 62);
        }
        return result.padStart(6, "0");
    }

    private isValidUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
}

// --- Usage ---
const shortener = new URLShortener();

const short1 = shortener.shorten("https://www.example.com/very/long/path");
const short2 = shortener.shorten("https://www.google.com");
const short3 = shortener.shorten("https://www.example.com/very/long/path"); // same as short1

console.log(short1);                    // https://short.ly/000001
console.log(short2);                    // https://short.ly/000002
console.log(short1 === short3);         // true (idempotent)

console.log(shortener.resolve(short1)); // https://www.example.com/very/long/path
console.log(shortener.resolve(short1)); // same (click count incremented)
console.log(shortener.getStats(short1)); // { longUrl: ..., clicks: 2 }
```

---

## 18. Middleware Pipeline (Express-like)

**Problem:** Build a middleware pipeline system from scratch.
- `use(middleware)` to register middleware.
- Each middleware receives `(context, next)`.
- Middleware can modify context and choose to call `next()` or short-circuit.

### TypeScript

```typescript
interface Context {
    request: { method: string; path: string; headers: Record<string, string>; body?: any };
    response: { statusCode: number; body: any; headers: Record<string, string> };
    state: Record<string, any>;
}

type Middleware = (ctx: Context, next: () => Promise<void>) => Promise<void> | void;

class Pipeline {
    private middlewares: Middleware[] = [];

    use(middleware: Middleware): this {
        this.middlewares.push(middleware);
        return this;
    }

    async execute(ctx: Context): Promise<Context> {
        let index = -1;

        const dispatch = async (i: number): Promise<void> => {
            if (i <= index) throw new Error("next() called multiple times");
            index = i;

            const middleware = this.middlewares[i];
            if (!middleware) return;

            await middleware(ctx, () => dispatch(i + 1));
        };

        await dispatch(0);
        return ctx;
    }
}

// --- Usage ---

function createContext(method: string, path: string, body?: any): Context {
    return {
        request: { method, path, headers: {}, body },
        response: { statusCode: 200, body: null, headers: {} },
        state: {},
    };
}

// Logger middleware
const logger: Middleware = async (ctx, next) => {
    const start = Date.now();
    console.log(`→ ${ctx.request.method} ${ctx.request.path}`);
    await next();
    console.log(`← ${ctx.response.statusCode} (${Date.now() - start}ms)`);
};

// Auth middleware
const auth: Middleware = async (ctx, next) => {
    const token = ctx.request.headers["authorization"];
    if (!token) {
        ctx.response.statusCode = 401;
        ctx.response.body = { error: "Unauthorized" };
        return; // short-circuit, don't call next()
    }
    ctx.state.userId = "user_123";
    await next();
};

// Route handler
const handler: Middleware = async (ctx, next) => {
    ctx.response.statusCode = 200;
    ctx.response.body = { message: "Hello", userId: ctx.state.userId };
};

const pipeline = new Pipeline();
pipeline.use(logger).use(auth).use(handler);

// Unauthenticated request
const ctx1 = createContext("GET", "/api/profile");
await pipeline.execute(ctx1);
console.log(ctx1.response); // { statusCode: 401, body: { error: "Unauthorized" } }

// Authenticated request
const ctx2 = createContext("GET", "/api/profile");
ctx2.request.headers["authorization"] = "Bearer token123";
await pipeline.execute(ctx2);
console.log(ctx2.response); // { statusCode: 200, body: { message: "Hello", userId: "user_123" } }
```

---

## 19. Pub/Sub Message Broker

**Problem:** Build an in-memory message broker with topics, subscriptions, and message persistence.
- Publishers send messages to topics.
- Subscribers receive messages from subscribed topics.
- Support message acknowledgment.

### TypeScript

```typescript
interface Message<T = any> {
    id: string;
    topic: string;
    payload: T;
    timestamp: Date;
    acknowledged: boolean;
}

interface Subscription {
    id: string;
    topic: string;
    handler: (message: Message) => void | Promise<void>;
}

class MessageBroker {
    private subscriptions = new Map<string, Subscription[]>();
    private messageStore = new Map<string, Message[]>(); // topic → messages
    private deadLetterQueue: Message[] = [];
    private idCounter = 0;

    subscribe(topic: string, handler: (message: Message) => void | Promise<void>): string {
        const subId = `sub_${++this.idCounter}`;
        const subscription: Subscription = { id: subId, topic, handler };

        if (!this.subscriptions.has(topic)) {
            this.subscriptions.set(topic, []);
        }
        this.subscriptions.get(topic)!.push(subscription);
        return subId;
    }

    unsubscribe(subscriptionId: string): boolean {
        for (const [topic, subs] of this.subscriptions) {
            const idx = subs.findIndex((s) => s.id === subscriptionId);
            if (idx !== -1) {
                subs.splice(idx, 1);
                return true;
            }
        }
        return false;
    }

    async publish<T>(topic: string, payload: T): Promise<string> {
        const message: Message<T> = {
            id: `msg_${++this.idCounter}`,
            topic,
            payload,
            timestamp: new Date(),
            acknowledged: false,
        };

        if (!this.messageStore.has(topic)) {
            this.messageStore.set(topic, []);
        }
        this.messageStore.get(topic)!.push(message);

        const subs = this.subscriptions.get(topic) ?? [];
        if (subs.length === 0) {
            this.deadLetterQueue.push(message);
            return message.id;
        }

        for (const sub of subs) {
            try {
                await sub.handler(message);
            } catch (err) {
                console.error(`Handler failed for sub ${sub.id}:`, err);
                this.deadLetterQueue.push(message);
            }
        }

        return message.id;
    }

    acknowledge(messageId: string): boolean {
        for (const messages of this.messageStore.values()) {
            const msg = messages.find((m) => m.id === messageId);
            if (msg) {
                msg.acknowledged = true;
                return true;
            }
        }
        return false;
    }

    getMessages(topic: string): Message[] {
        return this.messageStore.get(topic) ?? [];
    }

    getDeadLetterQueue(): Message[] {
        return [...this.deadLetterQueue];
    }

    getTopicStats(): Record<string, { messages: number; subscribers: number }> {
        const stats: Record<string, { messages: number; subscribers: number }> = {};
        const allTopics = new Set([
            ...this.messageStore.keys(),
            ...this.subscriptions.keys(),
        ]);
        for (const topic of allTopics) {
            stats[topic] = {
                messages: this.messageStore.get(topic)?.length ?? 0,
                subscribers: this.subscriptions.get(topic)?.length ?? 0,
            };
        }
        return stats;
    }
}

// --- Usage ---
const broker = new MessageBroker();

broker.subscribe("orders", (msg) => {
    console.log(`[Email Service] New order: ${JSON.stringify(msg.payload)}`);
    broker.acknowledge(msg.id);
});

broker.subscribe("orders", (msg) => {
    console.log(`[Inventory Service] Processing order: ${msg.id}`);
});

await broker.publish("orders", { orderId: "ORD-001", total: 99.99 });
await broker.publish("payments", { amount: 99.99 }); // no subscriber → dead letter queue

console.log("Stats:", broker.getTopicStats());
console.log("Dead letters:", broker.getDeadLetterQueue().length); // 1
```

---

## 20. Cron Expression Parser

**Problem:** Implement a simplified cron expression parser and scheduler.
- Parse expressions like `"*/5 * * * *"` (every 5 minutes).
- Determine if a given date matches the expression.
- Find the next N execution times.

### TypeScript

```typescript
interface CronField {
    type: "wildcard" | "value" | "range" | "step" | "list";
    values: number[];
}

class CronExpression {
    private fields: {
        minute: CronField;
        hour: CronField;
        dayOfMonth: CronField;
        month: CronField;
        dayOfWeek: CronField;
    };

    private static RANGES: Record<string, [number, number]> = {
        minute: [0, 59],
        hour: [0, 23],
        dayOfMonth: [1, 31],
        month: [1, 12],
        dayOfWeek: [0, 6],
    };

    constructor(expression: string) {
        const parts = expression.trim().split(/\s+/);
        if (parts.length !== 5) {
            throw new Error(`Invalid cron expression: expected 5 fields, got ${parts.length}`);
        }

        this.fields = {
            minute: this.parseField(parts[0], "minute"),
            hour: this.parseField(parts[1], "hour"),
            dayOfMonth: this.parseField(parts[2], "dayOfMonth"),
            month: this.parseField(parts[3], "month"),
            dayOfWeek: this.parseField(parts[4], "dayOfWeek"),
        };
    }

    private parseField(field: string, name: string): CronField {
        const [min, max] = CronExpression.RANGES[name];

        if (field === "*") {
            return { type: "wildcard", values: this.range(min, max) };
        }

        if (field.includes("/")) {
            const [base, stepStr] = field.split("/");
            const step = parseInt(stepStr);
            const start = base === "*" ? min : parseInt(base);
            const values: number[] = [];
            for (let i = start; i <= max; i += step) values.push(i);
            return { type: "step", values };
        }

        if (field.includes(",")) {
            const values = field.split(",").map(Number);
            return { type: "list", values };
        }

        if (field.includes("-")) {
            const [start, end] = field.split("-").map(Number);
            return { type: "range", values: this.range(start, end) };
        }

        return { type: "value", values: [parseInt(field)] };
    }

    private range(start: number, end: number): number[] {
        const result: number[] = [];
        for (let i = start; i <= end; i++) result.push(i);
        return result;
    }

    matches(date: Date): boolean {
        return (
            this.fields.minute.values.includes(date.getMinutes()) &&
            this.fields.hour.values.includes(date.getHours()) &&
            this.fields.dayOfMonth.values.includes(date.getDate()) &&
            this.fields.month.values.includes(date.getMonth() + 1) &&
            this.fields.dayOfWeek.values.includes(date.getDay())
        );
    }

    nextExecutions(count: number, from: Date = new Date()): Date[] {
        const results: Date[] = [];
        const current = new Date(from);
        current.setSeconds(0, 0);
        current.setMinutes(current.getMinutes() + 1); // start from next minute

        const maxIterations = 525600; // ~1 year in minutes
        let iterations = 0;

        while (results.length < count && iterations < maxIterations) {
            if (this.matches(current)) {
                results.push(new Date(current));
            }
            current.setMinutes(current.getMinutes() + 1);
            iterations++;
        }

        return results;
    }

    toString(): string {
        const describe = (field: CronField, name: string): string => {
            if (field.type === "wildcard") return `every ${name}`;
            if (field.type === "step") return `every ${field.values[1] - field.values[0]} ${name}(s)`;
            return `${name} ${field.values.join(",")}`;
        };

        return [
            describe(this.fields.minute, "minute"),
            describe(this.fields.hour, "hour"),
            describe(this.fields.dayOfMonth, "day"),
            describe(this.fields.month, "month"),
            describe(this.fields.dayOfWeek, "weekday"),
        ].join(", ");
    }
}

class CronScheduler {
    private jobs = new Map<string, { cron: CronExpression; fn: () => void; timer: ReturnType<typeof setInterval> }>();
    private idCounter = 0;

    schedule(expression: string, fn: () => void): string {
        const id = `job_${++this.idCounter}`;
        const cron = new CronExpression(expression);

        const timer = setInterval(() => {
            if (cron.matches(new Date())) {
                fn();
            }
        }, 60_000); // check every minute

        this.jobs.set(id, { cron, fn, timer });
        return id;
    }

    cancel(jobId: string): boolean {
        const job = this.jobs.get(jobId);
        if (!job) return false;
        clearInterval(job.timer);
        this.jobs.delete(jobId);
        return true;
    }

    cancelAll(): void {
        for (const [id] of this.jobs) this.cancel(id);
    }
}

// --- Usage ---
const cron = new CronExpression("*/15 9-17 * * 1-5"); // every 15min, 9am-5pm, Mon-Fri

const now = new Date();
console.log("Matches now?", cron.matches(now));

const next5 = cron.nextExecutions(5);
next5.forEach((d) => console.log("Next:", d.toLocaleString()));
```

---

## Cheat Sheet — What Interviewers Look For

```
┌──────────────────────────────────────────────────────────────────┐
│                  LLD MACHINE CODING RUBRIC                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. WORKING CODE          — Does it actually run? Edge cases?    │
│  2. OOP DESIGN            — Classes, encapsulation, SRP          │
│  3. CLEAN INTERFACES      — Intuitive API, good method names     │
│  4. EXTENSIBILITY         — Easy to add new features?            │
│  5. SEPARATION OF CONCERN — Business logic vs I/O vs display     │
│  6. ERROR HANDLING        — Validations, meaningful errors       │
│  7. DATA STRUCTURES       — Right choice of Map, Set, List       │
│  8. TIME/SPACE COMPLEXITY — Aware of performance implications    │
│  9. NAMING                — Variables and methods are clear       │
│  10. NO GOD CLASSES       — Split large classes, use composition │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                    COMMON PATTERNS                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  • Strategy    → Rate limiter, sorting, payment processing       │
│  • Observer    → Event emitter, pub/sub, notifications           │
│  • State       → Vending machine, elevator, game states          │
│  • Factory     → Vehicle creation, notification channels         │
│  • Singleton   → Logger, config, connection pool                 │
│  • Builder     → Complex object construction (queries, configs)  │
│  • Iterator    → Pagination, stream processing                   │
│  • Template    → Middleware pipeline, lifecycle hooks             │
│  • Decorator   → Logging, caching, retry wrappers                │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                    TIME MANAGEMENT (45-60 min)                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  00-05 min  → Clarify requirements, ask questions                │
│  05-10 min  → Identify entities, list classes & methods          │
│  10-45 min  → Implement core functionality                       │
│  45-55 min  → Handle edge cases, add error handling              │
│  55-60 min  → Quick test, explain trade-offs                     │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

# BEGINNER LEVEL (Freshers / 0-1 YOE)

Focus: Basic OOP, clean code, simple data structures.

---

## B1. Stack Implementation

**Problem:** Implement a `Stack` from scratch with `push`, `pop`, `peek`, `isEmpty`, and `size`. Support a max capacity with overflow protection.

### TypeScript

```typescript
class Stack<T> {
    private items: T[] = [];

    constructor(private capacity: number = Infinity) {}

    push(item: T): void {
        if (this.items.length >= this.capacity) {
            throw new Error("Stack overflow");
        }
        this.items.push(item);
    }

    pop(): T {
        if (this.isEmpty()) throw new Error("Stack underflow");
        return this.items.pop()!;
    }

    peek(): T {
        if (this.isEmpty()) throw new Error("Stack is empty");
        return this.items[this.items.length - 1];
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    size(): number {
        return this.items.length;
    }

    clear(): void {
        this.items = [];
    }

    toArray(): T[] {
        return [...this.items];
    }

    [Symbol.iterator](): Iterator<T> {
        let index = this.items.length - 1;
        const items = this.items;
        return {
            next(): IteratorResult<T> {
                if (index >= 0) return { value: items[index--], done: false };
                return { value: undefined as any, done: true };
            },
        };
    }
}

// --- Usage ---
const stack = new Stack<number>(5);
stack.push(10);
stack.push(20);
stack.push(30);
console.log(stack.peek());   // 30
console.log(stack.pop());    // 30
console.log(stack.size());   // 2
console.log([...stack]);     // [20, 10] — iterate top to bottom
```

### Java

```java
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class Stack<T> implements Iterable<T> {
    private final List<T> items = new ArrayList<>();
    private final int capacity;

    public Stack() { this(Integer.MAX_VALUE); }
    public Stack(int capacity) { this.capacity = capacity; }

    public void push(T item) {
        if (items.size() >= capacity) throw new RuntimeException("Stack overflow");
        items.add(item);
    }

    public T pop() {
        if (isEmpty()) throw new RuntimeException("Stack underflow");
        return items.remove(items.size() - 1);
    }

    public T peek() {
        if (isEmpty()) throw new RuntimeException("Stack is empty");
        return items.get(items.size() - 1);
    }

    public boolean isEmpty() { return items.isEmpty(); }
    public int size() { return items.size(); }

    @Override
    public Iterator<T> iterator() {
        return new Iterator<>() {
            int index = items.size() - 1;
            public boolean hasNext() { return index >= 0; }
            public T next() { return items.get(index--); }
        };
    }

    public static void main(String[] args) {
        Stack<Integer> stack = new Stack<>(5);
        stack.push(10);
        stack.push(20);
        stack.push(30);
        System.out.println(stack.peek()); // 30
        System.out.println(stack.pop());  // 30
        System.out.println(stack.size()); // 2
    }
}
```

---

## B2. Queue Implementation

**Problem:** Implement a `Queue` using two stacks. Support `enqueue`, `dequeue`, `peek`, `isEmpty`.

### TypeScript

```typescript
class QueueUsingStacks<T> {
    private inStack: T[] = [];
    private outStack: T[] = [];

    enqueue(item: T): void {
        this.inStack.push(item);
    }

    dequeue(): T {
        if (this.isEmpty()) throw new Error("Queue is empty");
        this.transferIfNeeded();
        return this.outStack.pop()!;
    }

    peek(): T {
        if (this.isEmpty()) throw new Error("Queue is empty");
        this.transferIfNeeded();
        return this.outStack[this.outStack.length - 1];
    }

    isEmpty(): boolean {
        return this.inStack.length === 0 && this.outStack.length === 0;
    }

    size(): number {
        return this.inStack.length + this.outStack.length;
    }

    private transferIfNeeded(): void {
        if (this.outStack.length === 0) {
            while (this.inStack.length > 0) {
                this.outStack.push(this.inStack.pop()!);
            }
        }
    }
}

// --- Usage ---
const queue = new QueueUsingStacks<string>();
queue.enqueue("A");
queue.enqueue("B");
queue.enqueue("C");
console.log(queue.dequeue()); // A (FIFO)
console.log(queue.peek());   // B
console.log(queue.size());   // 2
```

### Java

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class QueueUsingStacks<T> {
    private final Deque<T> inStack = new ArrayDeque<>();
    private final Deque<T> outStack = new ArrayDeque<>();

    public void enqueue(T item) {
        inStack.push(item);
    }

    public T dequeue() {
        if (isEmpty()) throw new RuntimeException("Queue is empty");
        transferIfNeeded();
        return outStack.pop();
    }

    public T peek() {
        if (isEmpty()) throw new RuntimeException("Queue is empty");
        transferIfNeeded();
        return outStack.peek();
    }

    public boolean isEmpty() {
        return inStack.isEmpty() && outStack.isEmpty();
    }

    public int size() {
        return inStack.size() + outStack.size();
    }

    private void transferIfNeeded() {
        if (outStack.isEmpty()) {
            while (!inStack.isEmpty()) outStack.push(inStack.pop());
        }
    }

    public static void main(String[] args) {
        QueueUsingStacks<String> q = new QueueUsingStacks<>();
        q.enqueue("A");
        q.enqueue("B");
        q.enqueue("C");
        System.out.println(q.dequeue()); // A
        System.out.println(q.peek());    // B
    }
}
```

---

## B3. Todo List Manager

**Problem:** Build a simple Todo List manager.
- Add, complete, delete, list todos.
- Filter by status (all, pending, completed).
- Search by keyword.

### TypeScript

```typescript
interface Todo {
    id: number;
    title: string;
    completed: boolean;
    createdAt: Date;
    completedAt: Date | null;
}

class TodoList {
    private todos: Todo[] = [];
    private idCounter = 0;

    add(title: string): Todo {
        if (!title.trim()) throw new Error("Title cannot be empty");
        const todo: Todo = {
            id: ++this.idCounter,
            title: title.trim(),
            completed: false,
            createdAt: new Date(),
            completedAt: null,
        };
        this.todos.push(todo);
        return todo;
    }

    complete(id: number): Todo {
        const todo = this.findById(id);
        if (todo.completed) throw new Error(`Todo ${id} is already completed`);
        todo.completed = true;
        todo.completedAt = new Date();
        return todo;
    }

    delete(id: number): void {
        const index = this.todos.findIndex((t) => t.id === id);
        if (index === -1) throw new Error(`Todo ${id} not found`);
        this.todos.splice(index, 1);
    }

    getAll(filter: "all" | "pending" | "completed" = "all"): Todo[] {
        if (filter === "pending") return this.todos.filter((t) => !t.completed);
        if (filter === "completed") return this.todos.filter((t) => t.completed);
        return [...this.todos];
    }

    search(keyword: string): Todo[] {
        const lower = keyword.toLowerCase();
        return this.todos.filter((t) => t.title.toLowerCase().includes(lower));
    }

    stats(): { total: number; completed: number; pending: number } {
        const completed = this.todos.filter((t) => t.completed).length;
        return { total: this.todos.length, completed, pending: this.todos.length - completed };
    }

    private findById(id: number): Todo {
        const todo = this.todos.find((t) => t.id === id);
        if (!todo) throw new Error(`Todo ${id} not found`);
        return todo;
    }
}

// --- Usage ---
const list = new TodoList();
list.add("Buy groceries");
list.add("Read chapter 5");
list.add("Buy birthday gift");
list.complete(1);

console.log(list.getAll("pending"));      // 2 items
console.log(list.search("buy"));          // 2 items
console.log(list.stats());                // { total: 3, completed: 1, pending: 2 }
```

---

## B4. Bank Account System

**Problem:** Implement a basic banking system.
- Create accounts. Deposit, withdraw, transfer.
- Transaction history.
- Prevent overdrafts.

### TypeScript

```typescript
interface Transaction {
    id: string;
    type: "DEPOSIT" | "WITHDRAWAL" | "TRANSFER_IN" | "TRANSFER_OUT";
    amount: number;
    balance: number;
    timestamp: Date;
    description: string;
}

class BankAccount {
    private _balance = 0;
    private transactions: Transaction[] = [];
    private txnCounter = 0;

    constructor(
        readonly accountNumber: string,
        readonly ownerName: string,
        initialDeposit: number = 0
    ) {
        if (initialDeposit > 0) this.deposit(initialDeposit, "Initial deposit");
    }

    get balance(): number {
        return this._balance;
    }

    deposit(amount: number, description = "Deposit"): Transaction {
        if (amount <= 0) throw new Error("Deposit amount must be positive");
        this._balance += amount;
        return this.recordTransaction("DEPOSIT", amount, description);
    }

    withdraw(amount: number, description = "Withdrawal"): Transaction {
        if (amount <= 0) throw new Error("Withdrawal amount must be positive");
        if (amount > this._balance) throw new Error("Insufficient funds");
        this._balance -= amount;
        return this.recordTransaction("WITHDRAWAL", amount, description);
    }

    getTransactionHistory(): Transaction[] {
        return [...this.transactions];
    }

    getStatement(lastN?: number): string {
        const txns = lastN ? this.transactions.slice(-lastN) : this.transactions;
        const header = `Statement for ${this.ownerName} (${this.accountNumber})\n${"=".repeat(60)}`;
        const rows = txns.map(
            (t) =>
                `${t.timestamp.toLocaleDateString()} | ${t.type.padEnd(14)} | ` +
                `${t.amount.toFixed(2).padStart(10)} | Bal: ${t.balance.toFixed(2)}`
        );
        return [header, ...rows, `${"=".repeat(60)}`, `Current Balance: $${this._balance.toFixed(2)}`].join("\n");
    }

    private recordTransaction(type: Transaction["type"], amount: number, description: string): Transaction {
        const txn: Transaction = {
            id: `TXN-${++this.txnCounter}`,
            type,
            amount,
            balance: this._balance,
            timestamp: new Date(),
            description,
        };
        this.transactions.push(txn);
        return txn;
    }
}

class Bank {
    private accounts = new Map<string, BankAccount>();
    private accountCounter = 0;

    createAccount(ownerName: string, initialDeposit = 0): BankAccount {
        const accNum = `ACC-${String(++this.accountCounter).padStart(6, "0")}`;
        const account = new BankAccount(accNum, ownerName, initialDeposit);
        this.accounts.set(accNum, account);
        return account;
    }

    getAccount(accountNumber: string): BankAccount {
        const acc = this.accounts.get(accountNumber);
        if (!acc) throw new Error(`Account ${accountNumber} not found`);
        return acc;
    }

    transfer(fromAccNum: string, toAccNum: string, amount: number): void {
        const from = this.getAccount(fromAccNum);
        const to = this.getAccount(toAccNum);
        if (from === to) throw new Error("Cannot transfer to the same account");

        from.withdraw(amount, `Transfer to ${toAccNum}`);
        to.deposit(amount, `Transfer from ${fromAccNum}`);
    }
}

// --- Usage ---
const bank = new Bank();
const alice = bank.createAccount("Alice", 1000);
const bob = bank.createAccount("Bob", 500);

alice.deposit(200);
bank.transfer(alice.accountNumber, bob.accountNumber, 300);

console.log(alice.balance); // 900
console.log(bob.balance);   // 800
console.log(alice.getStatement());
```

---

## B5. Library Management System

**Problem:** Build a simple library system.
- Add books, register members.
- Borrow and return books.
- Track who has which book. Max 3 books per member.

### TypeScript

```typescript
class Book {
    borrowedBy: string | null = null;
    borrowedAt: Date | null = null;

    constructor(
        readonly isbn: string,
        readonly title: string,
        readonly author: string
    ) {}

    isAvailable(): boolean {
        return this.borrowedBy === null;
    }
}

class Member {
    borrowedBooks: string[] = []; // ISBNs

    constructor(
        readonly id: string,
        readonly name: string
    ) {}
}

class Library {
    private books = new Map<string, Book>();
    private members = new Map<string, Member>();
    private static MAX_BOOKS_PER_MEMBER = 3;

    addBook(isbn: string, title: string, author: string): Book {
        if (this.books.has(isbn)) throw new Error(`Book ${isbn} already exists`);
        const book = new Book(isbn, title, author);
        this.books.set(isbn, book);
        return book;
    }

    registerMember(id: string, name: string): Member {
        if (this.members.has(id)) throw new Error(`Member ${id} already exists`);
        const member = new Member(id, name);
        this.members.set(id, member);
        return member;
    }

    borrowBook(memberId: string, isbn: string): void {
        const member = this.getMember(memberId);
        const book = this.getBook(isbn);

        if (!book.isAvailable()) {
            throw new Error(`"${book.title}" is already borrowed by ${book.borrowedBy}`);
        }
        if (member.borrowedBooks.length >= Library.MAX_BOOKS_PER_MEMBER) {
            throw new Error(`${member.name} has reached the borrowing limit (${Library.MAX_BOOKS_PER_MEMBER})`);
        }

        book.borrowedBy = memberId;
        book.borrowedAt = new Date();
        member.borrowedBooks.push(isbn);
    }

    returnBook(memberId: string, isbn: string): void {
        const member = this.getMember(memberId);
        const book = this.getBook(isbn);

        if (book.borrowedBy !== memberId) {
            throw new Error(`${member.name} has not borrowed "${book.title}"`);
        }

        book.borrowedBy = null;
        book.borrowedAt = null;
        member.borrowedBooks = member.borrowedBooks.filter((b) => b !== isbn);
    }

    searchBooks(query: string): Book[] {
        const lower = query.toLowerCase();
        return [...this.books.values()].filter(
            (b) =>
                b.title.toLowerCase().includes(lower) ||
                b.author.toLowerCase().includes(lower) ||
                b.isbn.includes(lower)
        );
    }

    getAvailableBooks(): Book[] {
        return [...this.books.values()].filter((b) => b.isAvailable());
    }

    getMemberBooks(memberId: string): Book[] {
        const member = this.getMember(memberId);
        return member.borrowedBooks.map((isbn) => this.getBook(isbn));
    }

    private getBook(isbn: string): Book {
        const book = this.books.get(isbn);
        if (!book) throw new Error(`Book ${isbn} not found`);
        return book;
    }

    private getMember(id: string): Member {
        const member = this.members.get(id);
        if (!member) throw new Error(`Member ${id} not found`);
        return member;
    }
}

// --- Usage ---
const library = new Library();

library.addBook("978-1", "Clean Code", "Robert C. Martin");
library.addBook("978-2", "Design Patterns", "Gang of Four");
library.addBook("978-3", "Refactoring", "Martin Fowler");

library.registerMember("M1", "Alice");
library.registerMember("M2", "Bob");

library.borrowBook("M1", "978-1");
library.borrowBook("M1", "978-2");

console.log(library.getAvailableBooks().map((b) => b.title)); // ["Refactoring"]
console.log(library.getMemberBooks("M1").map((b) => b.title)); // ["Clean Code", "Design Patterns"]

library.returnBook("M1", "978-1");
console.log(library.getAvailableBooks().map((b) => b.title)); // ["Clean Code", "Refactoring"]
```

---

## B6. Shopping Cart

**Problem:** Implement a shopping cart with:
- Add/remove items. Update quantity.
- Apply discount codes (percentage or flat).
- Calculate subtotal, discount, tax, and total.

### TypeScript

```typescript
interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
}

interface DiscountCode {
    code: string;
    type: "percentage" | "flat";
    value: number;
    minOrderAmount: number;
}

class ShoppingCart {
    private items = new Map<string, CartItem>();
    private appliedDiscount: DiscountCode | null = null;
    private taxRate: number;

    private static DISCOUNT_CODES: DiscountCode[] = [
        { code: "SAVE10", type: "percentage", value: 10, minOrderAmount: 50 },
        { code: "FLAT20", type: "flat", value: 20, minOrderAmount: 100 },
        { code: "HALF", type: "percentage", value: 50, minOrderAmount: 200 },
    ];

    constructor(taxRate: number = 0.18) {
        this.taxRate = taxRate;
    }

    addItem(productId: string, name: string, price: number, quantity: number = 1): void {
        if (price <= 0) throw new Error("Price must be positive");
        if (quantity <= 0) throw new Error("Quantity must be positive");

        const existing = this.items.get(productId);
        if (existing) {
            existing.quantity += quantity;
        } else {
            this.items.set(productId, { productId, name, price, quantity });
        }
    }

    removeItem(productId: string): void {
        if (!this.items.has(productId)) throw new Error("Item not in cart");
        this.items.delete(productId);
    }

    updateQuantity(productId: string, quantity: number): void {
        if (quantity <= 0) {
            this.removeItem(productId);
            return;
        }
        const item = this.items.get(productId);
        if (!item) throw new Error("Item not in cart");
        item.quantity = quantity;
    }

    applyDiscount(code: string): string {
        const discount = ShoppingCart.DISCOUNT_CODES.find(
            (d) => d.code === code.toUpperCase()
        );
        if (!discount) throw new Error("Invalid discount code");
        if (this.getSubtotal() < discount.minOrderAmount) {
            throw new Error(`Minimum order amount is $${discount.minOrderAmount}`);
        }
        this.appliedDiscount = discount;
        return `Applied ${discount.code}: ${discount.type === "percentage" ? discount.value + "% off" : "$" + discount.value + " off"}`;
    }

    removeDiscount(): void {
        this.appliedDiscount = null;
    }

    getSubtotal(): number {
        let total = 0;
        for (const item of this.items.values()) {
            total += item.price * item.quantity;
        }
        return Math.round(total * 100) / 100;
    }

    getDiscountAmount(): number {
        if (!this.appliedDiscount) return 0;
        const subtotal = this.getSubtotal();
        if (this.appliedDiscount.type === "percentage") {
            return Math.round(subtotal * (this.appliedDiscount.value / 100) * 100) / 100;
        }
        return Math.min(this.appliedDiscount.value, subtotal);
    }

    getTax(): number {
        const afterDiscount = this.getSubtotal() - this.getDiscountAmount();
        return Math.round(afterDiscount * this.taxRate * 100) / 100;
    }

    getTotal(): number {
        return Math.round(
            (this.getSubtotal() - this.getDiscountAmount() + this.getTax()) * 100
        ) / 100;
    }

    getItemCount(): number {
        let count = 0;
        for (const item of this.items.values()) count += item.quantity;
        return count;
    }

    getSummary(): string {
        const lines: string[] = ["--- Shopping Cart ---"];
        for (const item of this.items.values()) {
            lines.push(
                `${item.name} x${item.quantity} @ $${item.price.toFixed(2)} = $${(item.price * item.quantity).toFixed(2)}`
            );
        }
        lines.push(`---`);
        lines.push(`Subtotal:  $${this.getSubtotal().toFixed(2)}`);
        if (this.appliedDiscount) {
            lines.push(`Discount:  -$${this.getDiscountAmount().toFixed(2)} (${this.appliedDiscount.code})`);
        }
        lines.push(`Tax (${(this.taxRate * 100).toFixed(0)}%):    $${this.getTax().toFixed(2)}`);
        lines.push(`Total:     $${this.getTotal().toFixed(2)}`);
        return lines.join("\n");
    }

    clear(): void {
        this.items.clear();
        this.appliedDiscount = null;
    }
}

// --- Usage ---
const cart = new ShoppingCart(0.1); // 10% tax
cart.addItem("P1", "Laptop", 999.99);
cart.addItem("P2", "Mouse", 29.99, 2);
cart.addItem("P3", "Keyboard", 79.99);
cart.applyDiscount("SAVE10");

console.log(cart.getSummary());
// Subtotal:  $1139.96
// Discount:  -$114.00 (SAVE10)
// Tax (10%): $102.60
// Total:     $1128.56
```

---

## B7. Linked List with Operations

**Problem:** Implement a singly linked list with insert, delete, reverse, detect cycle, and find middle.

### TypeScript

```typescript
class ListNode<T> {
    next: ListNode<T> | null = null;
    constructor(public value: T) {}
}

class LinkedList<T> {
    head: ListNode<T> | null = null;
    private _size = 0;

    get size(): number {
        return this._size;
    }

    append(value: T): void {
        const node = new ListNode(value);
        if (!this.head) {
            this.head = node;
        } else {
            let current = this.head;
            while (current.next) current = current.next;
            current.next = node;
        }
        this._size++;
    }

    prepend(value: T): void {
        const node = new ListNode(value);
        node.next = this.head;
        this.head = node;
        this._size++;
    }

    insertAt(index: number, value: T): void {
        if (index < 0 || index > this._size) throw new Error("Index out of bounds");
        if (index === 0) return this.prepend(value);

        const node = new ListNode(value);
        let current = this.head!;
        for (let i = 0; i < index - 1; i++) current = current.next!;
        node.next = current.next;
        current.next = node;
        this._size++;
    }

    deleteAt(index: number): T {
        if (index < 0 || index >= this._size) throw new Error("Index out of bounds");
        let removed: ListNode<T>;

        if (index === 0) {
            removed = this.head!;
            this.head = this.head!.next;
        } else {
            let current = this.head!;
            for (let i = 0; i < index - 1; i++) current = current.next!;
            removed = current.next!;
            current.next = removed.next;
        }
        this._size--;
        return removed.value;
    }

    find(value: T): number {
        let current = this.head;
        let index = 0;
        while (current) {
            if (current.value === value) return index;
            current = current.next;
            index++;
        }
        return -1;
    }

    reverse(): void {
        let prev: ListNode<T> | null = null;
        let current = this.head;
        while (current) {
            const next = current.next;
            current.next = prev;
            prev = current;
            current = next;
        }
        this.head = prev;
    }

    getMiddle(): T | null {
        if (!this.head) return null;
        let slow: ListNode<T> | null = this.head;
        let fast: ListNode<T> | null = this.head;
        while (fast?.next) {
            slow = slow!.next;
            fast = fast.next.next;
        }
        return slow!.value;
    }

    hasCycle(): boolean {
        let slow = this.head;
        let fast = this.head;
        while (fast?.next) {
            slow = slow!.next;
            fast = fast.next.next;
            if (slow === fast) return true;
        }
        return false;
    }

    toArray(): T[] {
        const result: T[] = [];
        let current = this.head;
        while (current) {
            result.push(current.value);
            current = current.next;
        }
        return result;
    }

    toString(): string {
        return this.toArray().join(" → ") + " → null";
    }
}

// --- Usage ---
const ll = new LinkedList<number>();
ll.append(1);
ll.append(2);
ll.append(3);
ll.append(4);
ll.append(5);

console.log(ll.toString());    // 1 → 2 → 3 → 4 → 5 → null
console.log(ll.getMiddle());   // 3

ll.reverse();
console.log(ll.toString());    // 5 → 4 → 3 → 2 → 1 → null

ll.insertAt(2, 99);
console.log(ll.toString());    // 5 → 4 → 99 → 3 → 2 → 1 → null

ll.deleteAt(2);
console.log(ll.toString());    // 5 → 4 → 3 → 2 → 1 → null
```

---

# INTERMEDIATE LEVEL (2-4 YOE)

Focus: Design patterns, real-world systems, concurrency concepts.

---

## I1. Connection Pool

**Problem:** Implement a generic connection pool.
- Fixed pool of reusable resources.
- `acquire()` gets a connection (blocks/waits if none available).
- `release()` returns it to the pool.
- Timeout if no connection available within a time limit.

### TypeScript

```typescript
class ConnectionPool<T> {
    private available: T[] = [];
    private inUse = new Set<T>();
    private waitQueue: { resolve: (conn: T) => void; reject: (err: Error) => void; timer: ReturnType<typeof setTimeout> }[] = [];

    constructor(
        private factory: () => T,
        private maxSize: number,
        private acquireTimeoutMs: number = 5000
    ) {
        for (let i = 0; i < maxSize; i++) {
            this.available.push(factory());
        }
    }

    async acquire(): Promise<T> {
        const conn = this.available.pop();
        if (conn) {
            this.inUse.add(conn);
            return conn;
        }

        return new Promise<T>((resolve, reject) => {
            const timer = setTimeout(() => {
                const idx = this.waitQueue.findIndex((w) => w.resolve === resolve);
                if (idx !== -1) this.waitQueue.splice(idx, 1);
                reject(new Error("Acquire timeout: no connection available"));
            }, this.acquireTimeoutMs);

            this.waitQueue.push({ resolve, reject, timer });
        });
    }

    release(conn: T): void {
        if (!this.inUse.has(conn)) {
            throw new Error("Connection is not from this pool");
        }
        this.inUse.delete(conn);

        if (this.waitQueue.length > 0) {
            const waiter = this.waitQueue.shift()!;
            clearTimeout(waiter.timer);
            this.inUse.add(conn);
            waiter.resolve(conn);
        } else {
            this.available.push(conn);
        }
    }

    async withConnection<R>(fn: (conn: T) => Promise<R>): Promise<R> {
        const conn = await this.acquire();
        try {
            return await fn(conn);
        } finally {
            this.release(conn);
        }
    }

    stats(): { available: number; inUse: number; waiting: number } {
        return {
            available: this.available.length,
            inUse: this.inUse.size,
            waiting: this.waitQueue.length,
        };
    }
}

// --- Usage ---
class MockDBConnection {
    id: number;
    constructor(id: number) { this.id = id; }
    async query(sql: string): Promise<string> {
        return `Result from conn-${this.id}: ${sql}`;
    }
}

let connId = 0;
const pool = new ConnectionPool(() => new MockDBConnection(++connId), 3, 2000);

// Safe usage with auto-release
const result = await pool.withConnection(async (conn) => {
    return conn.query("SELECT * FROM users");
});
console.log(result);
console.log(pool.stats()); // { available: 3, inUse: 0, waiting: 0 }
```

---

## I2. Retry with Backoff

**Problem:** Implement a retry utility supporting:
- Max retries.
- Exponential backoff with jitter.
- Configurable retry conditions.
- Abort/cancel capability.

### TypeScript

```typescript
interface RetryOptions {
    maxRetries: number;
    initialDelayMs: number;
    maxDelayMs: number;
    backoffMultiplier: number;
    jitter: boolean;
    retryOn?: (error: any) => boolean;
    onRetry?: (error: any, attempt: number, delayMs: number) => void;
}

const DEFAULT_OPTIONS: RetryOptions = {
    maxRetries: 3,
    initialDelayMs: 1000,
    maxDelayMs: 30000,
    backoffMultiplier: 2,
    jitter: true,
};

class AbortError extends Error {
    constructor() { super("Retry aborted"); this.name = "AbortError"; }
}

async function retry<T>(
    fn: (attempt: number) => Promise<T>,
    options: Partial<RetryOptions> = {}
): Promise<T> {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    let lastError: any;

    for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
        try {
            return await fn(attempt);
        } catch (error) {
            lastError = error;

            if (error instanceof AbortError) throw error;
            if (opts.retryOn && !opts.retryOn(error)) throw error;
            if (attempt === opts.maxRetries) break;

            let delay = Math.min(
                opts.initialDelayMs * Math.pow(opts.backoffMultiplier, attempt),
                opts.maxDelayMs
            );

            if (opts.jitter) {
                delay = delay * (0.5 + Math.random() * 0.5); // 50%-100% of calculated delay
            }

            opts.onRetry?.(error, attempt + 1, delay);
            await new Promise((r) => setTimeout(r, delay));
        }
    }

    throw lastError;
}

class RetryableHttpClient {
    async fetch(url: string): Promise<any> {
        return retry(
            async (attempt) => {
                console.log(`Attempt ${attempt + 1}: fetching ${url}`);
                const response = await fetch(url);
                if (response.status === 429 || response.status >= 500) {
                    throw new Error(`HTTP ${response.status}`);
                }
                return response.json();
            },
            {
                maxRetries: 3,
                initialDelayMs: 500,
                retryOn: (err) => {
                    const msg = err.message || "";
                    return msg.includes("429") || msg.includes("5");
                },
                onRetry: (err, attempt, delay) => {
                    console.log(`Retry ${attempt} after ${Math.round(delay)}ms: ${err.message}`);
                },
            }
        );
    }
}

// --- Usage ---
try {
    const result = await retry(
        async (attempt) => {
            if (attempt < 2) throw new Error("Temporary failure");
            return "Success on attempt " + (attempt + 1);
        },
        {
            maxRetries: 3,
            initialDelayMs: 100,
            onRetry: (err, attempt, delay) =>
                console.log(`Retry ${attempt}: ${err.message} (waiting ${Math.round(delay)}ms)`),
        }
    );
    console.log(result); // "Success on attempt 3"
} catch (err) {
    console.error("All retries failed:", err);
}
```

---

## I3. Pub/Sub with Wildcard Topics

**Problem:** Extend pub/sub to support wildcard topic matching.
- `*` matches one segment: `orders.*` matches `orders.created` but not `orders.item.added`.
- `#` matches zero or more segments: `orders.#` matches `orders`, `orders.created`, `orders.item.added`.

### TypeScript

```typescript
type Handler = (topic: string, message: any) => void;

class WildcardPubSub {
    private subscriptions: { pattern: string; handler: Handler; id: string }[] = [];
    private idCounter = 0;

    subscribe(pattern: string, handler: Handler): string {
        const id = `sub_${++this.idCounter}`;
        this.subscriptions.push({ pattern, handler, id });
        return id;
    }

    unsubscribe(id: string): boolean {
        const idx = this.subscriptions.findIndex((s) => s.id === id);
        if (idx === -1) return false;
        this.subscriptions.splice(idx, 1);
        return true;
    }

    publish(topic: string, message: any): number {
        let count = 0;
        for (const sub of this.subscriptions) {
            if (this.matches(sub.pattern, topic)) {
                sub.handler(topic, message);
                count++;
            }
        }
        return count;
    }

    private matches(pattern: string, topic: string): boolean {
        const patternParts = pattern.split(".");
        const topicParts = topic.split(".");

        let pi = 0;
        let ti = 0;

        while (pi < patternParts.length && ti < topicParts.length) {
            const pp = patternParts[pi];

            if (pp === "#") {
                // '#' at end matches everything remaining
                if (pi === patternParts.length - 1) return true;
                // Try all possible lengths for '#'
                for (let skip = ti; skip <= topicParts.length; skip++) {
                    const remainingPattern = patternParts.slice(pi + 1).join(".");
                    const remainingTopic = topicParts.slice(skip).join(".");
                    if (this.matches(remainingPattern, remainingTopic)) return true;
                }
                return false;
            }

            if (pp === "*") {
                pi++;
                ti++;
                continue;
            }

            if (pp !== topicParts[ti]) return false;
            pi++;
            ti++;
        }

        // Handle trailing '#' matching zero segments
        while (pi < patternParts.length && patternParts[pi] === "#") pi++;

        return pi === patternParts.length && ti === topicParts.length;
    }
}

// --- Usage ---
const bus = new WildcardPubSub();

bus.subscribe("orders.*", (topic, msg) => {
    console.log(`[Single wildcard] ${topic}:`, msg);
});

bus.subscribe("orders.#", (topic, msg) => {
    console.log(`[Multi wildcard] ${topic}:`, msg);
});

bus.subscribe("orders.created", (topic, msg) => {
    console.log(`[Exact match] ${topic}:`, msg);
});

console.log("--- Publish: orders.created ---");
bus.publish("orders.created", { id: 1 });
// [Single wildcard] orders.created: { id: 1 }
// [Multi wildcard] orders.created: { id: 1 }
// [Exact match] orders.created: { id: 1 }

console.log("\n--- Publish: orders.item.added ---");
bus.publish("orders.item.added", { item: "Book" });
// [Multi wildcard] orders.item.added: { item: "Book" }
// (Single wildcard does NOT match — * only matches one segment)
```

---

## I4. Circuit Breaker

**Problem:** Implement the Circuit Breaker pattern.
- States: Closed (normal), Open (failing, reject calls), Half-Open (test if recovered).
- Configurable failure threshold, timeout, and success threshold for recovery.

### TypeScript

```typescript
enum CircuitState {
    Closed = "CLOSED",
    Open = "OPEN",
    HalfOpen = "HALF_OPEN",
}

interface CircuitBreakerOptions {
    failureThreshold: number;
    successThreshold: number;
    timeout: number; // ms to wait before trying half-open
}

class CircuitBreaker {
    private state: CircuitState = CircuitState.Closed;
    private failureCount = 0;
    private successCount = 0;
    private lastFailureTime = 0;
    private options: CircuitBreakerOptions;

    constructor(options: Partial<CircuitBreakerOptions> = {}) {
        this.options = {
            failureThreshold: options.failureThreshold ?? 5,
            successThreshold: options.successThreshold ?? 2,
            timeout: options.timeout ?? 10000,
        };
    }

    async execute<T>(fn: () => Promise<T>): Promise<T> {
        if (this.state === CircuitState.Open) {
            if (Date.now() - this.lastFailureTime >= this.options.timeout) {
                this.state = CircuitState.HalfOpen;
                this.successCount = 0;
            } else {
                throw new Error(`Circuit breaker is OPEN. Retry after ${this.remainingTimeout()}ms`);
            }
        }

        try {
            const result = await fn();
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            throw error;
        }
    }

    private onSuccess(): void {
        if (this.state === CircuitState.HalfOpen) {
            this.successCount++;
            if (this.successCount >= this.options.successThreshold) {
                this.state = CircuitState.Closed;
                this.failureCount = 0;
                this.successCount = 0;
                console.log("Circuit breaker → CLOSED (recovered)");
            }
        } else {
            this.failureCount = 0;
        }
    }

    private onFailure(): void {
        this.failureCount++;
        this.lastFailureTime = Date.now();

        if (this.state === CircuitState.HalfOpen) {
            this.state = CircuitState.Open;
            console.log("Circuit breaker → OPEN (half-open test failed)");
        } else if (this.failureCount >= this.options.failureThreshold) {
            this.state = CircuitState.Open;
            console.log("Circuit breaker → OPEN (threshold reached)");
        }
    }

    private remainingTimeout(): number {
        return Math.max(0, this.options.timeout - (Date.now() - this.lastFailureTime));
    }

    getState(): CircuitState {
        return this.state;
    }

    getStats(): { state: CircuitState; failures: number; successes: number } {
        return { state: this.state, failures: this.failureCount, successes: this.successCount };
    }
}

// --- Usage ---
const breaker = new CircuitBreaker({
    failureThreshold: 3,
    successThreshold: 2,
    timeout: 5000,
});

async function unreliableService(): Promise<string> {
    if (Math.random() < 0.7) throw new Error("Service unavailable");
    return "OK";
}

for (let i = 0; i < 10; i++) {
    try {
        const result = await breaker.execute(unreliableService);
        console.log(`Call ${i + 1}: ${result}`, breaker.getStats());
    } catch (err: any) {
        console.log(`Call ${i + 1}: FAILED — ${err.message}`, breaker.getStats());
    }
    await new Promise((r) => setTimeout(r, 500));
}
```

---

## I5. Concurrent Task Runner

**Problem:** Implement a task runner that executes async tasks with a configurable **concurrency limit** (like `p-limit`).

### TypeScript

```typescript
class ConcurrentRunner {
    private running = 0;
    private queue: (() => void)[] = [];

    constructor(private concurrency: number) {
        if (concurrency < 1) throw new Error("Concurrency must be >= 1");
    }

    async run<T>(fn: () => Promise<T>): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const execute = async () => {
                this.running++;
                try {
                    const result = await fn();
                    resolve(result);
                } catch (err) {
                    reject(err);
                } finally {
                    this.running--;
                    this.processQueue();
                }
            };

            if (this.running < this.concurrency) {
                execute();
            } else {
                this.queue.push(execute);
            }
        });
    }

    async map<T, R>(items: T[], fn: (item: T) => Promise<R>): Promise<R[]> {
        return Promise.all(items.map((item) => this.run(() => fn(item))));
    }

    private processQueue(): void {
        if (this.queue.length > 0 && this.running < this.concurrency) {
            const next = this.queue.shift()!;
            next();
        }
    }

    get pendingCount(): number {
        return this.queue.length;
    }

    get activeCount(): number {
        return this.running;
    }
}

// --- Usage ---
const runner = new ConcurrentRunner(3); // max 3 concurrent tasks

async function fetchUrl(url: string): Promise<string> {
    const delay = Math.random() * 2000;
    await new Promise((r) => setTimeout(r, delay));
    console.log(`Fetched: ${url} (${Math.round(delay)}ms)`);
    return `Result: ${url}`;
}

const urls = Array.from({ length: 10 }, (_, i) => `https://api.example.com/page/${i + 1}`);

console.time("Total");
const results = await runner.map(urls, fetchUrl);
console.timeEnd("Total"); // ~7s instead of ~10s (3x concurrency)
console.log(`Got ${results.length} results`);
```

---

# ADVANCED LEVEL (5+ YOE)

Focus: Distributed system primitives, complex state machines, advanced patterns.

---

## A1. Event Sourcing Store

**Problem:** Implement an event-sourced data store.
- All state changes stored as immutable events.
- Current state is derived by replaying events.
- Support snapshots for performance.
- Time-travel (get state at any point in time).

### TypeScript

```typescript
interface Event {
    id: string;
    aggregateId: string;
    type: string;
    payload: any;
    timestamp: Date;
    version: number;
}

interface Snapshot<T> {
    aggregateId: string;
    state: T;
    version: number;
    timestamp: Date;
}

type EventHandler<T> = (state: T, event: Event) => T;

class EventStore<T> {
    private events: Event[] = [];
    private snapshots = new Map<string, Snapshot<T>>();
    private handlers = new Map<string, EventHandler<T>>();
    private snapshotInterval: number;

    constructor(
        private initialState: () => T,
        snapshotInterval = 10
    ) {
        this.snapshotInterval = snapshotInterval;
    }

    registerHandler(eventType: string, handler: EventHandler<T>): void {
        this.handlers.set(eventType, handler);
    }

    appendEvent(aggregateId: string, type: string, payload: any): Event {
        const version = this.getEventsForAggregate(aggregateId).length + 1;
        const event: Event = {
            id: `evt_${this.events.length + 1}`,
            aggregateId,
            type,
            payload,
            timestamp: new Date(),
            version,
        };
        this.events.push(event);

        if (version % this.snapshotInterval === 0) {
            this.createSnapshot(aggregateId);
        }

        return event;
    }

    getState(aggregateId: string): T {
        const snapshot = this.snapshots.get(aggregateId);
        let state = snapshot ? { ...snapshot.state } : this.initialState();
        const startVersion = snapshot ? snapshot.version + 1 : 1;

        const events = this.getEventsForAggregate(aggregateId)
            .filter((e) => e.version >= startVersion);

        for (const event of events) {
            const handler = this.handlers.get(event.type);
            if (handler) state = handler(state, event);
        }

        return state;
    }

    getStateAtTime(aggregateId: string, at: Date): T {
        let state = this.initialState();
        const events = this.getEventsForAggregate(aggregateId)
            .filter((e) => e.timestamp <= at);

        for (const event of events) {
            const handler = this.handlers.get(event.type);
            if (handler) state = handler(state, event);
        }

        return state;
    }

    getHistory(aggregateId: string): Event[] {
        return this.getEventsForAggregate(aggregateId);
    }

    private getEventsForAggregate(aggregateId: string): Event[] {
        return this.events.filter((e) => e.aggregateId === aggregateId);
    }

    private createSnapshot(aggregateId: string): void {
        const state = this.getState(aggregateId);
        const events = this.getEventsForAggregate(aggregateId);
        this.snapshots.set(aggregateId, {
            aggregateId,
            state,
            version: events.length,
            timestamp: new Date(),
        });
    }
}

// --- Usage: Bank Account with Event Sourcing ---

interface AccountState {
    balance: number;
    owner: string;
    isActive: boolean;
    transactionCount: number;
}

const store = new EventStore<AccountState>(
    () => ({ balance: 0, owner: "", isActive: false, transactionCount: 0 }),
    5
);

store.registerHandler("ACCOUNT_CREATED", (state, event) => ({
    ...state,
    owner: event.payload.owner,
    isActive: true,
}));

store.registerHandler("MONEY_DEPOSITED", (state, event) => ({
    ...state,
    balance: state.balance + event.payload.amount,
    transactionCount: state.transactionCount + 1,
}));

store.registerHandler("MONEY_WITHDRAWN", (state, event) => ({
    ...state,
    balance: state.balance - event.payload.amount,
    transactionCount: state.transactionCount + 1,
}));

store.registerHandler("ACCOUNT_CLOSED", (state, event) => ({
    ...state,
    isActive: false,
}));

const accId = "acc_001";
store.appendEvent(accId, "ACCOUNT_CREATED", { owner: "Alice" });
store.appendEvent(accId, "MONEY_DEPOSITED", { amount: 1000 });
const afterDeposit = new Date();
store.appendEvent(accId, "MONEY_WITHDRAWN", { amount: 200 });
store.appendEvent(accId, "MONEY_DEPOSITED", { amount: 500 });

console.log("Current state:", store.getState(accId));
// { balance: 1300, owner: "Alice", isActive: true, transactionCount: 3 }

console.log("State after first deposit:", store.getStateAtTime(accId, afterDeposit));
// { balance: 1000, owner: "Alice", isActive: true, transactionCount: 1 }

console.log("Full history:", store.getHistory(accId).length, "events");
```

---

## A2. Distributed Lock (In-Memory Simulation)

**Problem:** Implement a distributed lock manager with:
- Acquire lock with timeout.
- Auto-release after TTL.
- Re-entrant locks (same owner can acquire multiple times).
- Fairness (FIFO queue for waiting acquirers).

### TypeScript

```typescript
interface Lock {
    resource: string;
    owner: string;
    acquiredAt: number;
    ttlMs: number;
    reentrantCount: number;
}

class DistributedLockManager {
    private locks = new Map<string, Lock>();
    private waitQueues = new Map<string, {
        owner: string;
        resolve: () => void;
        reject: (err: Error) => void;
        timer: ReturnType<typeof setTimeout>;
    }[]>();

    async acquire(resource: string, owner: string, ttlMs: number = 10000, timeoutMs: number = 5000): Promise<boolean> {
        this.cleanExpired();

        const existing = this.locks.get(resource);

        // Re-entrant: same owner
        if (existing && existing.owner === owner && !this.isExpired(existing)) {
            existing.reentrantCount++;
            existing.ttlMs = ttlMs; // refresh TTL
            return true;
        }

        // Lock is free
        if (!existing || this.isExpired(existing)) {
            this.locks.set(resource, {
                resource, owner, acquiredAt: Date.now(), ttlMs, reentrantCount: 1,
            });
            return true;
        }

        // Lock is held by someone else — wait in queue
        return new Promise<boolean>((resolve, reject) => {
            const timer = setTimeout(() => {
                this.removeFromQueue(resource, owner);
                resolve(false);
            }, timeoutMs);

            if (!this.waitQueues.has(resource)) {
                this.waitQueues.set(resource, []);
            }

            this.waitQueues.get(resource)!.push({
                owner,
                resolve: () => {
                    clearTimeout(timer);
                    this.locks.set(resource, {
                        resource, owner, acquiredAt: Date.now(), ttlMs, reentrantCount: 1,
                    });
                    resolve(true);
                },
                reject: (err) => {
                    clearTimeout(timer);
                    reject(err);
                },
                timer,
            });
        });
    }

    release(resource: string, owner: string): boolean {
        const lock = this.locks.get(resource);
        if (!lock || lock.owner !== owner) return false;

        lock.reentrantCount--;
        if (lock.reentrantCount > 0) return true; // still held

        this.locks.delete(resource);
        this.notifyNext(resource);
        return true;
    }

    isLocked(resource: string): boolean {
        const lock = this.locks.get(resource);
        return !!lock && !this.isExpired(lock);
    }

    getLockInfo(resource: string): Lock | null {
        const lock = this.locks.get(resource);
        if (!lock || this.isExpired(lock)) return null;
        return { ...lock };
    }

    async withLock<T>(resource: string, owner: string, fn: () => Promise<T>, ttlMs = 10000): Promise<T> {
        const acquired = await this.acquire(resource, owner, ttlMs);
        if (!acquired) throw new Error(`Failed to acquire lock on ${resource}`);
        try {
            return await fn();
        } finally {
            this.release(resource, owner);
        }
    }

    private isExpired(lock: Lock): boolean {
        return Date.now() - lock.acquiredAt > lock.ttlMs;
    }

    private cleanExpired(): void {
        for (const [resource, lock] of this.locks) {
            if (this.isExpired(lock)) {
                this.locks.delete(resource);
                this.notifyNext(resource);
            }
        }
    }

    private notifyNext(resource: string): void {
        const queue = this.waitQueues.get(resource);
        if (queue && queue.length > 0) {
            const next = queue.shift()!;
            next.resolve();
        }
    }

    private removeFromQueue(resource: string, owner: string): void {
        const queue = this.waitQueues.get(resource);
        if (queue) {
            const idx = queue.findIndex((w) => w.owner === owner);
            if (idx !== -1) queue.splice(idx, 1);
        }
    }
}

// --- Usage ---
const lockMgr = new DistributedLockManager();

async function processOrder(orderId: string, worker: string) {
    await lockMgr.withLock(`order:${orderId}`, worker, async () => {
        console.log(`${worker} processing order ${orderId}`);
        await new Promise((r) => setTimeout(r, 1000));
        console.log(`${worker} finished order ${orderId}`);
    });
}

// Concurrent workers trying to process the same order
await Promise.all([
    processOrder("ORD-001", "worker-A"),
    processOrder("ORD-001", "worker-B"), // waits until A releases
    processOrder("ORD-002", "worker-C"), // different resource, runs in parallel
]);
```

---

## A3. CQRS (Command Query Responsibility Segregation)

**Problem:** Implement a CQRS system where:
- **Commands** mutate state and go through validation/authorization.
- **Queries** are read-only and can use optimized read models.
- Command and query sides can evolve independently.

### TypeScript

```typescript
// --- Command Side ---

interface Command {
    type: string;
    payload: any;
    metadata: { userId: string; timestamp: Date };
}

type CommandHandler = (command: Command) => Promise<void>;
type Validator = (command: Command) => string | null; // null = valid

class CommandBus {
    private handlers = new Map<string, CommandHandler>();
    private validators = new Map<string, Validator[]>();
    private middleware: ((cmd: Command, next: () => Promise<void>) => Promise<void>)[] = [];

    registerHandler(commandType: string, handler: CommandHandler): void {
        this.handlers.set(commandType, handler);
    }

    addValidator(commandType: string, validator: Validator): void {
        if (!this.validators.has(commandType)) {
            this.validators.set(commandType, []);
        }
        this.validators.get(commandType)!.push(validator);
    }

    use(middleware: (cmd: Command, next: () => Promise<void>) => Promise<void>): void {
        this.middleware.push(middleware);
    }

    async dispatch(command: Command): Promise<void> {
        // Validate
        const validators = this.validators.get(command.type) ?? [];
        for (const validate of validators) {
            const error = validate(command);
            if (error) throw new Error(`Validation failed: ${error}`);
        }

        const handler = this.handlers.get(command.type);
        if (!handler) throw new Error(`No handler for command: ${command.type}`);

        // Run through middleware chain
        let index = 0;
        const executeNext = async (): Promise<void> => {
            if (index < this.middleware.length) {
                const mw = this.middleware[index++];
                await mw(command, executeNext);
            } else {
                await handler(command);
            }
        };

        await executeNext();
    }
}

// --- Query Side ---

interface Query {
    type: string;
    params: any;
}

type QueryHandler<T> = (query: Query) => Promise<T>;

class QueryBus {
    private handlers = new Map<string, QueryHandler<any>>();

    registerHandler<T>(queryType: string, handler: QueryHandler<T>): void {
        this.handlers.set(queryType, handler);
    }

    async execute<T>(query: Query): Promise<T> {
        const handler = this.handlers.get(query.type);
        if (!handler) throw new Error(`No handler for query: ${query.type}`);
        return handler(query);
    }
}

// --- Read Model (optimized for queries) ---

interface UserReadModel {
    id: string;
    name: string;
    email: string;
    orderCount: number;
    totalSpent: number;
    lastOrderDate: Date | null;
}

// --- Usage ---

// Write store (source of truth)
const users = new Map<string, { id: string; name: string; email: string }>();
const orders = new Map<string, { userId: string; amount: number; date: Date }[]>();

// Read model (denormalized, query-optimized)
const userReadModels = new Map<string, UserReadModel>();

const commandBus = new CommandBus();
const queryBus = new QueryBus();

// Logging middleware
commandBus.use(async (cmd, next) => {
    console.log(`[CMD] ${cmd.type}`, cmd.payload);
    const start = Date.now();
    await next();
    console.log(`[CMD] ${cmd.type} completed in ${Date.now() - start}ms`);
});

// Command handlers (mutate write store + update read model)
commandBus.registerHandler("CREATE_USER", async (cmd) => {
    const { id, name, email } = cmd.payload;
    users.set(id, { id, name, email });
    userReadModels.set(id, { id, name, email, orderCount: 0, totalSpent: 0, lastOrderDate: null });
});

commandBus.addValidator("CREATE_USER", (cmd) => {
    if (!cmd.payload.email?.includes("@")) return "Invalid email";
    if (!cmd.payload.name?.trim()) return "Name is required";
    return null;
});

commandBus.registerHandler("PLACE_ORDER", async (cmd) => {
    const { userId, orderId, amount } = cmd.payload;
    if (!users.has(userId)) throw new Error("User not found");

    if (!orders.has(userId)) orders.set(userId, []);
    orders.get(userId)!.push({ userId, amount, date: new Date() });

    // Update read model
    const readModel = userReadModels.get(userId)!;
    readModel.orderCount++;
    readModel.totalSpent += amount;
    readModel.lastOrderDate = new Date();
});

// Query handlers (read from optimized read model)
queryBus.registerHandler<UserReadModel>("GET_USER_PROFILE", async (query) => {
    const model = userReadModels.get(query.params.userId);
    if (!model) throw new Error("User not found");
    return model;
});

queryBus.registerHandler<UserReadModel[]>("GET_TOP_SPENDERS", async (query) => {
    return [...userReadModels.values()]
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, query.params.limit ?? 10);
});

// Execute
await commandBus.dispatch({
    type: "CREATE_USER",
    payload: { id: "u1", name: "Alice", email: "alice@example.com" },
    metadata: { userId: "admin", timestamp: new Date() },
});

await commandBus.dispatch({
    type: "PLACE_ORDER",
    payload: { userId: "u1", orderId: "o1", amount: 99.99 },
    metadata: { userId: "u1", timestamp: new Date() },
});

const profile = await queryBus.execute<UserReadModel>({
    type: "GET_USER_PROFILE",
    params: { userId: "u1" },
});
console.log("Profile:", profile);
// { id: "u1", name: "Alice", email: "alice@example.com", orderCount: 1, totalSpent: 99.99, ... }
```

---

## A4. Saga / Distributed Transaction Orchestrator

**Problem:** Implement a Saga pattern for distributed transactions.
- Execute a series of steps in order.
- If any step fails, run **compensating actions** for all completed steps in reverse order.
- Each step has an `execute` and a `compensate` function.

### TypeScript

```typescript
interface SagaStep<TContext> {
    name: string;
    execute: (context: TContext) => Promise<void>;
    compensate: (context: TContext) => Promise<void>;
}

interface SagaResult<TContext> {
    success: boolean;
    context: TContext;
    completedSteps: string[];
    failedStep: string | null;
    error: Error | null;
}

class SagaOrchestrator<TContext extends Record<string, any>> {
    private steps: SagaStep<TContext>[] = [];

    addStep(step: SagaStep<TContext>): this {
        this.steps.push(step);
        return this;
    }

    async execute(initialContext: TContext): Promise<SagaResult<TContext>> {
        const completedSteps: SagaStep<TContext>[] = [];
        const context = { ...initialContext };

        for (const step of this.steps) {
            try {
                console.log(`[SAGA] Executing: ${step.name}`);
                await step.execute(context);
                completedSteps.push(step);
            } catch (error: any) {
                console.error(`[SAGA] Failed at: ${step.name} — ${error.message}`);
                console.log(`[SAGA] Starting compensation for ${completedSteps.length} steps...`);

                // Compensate in reverse order
                for (let i = completedSteps.length - 1; i >= 0; i--) {
                    try {
                        console.log(`[SAGA] Compensating: ${completedSteps[i].name}`);
                        await completedSteps[i].compensate(context);
                    } catch (compError: any) {
                        console.error(`[SAGA] Compensation failed for ${completedSteps[i].name}: ${compError.message}`);
                        // In production: alert, manual intervention queue
                    }
                }

                return {
                    success: false,
                    context,
                    completedSteps: completedSteps.map((s) => s.name),
                    failedStep: step.name,
                    error,
                };
            }
        }

        return {
            success: true,
            context,
            completedSteps: completedSteps.map((s) => s.name),
            failedStep: null,
            error: null,
        };
    }
}

// --- Usage: Order Processing Saga ---

interface OrderContext {
    orderId: string;
    userId: string;
    amount: number;
    productId: string;
    paymentId?: string;
    reservationId?: string;
    shippingId?: string;
}

const orderSaga = new SagaOrchestrator<OrderContext>();

orderSaga.addStep({
    name: "Reserve Inventory",
    execute: async (ctx) => {
        console.log(`  Reserving product ${ctx.productId}`);
        ctx.reservationId = `RES-${Date.now()}`;
    },
    compensate: async (ctx) => {
        console.log(`  Releasing reservation ${ctx.reservationId}`);
        ctx.reservationId = undefined;
    },
});

orderSaga.addStep({
    name: "Process Payment",
    execute: async (ctx) => {
        console.log(`  Charging $${ctx.amount} to user ${ctx.userId}`);
        // Simulate occasional failure
        if (Math.random() < 0.3) throw new Error("Payment gateway timeout");
        ctx.paymentId = `PAY-${Date.now()}`;
    },
    compensate: async (ctx) => {
        console.log(`  Refunding payment ${ctx.paymentId}`);
        ctx.paymentId = undefined;
    },
});

orderSaga.addStep({
    name: "Create Shipment",
    execute: async (ctx) => {
        console.log(`  Creating shipment for order ${ctx.orderId}`);
        ctx.shippingId = `SHIP-${Date.now()}`;
    },
    compensate: async (ctx) => {
        console.log(`  Cancelling shipment ${ctx.shippingId}`);
        ctx.shippingId = undefined;
    },
});

orderSaga.addStep({
    name: "Send Confirmation Email",
    execute: async (ctx) => {
        console.log(`  Emailing confirmation for ${ctx.orderId}`);
    },
    compensate: async (ctx) => {
        console.log(`  Sending cancellation email for ${ctx.orderId}`);
    },
});

const result = await orderSaga.execute({
    orderId: "ORD-001",
    userId: "user-42",
    amount: 99.99,
    productId: "PROD-100",
});

console.log("\nSaga result:", result.success ? "SUCCESS" : "FAILED");
if (!result.success) {
    console.log("Failed at:", result.failedStep);
    console.log("Compensated:", result.completedSteps.join(", "));
}
```

---

## A5. Rule Engine

**Problem:** Implement a configurable rule engine.
- Rules are defined as conditions + actions.
- Conditions support AND, OR, NOT operators.
- Rules have priority. First matching rule wins (or all matching rules execute).

### TypeScript

```typescript
type ConditionFn<T> = (fact: T) => boolean;

interface Condition<T> {
    evaluate(fact: T): boolean;
}

class SimpleCondition<T> implements Condition<T> {
    constructor(private fn: ConditionFn<T>, readonly description: string) {}
    evaluate(fact: T): boolean { return this.fn(fact); }
}

class AndCondition<T> implements Condition<T> {
    constructor(private conditions: Condition<T>[]) {}
    evaluate(fact: T): boolean { return this.conditions.every((c) => c.evaluate(fact)); }
}

class OrCondition<T> implements Condition<T> {
    constructor(private conditions: Condition<T>[]) {}
    evaluate(fact: T): boolean { return this.conditions.some((c) => c.evaluate(fact)); }
}

class NotCondition<T> implements Condition<T> {
    constructor(private condition: Condition<T>) {}
    evaluate(fact: T): boolean { return !this.condition.evaluate(fact); }
}

interface Rule<T, R> {
    name: string;
    priority: number;
    condition: Condition<T>;
    action: (fact: T) => R;
}

class RuleEngine<T, R> {
    private rules: Rule<T, R>[] = [];

    addRule(rule: Rule<T, R>): this {
        this.rules.push(rule);
        this.rules.sort((a, b) => b.priority - a.priority); // higher priority first
        return this;
    }

    executeFirst(fact: T): { rule: string; result: R } | null {
        for (const rule of this.rules) {
            if (rule.condition.evaluate(fact)) {
                return { rule: rule.name, result: rule.action(fact) };
            }
        }
        return null;
    }

    executeAll(fact: T): { rule: string; result: R }[] {
        const results: { rule: string; result: R }[] = [];
        for (const rule of this.rules) {
            if (rule.condition.evaluate(fact)) {
                results.push({ rule: rule.name, result: rule.action(fact) });
            }
        }
        return results;
    }
}

// --- Helpers ---
function condition<T>(fn: ConditionFn<T>, desc: string): Condition<T> {
    return new SimpleCondition(fn, desc);
}
function and<T>(...conditions: Condition<T>[]): Condition<T> {
    return new AndCondition(conditions);
}
function or<T>(...conditions: Condition<T>[]): Condition<T> {
    return new OrCondition(conditions);
}
function not<T>(c: Condition<T>): Condition<T> {
    return new NotCondition(c);
}

// --- Usage: Pricing Rule Engine ---

interface OrderFact {
    amount: number;
    customerType: "regular" | "premium" | "vip";
    itemCount: number;
    isFirstOrder: boolean;
    couponCode?: string;
}

interface Discount {
    percentage: number;
    reason: string;
}

const engine = new RuleEngine<OrderFact, Discount>();

engine.addRule({
    name: "VIP Bulk Discount",
    priority: 100,
    condition: and(
        condition<OrderFact>((f) => f.customerType === "vip", "VIP customer"),
        condition<OrderFact>((f) => f.amount > 500, "Order > $500")
    ),
    action: () => ({ percentage: 25, reason: "VIP + bulk order" }),
});

engine.addRule({
    name: "First Order Discount",
    priority: 90,
    condition: condition<OrderFact>((f) => f.isFirstOrder, "First order"),
    action: () => ({ percentage: 15, reason: "Welcome discount" }),
});

engine.addRule({
    name: "Premium Customer",
    priority: 50,
    condition: or(
        condition<OrderFact>((f) => f.customerType === "premium", "Premium"),
        condition<OrderFact>((f) => f.customerType === "vip", "VIP")
    ),
    action: () => ({ percentage: 10, reason: "Premium member discount" }),
});

engine.addRule({
    name: "Bulk Discount",
    priority: 30,
    condition: condition<OrderFact>((f) => f.itemCount >= 10, "10+ items"),
    action: (f) => ({ percentage: 5, reason: `Bulk discount (${f.itemCount} items)` }),
});

// Test
const order: OrderFact = {
    amount: 750,
    customerType: "vip",
    itemCount: 15,
    isFirstOrder: false,
};

const bestMatch = engine.executeFirst(order);
console.log("Best discount:", bestMatch);
// { rule: "VIP Bulk Discount", result: { percentage: 25, reason: "VIP + bulk order" } }

const allMatches = engine.executeAll(order);
console.log("All applicable discounts:", allMatches);
// VIP Bulk Discount (25%), Premium Customer (10%), Bulk Discount (5%)
```

---

## Difficulty Level Summary

```
┌────────────────────────────────────────────────────────────────────┐
│                    QUESTION DIFFICULTY MAP                          │
├──────────┬─────────────────────────────────────────────────────────┤
│          │                                                         │
│ BEGINNER │  Stack, Queue, Todo List, Bank Account,                 │
│ (B1–B7)  │  Library System, Shopping Cart, Linked List             │
│          │  → Focus: Basic OOP, CRUD, input validation             │
│          │                                                         │
├──────────┼─────────────────────────────────────────────────────────┤
│          │                                                         │
│ INTER-   │  Connection Pool, Retry with Backoff,                   │
│ MEDIATE  │  Wildcard PubSub, Circuit Breaker,                      │
│ (I1–I5)  │  Concurrent Task Runner                                 │
│          │  → Focus: Design patterns, async, resilience            │
│          │                                                         │
├──────────┼─────────────────────────────────────────────────────────┤
│          │                                                         │
│ ADVANCED │  Event Sourcing, Distributed Lock, CQRS,                │
│ (A1–A5)  │  Saga Orchestrator, Rule Engine                         │
│          │  → Focus: Distributed system primitives, architecture   │
│          │                                                         │
├──────────┼─────────────────────────────────────────────────────────┤
│          │                                                         │
│ ORIGINAL │  MyCounter, LRU Cache, Event Emitter, Rate Limiter,     │
│ 20       │  KV Store, Task Scheduler, Snake & Ladder, Parking Lot, │
│ (#1–#20) │  Splitwise, TicTacToe, Elevator, Logger, Promise.all,   │
│          │  HashMap, Debounce/Throttle, Vending Machine,            │
│          │  URL Shortener, Middleware, PubSub Broker, Cron Parser   │
│          │  → Focus: Most-asked in FAANG/startup interviews        │
│          │                                                         │
└──────────┴─────────────────────────────────────────────────────────┘
```

---

*Last updated: March 2026*

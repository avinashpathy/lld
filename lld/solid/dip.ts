/**
 * D — Dependency Inversion Principle (DIP)
 * High-level modules depend on abstractions, not concrete implementations.
 *
 * Run: npx tsx lld/solid/dip.ts
 */

interface Database {
  save(data: string): void;
}

class MySQLDatabase implements Database {
  save(data: string): void {
    console.log(`[MySQL] Saved: ${data}`);
  }
}

class PostgresDatabase implements Database {
  save(data: string): void {
    console.log(`[Postgres] Saved: ${data}`);
  }
}

class InMemoryDatabase implements Database {
  private store: string[] = [];

  save(data: string): void {
    this.store.push(data);
    console.log(`[InMemory] Saved: ${data} (total: ${this.store.length})`);
  }

  getAll(): string[] {
    return [...this.store];
  }
}

// ✅ OrderService depends on Database abstraction — swap implementations freely
class OrderService {
  constructor(private db: Database) {}

  createOrder(orderId: string, item: string): void {
    const payload = `order:${orderId}|item:${item}`;
    this.db.save(payload);
    console.log(`[OrderService] Order ${orderId} created for "${item}"`);
  }
}

// --- Demo ---
console.log("Using MySQL backend:\n");
const mysqlService = new OrderService(new MySQLDatabase());
mysqlService.createOrder("ORD-001", "Laptop");

console.log("\nUsing Postgres backend:\n");
const pgService = new OrderService(new PostgresDatabase());
pgService.createOrder("ORD-002", "Phone");

console.log("\nUsing InMemory backend (great for tests):\n");
const memDb = new InMemoryDatabase();
const testService = new OrderService(memDb);
testService.createOrder("ORD-003", "Headphones");
testService.createOrder("ORD-004", "Keyboard");
console.log("Stored orders:", memDb.getAll());

/**
 * I — Interface Segregation Principle (ISP)
 * Clients should not be forced to depend on methods they don't use.
 *
 * Run: npx tsx lld/solid/isp.ts
 */

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
  constructor(private name: string) {}

  work(): void {
    console.log(`[${this.name}] Working on tasks`);
  }

  eat(): void {
    console.log(`[${this.name}] Eating lunch`);
  }

  sleep(): void {
    console.log(`[${this.name}] Sleeping`);
  }
}

// ✅ Robot only implements Workable — not forced to stub eat()/sleep()
class RobotWorker implements Workable {
  constructor(private id: string) {}

  work(): void {
    console.log(`[Robot ${this.id}] Working 24/7`);
  }
}

function assignWork(worker: Workable): void {
  worker.work();
}

function lunchBreak(worker: Feedable): void {
  worker.eat();
}

// --- Demo ---
const human = new HumanWorker("Avinash");
const robot = new RobotWorker("R-42");

console.log("Human worker day:");
assignWork(human);
lunchBreak(human);
human.sleep();

console.log("\nRobot worker day:");
assignWork(robot);
// lunchBreak(robot); // ❌ Compile error — RobotWorker doesn't implement Feedable (by design)

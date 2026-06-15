class Counter {
    private static instance: Counter;
    private count: number = 0;

    private constructor() { }

    static getInstance(): Counter {
        if (!Counter.instance) {
            Counter.instance = new Counter();
        }
        return Counter.instance;
    }

    increment(): void {
        this.count++;
    }

    getCount(): number {
        return this.count;
    }
}

const c1 = Counter.getInstance();
const c2 = Counter.getInstance();
console.log("Same instance:", c1 === c2);
for (let i = 0; i < 5; i++) {
    c1.increment();
}
console.log("Count after 5 increments:", c1.getCount());


// Example 2

const LogLevel = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
} as const;
type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];

class Logger {
    private static instance: Logger;
    private minLevel: LogLevel = LogLevel.INFO;

    private constructor() {}

    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    setLevel(level: LogLevel): void {
        this.minLevel = level;
    }

    private log(level: LogLevel, message: string): void {
        if (level >= this.minLevel) {
            const names = ["DEBUG", "INFO", "WARN", "ERROR"];
            console.log(`[${names[level]}] ${message}`);
        }
    }

    debug(msg: string): void { this.log(LogLevel.DEBUG, msg); }
    info(msg: string): void  { this.log(LogLevel.INFO, msg); }
    warn(msg: string): void  { this.log(LogLevel.WARN, msg); }
    error(msg: string): void { this.log(LogLevel.ERROR, msg); }
}

const l1 = Logger.getInstance();
const l2 = Logger.getInstance();
console.log("Same instance:", l1 === l2);
l1.setLevel(LogLevel.WARN);
l1.debug("Starting up");
l1.info("Server listening on port 8080");
l1.warn("Connection pool running low");
l1.error("Failed to connect to database");
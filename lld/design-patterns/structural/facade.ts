// Subsystem: Controls smart lights in the house
class SmartLightsSystem {
    on(): void {
        console.log("Lights: Turned on.");
    }

    off(): void {
        console.log("Lights: Turned off.");
    }
}

// Subsystem: Controls the thermostat temperature and mode
class Thermostat {
    private mode: string = "";

    setTemperature(degrees: number): void {
        console.log(`Thermostat: Mode set to ${this.mode}. Temperature set to ${degrees}C.`);
    }

    setMode(mode: string): void {
        this.mode = mode;
    }
}

// Subsystem: Controls the home security system
class SecuritySystem {
    arm(): void {
        console.log("Security: System armed.");
    }

    disarm(): void {
        console.log("Security: System disarmed.");
    }
}

// Facade: Provides simplified methods to control all smart home subsystems
class SmartHomeFacade {
    private lights: SmartLightsSystem;
    private thermostat: Thermostat;
    private security: SecuritySystem;

    constructor(lights: SmartLightsSystem, thermostat: Thermostat, security: SecuritySystem) {
        this.lights = lights;
        this.thermostat = thermostat;
        this.security = security;
    }

    leaveHome(): void {
        console.log("--- Leaving Home ---");
        this.lights.off();
        this.thermostat.setMode("eco");
        this.thermostat.setTemperature(18);
        this.security.arm();
        console.log("--- Home secured ---");
    }

    arriveHome(): void {
        console.log("--- Arriving Home ---");
        this.lights.on();
        this.thermostat.setMode("comfort");
        this.thermostat.setTemperature(22);
        this.security.disarm();
        console.log("--- Welcome home! ---");
    }
}

const lights = new SmartLightsSystem();
const thermostat = new Thermostat();
const security = new SecuritySystem();

const home = new SmartHomeFacade(lights, thermostat, security);
home.leaveHome();
console.log();
home.arriveHome();
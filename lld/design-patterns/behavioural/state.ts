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

    selectProduct(machine: VendingMachine): void {
        console.log("Insert coin first");
    }

    dispense(machine: VendingMachine): void {
        console.log("Insert coin first");
    }
}

class HasCoinState implements VendingMachineState {
    insertCoin(machine: VendingMachine): void {
        console.log("Coin already inserted");
    }

    selectProduct(machine: VendingMachine): void {
        console.log("Product selected");
        machine.setState(new DispenseState());
    }

    dispense(machine: VendingMachine): void {
        console.log("Select product first");
    }
}

class DispenseState implements VendingMachineState {
    insertCoin(machine: VendingMachine): void {
        console.log("Please wait, dispensing");
    }

    selectProduct(machine: VendingMachine): void {
        console.log("Please wait, dispensing");
    }

    dispense(machine: VendingMachine): void {
        console.log("Dispensing product");
        machine.setState(new NoCoinState());
    }
}

class VendingMachine {
    private currentState: VendingMachineState;

    constructor() {
        this.currentState = new NoCoinState();
    }

    insertCoin(): void {
        this.currentState.insertCoin(this);
    }

    selectProduct(): void {
        this.currentState.selectProduct(this);
    }

    dispense(): void {
        this.currentState.dispense(this);
    }

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


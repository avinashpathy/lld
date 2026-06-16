interface Pizza {
    getCost(): number;
    getDescription(): string;
}

class PlainPizza implements Pizza {
    getCost(): number { return 5.00; }
    getDescription(): string { return "Plain pizza"; }
}

abstract class PizzaDecorator implements Pizza {
    protected pizza: Pizza;

    constructor(pizza: Pizza) {
        this.pizza = pizza;
    }

    getCost(): number {
        return this.pizza.getCost();
    }

    getDescription(): string {
        return this.pizza.getDescription();
    }
}

class CheeseDecorator extends PizzaDecorator {
    constructor(pizza: Pizza) {
        super(pizza);
    }

    getCost(): number {
        return this.pizza.getCost() + 1.50;
    }

    getDescription(): string {
        return this.pizza.getDescription() + ", cheese";
    }
}

class OliveDecorator extends PizzaDecorator {
    constructor(pizza: Pizza) {
        super(pizza);
    }

    getCost(): number {
        return this.pizza.getCost() + 2.00;
    }

    getDescription(): string {
        return this.pizza.getDescription() + ", olives";
    }
}

class MushroomDecorator extends PizzaDecorator {
    constructor(pizza: Pizza) {
        super(pizza);
    }

    getCost(): number {
        return this.pizza.getCost() + 1.00;
    }

    getDescription(): string {
        return this.pizza.getDescription() + ", mushrooms";
    }
}

const plain: Pizza = new PlainPizza();
console.log(`${plain.getDescription()} | $${plain.getCost().toFixed(2)}`);

const cheeseOlive: Pizza = new OliveDecorator(new CheeseDecorator(new PlainPizza()));
console.log(`${cheeseOlive.getDescription()} | $${cheeseOlive.getCost().toFixed(2)}`);

const loaded: Pizza = new MushroomDecorator(
    new OliveDecorator(new CheeseDecorator(new PlainPizza())));
console.log(`${loaded.getDescription()} | $${loaded.getCost().toFixed(2)}`);
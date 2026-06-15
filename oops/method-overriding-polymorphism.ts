// method overriding - runtime polymorphism

abstract class Discount {
    protected label: string;

    constructor(label: string) {
        this.label = label;
    }

    abstract apply(price: number): number;

    describe(originalPrice: number): void {
        const discountedPrice = this.apply(originalPrice);
        console.log(`${this.label}: $${originalPrice.toFixed(2)} -> $${discountedPrice.toFixed(2)}`);
    }
}

class PercentageDiscount extends Discount {
    private percentage: number;

    constructor(percentage: number) {
        super(percentage.toFixed(1) + "% off");
        this.percentage = percentage;
    }

    apply(price: number): number {
        return price * (1 - this.percentage / 100);
    }
}

class FlatDiscount extends Discount {
    private amount: number;

    constructor(amount: number) {
        super("$" + amount.toFixed(1) + " off");
        this.amount = amount;
    }

    apply(price: number): number {
        return Math.max(price - this.amount, 0);
    }
}

class BuyOneGetOneFree extends Discount {
    constructor() {
        super("Buy 1 Get 1 Free");
    }

    apply(price: number): number {
        return price / 2;
    }
}

class OrderProcessor {
    processOrder(itemName: string, price: number, discount: Discount): void {
        console.log(`Item: ${itemName}`);
        discount.describe(price);
    }
}

const processor = new OrderProcessor();

processor.processOrder("Laptop", 999.99, new PercentageDiscount(20));
processor.processOrder("Headphones", 49.99, new FlatDiscount(15));
processor.processOrder("Keyboard", 79.98, new BuyOneGetOneFree());



// Example 2:

class Animal {
    makeSound(): void {
        console.log("Animal makes a sound");
    }
}

class Dog extends Animal {
    makeSound(): void {
        console.log("Dog barks");
    }
}

class Cat extends Animal {
    makeSound(): void {
        console.log("Cat meows");
    }
}

const animal = new Animal();
const dog = new Dog();
const cat = new Cat();

animal.makeSound();
dog.makeSound();
cat.makeSound();
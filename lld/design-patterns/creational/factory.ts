// Which object to create? -> Factory pattern solves this

// Example 1

interface Notification {
    send(message: string): void;
}

class EmailNotification implements Notification {
    send(message: string): void {
        console.log(`Email: ${message}`);
    }
}

class SmsNotification implements Notification {
    send(message: string): void {
        console.log(`SMS: ${message}`);
    }
}

class NotificationFactory {
    static create(type: string): Notification {
        switch (type) {
            case "email":
                return new EmailNotification();
            case "sms":
                return new SmsNotification();
            default:
                throw new Error("Invalid type");
        }
    }
}

const notification = NotificationFactory.create("email");
notification.send("Hello!");


// Example 2

interface PaymentMethod {
    validatePayment(): boolean;
    processPayment(amount: number): void;
    getReceipt(): string;
}

class CreditCardPayment implements PaymentMethod {
    validatePayment(): boolean {
        console.log("Validating credit card...");
        return true;
    }

    processPayment(amount: number): void {
        const fee = amount * 0.025;
        console.log(`Processing credit card payment: $${amount.toFixed(2)} (fee: $${fee.toFixed(2)})`);
    }

    getReceipt(): string {
        return "Card ending in ****1234";
    }
}

class PayPalPayment implements PaymentMethod {
    validatePayment(): boolean {
        console.log("Validating PayPal account...");
        return true;
    }

    processPayment(amount: number): void {
        const fee = amount * 0.015;
        console.log(`Processing PayPal payment: $${amount.toFixed(2)} (fee: $${fee.toFixed(2)})`);
    }

    getReceipt(): string {
        return "PayPal: user@email.com";
    }
}

class CryptoPayment implements PaymentMethod {
    validatePayment(): boolean {
        console.log("Validating crypto wallet...");
        return true;
    }

    processPayment(amount: number): void {
        const fee = amount * 0.005;
        console.log(`Processing crypto payment: $${amount.toFixed(2)} (fee: $${fee.toFixed(2)})`);
    }

    getReceipt(): string {
        return "Wallet: 0x1a2b...3c4d";
    }
}

abstract class PaymentCreator {
    // Factory method - subclasses decide which PaymentMethod to create
    abstract createPayment(): PaymentMethod;

    checkout(amount: number): void {
        const payment = this.createPayment();
        payment.validatePayment();
        payment.processPayment(amount);
        console.log(`Receipt: ${payment.getReceipt()}`);
    }
}

class CreditCardPaymentCreator extends PaymentCreator {
    createPayment(): PaymentMethod {
        return new CreditCardPayment();
    }
}

class PayPalPaymentCreator extends PaymentCreator {
    createPayment(): PaymentMethod {
        return new PayPalPayment();
    }
}

class CryptoPaymentCreator extends PaymentCreator {
    createPayment(): PaymentMethod {
        return new CryptoPayment();
    }
}

function main(): void {
    let processor: PaymentCreator;

    processor = new CreditCardPaymentCreator();
    processor.checkout(100.00);

    console.log();

    processor = new PayPalPaymentCreator();
    processor.checkout(250.00);

    console.log();

    processor = new CryptoPaymentCreator();
    processor.checkout(500.00);
}

main();
interface PaymentStrategy {
    pay(amount: number): boolean;
  }
  
  class CreditCardPayment implements PaymentStrategy {
    private cardNumber: string;
  
    constructor(cardNumber: string) {
      this.cardNumber = cardNumber;
    }
  
    pay(amount: number): boolean {
      // Credit card processing logic
      console.log(`Paid ${amount} with credit card`);
      return true;
    }
  }
  
  class PayPalPayment implements PaymentStrategy {
    private email: string;
  
    constructor(email: string) {
      this.email = email;
    }
  
    pay(amount: number): boolean {
      // PayPal processing logic
      console.log(`Paid ${amount} with PayPal`);
      return true;
    }
  }
  
  class ShoppingCart {
    private paymentStrategy?: PaymentStrategy;
  
    setPaymentStrategy(strategy: PaymentStrategy): void {
      this.paymentStrategy = strategy;
    }
  
    checkout(amount: number): void {
      this.paymentStrategy!.pay(amount);
    }
  }
  
  // Usage
  const cart = new ShoppingCart();
  
  cart.setPaymentStrategy(new CreditCardPayment("1234-5678"));
  cart.checkout(100.00);
  
  cart.setPaymentStrategy(new PayPalPayment("user@example.com"));
  cart.checkout(50.00);
  
  
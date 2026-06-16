interface Observer {
    update(symbol: string, price: number): void;
  }
  
  interface Subject {
    attach(observer: Observer): void;
    detach(observer: Observer): void;
    notifyObservers(): void;
  }
  
  class Stock implements Subject {
    private observers: Observer[] = [];
    private symbol: string;
    private price: number = 0;
  
    constructor(symbol: string) {
      this.symbol = symbol;
    }
  
    attach(observer: Observer): void {
      this.observers.push(observer);
    }
  
    detach(observer: Observer): void {
      const index = this.observers.indexOf(observer);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    }
  
    setPrice(price: number): void {
      this.price = price;
      this.notifyObservers();  // Price changed, tell everyone
    }
  
    notifyObservers(): void {
      for (const observer of this.observers) {
        observer.update(this.symbol, this.price);
      }
    }
  }
  
  class PriceDisplay implements Observer {
    update(symbol: string, price: number): void {
      console.log(`Display updated: ${symbol} = $${price}`);
    }
  }
  
  class PriceAlert implements Observer {
    private threshold: number;
  
    constructor(threshold: number) {
      this.threshold = threshold;
    }
  
    update(symbol: string, price: number): void {
      if (price > this.threshold) {
        console.log(`Alert! ${symbol} exceeded $${this.threshold}`);
      }
    }
  }
  
  // Usage
  const stock = new Stock("AAPL");
  
  const display = new PriceDisplay();
  const alert = new PriceAlert(150.00);
  
  stock.attach(display);
  stock.attach(alert);
  
  stock.setPrice(145.00);  // Both observers get notified
  stock.setPrice(155.00);  // Both observers get notified
  
  
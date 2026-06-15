interface Bird {
  eat(): void;
}

interface FlyingBird extends Bird {
  fly(): void;
}

class Sparrow implements FlyingBird {
  eat(): void {
    console.log("Sparrow is eating");
  }

  fly(): void {
    console.log("Sparrow is flying");
  }
}

class Penguin implements Bird {
  eat(): void {
    console.log("Penguin is eating");
  }
}

const sparrow = new Sparrow();
sparrow.eat();
sparrow.fly();

const penguin = new Penguin();
penguin.eat();
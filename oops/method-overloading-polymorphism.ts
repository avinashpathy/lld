class Calculator {
    add(a: number, b: number): number;
    add(a: number, b: number, c: number): number;

    add(a: number, b: number, c?: number): number {
        if (c !== undefined) {
            return a + b + c;
        }
        return a + b;
    }
}

const calc = new Calculator();

console.log(calc.add(2, 3));      // 5
console.log(calc.add(1, 2, 3));   // 6
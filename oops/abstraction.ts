abstract class Shape{
    protected name: string;

    constructor(name:string){
        this.name=name;
    }

    abstract area():number;
    abstract perimeter():number;

    describe():void {
        console.log(`Shape: ${this.name}, Area: ${this.area().toFixed(2)}, Perimeter: ${this.perimeter().toFixed(2)}`);
    }
}

class Circle extends Shape{
    private radius: number;

    constructor(radius:number){
        super("Circle");
        this.radius=radius;
    }

    area():number{
        return Math.PI*this.radius*this.radius;
    }
    perimeter(): number {
        return 2 * Math.PI * this.radius;
    }
}

class Rectangle extends Shape {
    private width: number;
    private height: number;

    constructor(width: number, height: number) {
        super("Rectangle");
        this.width = width;
        this.height = height;
    }

    area(): number {
        return this.width * this.height;
    }

    perimeter(): number {
        return 2 * (this.width + this.height);
    }
}

const circle:Shape = new Circle(5.0);
circle.describe();
const rectangle:Rectangle = new Rectangle(10,5);
rectangle.describe();
class TemperatureSensor{
    private readings:number[]=[];

    addReading(value: number):void {
        if(value>=-50 && value <=150){
            this.readings.push(value);
        }
    }

    getAverage():number {
        if(this.readings.length === 0){
            return 0;
        }
        const sum = this.readings.reduce((a,b) => a+b,0);
        return Math.round((sum/this.readings.length)*100)/100;
    }

    getReadingCount(): number {
        return this.readings.length;
    }

    getReadings(): number[] {
        return [...this.readings];
    }
}

const sensor = new TemperatureSensor();
sensor.addReading(22.5);
sensor.addReading(23.1);
sensor.addReading(200.0);  // Should be rejected
sensor.addReading(-10.0);

console.log(`Count: ${sensor.getReadingCount()}`);  // 3
console.log(`Average: ${sensor.getAverage()}`); 
class TrafficLight {
    static readonly RED = new TrafficLight("RED",30);
    static readonly YELLOW = new TrafficLight("YELLOW",5);
    static readonly GREEN = new TrafficLight("GREEN",25);

    readonly color: string;
    readonly duration: number;

    constructor(color: string, duration:number){
        this.color=color;
        this.duration = duration;
    }

    next():TrafficLight{
        if(this == TrafficLight.RED) return TrafficLight.GREEN;
        if(this == TrafficLight.GREEN) return TrafficLight.YELLOW;
        return TrafficLight.RED;
    }

    display():void{
        console.log(`${this.color} (${this.duration})`);
    }
}

let light = TrafficLight.RED;
for(let i=0;i<6;i++){
    light.display();
    light = light.next();
}
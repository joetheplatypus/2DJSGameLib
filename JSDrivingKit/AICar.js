import { Car } from "./Car.js";
import { RoadTile } from "./RoadTile.js";

export class AICar extends Car {
    constructor() {
        super()
        this.target = null;
        this.targetCB = () => {};
        this.maxSpeed = 3;
        this.acceptDistance = 50;
        this.maxSteer = 0.8
    }
    update() {
        if(this.target) {
            this.input.on = true

            const forward = Math.sign(this.vForward().dot(this.vTo(this.target)))

            // turn around if long distance
            if(this.distSq(this.target) > 2000 && forward === -1) {
                if(this.lvelocity.x < 5) {
                    this.input.turn = 1;
                    this.input.drive = 1;
                    this.input.brake = 0;
                    this.input.handbrake = 1;
                } else {
                    this.input.brake = 1;
                    this.input.turn = 1;
                    this.input.handbrake = 1;
                }
                
            } else {
                this.input.handbrake = 0;
                if(forward > 0) {
                    if(this.input.reverse && Math.abs(this.lvelocity.x) < 1) {
                        this.input.reverse = false;
                    } else if(this.input.reverse) {
                        this.input.brake = 1;
                        this.input.drive = 0;
                    } else {
                        this.input.drive = 1;
                        this.input.brake = 0;
                    }
                } else if(forward < 0) {
                    if(!this.input.reverse && Math.abs(this.lvelocity.x) < 1) {
                        this.input.reverse = true;
                    } else if(this.input.reverse) {
                        this.input.drive = 1;
                        this.input.brake = 0;
                    } else {
                        this.input.brake = 1;
                        this.input.drive = 0;
                    }
                }
    
                let angle = this.angleTo(this.target) - this.rotation;
                while(angle > Math.PI) {
                    angle -= 2*Math.PI;
                }
                while(angle < -Math.PI) {
                    angle += 2*Math.PI
                }
    
                if(angle < -0.1) {
                    this.input.turn = -1;
                } else if(angle > 0.1) {
                    this.input.turn = 1;
                } else if(Math.abs(this.steerAngle) < 0.1) {
                    this.input.turn = angle;
                } else {
                    this.input.turn = 0;
                }
            }
            if(this.distSq(this.target) < Math.pow(this.acceptDistance,2)) {
                this.target = null;
                this.input.on = false;
                this.input.turn = 0;
                this.input.drive = 0;
                this.input.brake = 0;
                this.targetCB();
            }

            if(this.lvelocity.x > this.maxSpeed) {
                this.input.drive = 0;
            }
        }
        super.update()
    }
    goto({x,y}, cb) {
        this.target = {x,y};
        this.targetCB = cb;
    }
    follow(waypoints, cb) {
        this.goto(waypoints[0], () => {
            if(waypoints.length == 1) {
                cb()
            } else {
                this.follow(waypoints.slice(1), cb)
            }
        })
    }
    onClick() {
        // this.follow([
        //     {x:500,y:500},
        //     {x:-200,y:500},
        //     {x:-200,y:-200},
        //     {x:500,y:-200}
        // ], () => {console.log('done')})

        const network = this.closest(RoadTile).network;
        const path = network.generatePath([{x:5,y:5},{x:6,y:5},{x:7,y:5},{x:7,y:4},{x:7,y:3},{x:7,y:4},{x:7,y:5}]);
        console.log(path)
        this.follow(path, () => {console.log('done')})
    }
}
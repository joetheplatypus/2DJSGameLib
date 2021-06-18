import { GameObject,clamp } from "../JSEngineKit/main.js";
import { ParticleEmitter } from "../JSParticleKit/main.js";

export class Car extends GameObject {
    constructor() {
        super()
        this.friction.x = 0;
        this.friction.y = 0;

        this.input = {
            drive: 0,
            brake: 0,
            turn: 0,
            handbrake: 0,
            reverse: false,
            on: false,
        };

        this.dimensions = {x:128,y:60}

        this.lvelocity = {x:0, y:0};
        this.lacceleration = {x:0, y:0};
        this.steerAngle = 0;

        this.downforce = 9.81;
        this.mass = 1200;
        this.cogFrontA = 2;
        this.cogBackA = 2;
        this.cogHeight = 0.55;
        this.wheelRad = 0.3;
        this.tireGrip = 2;
        this.tireLockGrip = 0.7;
        this.engineForce = 8000;
        this.brakeForce = 12000;
        this.handbrakeForce = 4800;
        this.weightTransfer = 0.2;
        this.maxSteer = 0.6;
        this.cornerStiffFront = 5;
        this.cornerStiffBack = 5.2;
        this.airResist = 2.5;
        this.rollResist = 8;
        
        this.wheelBase = this.cogFrontA + this.cogBackA;
        this.awrFront = this.cogBackA / this.wheelBase;
        this.awrBack = this.cogFrontA / this.wheelBase;
    }
    init() {
        this.emitter = new ParticleEmitter(0, 0, 5, 2, 0.5, 'grey',1);
    }
    update(input) {
        // Smooth steering input
        if(this.input.turn !== 0) {
            this.steerAngle = clamp(this.steerAngle + this.input.turn*0.3, -this.maxSteer, this.maxSteer);
            
        } else {
            if(this.steerAngle > 0) {
                this.steerAngle = Math.max(this.steerAngle - 0.1, 0)
            } else if(this.steerAngle < 0) {
                this.steerAngle = Math.min(this.steerAngle + 0.1, 0)
            }
        }
        
        // move emitter to back of car.
        const c = Math.cos(this.rotation);
        const s = Math.sin(this.rotation);
        const local = { x:-55, y:20 };
        this.emitter.position.x = c*local.x - s*local.y + this.position.x;
        this.emitter.position.y = s*local.x + c*local.y + this.position.y;
        this.emitter.active = this.input.on

        super.update()

    }
    updatePhysics() {
        const c = Math.cos(this.rotation);
        const s = Math.sin(this.rotation);

        this.lvelocity.x = c*this.velocity.x + s*this.velocity.y;
        this.lvelocity.y = c*this.velocity.y - s*this.velocity.x;

        const awFront = this.mass * (this.awrFront * this.downforce - this.weightTransfer * this.lacceleration.x * this.cogHeight / this.wheelBase);
        const awBack = this.mass * (this.awrBack * this.downforce + this.weightTransfer * this.lacceleration.x * this.cogHeight / this.wheelBase);

        const angVelFront = this.cogFrontA * this.angularVelocity;
        const angVelBack = -this.cogBackA * this.angularVelocity;

        const slipAngleFront = Math.atan2(this.lvelocity.y + angVelFront, Math.abs(this.lvelocity.x)) - Math.sign(this.lvelocity.x) * this.steerAngle;
        const slipAngleBack = Math.atan2(this.lvelocity.y + angVelBack, Math.abs(this.lvelocity.x));

        const tireGripFront = this.tireGrip;
        const tireGripBack = this.tireGrip * (1 - this.input.handbrake * (1 - this.tireLockGrip));

        const frictionFront = clamp(-this.cornerStiffFront * slipAngleFront, -tireGripFront, tireGripFront) * awFront;
        const frictionBack = clamp(-this.cornerStiffBack * slipAngleBack, -tireGripBack, tireGripBack) * awBack;

        const brake = Math.min(this.input.brake * this.brakeForce + this.input.handbrake * this.handbrakeForce, this.brakeForce);
        let throttle = 0;
        if(this.input.reverse) {
            throttle = -1 *this.input.drive * (this.engineForce/4);
        } else {
            throttle = this.input.drive * this.engineForce;
        }

        const tractionForceX = throttle - brake*Math.sign(this.lvelocity.x);
        const tractionForceY = 0;

        let dragForceX = -this.rollResist * this.lvelocity.x - this.airResist * this.lvelocity.x * Math.abs(this.lvelocity.x);
        let dragForceY = -this.rollResist * this.lvelocity.y - this.airResist * this.lvelocity.y * Math.abs(this.lvelocity.y);

        if(!this.input.on) {
            dragForceX -= 4000 * this.lvelocity.x;
            dragForceY -= 4000 * this.lvelocity.y;
        }

        this.lacceleration.x = (dragForceX + tractionForceX) / this.mass;
        this.lacceleration.y = (dragForceY + tractionForceY + Math.cos(this.steerAngle) * frictionFront + frictionBack) / this.mass;

        this.acceleration.x = c*this.lacceleration.x - s*this.lacceleration.y;
        this.acceleration.y = s*this.lacceleration.x + c*this.lacceleration.y;

        this.velocity.x += 0.02 * this.acceleration.x;
        this.velocity.y += 0.02 * this.acceleration.y;
        
        let torque = (frictionFront + tractionForceY) * this.cogFrontA - frictionBack * this.cogBackA;

        const speedSq = Math.pow(this.velocity.x,2) + Math.pow(this.velocity.y,2);
        if(speedSq < 0.5 && !throttle) {
            this.drivingForce.x = 0;
            this.drivingForce.y = 0;
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.angularVelocity = 0;
            torque = 0;
        }

        this.angularVelocity += 0.02 * torque / this.mass;
        this.rotation += this.angularVelocity * 0.02;

        this.position.x += this.velocity.x * 0.6;
        this.position.y += this.velocity.y * 0.6;
    }
    draw(renderer) {
        renderer.setLayer(3)
        renderer.drawAdv("car_black_1", this.position.x, this.position.y, 1, this.rotation + Math.PI/2);

        renderer.setLayer(2)
        //front wheels
        renderer.fillRectRel(this.position.x, this.position.y, this.rotation, 45, 0, Math.PI/2, 27, 0, this.steerAngle, 10, 25, 'black');
        renderer.fillRectRel(this.position.x, this.position.y, this.rotation, 45, 0, Math.PI/2, -27, 0, this.steerAngle, 10, 25, 'black');
        
        //back wheels
        renderer.fillRectRel(this.position.x, this.position.y, this.rotation, -45, 0, Math.PI/2, 27, 0, 0, 10, 25, 'black');
        renderer.fillRectRel(this.position.x, this.position.y, this.rotation, -45, 0, Math.PI/2, -27, 0, 0, 10, 25, 'black');

        //break lights
        renderer.setLayer(4)
        if(this.input.brake) {
            renderer.fillRectRel(this.position.x, this.position.y, this.rotation, -35, 0, 0, -23, -23, 0, 6, 13, 'red')
            renderer.fillRectRel(this.position.x, this.position.y, this.rotation, -35, 0, 0, -23, 23, 0, 6, 13, 'red')
        }

        //reverse light
        if(this.input.reverse) {
            renderer.fillRectRel(this.position.x, this.position.y, this.rotation, -35, 0, 0, -23, 12, 0, 6, 13, 'white')
        }
    }
}
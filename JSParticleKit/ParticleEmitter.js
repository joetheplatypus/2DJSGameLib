import { GameObject } from '../JSEngineKit/main.js'
import { Particle } from './Particle.js';

// Emitter of particles every update loop.
export class ParticleEmitter extends GameObject {
    constructor(x,y,speed,num,lifetime,colour,layer=3) {
        super()
        this.fixed = true;
        this.bypassCollisions = true;
        
        this.position.x = x;
        this.position.y = y;
        this.speed = speed;
        this.num = num;
        this.colour = colour;
        this.lifetime = lifetime;
        this.layer = layer
        this.speedLowerBound = 0.3; // dont want stationary particles
        this.active = true;
    }
    update(input) {
        if(!this.active) return;
        for(let i = 0; i < this.num; i++) {
            let p = new Particle();
            const speed = (Math.random() * (this.speed - this.speedLowerBound) + this.speedLowerBound) * 0.1;
            const angle = Math.random() * 2*Math.PI;
            p.setPosition(this.position.x, this.position.y);
            p.lifetime = this.lifetime;
            p.colour = this.colour;
            p.layer = this.layer;
            p.drivingForce.x = speed * Math.cos(angle);
            p.drivingForce.y = speed * Math.sin(angle);
        }
    }
}
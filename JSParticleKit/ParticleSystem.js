import { GameObject } from '../JSEngineKit/GameObject.js'
import { Particle } from './Particle.js';

// Collection of particles removed upon creation
export class ParticleSystem extends GameObject {
    constructor(x,y,speed,num,lifetime,colour) {
        super()
        this.fixed = true;
        this.bypassCollisions = true;
        
        this.position.x = x;
        this.position.y = y;
        this.speed = speed;
        this.num = num;
        this.colour = colour;
        this.lifetime = lifetime;
        this.speedLowerBound = 0.3; // dont want stationary particles

        for(let i = 0; i < this.num; i++) {
            let p = new Particle();
            const speed = Math.random() * (this.speed - this.speedLowerBound) + this.speedLowerBound;
            const angle = Math.random() * 2*Math.PI;
            angle += Math.random() * 0.1;
            p.setPosition(this.position.x, this.position.y);
            p.lifetime = this.lifetime;
            p.colour = this.colour;
            p.drivingForce.x = speed * Math.cos(angle);
            p.drivingForce.y = speed * Math.sin(angle);
        }

        this.remove();
    }
}
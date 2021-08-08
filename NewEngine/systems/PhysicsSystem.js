import { Physics } from "../components/Physics.js";
import { Transform } from "../components/Transform.js";
import { System } from "../System.js";

export class PhysicsSystem extends System {
    constructor() {
        super()
        this.req = [Transform, Physics]
    }
    update(entities) {
        entities.map(entity => {
            const physics = entity.getComponent(Physics)
            const transform = entity.getComponent(Transform)
    
            // Kinematics
            physics.acceleration.x = physics.drivingForce.x - physics.velocity.x*physics.friction.x;
            physics.acceleration.y = physics.drivingForce.y - physics.velocity.y*physics.friction.y;
            physics.velocity.x += physics.acceleration.x;
            physics.velocity.y += physics.acceleration.y;
    
            // Smoothing
            if(physics.velocity.x < 0.1 && physics.velocity.x > -0.1) {
                physics.velocity.x = 0;
            }
            if(physics.velocity.y < 0.1 && physics.velocity.y > -0.1) {
                physics.velocity.y = 0;
            }
    
            transform.position.x += physics.velocity.x;
            transform.position.y += physics.velocity.y;
            transform.rotation += physics.angularVelocity;

        })
    }
}
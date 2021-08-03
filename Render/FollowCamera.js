import { Vector } from "../Engine/main.js";
import { Camera } from "./Camera.js";

// Camera that smoothly follows the target.
export class FollowCamera extends Camera {
    move() {
        const diff = this.target.minus(this.position)
        const r = Math.max(diff.abs().x, diff.abs().y) / 5;
        const direction = diff.angle();
        const dist = diff.modSq();
        let speed = 0;
        // smoothing
        if(dist < Math.pow(r,2)) {
            speed = Math.sqrt(dist) * 1/2
        } else if(dist < 1) {
            speed = 0
        } else {
            speed = r * 1/2;
        }
        this.position.x += speed * Math.cos(direction);
        this.position.y += speed * Math.sin(direction);
        
        // clamp
        this.position.x = clamp(this.position.x, this.clamps.l, this.clamps.r)
        this.position.y = clamp(this.position.y, this.clamps.b, this.clamps.t)
    }
}
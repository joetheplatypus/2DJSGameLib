import { Vector } from "../Engine/main.js";
import { Camera } from "./Camera.js";

export class FollowCamera extends Camera {
    move() {
        const diff = new Vector();
        diff.x = this.target.x - this.x;
        diff.y = this.target.y - this.y;
        const r = 10 * Math.max(Math.abs(dx), Math.abs(dy)) / 50;
        const direction = diff.angle();
        const dist = diff.distSq();
        let speed = 0;
        // smoothing
        if(dist < Math.pow(r,2)) {
            speed = Math.sqrt(dist) * 1/2
        } else if(dist < 1) {
            speed = 0
        } else {
            speed = r * 1/2;
        }
        this.x += speed * Math.cos(direction);
        this.y += speed * Math.sin(direction);
        
        // clamp
        this.x = clamp(this.x, this.clamps.l, this.clamps.r)
        this.y = clamp(this.y, this.clamps.b, this.clamps.t)
    }
}
import { Camera } from "./Camera.js";

export class FollowCamera extends Camera {
    move() {
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const r = 10 * Math.max(Math.abs(dx), Math.abs(dy)) / 50;
        const direction = Math.atan2(dy, dx);
        const dist = Math.pow(dy, 2) + Math.pow(dx, 2);
        let speed = 0;
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
        if(this.clamps.l !== null && this.x < this.clamps.l) {
            this.x = this.clamps.l
        }
        if(this.clamps.r !== null && this.x > this.clamps.r) {
            this.x = this.clamps.r
        }
        if(this.clamps.t !== null && this.y < this.clamps.t) {
            this.y = this.clamps.t
        }
        if(this.clamps.b !== null && this.y > this.clamps.b) {
            this.y = this.clamps.b
        }
        // round
    }
}
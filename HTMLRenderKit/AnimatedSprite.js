import { Sprite } from './Sprite.js'

// Sprite with multiple images for animation.  Handles timer ticks and updates getSprite() to return the current sprite frame.
export class AnimatedSprite {
    constructor(name, animationSpeed, ...subsprites) {
        this.name = name;
        this.subsprites = subsprites;
        this.animationSpeed = animationSpeed; // higher is faster speed
        this.timer = 0;
        this.counter = 0; // index of sprite to show
        this.interval = (10/this.animationSpeed)/subsprites.length;
        Sprite.list.push(this)
    }
    tick() {
        this.timer += 0.1;
        this.timer = this.timer % (10/this.animationSpeed);
        this.counter = Math.floor(this.timer / this.interval);
    }
    setAnimationSpeed(animationSpeed) {
        this.animationSpeed = animationSpeed;
    }
    getSprite() {
        return this.subsprites[this.counter];
    }
}
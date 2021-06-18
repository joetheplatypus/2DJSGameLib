import { Sprite } from './Sprite.js'
export class AnimatedSprite {
    constructor(name, subsprites, animationSpeed) {
        this.name = name;
        this.subsprites = subsprites;
        this.animationSpeed = animationSpeed
        this.timer = 0;
        this.counter = 0; //which sprite to show
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
import { GameObject } from '../Engine/main.js'

export class Particle extends GameObject {
    constructor() {
        super()
        this.fixed = false;
        this.bypassCollisions = true;
        this.friction = {x:0,y:0}

        this.lifetime = 10;
        this.colour = 'white'
        this.layer = 3;

        this.counter = 0;
    }
    update(input) {
        super.update(input);
        this.counter += 0.1;
        if(this.counter > this.lifetime) {
            this.remove();
        }
    }
    draw(renderer) {
        renderer.setLayer(this.layer)
        renderer.fillCircle(this.position.x, this.position.y, 3,this.colour)
    }
}
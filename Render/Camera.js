import { util, Vector } from '../Engine/main.js'

// Camera allows for relative position rendering and speicfying dimensions allows renderer to draw only what is on screen.
export class Camera {
    constructor(w, h) {
        this.position = new Vector();
        this.dimensions = new Vector(w, h);
        this.target = new Vector();
        this.clamps = { l:null,r:null,t:null,b:null } // world position clamps
    }
    smooth({ x,y }) {
        return new Vector(x,y).floor()
    }
    to({ x,y }) {
        const v = new Vector(x,y)
        return v.minus(this.position).add(this.dimensions.scale(0.5))
    }
    from({ x,y }) {
        const v = new Vector(x,y)
        return v.add(this.position).minus(this.dimensions.scale(0.5))
    }
    setTarget(target) {
        if(!target || typeof target.x !== 'number' || typeof target.y !== 'number') {
            console.warn('Invalid camera target')
            return
        }
        this.target.set(target.x, target.y);
    }
    setClamps(l,t,r,b) {
        this.clamps = { l,t,r,b };
    }

    // To be called on update to move camera towards position target.
    move() {
        this.position.set(this.target.x, this.target.y)
        // clamp
        this.position.x = util.clamp(this.position.x, this.clamps.l, this.clamps.r)
        this.position.y = util.clamp(this.position.y, this.clamps.b, this.clamps.t)
        // do we need to smooth?
    }
    isInFrame(x,y,w,h) {
        return (x > -w && x < this.dimensions.x+w && y > -h && y < this.dimensions.y+h);
    }
    
}
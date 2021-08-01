import { util } from '../Engine/main.js'
export class Camera {
    constructor(w, h) {
        this.x = 0;
        this.y = 0;
        this.w = w;
        this.h = h;
        this.clamps = {l:null,r:null,t:null,b:null} // world position clamps
        this.target = {x:0,y:0};
    }
    smooth({x,y}) {
        return {x:Math.floor(x), y:Math.floor(y)}
    }
    to({x,y}) {
        return {x:x-this.x+this.w/2, y:y-this.y+this.h/2}
    }
    from({x,y}) {
        return {x:x+this.x-this.w/2, y:y+this.y-this.h/2}
    }
    setTarget(target) {
        if(!target || typeof target.x !== 'number' || typeof target.y !== 'number') {
            console.warn('Invalid camera target')
            return
        }
        this.target = target;
    }
    setClamps(l,t,r,b) {
        this.clamps = {l,t,r,b};
    }

    // To be called on update to move camera towards position target.
    move() {
        this.x = this.target.x;
        this.y = this.target.y;
        // clamp
        this.x = util.clamp(this.x, this.clamps.l, this.clamps.r)
        this.y = util.clamp(this.y, this.clamps.b, this.clamps.t)
        // do we need to smooth?
    }
    isInFrame(x,y,w,h) {
        return (x > -w && x < this.w+w && y > -h && y < this.h+h);
    }
    
}
export class Camera {
    constructor(w, h) {
        this.x = 0;
        this.y = 0;
        this.w = w;
        this.h = h;
        this.clamps = {l:null,r:null,t:null,b:null}
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
        this.target = target;
    }
    move() {
        this.x = this.target.x;
        this.y = this.target.y;
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
    isInFrame(x,y,w,h) {
        return (x > -w && x < this.w+w && y > -h && y < this.h+h);
    }
    setClamps(l,t,r,b) {
        this.clamps = {l,t,r,b};
    }
}
export class InputHandler {
    constructor() {
        this.axis = [0,0];
        this.axisBindings = [['w','s'],['d','a']];
        this.axisNames = ['vert','hoz']
        this.keys = {};
        this.keydowns = {};
        this.keyups = {};
        this.mousePos = {x:0,y:0};
    }
    onKeyDown(e) {
        if(this.keys[e.key]) return;
        this.keys[e.key] = true;
        this.keydowns[e.key] = true;
        delete this.keyups[e.key];
        for(let i = 0; i < this.axisBindings.length; i++) {
            if(e.key === this.axisBindings[i][0]) {
                this.axis[i]++;
            }
            if(e.key === this.axisBindings[i][1]) {
                this.axis[i]--;
            }
        }
    }
    onKeyUp(e) {
        if(!this.keys[e.key]) return;
        delete this.keys[e.key];
        delete this.keydowns[e.key];
        this.keyups[e.key] = true;
        for(let i = 0; i < this.axisBindings.length; i++) {
            if(e.key === this.axisBindings[i][0]) {
                this.axis[i]--;
            }
            if(e.key === this.axisBindings[i][1]) {
                this.axis[i]++;
            }
        }
    }
    key(key) {
        if(this.keys[key]) {
            return true;
        }
        return false;
    }
    keyDown(key) {
        if(this.keydowns[key]) {
            return true;
        }
        return false;
    }
    keyUp(key) {
        if(this.keyups[key]) {
            return true;
        }
        return false;
    }
    flush() {
        this.keydowns = {};
        this.keyups = {};
    }
    getAxis(name) {
        for(let i = 0; i < this.axisNames.length; i++) {
            if(this.axisNames[i] === name) {
                return this.axis[i]
            }
        }
    }
    addAxis(name, posKey, negKey) {
        this.axis.push(0)
        this.axisBindings.push([posKey, negKey])
        this.axisNames.push(name)
    }
    setMousePos({x,y}) {
        this.mousePos.x = x;
        this.mousePos.y = y;
    }
}
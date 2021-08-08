// State handler for an input.  Manages key and mouse events and calculates custom axis values.
export class InputHandler {

    constructor() {
        this.axis = [0,0]; // values
        this.axisBindings = [['w','s'],['d','a']]; // [pos,neg]
        this.axisNames = ['vert','hoz']
        this.keys = {};
        this.keydowns = {};
        this.keyups = {};
        this.mousePos = {x:0,y:0};
    }

    // To be called on key down event
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

    // To be called on key up event
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

    // Checks whether a key is currently pressed down
    key(key) {
        if(this.keys[key]) {
            return true;
        }
        return false;
    }

    // Checks whether the key has been pressed down after the last call of this function. 
    keyDown(key) {
        if(this.keydowns[key]) {
            return true;
        }
        return false;
    }

    // Checks whether the key has been released after the last call of this function. 
    keyUp(key) {
        if(this.keyups[key]) {
            return true;
        }
        return false;
    }

    // Clears current (unreceived) key up and down events
    flush() {
        this.keydowns = {};
        this.keyups = {};
    }

    // Calculates value of custom axis
    getAxis(name) {
        for(let i = 0; i < this.axisNames.length; i++) {
            if(this.axisNames[i] === name) {
                return this.axis[i]
            }
        }
    }

    // Register new axis
    addAxis(name, posKey, negKey) {
        this.axis.push(0)
        this.axisBindings.push([posKey, negKey])
        this.axisNames.push(name)
    }

    // Store mouse position
    setMousePos(x,y) {
        this.mousePos.x = x;
        this.mousePos.y = y;
    }
}
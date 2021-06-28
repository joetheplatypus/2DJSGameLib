import { Box } from './Box.js';
import { ColliderTypes } from './ColliderTypes.js';
import { collisionHandler, objectPartitions } from './Collision.js'
import { InputHandler } from './InputHandler.js';
import { Polygon } from './Polygon.js';
import { Vector } from './Vector.js'

// Base class for all objects within the game.
export class GameObject {
    constructor() {

        // PARAMETERS
        this.mass = 1; // Mass affects collision resolving (not friction)
        this.friction = {x:0.2,y:0.01};
        this.dimensions = {x:1,y:1}; //for circular collider uses avg of width and height as radius
        this.restitution = 0.5; // Something to do with collision response?
        
        this.colliderType = ColliderTypes.Box;
        this.bypassCollisions = false; //True - object does not get collision detection with any other objects
        this.doesCollide = true; //False - object does not invoke a collision response in the collider
        this.fixed = false; //True - object not moved to resolve collisions and no gravity applied
        this.colliderPositionDelta = {x:0,y:0}; // Used to offset collider position from gameobject position

        // LOCAL VARS
        this.id = Math.random(); // Currently unused in engine, may be usefult for some games
        this.position = {x:0,y:0}
        this.velocity = {x:0,y:0}
        this.acceleration = {x:0,y:0}
        this.drivingForce = {x:0,y:0}
        this.rotation = 0;
        this.angularVelocity = 0;
        this.lastCollisionList = [];
        this.collisionList = [];
        this.removeImpulseForceNextTick = null; // Used for applying impulses
        GameObject.list.push(this)
    }

    /**
     * Returns the axis-aligned bounding box that the object is contained within.
     */
    getAABoundingBox() {
        const pos = this.position;
        const cpd = this.colliderPositionDelta
        const p = this.getBoundingBox();
        const [gtl,gtr,gbr,gbl] = p.nodes;
        const tl = {
            x:Math.min(gbl.x,gbr.x,gtl.x,gtr.x) + pos.x + cpd.x,
            y:Math.min(gbl.y,gbr.y,gtl.y,gtr.y) + pos.y + cpd.y,
        }
        const br = {
            x:Math.max(gbl.x,gbr.x,gtl.x,gtr.x) + pos.x + cpd.x,
            y:Math.max(gbl.y,gbr.y,gtl.y,gtr.y) + pos.y + cpd.y,
        }
        return new Box(tl,br)
    }

    /**
     * Returns the rotated box vertices defined by this GameObject's dimensions and rotation.
     * @return {Polygon}
     */
    getBoundingBox() {
        const pos = this.position;
        const cpd = this.colliderPositionDelta
        const c = Math.cos(this.rotation);
        const s = Math.sin(this.rotation);
        // local bounds
        const ltl = { x:-this.dimensions.x/2, y:-this.dimensions.y/2 };
        const lbr = { x:this.dimensions.x/2, y:this.dimensions.y/2 };
        const ltr = { x:this.dimensions.x/2, y:-this.dimensions.y/2 };
        const lbl = { x:-this.dimensions.x/2, y:this.dimensions.y/2 };
        // convert to global
        const gtl = { x:c*ltl.x - s*ltl.y + pos.x + cpd.x, y:s*ltl.x + c*ltl.y + pos.y + cpd.y };
        const gbr = { x:c*lbr.x - s*lbr.y + pos.x + cpd.x, y:s*lbr.x + c*lbr.y + pos.y + cpd.y };
        const gtr = { x:c*ltr.x - s*ltr.y + pos.x + cpd.x, y:s*ltr.x + c*ltr.y + pos.y + cpd.y };
        const gbl = { x:c*lbl.x - s*lbl.y + pos.x + cpd.x, y:s*lbl.x + c*lbl.y + pos.y + cpd.y };
        return new Polygon(gtl, gtr, gbr, gbl);
    }

    /**
     * Initialisation method intented to be called after instantiation.  For example, if many GameObject's are instantiated for world creation,
     * then this method can be called afterwards to interact with other objects.
     */
    init() { 
        
    }

    /**
     * Update is intended called on all objects at a fixed time interval.  Input is passed as a parameter.
     * Sub-methods for updating physics and collisions are called here.
     * @param {InputHandler} input 
     */
    update(input) {
        this.updatePhysics();
        this.updateCollisions();
    }

    /**
     * Updates dynamics of the GameObject (acceleration, velocity, position, angular velocity, rotation).  
     * If the fixed attribute is not set then we add gravity to the acceleration.  Use drivingForce to move an object
     * or the impulse method for an instantaneous force.
     */
    updatePhysics() {
        if(!this.fixed) {
            this.drivingForce.y += GameObject.gravity;
        }
        this.acceleration.x = this.drivingForce.x - this.velocity.x*this.friction.x;
        this.acceleration.y = this.drivingForce.y - this.velocity.y*this.friction.y;
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;

        //smoothing
        if(this.velocity.x < 0.1 && this.velocity.x > -0.1) {
            this.velocity.x = 0;
        }
        if(this.velocity.y < 0.1 && this.velocity.y > -0.1) {
            this.velocity.y = 0;
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.rotation += this.angularVelocity;

        if(!this.fixed) {
            this.drivingForce.y -= GameObject.gravity
        }

        if(this.removeImpulseForceNextTick) {
            this.drivingForce.x -= this.removeImpulseForceNextTick[0];
            this.drivingForce.y -= this.removeImpulseForceNextTick[1];
            this.removeImpulseForceNextTick = null;
        }
        
    }

    /**
     * Utility method that calculates the new and existing collision based on the previous frames collision list which is stored as an atribute.
     * Calls the onCollisionEnter and onCollisionExit as necessary.
     */
    updateCollisions() {
        // Collision start/stop events
        const lastColliders = this.lastCollisionList.map(col => col.collider);
        const colliders = this.collisionList.map(l => l.collider);
        const newCollisions = this.collisionList.filter(i => !lastColliders.includes(i.collider));
        const oldCollisions = this.lastCollisionList.filter(i => !colliders.includes(i.collider));
        newCollisions.map(({collider, normal}) => this.onCollisionEnter(collider, normal));
        oldCollisions.map(({collider, normal}) => this.onCollisionExit(collider, normal));
        this.lastCollisionList = this.collisionList;
        this.collisionList = [];
    }

    /**
     * Applies an instantaenous force to the GameObject. (i.e. the acceleration is set for one frame only)
     * @param {number} x 
     * @param {number} y 
     */
    impulse(x,y) {
        this.drivingForce.x += x;
        this.drivingForce.y += y;
        this.removeImpulseForceNextTick = [x,y];
    }

    /**
     * Draw method intended to be used for the GameObject to draw itself using the renderer object passed as a parameter.
     * @param {Renderer} renderer 
     */
    draw(renderer) {

    }
    
    /**
     * Called when the GameObject is clicked on.
     */
    onClick() {

    }

    /**
     * Called for every collider every frame that it is colliding with the GameObject.  
     * @param {GameObject} collider 
     * @param {Array} normal 
     */
    onCollision(collider, normal) { 

    }

    /**
     * Called every time the GameObject collides with an object that it wasnt colliding with in the previous frame.
     * @param {GameObject} collider 
     * @param {Array} normal 
     */
    onCollisionEnter(collider, normal) {

    }

    /**
     * Called every time the GameObject no longer collides with an object that it was colliding with in the previous frame.
     * @param {GameObject} collider 
     * @param {Array} normal Normal of the original collision
     */
    onCollisionExit(collider, normal) {

    }

    /**
     * Call this method to remove the GameObject.  Will be removed next update.
     */
    remove() {
        this.toBeRemoved = true;
    }

    /**
     * Utility method to set the position of the GameObject
     * @param {Number} x 
     * @param {Number} y 
     */
    setPosition(x,y) {
        this.position.x = x;
        this.position.y = y;
    }

    /**
     * Returns the euclidian distance to the given GameObject.  Use distsq method where possible to avoid computationally expensive sqrt operation.
     * @param {GameObject} obj 
     */
    dist(obj) {
        return Math.sqrt(this.distSq(obj))
    }

    /**
     * Returns the euclidian distance to the given GameObject or {x,y} point sqaured.
     * @param {GameObject} obj 
     */
    distSq(obj) {
        if(obj instanceof GameObject) {
            return Math.pow(this.position.x - obj.position.x, 2) + Math.pow(this.position.y - obj.position.y, 2);
        } else {
            return Math.pow(this.position.x - obj.x, 2) + Math.pow(this.position.y - obj.y, 2);
        }
    }

    /**
     * Returns the angle from this GameObject to the input GameObject or position.  Angle in radians.
     * @param {GameObject | {x,y}} input
     */
    angleTo(obj) {
        let x,y = 0;
        if(obj instanceof GameObject) {
            x = obj.position.x;
            y = obj.position.y;
        } else {
            x = obj.x;
            y = obj.y
        }
        const dx = x - this.position.x;
        const dy = y - this.position.y;
        return Math.atan2(dy, dx);
    }

    /**
     * Set this GameObject's rotation to face the given GameObject or position using the angleTo method.
     * @param {GameObject | {x,y}} input
     */
    face(obj) {
        this.rotation = this.angleTo(obj);
    }

    /**
     * Returns a vector from the current object to the given object or {x,y} point
     */
    vTo(obj) {
        if(obj instanceof GameObject) {
            return new Vector({
                x: obj.position.x - this.position.x,
                y: obj.position.y - this.position.y,
            })
        } else {
            return new Vector({
                x: obj.x - this.position.x,
                y: obj.y - this.position.y,
            })
        }
    }

    /**
     * Returns a normalised vector in the direction the object is facing.
     */
    vForward() {
        return new Vector({
            x: Math.cos(this.rotation),
            y: Math.sin(this.rotation)
        })
    }

    /**
     * Returns the closest instance of the given class in the GameObject list.  Class must extend from GameObject to be in this list.
     * @param {GameObject} classs 
     */
    closest(classs) {
        const all = GameObject.list.filter(o => o instanceof classs);
        if(all.length == 0) return null;
        const closest = all.reduce((prev, cur) => this.distSq(prev) < this.distSq(cur) ? prev : cur);
        return closest;
    }

    /**
     * Calls init on all instances
     */
    static initAll() {
        GameObject.list.map(i => i.init())
    }

    /**
     * Calls update on all instances.  Deletes objects that are set to be removed from the GameObject list.
     * @param {InputHandler} input 
     */
    static updateAll(input) {
        GameObject.list = GameObject.list.filter(o => !o.toBeRemoved)
        GameObject.list.map(i => i.update(input))
    }

    /**
     * Calls render on all instances.
     * @param {Renderer} renderer 
     */
    static drawAll(renderer) {
        GameObject.list.map(i => i.draw(renderer))
    }

    /**
     * Propogates click method to all GameObject's whose axis-aligned bounding box contains the click position.
     * @param {{x,y}} clickPosition
     */
    static onClick({x,y}) {
        let hasCollided = false;
        GameObject.list.map(obj => {
            if(obj.getAABoundingBox().contains({x,y})) {
                obj.onClick();
                hasCollided = true;
            }
        })
        return hasCollided;
    }

    /**
     * Collision handler is called every frame to detect and resolve collisions.  
     * We use a partioning approach to check for collisions only within partitions that each object's axis-aligned bounding box is in.
     * Each collision is then detected depending on the two objects respective ColliderType.
     * Collisions are resolved by calculating normal and penetration depth using the Serparating Axis Theorem (SAT). 
     */
    static handleCollisions() {
        const colliders = GameObject.list.filter(g => !g.bypassCollisions); 
        //shift to fit in zero indexed 2d array
        const shiftX = -Math.min(...GameObject.list.map(g => g.position.x),0);
        const shiftY = -Math.min(...GameObject.list.map(g => g.position.y),0);
        //first we partition gameobjects into the squares their collider occupies (can be multiple)
        const partitions = [[]];
        const partitionSize = 500;
        for(let i = 0; i < colliders.length; i++) {
            const inPartitions = objectPartitions(partitionSize, colliders[i], shiftX, shiftY);
            inPartitions.map(([_i,_j]) => {

                if(!partitions[_i]) {
                    partitions[_i] = [];
                }
                if(!partitions[_i][_j]) {
                    partitions[_i][_j] = [];
                }
                
                partitions[_i][_j].push(colliders[i]);
            })
        }

        //check for collisions within these paritions (note objects can collide in multiple partitions)
        //we only want one collision for each pair of objects so store hash map of known collisions
        const collisions = {};
        partitions.map(row => row.map(cols => {
            for(let i = 0; i < cols.length; i++) {
                for(let j = 0; j < i; j++) {
                    if(cols[i].fixed && cols[j].fixed) {
                        continue; //dont check collisions between two fixed objects
                    }
                    const key = '' + cols[i].id + cols[j].id;
                    if(!collisions[key]) {
                        collisions[key] = true;
                        collisionHandler(cols[i], cols[j]);
                    }
                    
                }
            }
        }))
    }
}
GameObject.gravity = 1.2;
GameObject.list = [];

// Global function to create and initialise GameObjects
export function spawn(classarr, _args = []) {
    if(classarr instanceof Array) {
        const objs = classarr.map(([classs, args = []]) => {
            return new classs(...args);
        })
        objs.map(o => o.init());
        return objs;
    } else {
        const o = new classarr(..._args);
        o.init();
        return o;
    }
}
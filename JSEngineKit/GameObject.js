import { AABox } from './AABox.js';
import { ColliderTypes } from './ColliderTypes.js';
import Collision from './Collision.js'
import { Expanding2DArray } from './util.js';
import { Polygon } from './Polygon.js';
import { Vector } from './Vector.js'

// Base class for all objects within the game.
export class GameObject {
    constructor() {

        // PARAMETERS
        this.mass = 1; // Mass affects collision resolving (not friction)
        this.friction = {x:0.2,y:0.01};
        this.dimensions = new Vector(1,1); //for circular collider uses avg of width and height as radius
        this.restitution = 0.5; // Something to do with collision response?
        
        this.colliderType = ColliderTypes.Box;
        this.bypassCollisions = false; //True - object does not get collision detection with any other objects
        this.doesCollide = true; //False - object does not invoke a collision response in the collider
        this.fixed = false; //True - object not moved to resolve collisions and no gravity applied
        this.colliderPositionDelta = Vector.zero; // Used to offset collider position from gameobject position

        // LOCAL VARS
        this.id = Math.random();
        this.position = new Vector()
        this.velocity = new Vector()
        this.acceleration = new Vector()
        this.drivingForce = new Vector()
        this.rotation = 0;
        this.angularVelocity = 0;
        this.lastCollisionList = [];
        this.collisionList = [];
        this.removeImpulseForceNextTick = null; // Used for applying impulses
        GameObject.list.push(this)
    }

    // Returns the axis-aligned bounding box that the object is contained within.
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
        return new AABox(tl,br)
    }

    // Returns the rotated bounding box of the object as a Polygon object
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

    // Intented to be called after instantiation by spawn() and used to interact with other objects upon creation.
    init() { 
        
    }

    // Intended to be called at fixed time interval.
    update(input) {
        this.updatePhysics();
        this.updateCollisions();
    }

    // Updates kinematics, gravity etc.  Use impulse() or set this.drivingForce to apply forces to an object.
    updatePhysics() {
        // Apply gravity
        if(!this.fixed) {
            this.drivingForce.y += GameObject.gravity;
        }

        // Kinematics
        this.acceleration.x = this.drivingForce.x - this.velocity.x*this.friction.x;
        this.acceleration.y = this.drivingForce.y - this.velocity.y*this.friction.y;
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;

        // Smoothing
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
            // Object does not need to be aware of gravity so apply and remove every update
            this.drivingForce.y -= GameObject.gravity
        }

        if(this.removeImpulseForceNextTick) {
            this.drivingForce.x -= this.removeImpulseForceNextTick[0];
            this.drivingForce.y -= this.removeImpulseForceNextTick[1];
            this.removeImpulseForceNextTick = null;
        }
    }

    // Handles updating new and old collision lists to trigger onCollisionEnter and onCollisionExit
    updateCollisions() {
        const lastColliders = this.lastCollisionList.map(col => col.collider);
        const colliders = this.collisionList.map(l => l.collider);
        const newCollisions = this.collisionList.filter(i => !lastColliders.includes(i.collider));
        const oldCollisions = this.lastCollisionList.filter(i => !colliders.includes(i.collider));
        newCollisions.map(({collider, normal}) => this.onCollisionEnter(collider, normal));
        oldCollisions.map(({collider, normal}) => this.onCollisionExit(collider, normal));
        this.lastCollisionList = this.collisionList;
        this.collisionList = [];
    }

    // Applies an instantaenous force to the GameObject. (i.e. the acceleration is set for one frame only)
    impulse(x,y) {
        this.drivingForce.x += x;
        this.drivingForce.y += y;
        this.removeImpulseForceNextTick = [x,y];
    }

    // Intended to be used for the GameObject to draw itself using the renderer object passed as a parameter.
    draw(renderer) {

    }
    
    // Intended to be called when this object is clicked on.
    onClick() {

    }

    // Called every update that the object is in collision with this object
    onCollision(collider, normal) { 

    }

    // Called every time the GameObject collides with an object that it wasnt colliding with in the previous update.
    onCollisionEnter(collider, normal) {

    }

    // Called every time the GameObject no longer collides with an object that it was colliding with in the previous frame.
    onCollisionExit(collider, normal) {

    }

    // Call this to remove an object.  (Removed next update)
    remove() {
        this.toBeRemoved = true;
    }

    // Sets the position of the object.
    setPosition(x,y) {
        this.position.set(x,y)
    }

    // Euclidian distance to the given GameObject / vector.  Use distsq where possible.
    dist(obj) {
        return Math.sqrt(this.distSq(obj))
    }

    // Euclidian distance to the given GameObject / vector squared.
    distSq(obj) {
        if(obj instanceof GameObject) {
            return Math.pow(this.position.x - obj.position.x, 2) + Math.pow(this.position.y - obj.position.y, 2);
        } else {
            if(obj && obj.x && obj.y) {
                return Math.pow(this.position.x - obj.x, 2) + Math.pow(this.position.y - obj.y, 2);
            } else {
                console.warn('Called distSq with no point/GameObject')
                return 0
            }
        }
    }

    // Gets the angle from this GameObject to the input GameObject / vector.  (Angle in radians)
    angleTo(obj) {
        const v = this.vTo(obj)
        if(v === null) {
            return 0
        }
        return v.angle()
    }

    // Sets this GameObject's rotation to face the given GameObject / vector
    face(obj) {
        this.rotation = this.angleTo(obj);
    }

    // Vector from the current object to the given GameObject / vector
    vTo(obj) {
        if(obj instanceof GameObject) {
            return new Vector({
                x: obj.position.x - this.position.x,
                y: obj.position.y - this.position.y,
            })
        } else {
            if(obj && obj.x && obj.y) {
                return new Vector({
                    x: obj.x - this.position.x,
                    y: obj.y - this.position.y,
                })
            } else {
                console.warn('Called vTo with no point/GameObject')
                return null
            }
        }
    }

    // Normalised vector in the direction the object is facing.
    vForward() {
        return new Vector({
            x: Math.cos(this.rotation),
            y: Math.sin(this.rotation)
        })
    }

    // Finds closest instance of given class
    closest(classs) {
        const all = GameObject.list.filter(o => o instanceof classs);
        if(all.length == 0) return null;
        const closest = all.reduce((prev, cur) => this.distSq(prev) < this.distSq(cur) ? prev : cur);
        return closest;
    }

    // Calls init on all objects
    static initAll() {
        GameObject.list.map(i => i.init())
    }

    // Calls update on all objects. Removes from list if marked for removal.
    static updateAll(input) {
        GameObject.list = GameObject.list.filter(o => !o.toBeRemoved)
        GameObject.list.map(i => i.update(input))
    }

    // Calls render on all objects.
    static drawAll(renderer) {
        GameObject.list.map(i => i.draw(renderer))
    }

    // Propogates click method to all GameObject's by AABox. Returns true if there was at least one collision.
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

    // Returns a 2D array paritioning the world space with each object in all partitions where its AABox is present.
    static partitions(size, colliderOnly = true) {
        let list = GameObject.list
        if(colliderOnly) {
            list = GameObject.list.filter(o => !o.bypassCollisions)
        }
        // Need to shift for 0-indexing
        const shiftX = -Math.min(...GameObject.list.map(g => g.getAABoundingBox().tl.x),0) + size;
        const shiftY = -Math.min(...GameObject.list.map(g => g.getAABoundingBox().tl.y),0) + size;
        // Put into a 2D array
        const partitions = new Expanding2DArray([]);
        list.map(collider => {
            const aabox = collider.getAABoundingBox()
            const top = Math.floor((aabox.tl.y + shiftY) / size);
            const bottom = Math.floor((aabox.br.y + shiftY) / size);
            const left = Math.floor((aabox.tl.x + shiftX) / size);
            const right = Math.floor((aabox.br.x + shiftX) / size);
            for(let i=left; i<=right; i++) {
                for(let j=top; j<=bottom; j++) {
                    const arr = partitions.get(i,j)
                    if(arr.length === 0) {
                        partitions.set(i,j,[collider])
                    } else {
                        arr.push(collider)
                    }
                }
            }
        })
        return partitions.toArray()
    }

    // Intended to be called every update to detect and resolve collisions.  
    static handleCollisions() {
        const partitions = GameObject.partitions(500)
        let collisions = Collision.fromPartitions(partitions)
        console.log('partition coll: ' + collisions.length)
        collisions = Collision.broadPhase(collisions)
        console.log('broad phase coll: ' + collisions.length)
        const manifolds = Collision.narrowPhase(collisions)
        console.log('narrow phase coll: ' + manifolds.length)
        manifolds.map(({obj1,obj2,normal}) => {
            obj1.onCollision(obj2, normal)
            obj1.collisionList.push({collider: obj2, normal: normal})
            obj2.onCollision(obj1, normal.scale(-1))
            obj2.collisionList.push({collider: obj1, normal: normal.scale(-1)})
        })
        Collision.resolve(manifolds)

        //check for collisions within these paritions (note objects can collide in multiple partitions)
        //we only want one collision for each pair of objects so store hash map of known collisions
        // const collisions = {};
        // partitions.map(row => row.map(cols => {
        //     for(let i = 0; i < cols.length; i++) {
        //         for(let j = 0; j < i; j++) {
        //             if(cols[i].fixed && cols[j].fixed) {
        //                 continue; //dont check collisions between two fixed objects
        //             }
        //             const key = '' + cols[i].id + cols[j].id;
        //             if(!collisions[key]) {
        //                 collisions[key] = true;
        //                 collisionHandler(cols[i], cols[j]);
        //             }
                    
        //         }
        //     }
        // }))
    }
}
// GameObject.gravity = 1.2;
GameObject.gravity = 0;
GameObject.list = [];

// Global function to create and initialise GameObjects
export function spawn(classarr, _args = []) {
    if(classarr instanceof Array) {
        const objs = classarr.map((info) => {
            if(info instanceof Array) {
                const [classs, args = []] = info;
                return new classs(...args);
            } else {
                return new info();
            }
        })
        objs.map(o => o.init());
        return objs;
    } else {
        const o = new classarr(..._args);
        o.init();
        return o;
    }
}
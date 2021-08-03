/*
    Adapted from this guide:
    https://gamedevelopment.tutsplus.com/tutorials/how-to-create-a-custom-2d-physics-engine-the-basics-and-impulse-resolution--gamedev-6331
*/

import { ColliderTypes } from './ColliderTypes.js';
import { Polygon } from './Polygon.js';
import { util } from './util.js';
import { Vector } from './Vector.js'

const penDepthSlop = 0.01;
const penDepthPercent = 2;

export const Collision =  {

    // Utility class storing info for each collision
    Manifold: class {
        constructor(obj1,obj2,penDepth,normal) {
            this.obj1 = obj1;
            this.obj2 = obj2;
            this.penDepth = penDepth;
            this.normal = normal.normalise();
        }
        reverse() {
            this.normal = this.normal.scale(-1)
            return this
        }
    },

    // Returns list of collisions [[collider1, collider2],...] based on partitions
    fromPartitions(partitions) {
        const collisions = [];
        const uniqMap = {};
        partitions.map(row => row.map(cell => {
            for(let i=0; i<cell.length; i++) {
                for(let j=0; j<i; j++) {
                    if(cell[i].fixed && cell[j].fixed) {
                        continue
                    }
                    // We only want one collision for each pair
                    const key = ''+cell[i].id+cell[j].id
                    if(!uniqMap[key]) {
                        uniqMap[key] = true;
                        collisions.push([cell[i], cell[j]])
                    }
                }
            }
        }))
        return collisions
    },

    // Returns list of collisions [[collider1, collider2],...] based on AABox intersections
    broadPhase(collisions) {
        const ret = collisions.map(([obj1,obj2]) => {
            const box1 = obj1.getAABoundingBox();
            const box2 = obj2.getAABoundingBox();
            if(box1.intersects(box2)) {
                return [obj1,obj2]
            } else {
                return null
            }
        })
        return ret.filter(x => x !== null)
    },

    // Returns list of collision manifolds [manifold,...] based on SAT
    narrowPhase(collisions) {
        const ret = collisions.map(([obj1, obj2]) => {
            // Fix for directly on top collisions
            if (obj1.getAABoundingBox().center().equals(obj2.getAABoundingBox().center())) {
                return new Collision.Manifold(obj1, obj2, 0.1, Vector.right)
            }
            // Generate manifold
            if(obj1.colliderType === ColliderTypes.AABox) {
                if(obj2.colliderType === ColliderTypes.AABox) {
                    return genManifoldAABoxAABox(obj1, obj2)
                } else if(obj2.colliderType === ColliderTypes.Box) {
                    return genManifoldBoxAABox(obj2, obj1)
                } else if(obj2.colliderType === ColliderTypes.Circle) {
                    return genManifoldCircleAABox(obj2, obj1)
                }
            } else if(obj1.colliderType === ColliderTypes.Box) {
                if(obj2.colliderType === ColliderTypes.AABox) {
                    return genManifoldBoxAABox(obj1, obj2)
                } else if(obj2.colliderType === ColliderTypes.Box) {
                    return genManifoldBoxBox(obj1, obj2)
                } else if(obj2.colliderType === ColliderTypes.Circle) {
                    return genManifoldCircleBox(obj2, obj1)
                }
            } else if(obj1.colliderType === ColliderTypes.Circle) {
                if(obj2.colliderType === ColliderTypes.AABox) {
                    return genManifoldCircleAABox(obj1, obj2)
                } else if(obj2.colliderType === ColliderTypes.Box) {
                    return genManifoldCircleBox(obj1, obj2)
                } else if(obj2.colliderType === ColliderTypes.Circle) {
                    return genManifoldCircleCircle(obj1, obj2)
                }
            }
            
        })
        return ret.filter(x => x !== null)
    },

    // Resolve collisions using kinematics
    resolve(manifolds) {
        manifolds.map(({obj1,obj2,penDepth,normal}) => {
            if(!obj1.doesCollide || !obj2.doesCollide) {
                return;
            }
            const relVel = obj2.velocity.minus(obj1.velocity);
            const relVelNormal = relVel.dot(normal);
            if(relVelNormal > 0) {
                // collision is resolving itself
                return;
            }

            // Apply impulse
            const e = Math.min(obj1.restitution, obj2.restitution)
            let j = -(1+e)*relVelNormal;
            j /= (1/obj1.mass) + (1/obj2.mass);
            let impulse = normal.scale(j);
            if(!obj1.fixed) {
                obj1.velocity.x -= impulse.x*(1/obj1.mass);
                obj1.velocity.y -= impulse.y*(1/obj1.mass);
            }
            if(!obj2.fixed) {
                obj2.velocity.x += impulse.x*(1/obj2.mass);
                obj2.velocity.y += impulse.y*(1/obj2.mass);
            }

            // if(!obj1.fixed) {
            //     obj1.impulse(-impulse[0]*(1/obj1.mass), -impulse[1]*(1/obj1.mass));
            // }
            // if(!obj2.fixed) {
            //     obj2.impulse(impulse[0]*(1/obj2.mass), impulse[1]*(1/obj2.mass));
            // }

            // Positional correction
            const correction = Math.max(penDepth - penDepthSlop, 0) / 2 * penDepthPercent;
            const correctionVector = normal.scale(correction);
            if(!obj1.fixed) {
                obj1.position.x -= correctionVector.x;
                obj1.position.y -= correctionVector.y;
            }
            if(!obj2.fixed) {
                obj2.position.x += correctionVector.x;
                obj2.position.y += correctionVector.y;
            }
        })
        
    }
}

function genManifoldAABoxAABox(obj1, obj2) {
    const box1 = obj1.getAABoundingBox()
    const box2 = obj2.getAABoundingBox()
    const relPos = box2.center().minus(box1.center())
    const overlapX = box1.width()/2 + box2.width()/2 - Math.abs(relPos.x);
    if(overlapX > 0) {
        const overlapY = box1.height()/2 + box2.height()/2 - Math.abs(relPos.y);
        if(overlapY > 0) {
            if(overlapX < overlapY) {
                if(relPos.x < 0) {
                    return new Collision.Manifold(obj1, obj2, overlapX, Vector.left)
                } else {
                    return new Collision.Manifold(obj1, obj2, overlapX, Vector.right)
                }
            } else {
                if(relPos.y < 0) {
                    return new Collision.Manifold(obj1, obj2, overlapY, Vector.up)
                } else {
                    return new Collision.Manifold(obj1, obj2, overlapY, Vector.down)
                }
            }
        }
    }
    return null
}

function genManifoldBoxAABox(obj1, obj2) {
    const poly1 = obj1.getBoundingBox();
    const poly2 = Polygon.fromAABox(obj2.getAABoundingBox())
    return genManifoldBoxBox(obj1, obj2, poly1, poly2)
}

function genManifoldCircleAABox(obj1, obj2) {
    const box1 = obj1.getAABoundingBox()
    const box2 = obj2.getAABoundingBox()
    const relPos = box2.center().minus(box1.center())
    const closest = new Vector(relPos);
    const halfWidth = box2.width()/2
    const halfHeight = box2.height()/2;
    // Find closest point on box to circle
    closest.x = util.clamp(closest.x, -halfWidth, halfWidth);
    closest.y = util.clamp(closest.y, -halfHeight, halfHeight);
    let circleInside = false;
    if(relPos.equals(closest)) {
        //circle inside box, clamp circle centre to nearest edge
        circleInside = true;
        if(Math.abs(relPos.x) > Math.abs(relPos.y)) {
            if(closest.x > 0) {
                closest.x = halfWidth;
            } else {
                closest.x = -halfWidth;
            }
        } else {
            if(closest.y > 0) {
                closest.y = halfHeight;
            } else {
                closest.y = -halfHeight;
            }
        }
    }
    const normal = relPos.minus(closest);
    let d = normal.modSq();
    const r = (obj1.dimensions.x + obj1.dimensions.y)/4;
    if(d > Math.pow(r,2) && !circleInside) {
        return null
    }
    d = Math.sqrt(d);
    if(circleInside) {
        return new Collision.Manifold(obj1, obj2, r-d, normal.scale(-1))
    } else {
        return new Collision.Manifold(obj1, obj2, r-d, normal)
    }
}

function genManifoldBoxBox(obj1, obj2, poly1 = obj1.getBoundingBox(), poly2 = obj2.getBoundingBox()) {
    const relPosSign = new Vector();
    relPosSign.x = Math.sign(obj2.position.x - obj1.position.x) || 1;
    relPosSign.y = Math.sign(obj2.position.y - obj1.position.y) || 1;

    // get all axis for SAT (normals to all sides)
    let normals = poly1.normals();
    normals.push(...poly2.normals());
    const uniqNormals = Vector.removeScalarMultiples(normals)

    // SAT
    const overlaps = [];
    for(let i = 0; i < uniqNormals.length; i++) {
        const n = uniqNormals[i];
        const projection1 = poly1.project(n);
        const projection2 = poly2.project(n);
        const ol = util.overlap(projection1, projection2)
        if(!ol) {
            return null
        }
        overlaps.push({
            penDepth: ol,
            normal: n
        })
    }

    // Get minimum overlap manifold
    const minPenDepth = Math.min(...overlaps.map(i => i.penDepth));
    const min = overlaps.find(i => i.penDepth === minPenDepth);
    const signedNormal = relPosSign.had(min.normal.abs());
    return new Collision.Manifold(obj1, obj2, min.penDepth, signedNormal)
}

function genManifoldCircleBox(obj1, obj2) {
    const circ = obj1.getAABoundingBox()
    const r = (obj1.dimensions.x + obj1.dimensions.y)/4;
    const poly = obj2.getBoundingBox()
    const direction = circ.center().minus(poly.center()).angle()
    // Find closest point on box to circle
    const closest = poly.outerPoint(direction)
    let circleInside = false
    if(closest.minus(poly.center()).modSq() > circ.center().minus(poly.center()).modSq()) {
        circleInside = true
    }
    const normal = circ.center().minus(closest)
    let d = normal.modSq();
    if(d > Math.pow(r,2) && !circleInside) {
        return null
    }
    d = Math.sqrt(d);
    if(circleInside) {
        return new Collision.Manifold(obj1, obj2, r-d, normal)
    } else {
        return new Collision.Manifold(obj1, obj2, r-d, normal.scale(-1))
    }
}

function genManifoldCircleCircle(obj1, obj2) {
    const rad1 = util.avg(obj1.dimensions.x, obj1.dimensions.y)/2
    const rad2 = util.avg(obj2.dimensions.x, obj2.dimensions.y)/2
    const relPos = new Vector({
        x: obj2.getAABoundingBox().center().x - obj1.getAABoundingBox().center().x,
        y: obj2.getAABoundingBox().center().y - obj1.getAABoundingBox().center().y, 
    })
    const r = rad1+rad2;
    if(relPos.modSq() > Math.pow(r,2)) {
        return null
    }
    const d = relPos.mod();
    if(d !== 0) {
        return new Collision.Manifold(obj1, obj2, r-d, relPos.scale(1/d))
    }
    // This should never happen since we check in narrowPhase
    return new Collision.Manifold(obj1, obj2, rad1, Vector.right)
}
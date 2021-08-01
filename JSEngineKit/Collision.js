/*
    Adapted from this guide:
    https://gamedevelopment.tutsplus.com/tutorials/how-to-create-a-custom-2d-physics-engine-the-basics-and-impulse-resolution--gamedev-6331
*/

import { ColliderTypes } from './ColliderTypes.js';
import { clamp } from './main.js';
import { Polygon } from './Polygon.js';
import { avg, overlap } from './util.js';
import { Vector } from './Vector.js'



const penDepthSlop = 0.01;
const penDepthPercent = 2;

const Collision =  {
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
                    const man = genManifoldBoxAABox(obj2, obj1)
                    if(man) return man.reverse()
                    return null
                } else if(obj2.colliderType === ColliderTypes.Circle) {
                    return genManifoldCircleAABox(obj2, obj1)
                }
            } else if(obj1.colliderType === ColliderTypes.Box) {
                if(obj2.colliderType === ColliderTypes.AABox) {
                    return genManifoldBoxAABox(obj1, obj2)
                } else if(obj2.colliderType === ColliderTypes.Box) {
                    return genManifoldBoxBox(obj1, obj2)
                } else if(obj2.colliderType === ColliderTypes.Circle) {
                    const man = genManifoldCircleBox(obj2, obj1)
                    if(man) return man.reverse()
                    return null
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
export default Collision;

function genManifoldAABoxAABox(obj1, obj2) {
    const box1 = obj1.getAABoundingBox()
    const box2 = obj2.getAABoundingBox()
    const relPos = box2.center().minus(box1.center())
    const overlapX = box1.width()/2 + box2.width()/2 - Math.abs(relPos.x);
    console.log(overlapX)
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
    const halfWidth = box1.width()/2
    const halfHeight = box1.height()/2;
    closest.x = clamp(closest.x, -halfWidth, halfWidth);
    closest.y = clamp(closest.y, -halfHeight, halfHeight);
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
    const r = (obj2.dimensions.x + obj2.dimensions.y)/4;
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
        const ol = overlap(projection1, projection2)
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
    // Just do AABox collision for now
    return genManifoldCircleAABox(obj1, obj2)
}

function genManifoldCircleCircle(obj1, obj2) {
    const rad1 = avg(obj1.dimensions.x, obj1.dimensions.y)/2
    const rad2 = avg(obj2.dimensions.x, obj2.dimensions.y)/2
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



// export function collisionHandler(obj1, obj2) {
//     const [normal, penDepth] = collisionDetection(obj1, obj2)
//     if(penDepth > 0) {
//         // Add to object's collision list for it to handle its own onCollision events next update
//         obj1.onCollision(obj2, normal)
//         obj1.collisionList.push({collider: obj2, normal: normal})
//         obj2.onCollision(obj1, normal.scale(-1))
//         obj2.collisionList.push({collider: obj1, normal: normal.scale(-1)})
//         // Run physics collision response if necessary
//         if(obj1.doesCollide && obj2.doesCollide) {
//             collisionResponse(obj1, obj2, normal, penDepth)
//         }
//     }
// }

// function collisionDetectionBoxBox(obj1,obj2) {
//     const relPos = {};
//     const bb1 = obj1.getAABoundingBox();
//     const bb2 = obj2.getAABoundingBox();
//     const bb1_centreX = (bb1.br.x + bb1.tl.x)/2;
//     const bb1_centreY = (bb1.br.y + bb1.tl.y)/2;
//     const bb2_centreX = (bb2.br.x + bb2.tl.x)/2;
//     const bb2_centreY = (bb2.br.y + bb2.tl.y)/2;
//     const bb1_width = bb1.br.x - bb1.tl.x;
//     const bb2_width = bb2.br.x - bb2.tl.x;
//     const bb1_height = bb1.br.y - bb1.tl.y;
//     const bb2_height = bb2.br.y - bb2.tl.y;
//     relPos.x = bb2_centreX - bb1_centreX;
//     relPos.y = bb2_centreY - bb1_centreY;
//     const halfWidth1 = bb1_width/2;
//     const halfWidth2 = bb2_width/2;
//     const overlapX = halfWidth1 + halfWidth2 - Math.abs(relPos.x);
//     if(overlapX > 0) {
//         const halfHeight1 = bb1_height/2;
//         const halfHeight2 = bb2_height/2;
//         const overlapY = halfHeight1 + halfHeight2 - Math.abs(relPos.y);
//         if(overlapY > 0) {
//             if(overlapX < overlapY) {
//                 if(relPos.x < 0) {
//                     return [Vector.left, overlapX]
//                 } else {
//                     return [Vector.right, overlapX]
//                 }
//             } else {
//                 if(relPos.y < 0) {
//                     return [Vector.up, overlapY]
//                 } else {
//                     return [Vector.down, overlapY]
//                 }
//             }
//         }
//     }
//     return [Vector.zero,0]
// }

// function collisionDetectionCircleCircle(obj1,obj2) {
//     const relPos = new Vector();
//     relPos.x = obj2.position.x + obj2.colliderPositionDelta.x - obj1.position.x - obj1.colliderPositionDelta.x;
//     relPos.y = obj2.position.y + obj2.colliderPositionDelta.y - obj1.position.y - obj1.colliderPositionDelta.y;
//     const r1 = (obj1.dimensions.x + obj1.dimensions.y)/4;
//     const r2 = (obj2.dimensions.x + obj2.dimensions.y)/4;
//     const r = r1+r2;
//     if(relPos.distSq() > Math.pow(r,2)) {
//         return [Vector.zero,0]
//     }
//     const d = relPos.dist();
//     if(d !== 0) {
//         return [relPos.scale(1/d),r-d];
//     }
//     return [Vector.right,r1];
// }

// function collisionDetectionBoxCircle(obj1,obj2) {
//     const relPos = new Vector();
//     relPos.x = obj2.position.x + obj2.colliderPositionDelta.x - obj1.position.x - obj1.colliderPositionDelta.x;
//     relPos.y = obj2.position.y + obj2.colliderPositionDelta.y - obj1.position.y - obj1.colliderPositionDelta.y;
//     const closest = new Vector(relPos.x, relPos.y);
//     const halfWidth = obj1.dimensions.x/2;
//     const halfHeight = obj1.dimensions.y/2;
//     closest.x = clamp(closest.x, -halfWidth, halfWidth);
//     closest.y = clamp(closest.y, -halfHeight, halfHeight);
//     let circleInside = false;
//     if(relPos.equals(closest)) {
//         //circle inside box, clamp circle centre to nearest edge
//         circleInside = true;
//         if(Math.abs(relPos.x) > Math.abs(relPos.y)) {
//             if(closest.x > 0) {
//                 closest.x = halfWidth;
//             } else {
//                 closest.x = -halfWidth;
//             }
//         } else {
//             if(closest.y > 0) {
//                 closest.y = halfHeight;
//             } else {
//                 closest.y = -halfHeight;
//             }
//         }
//     }
//     const normal = relPos.minus(closest);
//     let d = normal.distSq();
//     const r = (obj2.dimensions.x + obj2.dimensions.y)/4;
//     if(d > Math.pow(r,2) && !circleInside) {
//         return [Vector.zero,0]
//     }
//     d = Math.sqrt(d);
//     if(circleInside) {
//         return [normal, r-d];
//     } else {
//         return [normal.scale(-1), r-d];
//     }
// }

// function collisionDetectionPolyPoly(obj1, obj2) {
//     //fix for on top
//     if(obj1.position.x === obj2.position.x && obj1.position.y === obj2.position.y) {
//         return [Vector.right, 0.1];
//     }

//     //needed to find sign of normal
//     const relPosSign = new Vector();
//     relPosSign.x = Math.sign(obj2.position.x - obj1.position.x) || 1;
//     relPosSign.y = Math.sign(obj2.position.y - obj1.position.y) || 1;
    
//     // SEPERATING AXIS THEOREM
//     const poly1 = obj1.getBoundingBox();
//     const poly2 = obj2.getBoundingBox();

//     // get all axis (normals to all sides)
//     let normals = poly1.normals();
//     normals.push(...poly2.normals());
//     normals = removeDupeNorms(normals)
//     // SAP
//     const overlaps = [];
//     for(let i = 0; i < normals.length; i++) {
//         const n = normals[i];
//         const projection1 = poly1.project(n);
//         const projection2 = poly2.project(n);
//         const overlap = projectionOverlap(projection1, projection2)
//         if(!overlap) {
//             return [Vector.zero,0]
//         }
//         overlaps.push({
//             penDepth: overlap,
//             normal: n
//         })
//     }
//     const minPenDepth = Math.min(...overlaps.map(i => i.penDepth));
//     const min = overlaps.find(i => i.penDepth === minPenDepth);
//     const signedNormal = relPosSign.had(min.normal.abs());
//     return [signedNormal, min.penDepth]
// }

// function projectionOverlap([min1,max1], [min2,max2]) {
//     if(min1 > max2 || min2 > max1) {
//         return false;
//     }
//     return Math.min(max1,max2) - Math.max(min1,min2);
// }

// function removeDupeNorms(normals) {
//     let toRemove = [];
//     let res = [];
//     for(let i = 0; i < normals.length; i++) {
//         for(let j = 0; j < i; j++) {
//             if(normals[i].x === normals[j].x && normals[i].y === normals[j].y) {
//                 toRemove.push(j)
//             }
//             if(normals[i].x === -normals[j].x && normals[i].y === -normals[j].y) {
//                 toRemove.push(j)
//             }
//         }
//     }
//     for(let i = 0; i < normals.length; i++) {
//         if(toRemove.indexOf(i) === -1) {
//             res.push(normals[i])
//         }
//     }
//     return res;
// }

// export function collisionDetection(obj1, obj2) {
//     if(obj1.colliderType === ColliderTypes.Box && obj2.colliderType === ColliderTypes.Box) {
//         //Broad phase
//         const [normal, penDepth] = collisionDetectionBoxBox(obj1,obj2)
//         if(penDepth > 0) {
//             //Narrow Phase
//             return collisionDetectionPolyPoly(obj1,obj2);
//         }
//         return [Vector.zero,0]
//     } else if(obj1.colliderType === ColliderTypes.Box && obj2.colliderType === ColliderTypes.Circle) {
//         const [normal, penDepth] = collisionDetectionBoxCircle(obj1,obj2)
//         return [normal.scale(-1), penDepth]
//     } else if(obj2.colliderType === ColliderTypes.Box && obj1.colliderType === ColliderTypes.Circle) {
//         return collisionDetectionBoxCircle(obj2,obj1);
//     } else if(obj2.colliderType === ColliderTypes.Circle && obj1.colliderType === ColliderTypes.Circle) {
//         return collisionDetectionCircleCircle(obj1, obj2);
//     } else {
//         //Broad phase
//         const [normal, penDepth] = collisionDetectionBoxBox(obj1,obj2)
//         if(penDepth > 0) {
//             //Narrow Phase
//             return collisionDetectionPolyPoly(obj1,obj2);
//         }
//         return [Vector.zero,0]
//     }
// }

// export function collisionResponse(obj1, obj2, _normal, penDepth) {
//     const normal = _normal.normalise();
//     const relVel = new Vector();
//     relVel.x = obj2.velocity.x - obj1.velocity.x;
//     relVel.y = obj2.velocity.y - obj1.velocity.y;
//     const relVelNormal = relVel.dot(normal);
//     if(relVelNormal > 0) {
//         return;
//     }
//     const e = Math.min(obj1.restitution, obj2.restitution)
//     // impulse scalar
//     let j = -(1+e)*relVelNormal;
//     j /= (1/obj1.mass) + (1/obj2.mass);
//     let impulse = normal.scale(j);
//     if(!obj1.fixed) {
//         obj1.velocity.x -= impulse.x*(1/obj1.mass);
//         obj1.velocity.y -= impulse.y*(1/obj1.mass);
//     }
//     if(!obj2.fixed) {
//         obj2.velocity.x += impulse.x*(1/obj2.mass);
//         obj2.velocity.y += impulse.y*(1/obj2.mass);
//     }

//     // if(!obj1.fixed) {
//     //     obj1.impulse(-impulse[0]*(1/obj1.mass), -impulse[1]*(1/obj1.mass));
//     // }
//     // if(!obj2.fixed) {
//     //     obj2.impulse(impulse[0]*(1/obj2.mass), impulse[1]*(1/obj2.mass));
//     // }

//     // positional correction
//     const correction = Math.max(penDepth - penDepthSlop, 0) / 2 * penDepthPercent;
//     const correctionVector = normal.scale(correction);
//     if(!obj1.fixed) {
//         obj1.position.x -= correctionVector.x;
//         obj1.position.y -= correctionVector.y;
//     }
//     if(!obj2.fixed) {
//         obj2.position.x += correctionVector.x;
//         obj2.position.y += correctionVector.y;
//     }
// }

// export function objectPartitions(partitionSize, object, shiftX, shiftY) {
    
//     let top = object.position.y - object.dimensions.y/2 + object.colliderPositionDelta.y + shiftY;
//     let left = object.position.x - object.dimensions.x/2 + object.colliderPositionDelta.x + shiftX;
//     let bottom = object.position.y + object.dimensions.y/2 + object.colliderPositionDelta.y + shiftY;
//     let right = object.position.x + object.dimensions.x/2 + object.colliderPositionDelta.x + shiftX;
//     top = Math.floor(top/partitionSize)
//     left = Math.floor(left/partitionSize)
//     bottom = Math.floor(bottom/partitionSize)
//     right = Math.floor(right/partitionSize)
//     const res = [];
//     for(let i = top; i <= bottom; i++) {
//         for(let j = left; j <= right; j++) {
//             res.push([i,j])
//         }
//     }
//     return res;
// }
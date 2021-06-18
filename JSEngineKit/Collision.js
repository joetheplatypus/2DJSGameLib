/*
    Adapted from this guide:
    https://gamedevelopment.tutsplus.com/tutorials/how-to-create-a-custom-2d-physics-engine-the-basics-and-impulse-resolution--gamedev-6331
*/

import { ColliderTypes } from './ColliderTypes.js';
import { clamp } from './main.js';
import Vector from './Vector.js'

const penDepthSlop = 0.01;
const penDepthPercent = 2;

export function collisionHandler(obj1, obj2) {
    const [normal, penDepth] = collisionDetection(obj1, obj2)
    if(penDepth > 0) {
        obj1.onCollision(obj2, normal)
        obj1.collisionList.push({collider: obj2, normal: normal})
        obj2.onCollision(obj1, Vector.scale(normal,-1))
        obj2.collisionList.push({collider: obj1, normal: Vector.scale(normal,-1)})
        if(obj1.doesCollide && obj2.doesCollide) {
            collisionResponse(obj1, obj2, normal, penDepth)
        }
    }
}

function collisionDetectionBoxBox(obj1,obj2) {
    const relPos = {};
    const bb1 = obj1.getAABoundingBox();
    const bb2 = obj2.getAABoundingBox();
    const bb1_centreX = (bb1.br.x + bb1.tl.x)/2;
    const bb1_centreY = (bb1.br.y + bb1.tl.y)/2;
    const bb2_centreX = (bb2.br.x + bb2.tl.x)/2;
    const bb2_centreY = (bb2.br.y + bb2.tl.y)/2;
    const bb1_width = bb1.br.x - bb1.tl.x;
    const bb2_width = bb2.br.x - bb2.tl.x;
    const bb1_height = bb1.br.y - bb1.tl.y;
    const bb2_height = bb2.br.y - bb2.tl.y;
    relPos.x = bb2_centreX - bb1_centreX;
    relPos.y = bb2_centreY - bb1_centreY;
    const halfWidth1 = bb1_width/2;
    const halfWidth2 = bb2_width/2;
    const overlapX = halfWidth1 + halfWidth2 - Math.abs(relPos.x);
    if(overlapX > 0) {
        const halfHeight1 = bb1_height/2;
        const halfHeight2 = bb2_height/2;
        const overlapY = halfHeight1 + halfHeight2 - Math.abs(relPos.y);
        if(overlapY > 0) {
            if(overlapX < overlapY) {
                if(relPos.x < 0) {
                    return [[-1, 0], overlapX]
                } else {
                    return [[1,0], overlapX]
                }
            } else {
                if(relPos.y < 0) {
                    return [[0,-1], overlapY]
                } else {
                    return [[0,1], overlapY]
                }
            }
        }
    }
    return [[0,0],0]
}

function collisionDetectionCircleCircle(obj1,obj2) {
    const relPos = {};
    relPos.x = obj2.position.x + obj2.colliderPositionDelta.x - obj1.position.x - obj1.colliderPositionDelta.x;
    relPos.y = obj2.position.y + obj2.colliderPositionDelta.y - obj1.position.y - obj1.colliderPositionDelta.y;
    const r1 = (obj1.dimensions.x + obj1.dimensions.y)/4;
    const r2 = (obj2.dimensions.x + obj2.dimensions.y)/4;
    const r = r1+r2;
    if(Vector.lengthSq([relPos.x,relPos.y]) > Math.pow(r,2)) {
        return [[0,0],0]
    }
    const d = Vector.length([relPos.x,relPos.y]);
    if(d !== 0) {
        return [Vector.scale([relPos.x,relPos.y],1/d),r-d];
    }
    return [[1,0],r1];
}

function collisionDetectionBoxCircle(obj1,obj2) {
    const relPos = [];
    relPos[0] = obj2.position.x + obj2.colliderPositionDelta.x - obj1.position.x - obj1.colliderPositionDelta.x;
    relPos[1] = obj2.position.y + obj2.colliderPositionDelta.y - obj1.position.y - obj1.colliderPositionDelta.y;
    const closest = [];
    closest[0] = relPos[0];
    closest[1] = relPos[1];
    const halfWidth = obj1.dimensions.x/2;
    const halfHeight = obj1.dimensions.y/2;
    closest[0] = clamp(closest[0], -halfWidth, halfWidth);
    closest[1] = clamp(closest[1], -halfHeight, halfHeight);
    let circleInside = false;
    if(Vector.equal(relPos, closest)) {
        //circle inside box, clamp circle centre to nearest edge
        circleInside = true;
        if(Math.abs(relPos[0]) > Math.abs(relPos[1])) {
            if(closest[0] > 0) {
                closest[0] = halfWidth;
            } else {
                closest[0] = -halfWidth;
            }
        } else {
            if(closest[1] > 0) {
                closest[1] = halfHeight;
            } else {
                closest[1] = -halfHeight;
            }
        }
    }
    const normal = Vector.minus(relPos,closest);
    let d = Vector.lengthSq(normal);
    const r = (obj2.dimensions.x + obj2.dimensions.y)/4;
    if(d > Math.pow(r,2) && !circleInside) {
        return [[0,0],0]
    }
    d = Math.sqrt(d);
    if(circleInside) {
        return [normal, r-d];
    } else {
        return [Vector.scale(normal,-1),r-d];
    }
}

function collisionDetectionPolyPoly(obj1, obj2) {
    //fix for on top
    if(obj1.position.x === obj2.position.x && obj1.position.y === obj2.position.y) {
        return [[1,0], 0.1];
    }

    //needed to find sign of normal
    const relPosSign = {};
    relPosSign.x = Math.sign(obj2.position.x - obj1.position.x) || 1;
    relPosSign.y = Math.sign(obj2.position.y - obj1.position.y) || 1;
    
    // SEPERATING AXIS THEOREM
    const poly1 = obj1.getBoundingBox();
    const poly2 = obj2.getBoundingBox();

    // get all axis (normals to all sides)
    let normals = poly1.normals();
    normals.push(...poly2.normals());
    normals = removeDupeNorms(normals)
    // SAP
    const overlaps = [];
    for(let i = 0; i < normals.length; i++) {
        const n = normals[i];
        const projection1 = poly1.project(n);
        const projection2 = poly2.project(n);
        const overlap = projectionOverlap(projection1, projection2)
        if(!overlap) {
            return [[0,0],0]
        }
        overlaps.push({
            penDepth: overlap,
            normal: n
        })
    }
    const minPenDepth = Math.min(...overlaps.map(i => i.penDepth));
    const min = overlaps.find(i => i.penDepth === minPenDepth);
    const signedNormal = [relPosSign.x * Math.abs(min.normal.x), relPosSign.y * Math.abs(min.normal.y)]
    return [signedNormal,min.penDepth]
}

function projectionOverlap([min1,max1], [min2,max2]) {
    if(min1 > max2 || min2 > max1) {
        return false;
    }
    return Math.min(max1,max2) - Math.max(min1,min2);
}

function removeDupeNorms(normals) {
    let toRemove = [];
    let res = [];
    for(let i = 0; i < normals.length; i++) {
        for(let j = 0; j < i; j++) {
            if(normals[i].x === normals[j].x && normals[i].y === normals[j].y) {
                toRemove.push(j)
            }
            if(normals[i].x === -normals[j].x && normals[i].y === -normals[j].y) {
                toRemove.push(j)
            }
        }
    }
    for(let i = 0; i < normals.length; i++) {
        if(toRemove.indexOf(i) === -1) {
            res.push(normals[i])
        }
    }
    return res;
}

export function collisionDetection(obj1, obj2) {
    if(obj1.colliderType === ColliderTypes.Box && obj2.colliderType === ColliderTypes.Box) {
        //Broad phase
        const [normal, penDepth] = collisionDetectionBoxBox(obj1,obj2)
        if(penDepth > 0) {
            //Narrow Phase
            return collisionDetectionPolyPoly(obj1,obj2);
        }
        return [[0,0],0]
    } else if(obj1.colliderType === ColliderTypes.Box && obj2.colliderType === ColliderTypes.Circle) {
        const [normal, penDepth] = collisionDetectionBoxCircle(obj1,obj2)
        return [Vector.scale(normal,-1),penDepth]
    } else if(obj2.colliderType === ColliderTypes.Box && obj1.colliderType === ColliderTypes.Circle) {
        return collisionDetectionBoxCircle(obj2,obj1);
    } else if(obj2.colliderType === ColliderTypes.Circle && obj1.colliderType === ColliderTypes.Circle) {
        return collisionDetectionCircleCircle(obj1, obj2);
    } else {
        //Broad phase
        const [normal, penDepth] = collisionDetectionBoxBox(obj1,obj2)
        if(penDepth > 0) {
            //Narrow Phase
            return collisionDetectionPolyPoly(obj1,obj2);
        }
        return [[0,0],0]
    }
}

export function collisionResponse(obj1, obj2, normal, penDepth) {
    normal = Vector.normalise(normal)
    const relVel = [];
    relVel[0] = obj2.velocity.x - obj1.velocity.x;
    relVel[1] = obj2.velocity.y - obj1.velocity.y;
    const relVelNormal = Vector.dot({x:relVel[0],y:relVel[1]}, {x:normal[0],y:normal[1]});
    if(relVelNormal > 0) {
        return;
    }
    const e = Math.min(obj1.restitution, obj2.restitution)
    // impulse scalar
    let j = -(1+e)*relVelNormal;
    j /= (1/obj1.mass) + (1/obj2.mass);
    let impulse = Vector.scale(normal, j);
    if(!obj1.fixed) {
        obj1.velocity.x -= impulse[0]*(1/obj1.mass);
        obj1.velocity.y -= impulse[1]*(1/obj1.mass);
    }
    if(!obj2.fixed) {
        obj2.velocity.x += impulse[0]*(1/obj2.mass);
        obj2.velocity.y += impulse[1]*(1/obj2.mass);
    }

    // if(!obj1.fixed) {
    //     obj1.impulse(-impulse[0]*(1/obj1.mass), -impulse[1]*(1/obj1.mass));
    // }
    // if(!obj2.fixed) {
    //     obj2.impulse(impulse[0]*(1/obj2.mass), impulse[1]*(1/obj2.mass));
    // }

    // positional correction
    const correction = Math.max(penDepth - penDepthSlop, 0) / 2 * penDepthPercent;
    const correctionVector = Vector.scale(normal, correction);
    if(!obj1.fixed) {
        obj1.position.x -= correctionVector[0];
        obj1.position.y -= correctionVector[1];
    }
    if(!obj2.fixed) {
        obj2.position.x += correctionVector[0];
        obj2.position.y += correctionVector[1];
    }
}

export function objectPartitions(partitionSize, object, shiftX, shiftY) {
    
    let top = object.position.y - object.dimensions.y/2 + object.colliderPositionDelta.y + shiftY;
    let left = object.position.x - object.dimensions.x/2 + object.colliderPositionDelta.x + shiftX;
    let bottom = object.position.y + object.dimensions.y/2 + object.colliderPositionDelta.y + shiftY;
    let right = object.position.x + object.dimensions.x/2 + object.colliderPositionDelta.x + shiftX;
    top = Math.floor(top/partitionSize)
    left = Math.floor(left/partitionSize)
    bottom = Math.floor(bottom/partitionSize)
    right = Math.floor(right/partitionSize)
    const res = [];
    for(let i = top; i <= bottom; i++) {
        for(let j = left; j <= right; j++) {
            res.push([i,j])
        }
    }
    return res;
}
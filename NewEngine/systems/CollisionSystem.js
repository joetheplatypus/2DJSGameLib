import { Vector } from "../util/Vector.js";
import { Collider } from "../components/Collider.js";
import { Physics } from "../components/Physics.js";
import { System } from "../System.js";
import { util } from "../util/util.js";
import { Transform } from "../components/Transform.js";

export class CollisionSystem extends System {
    constructor() {
        super()
        this.req = [Collider]
        this.partitionSize = 500
    }
    update(entities) {
        const partitions = this.partition(entities)
        let collisions = this.collisions(partitions)
        collisions = this.broadPhase(collisions)
        const manifolds = this.narrowPhase(collisions)
        manifolds.map(({obj1,obj2,normal}) => {
            // obj1.onCollision(obj2, normal)
            // obj1.collisionList.push({collider: obj2, normal: normal})
            // obj2.onCollision(obj1, normal.scale(-1))
            // obj2.collisionList.push({collider: obj1, normal: normal.scale(-1)})
        })
        this.resolve(manifolds)
    }
    partition(entities) {
        // Need to shift for 0-indexing to account for negative positions
        const shiftX = -Math.min(...entities.map(g => g.getComponent(Collider).getAABox().tl.x),0) + this.partitionSize;
        const shiftY = -Math.min(...entities.map(g => g.getComponent(Collider).getAABox().tl.y),0) + this.partitionSize;
        // Put into a 2D array
        const partitions = new util.Expanding2DArray([]);
        entities.map(entity => {
            const collider = entity.getComponent(Collider)
            const aabox = collider.getAABox()
            const top = Math.floor((aabox.tl.y + shiftY) / this.partitionSize);
            const bottom = Math.floor((aabox.br.y + shiftY) / this.partitionSize);
            const left = Math.floor((aabox.tl.x + shiftX) / this.partitionSize);
            const right = Math.floor((aabox.br.x + shiftX) / this.partitionSize);
            for(let i=left; i<=right; i++) {
                for(let j=top; j<=bottom; j++) {
                    const arr = partitions.get(i,j)
                    if(arr.length === 0) {
                        partitions.set(i,j,[entity])
                    } else {
                        arr.push(entity)
                    }
                }
            }
        })
        return partitions.toArray()
    }
    collisions(partitions) {
        const collisions = [];
        const uniqMap = {};
        partitions.map(row => row.map(cell => {
            for(let i=0; i<cell.length; i++) {
                for(let j=0; j<i; j++) {
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
    }
    broadPhase(collisions) {
        const ret = collisions.map(([ent1,ent2]) => {
            const box1 = ent1.getComponent(Collider).getAABox();
            const box2 = ent2.getComponent(Collider).getAABox();
            if(box1.intersects(box2)) {
                return [ent1,ent2]
            } else {
                return null
            }
        })
        return ret.filter(x => x !== null)
    }
    narrowPhase(collisions) {
        const ret = collisions.map(([ent1, ent2]) => {
            const col1 = ent1.getComponent(Collider)
            const col2 = ent2.getComponent(Collider)
            // Fix for directly on top collisions
            if (col1.getAABox().center().equals(col2.getAABox().center())) {
                return new Collision.Manifold(col1, col2, 0.1, Vector.right)
            }
            // Generate manifold
            if(col1.colliderType === Collider.Type.AABox) {
                if(col2.colliderType === Collider.Type.AABox) {
                    return CollisionSystem.Manifold.genAABoxAABox(col1, col2)
                } else if(col2.colliderType === Collider.Type.Box) {
                    return CollisionSystem.Manifold.genBoxAABox(col2, col1)
                } else if(col2.colliderType === Collider.Type.Circle) {
                    return CollisionSystem.Manifold.genCircleAABox(col2, col1)
                }
            } else if(col1.colliderType === Collider.Type.Box) {
                if(col2.colliderType === Collider.Type.AABox) {
                    return CollisionSystem.Manifold.genBoxAABox(col1, col2)
                } else if(col2.colliderType === Collider.Type.Box) {
                    return CollisionSystem.Manifold.genBoxBox(col1, col2)
                } else if(col2.colliderType === Collider.Type.Circle) {
                    return CollisionSystem.Manifold.genCircleBox(col2, col1)
                }
            } else if(col1.colliderType === Collider.Type.Circle) {
                if(col2.colliderType === Collider.Type.AABox) {
                    return CollisionSystem.Manifold.genCircleAABox(col1, col2)
                } else if(col2.colliderType === Collider.Type.Box) {
                    return CollisionSystem.Manifold.genCircleBox(col1, col2)
                } else if(col2.colliderType === Collider.Type.Circle) {
                    return CollisionSystem.Manifold.genCircleCircle(col1, col2)
                }
            }
        })
        return ret.filter(x => x !== null)
    }
    resolve(manifolds) {
        manifolds.map(({ col1,col2,penDepth,normal }) => {
            // Dont resolive triggers
            if(col1.triggerOnly || col2.triggerOnly) {
                return;
            }

            const phys1 = col1.go.getComponent(Physics)
            const phys2 = col2.go.getComponent(Physics)

            const transform1 = col1.go.getComponent(Transform)
            const transform2 = col2.go.getComponent(Transform)

            const vel1 = new Vector()
            const vel2 = new Vector()
            const mass1 = 1
            const mass2 = 1
            
            if(phys1) {
                vel1.set(phys1.velocity.x, phys1.velocity.y)
                mass1 = phys1.mass
            }
            if(phys2) {
                vel2.set(phys2.velocity.x, phys2.velocity.y)
                mass2 = phys2.mass
            }

            const relVel = vel2.minus(vel1);
            const relVelNormal = relVel.dot(normal);
            if(relVelNormal > 0) {
                // collision is resolving itself
                return;
            }

            // Apply impulse
            const e = Math.min(col1.restitution, col2.restitution)
            let j = -(1+e)*relVelNormal;
            j /= (1/mass1) + (1/mass1);
            let impulse = normal.scale(j);
            if(phys1) {
                phys1.velocity.x -= impulse.x*(1/mass1);
                phys1.velocity.y -= impulse.y*(1/mass1);
            }
            if(phys2) {
                phys2.velocity.x += impulse.x*(1/mass2);
                phys2.velocity.y += impulse.y*(1/mass2);
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
            if(phys1) {
                transform1.position.x -= correctionVector.x;
                transform1.position.y -= correctionVector.y;
            }
            if(phys2) {
                transform2.position.x += correctionVector.x;
                transform2.position.y += correctionVector.y;
            }
        })
    }
}
CollisionSystem.Manifold = class {
    constructor(col1, col2, penDepth, normal) {
        this.col1 = col1;
        this.col2 = col2;
        this.penDepth = penDepth;
        this.normal = normal.normalise();
    }
    reverse() {
        this.normal = this.normal.scale(-1)
        return this
    }
    static genAABoxAABox(col1, col2) {
        const box1 = col1.getAABox()
        const box2 = col2.getAABox()
        const relPos = box2.center().minus(box1.center())
        const overlapX = box1.width()/2 + box2.width()/2 - Math.abs(relPos.x);
        if(overlapX > 0) {
            const overlapY = box1.height()/2 + box2.height()/2 - Math.abs(relPos.y);
            if(overlapY > 0) {
                if(overlapX < overlapY) {
                    if(relPos.x < 0) {
                        return new CollisionSystem.Manifold(col1, col2, overlapX, Vector.left)
                    } else {
                        return new CollisionSystem.Manifold(col1, col2, overlapX, Vector.right)
                    }
                } else {
                    if(relPos.y < 0) {
                        return new CollisionSystem.Manifold(col1, col2, overlapY, Vector.up)
                    } else {
                        return new CollisionSystem.Manifold(col1, col2, overlapY, Vector.down)
                    }
                }
            }
        }
        return null
    }
    
    static genBoxAABox(col1, col2) {
        const poly1 = col1.getPoly();
        const poly2 = Polygon.fromAABox(col2.getAABox())
        return genBoxBox(col1, col2, poly1, poly2)
    }
    
    static genCircleAABox(col1, col2) {
        const box1 = col1.getAABox()
        const box2 = col2.getAABox()
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
        const r = (col1.dimensions.x + col1.dimensions.y)/4;
        if(d > Math.pow(r,2) && !circleInside) {
            return null
        }
        d = Math.sqrt(d);
        if(circleInside) {
            return new CollisionSystem.Manifold(col1, col2, r-d, normal.scale(-1))
        } else {
            return new CollisionSystem.Manifold(col1, col2, r-d, normal)
        }
    }
    
    static genBoxBox(col1, col2, poly1 = col1.getPoly(), poly2 = col2.getPoly()) {
        const relPosSign = new Vector();
        relPosSign.x = Math.sign(col2.position.x - col1.position.x) || 1;
        relPosSign.y = Math.sign(col2.position.y - col1.position.y) || 1;
    
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
        return new CollisionSystem.Manifold(col1, col2, min.penDepth, signedNormal)
    }
    
    static genCircleBox(col1, col2) {
        const circ = col1.getAABox()
        const r = (col1.dimensions.x + col1.dimensions.y)/4;
        const poly = col2.getPoly()
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
            return new CollisionSystem.Manifold(col1, col2, r-d, normal)
        } else {
            return new CollisionSystem.Manifold(col1, col2, r-d, normal.scale(-1))
        }
    }
    
    static genCircleCircle(col1, col2) {
        const rad1 = util.avg(col1.dimensions.x, col1.dimensions.y)/2
        const rad2 = util.avg(col2.dimensions.x, col2.dimensions.y)/2
        const relPos = new Vector({
            x: col2.getAABox().center().x - col1.getAABox().center().x,
            y: col2.getAABox().center().y - col1.getAABox().center().y, 
        })
        const r = rad1+rad2;
        if(relPos.modSq() > Math.pow(r,2)) {
            return null
        }
        const d = relPos.mod();
        if(d !== 0) {
            return new CollisionSystem.Manifold(col1, col2, r-d, relPos.scale(1/d))
        }
        // This should never happen since we check in narrowPhase
        return new CollisionSystem.Manifold(col1, col2, rad1, Vector.right)
    }
}
export default {
    dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y
    },
    scale(v, t) {
        return v.map(e => e*t);
    },
    equal(v1, v2) {
        return (v1[0] === v2[0] && v1[1] === v2[1]);
    },
    distanceSq(v1,v2) {
        return Math.pow(v1[0] - v2[0]) + Math.pow(v1[1] - v2[1])
    },
    lengthSq(v1) {
        return Math.pow(v1[0], 2) + Math.pow(v1[1], 2)
    },
    length(v1) {
        return Math.sqrt(this.lengthSq(v1));
    },
    posDistSq(v1,v2) {
        return Math.pow(v1.x - v2.x,2) + Math.pow(v1.y - v2.y,2)
    },
    add(v1,v2) {
        return [v1[0]+v2[0],v1[1]+v2[1]];
    },
    minus(v1,v2) {
        return this.add(v1, this.scale(v2,-1))
    },
    normalise(v) {
        const r = this.length(v);
        return this.scale(v, 1/r)
    },
    down: [0,1],
    up: [0,-1],
    left: [-1,0],
    right: [1,0]
}
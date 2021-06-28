export * from './GameObject.js'
export * from './InputHandler.js'
export * from './Entity.js'
export * from './ColliderTypes.js'
export * from './Polygon.js'
export function spawn(classs,...args) {
    const o = new classs(...args);
    o.init();
    return o;
}
export function clamp(x,min,max) {
    if(x < min) return min;
    if(x > max) return max;
    return x;
}

export function mod(n, m) {
    return ((n % m) + m) % m;
}
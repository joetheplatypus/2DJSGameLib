// Enhances infix modulo operator ensuring always returns a positive value.
export function mod(n, m) {
    return ((n % m) + m) % m;
}

// Clamps input x between and including [min,max]
export function clamp(x, min, max) {
    if(x < min) return min;
    if(x > max) return max;
    return x;
}
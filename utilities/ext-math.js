
export function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

export function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}
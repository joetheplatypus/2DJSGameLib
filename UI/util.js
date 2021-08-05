import { UIBase } from './UIBase.js'

let camera = null;
let dom = null;

export function setCamera(_camera) {
    camera = _camera;
}

export function getCamera() {
    return camera;
}

export function setDOM(_dom) {
    dom = _dom;
    dom.classList.add('UIBaseContainer')
}

export function addDOM(el) {
    dom.appendChild(el)
}

export function removeDOM(el) {
    dom.removeChild(el)
}

export function update() {
    UIBase.updateAll();
}
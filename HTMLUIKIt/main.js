import DOM from './DOM.js'
import UIList from './UIList.js'
export * from './UIPanel.js'
export * from './UITitlePanel.js'
export * from './UIConfirmPanel.js'
export * from './UIButtonPanel.js'
export * from './UIInputPanel.js'
export * from './UITablePanel.js'
export * from './UIMultiInputPanel.js'
export * from './UICrudTablePanel.js'
export * from './UIStaticInventoryPanel.js'
export * from './UIInventoryPanel.js'
export * from './UIInfoPanel.js'
export * from './UIEditableInfoPanel.js'
export * from './UIAlert.js'

export function setUIDOM(dom) {
    DOM.set(dom)
}

export function updateUI() {
    UIList.updateAll();
}

export function closeAllUI() {
    // important to copy as hiding may delete from UIList
    const listCopy = [...UIList.list];
    listCopy.map(item => {
        item.hide()
    })
}

export function removeUIComp(el) {
    UIList.remove(el)
    DOM.remove(el.dom);
}

export function setUIProjection(proj) {
    DOM.setProjection(proj)
}
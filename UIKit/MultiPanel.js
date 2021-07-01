export class MultiPanel {
    constructor() {
        this.currentPanel = null;
        this.panels = {}; // Map
        this.removeOnClose = false;
        this.position = { x:0, y:0 }
    }
    add(name, panel) {
        if(this.panels[name]) {
            console.error('panel name already exists')
        } else {
            this.panels[name] = panel;
            if(this.currentPanel === null) {
                this.currentPanel = this.panels[name];
            }
            panel.removeOnClose = false;
            panel.onclose.add(() => {this.close()})
            panel.position.x = this.position.x;
            panel.position.y = this.position.y;
        }
    }
    switch(name) {
        this.currentPanel.hide();
        this.currentPanel = this.panels[name];
        this.currentPanel.show();
    }
    close() {
        if(this.removeOnClose) {
            Object.keys(this.panels).map(k => this.panels[k].remove())
        } else {
            this.currentPanel.hide();
        }
    }
    show() {
        this.currentPanel.show();
    }
    hide() {
        this.currentPanel.hide();
    }

}
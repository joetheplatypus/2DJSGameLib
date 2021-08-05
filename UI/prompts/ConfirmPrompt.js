import Blur from "../Blur.js";
import { Buttons } from "../components/Buttons.js";
import { Text } from "../components/Text.js";
import { Title } from "../components/Title.js";
import { Panel } from "../Panel.js";

export class ConfirmPrompt extends Panel {
    constructor(text, cb) {
        super()
        this.worldCoords = false;
        this.removeOnClose = true;
        this.position.x = window.innerWidth/2;
        this.position.y = window.innerHeight/2;
        this.dom.classList.add('UIKitPrompt');
        this.addComponent(Title, text)
        this.addComponent(Buttons, 'Cancel', () => {this.close()}, 'OK', () => {this.close(); cb()})
        Blur.on();
        this.show()
    }
    close() {
        Blur.off();
        super.close();
    }
}
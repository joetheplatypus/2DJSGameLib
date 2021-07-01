import Blur from "../Blur.js";
import { Buttons } from "../components/Buttons.js";
import { Input } from "../components/Input.js";
import { Text } from "../components/Text.js";
import { Title } from "../components/Title.js";
import { Panel } from "../Panel.js";

export class InputPrompt extends Panel {
    constructor(title, inputs, values, cb) {
        super()
        this.worldCoords = false;
        this.removeOnClose = true;
        this.position.x = window.innerWidth/2;
        this.position.y = window.innerHeight/2;
        this.dom.classList.add('UIKitPrompt');
        this.addComponent(Title, title)
        const inputDoms = [];
        for(let i = 0; i < inputs.length; i++) {
            inputDoms.push(this.addComponent(Input, inputs[i], values[i]))
        }        
        this.addComponent(Buttons, 'Cancel', () => {this.close()}, 'OK', () => {
            this.close();
            cb(...inputDoms.map(i => i.getValue()))
        })
        Blur.on();
        this.show()
    }
    close() {
        Blur.off();
        super.close();
    }
}
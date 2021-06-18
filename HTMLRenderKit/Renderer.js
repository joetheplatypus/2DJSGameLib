import { Sprite } from './Sprite.js'
import { AnimatedSprite } from './AnimatedSprite.js'
import { Spritesheet } from './Spritesheet.js'

export class Renderer {
    constructor(camera, ctx) {
        this.camera = camera;
        this.ctx = ctx;
        this.layerFuncs = [[],[],[],[],[],[]];
        this.currentLayer = 0;
        this.backgroundImg = null;
    }
    setLayer(layer) {
        this.currentLayer = layer;
    }
    draw(spriteName,_x,_y) {
        let {x,y} = this.camera.to({x:_x,y:_y});
        let sprite = Sprite.fromName(spriteName);
        if(sprite instanceof AnimatedSprite) {
            sprite.tick()
            sprite = Sprite.fromName(sprite.getSprite());
        }
        if(!this.camera.isInFrame(x, y, sprite.dim.w, sprite.dim.h)) {
            return;
        }
        const sheet = Spritesheet.fromName(sprite.sheet);
        const topLeft = {x: x-sprite.dim.w/2, y: y-sprite.dim.h/2};
        this.layerFuncs[this.currentLayer].push(() => {
            this.ctx.drawImage(sheet.image, sprite.pos.x, sprite.pos.y, sprite.dim.w, sprite.dim.h, Math.floor(topLeft.x), Math.floor(topLeft.y), sprite.dim.w, sprite.dim.h);
        })
    }
    drawAdv(spriteName,_x,_y,scale,rot,flipX = false, crop = {top:0,bottom:0,left:0,right:0}) {
        let {x,y} = this.camera.to({x:_x,y:_y});
        let sprite = Sprite.fromName(spriteName);
        if(sprite instanceof AnimatedSprite) {
            sprite.tick()
            sprite = Sprite.fromName(sprite.getSprite());
        }
        if(!this.camera.isInFrame(x, y, sprite.dim.w, sprite.dim.h)) {
            return;
        }
        const sheet = Spritesheet.fromName(sprite.sheet);
        this.layerFuncs[this.currentLayer].push(() => {
            this.ctx.save();
            this.ctx.translate(Math.floor(x),Math.floor(y));
            this.ctx.rotate(rot);
            if(flipX) {
                this.ctx.scale(-1,1);
            }
            this.ctx.drawImage(sheet.image, sprite.pos.x + crop.left, sprite.pos.y + crop.top, sprite.dim.w - crop.left - crop.right, sprite.dim.h - crop.top - crop.bottom, -sprite.dim.w*scale/2, -sprite.dim.h*scale/2, sprite.dim.w*scale, sprite.dim.h*scale)
            this.ctx.restore()
        })
    }
    fillRectRel(_x,_y,rot,_x2,_y2,rot2,_x3,_y3,rot3,w,h,colour) {
        let {x,y} = this.camera.to({x:_x,y:_y});
        this.layerFuncs[this.currentLayer].push(() => {
            this.ctx.save();
            this.ctx.translate(Math.floor(x),Math.floor(y));
            this.ctx.rotate(rot);
            this.ctx.translate(_x2,_y2);
            this.ctx.rotate(rot2);
            this.ctx.translate(_x3,_y3);
            this.ctx.rotate(rot3);
            this.ctx.fillStyle = colour;
            this.ctx.fillRect(-w/2, -h/2, w, h)
            this.ctx.restore();
        });
        this.ctx.restore();
    }
    fillRect(_x,_y,w,h,colour,rot = 0) {
        let {x,y} = this.camera.to({x:_x,y:_y});
        if(!this.camera.isInFrame(x,y,w,h)) {
            return;
        }
        this.layerFuncs[this.currentLayer].push(() => {
            this.ctx.save();
            this.ctx.translate(x,y);
            this.ctx.rotate(rot);
            this.ctx.fillStyle = colour;
            this.ctx.fillRect(-w/2, -h/2, w, h)
            this.ctx.restore();
        })
    }
    fillCircle(_x,_y,r,colour) {
        let {x,y} = this.camera.to({x:_x,y:_y});
        if(!this.camera.isInFrame(x,y,r,r)) {
            return;
        }
        this.layerFuncs[this.currentLayer].push(() => {
            this.ctx.fillStyle = colour;
            this.ctx.beginPath();
            this.ctx.arc(x, y, r, 0, 2*Math.PI);
            this.ctx.fill();
        })
    }
    clear() {
        if(this.backgroundImg) {
            this.ctx.drawImage(this.backgroundImg, 0, 0, this.camera.w, this.camera.h);
        } else {
            this.ctx.fillStyle = 'black'
            this.ctx.fillRect(0, 0, this.camera.w, this.camera.h)
        }
        
    }
    render() {
        this.layerFuncs = this.layerFuncs.map(layer => {
            layer.map(f => f());
            return [];
        })
    }
    setBackgroundImg(src) {
        this.backgroundImg = new Image();
        this.backgroundImg.src = src;
    }
}
import { Tile } from "../JSTileKit/main.js";

export class RoadTile extends Tile {
    constructor(x, y, sprite) {
        super(x, y, sprite);
        this.bypassCollisions = true;
        this.doesCollide = false;
        this.laneWidth = 120;
        this.dimensions = {x:500,y:500}
        this.network = null;
    }
    generatePath(enter, goal) {
        const pathType = pathTypes[(dirs[goal] - dirs[enter] + 8) % 4]
        // Generate path from north then rotate
        let path = [];
        switch(pathType) {
            case 'F':
                path.push({x:+this.laneWidth,y:-this.dimensions.y/2})
                path.push({x:+this.laneWidth,y:+this.dimensions.y/2})
                break;
            case 'L':
                path.push({x:+this.laneWidth,y:-this.dimensions.y/2})
                path.push({x:this.dimensions.x/2,y:-this.laneWidth})
                break;
            case 'R':
                path.push({x:+this.laneWidth,y:-this.dimensions.y/2})
                path.push({x:-this.dimensions.x/2,y:this.laneWidth})
                break;
            case 'B':
                path.push({x:this.laneWidth,y:-this.dimensions.y/2})
                path.push({x:this.laneWidth,y:0})
                path.push({x:-this.laneWidth,y:0})
                path.push({x:-this.laneWidth,y:-this.dimensions.y/2})
                break;
        }
        //Rotate
        let angle = -(dirs[enter]-1)*Math.PI/2
        let c = Math.cos(angle);
        let s = Math.sin(angle);
        path = path.map(({x,y}) => ({x:c*x + s*y, y: -s*x + c*y}));

        //Add world coords
        // console.log(path)
        path = path.map(({x,y}) => ({x:x+this.position.x, y:y+this.position.y}))

        return path;
    }
    draw(renderer) {
        renderer.setLayer(1)
        renderer.fillRect(this.position.x, this.position.y, 500, 500, 'black')
        let path = [];
        path.push({x:this.laneWidth,y:-this.dimensions.y/2})
        path.push({x:this.laneWidth,y:0})
        path.push({x:-this.laneWidth,y:0})
        path.push({x:-this.laneWidth,y:-this.dimensions.y/2})
        path.push({x:+this.laneWidth,y:-this.dimensions.y/2})
        path.push({x:+this.laneWidth,y:-this.dimensions.y/2})
        path.push({x:-this.dimensions.x/2,y:this.laneWidth})
        path.push({x:this.dimensions.x/2,y:-this.laneWidth})
        path.push({x:+this.laneWidth,y:-this.dimensions.y/2})
        path.push({x:+this.laneWidth,y:+this.dimensions.y/2})
        path = path.map(({x,y}) => ({x:x+this.position.x, y:y+this.position.y}))
        renderer.setLayer(4)
        path.map(p => {
            renderer.fillRect(p.x, p.y, 50, 50, 'green')
        })

        
    }
}

const dirs = {
    'N':1,
    'E':2,
    'S':3,
    'W':4
}
const pathTypes = {
    2:'F',
    1:'L',
    3:'R',
    0:'B' //turn around
}
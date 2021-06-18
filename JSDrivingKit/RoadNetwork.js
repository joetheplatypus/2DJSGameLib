export class RoadNetwork {
    constructor() {
        this.layout = [[]];
        this.tileMap = new Map([[]]);
    }
    getTile({x,y}) {
        return this.tileMap.get(x+':'+y);
    }
    registerTile({x,y},tile) {
        this.tileMap.set(x+':'+y, tile);
        //resize 2d array
        while(this.layout.length <= y) {
            this.layout.push(new Array(this.layout[0].length));
        }
        while(this.layout[0].length <= x) {
            this.layout.map(r => r.push(0))
        }
        //set
        this.layout[y][x] = 1;
        tile.network = this;
    }
    generatePath(gridPosList) {
        let path = [];
        for(let i = 1; i < gridPosList.length-1; i++) {
            const tile = this.getTile(gridPosList[i]);
            const start = this.getDir(gridPosList[i-1], gridPosList[i]);
            const end = this.getDir(gridPosList[i+1], gridPosList[i]);
            path.push(...tile.generatePath(start,end))
        }
        return path;
    }
    getDir(gridPos1, gridPos2) {
        const dx = gridPos2.x - gridPos1.x;
        const dy = gridPos2.y - gridPos1.y;
        if(dx == 1) { return 'W' };
        if(dx == -1) { return 'E' };
        if(dy == 1) { return 'N' };
        if(dy == -1) { return 'S' };
    }
}
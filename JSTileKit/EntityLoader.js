import { Tile } from './Tile.js'

export function loadEntities(map, classMapping) {
    // get list of objects
    let objs = getObjects(map);
    // filter out those without tag
    objs = objs.filter(o => (o.properties && o.properties.find(p => p.name === 'tag')));
    // load entity from tag
    objs.map(({properties, x, y}) => {
        const tag = properties.find(p => p.name === 'tag').value;
        const paramObj = properties.find(p => p.name === 'param')
        
        const classToInstantiate = classMapping.get(tag);
        if(classToInstantiate) {
            let o = null;
            if(paramObj) {
                const param = paramObj.value;
                o = new classToInstantiate(param);
            } else {
                o = new classToInstantiate()
            }
            o.setPosition(x, y-Tile.size)
        }
    })
}

function getObjects(map) {
    return map.layers.find(l => l.name ==='objects').objects;
}

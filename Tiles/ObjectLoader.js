export const ObjectLoader = {

    // Loads GameObjects from layer.  `class` tag specifies class in mapping and `param` is passed as paramters
    fromTiledLayer(map, classMapping, layerName = 'Object Layer 1') {
        // get list of objects
        let objs = map.layers.find(l => l.name === layerName).objects;
        // filter out those without tag
        objs = objs.filter(o => (o.properties && o.properties.find(p => p.name === 'class')));
        // load obj from tag
        objs.map(({properties, x, y}) => {
            const className = properties.find(p => p.name === 'class').value;
            const paramObj = properties.find(p => p.name === 'param')
            
            const classs = classMapping.get(className);
            if(classs) {
                let o = null;
                if(paramObj) {
                    const param = paramObj.value;
                    o = new classs(param);
                } else {
                    o = new classs()
                }
                // For some reason this positioning is correct...
                o.setPosition(x, y - map.tileheight);
            }
        })
    }

}
import { Components, Entity, ComponentFactory } from "../NewEngine/main.js";

export const ObjectLoader = {

    // Loads GameObjects from layer.  `class` tag specifies class in mapping and `param` is passed as paramters
    fromTiledLayer(map, layerName = 'Object Layer 1') {
        // get list of objects
        let objs = map.layers.find(l => l.name === layerName).objects;
        // filter out those without tag
        // objs = objs.filter(o => (o.properties && o.properties.find(p => p.name === 'class')));
        // load obj from tag
        objs.map(({properties, x, y}) => {

            const entity = new Entity()
            const transform = entity.addComponent(Components.Transform)
            properties.map(({name, value}) => {
                const component = ComponentFactory.get(name)
                if(component) {
                    const args = JSON.parse(value)
                    entity.addComponent(component, ...args)
                }
            })

            transform.position.set(x, y - map.tileheight);
        })
    }

}
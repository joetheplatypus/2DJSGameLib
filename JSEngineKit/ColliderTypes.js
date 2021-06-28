// Enum for the collider type used in collision detection and resolution.
export const ColliderTypes =  {

    // Axis-Aligned-Bounding-Box broad phase -> SAT polygon narrow phase to handle rotation
    Box:'Box',

    // Simple circle collider using avg of width and height as diameter
    Circle:'Circle',
    
    // Polygon collider using SAT (not implemented)
    Poly:'Poly',
}

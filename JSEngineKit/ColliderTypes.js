/**
 * @typedef {string} ColliderType
 **/

/**
 * @enum {ColliderType} Enum for the collider type used in collision detection and resolution.
 */
export const ColliderTypes =  {
    /** 
     * @var Box 
     * @desc Axis-Aligned-Bounding-Box broad phase -> SAT polygon narrow phase to handle rotation
     */
    Box:'Box',
    /** 
     * @var Circle 
     * @desc Simple circle collider using avg of width and height as diameter
     */
    Circle:'Circle',
    /** 
     * @var Poly 
     * @desc Polygon collider using SAT
     */
    Poly:'Poly', // Not Implemented
}

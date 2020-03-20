/**
 * @class
 * @classdesc This class enable us to generate Rubik's cube stickers.
 */
class RubikSticker{
    /**
     * Inicialites the sticker
     * @param {number} rX - Number of rotations of 90 degres around the X axis.
     * @param {number} rY - Number of rotations of 90 degres around the Y axis.
     * @param {P5Color} [c=COLORSDIC.NULL] - Color of the sticker (P5Color)
     * @param {number} [w=cubeW]  - The size of the piece that contains the sticker.
     */
    constructor(rX, rY, c, w){
        this.rX = rX * Math.PI / 2;
        this.rY = rY * Math.PI / 2;
        this.width = (w)? w : RubikCube.cubeW;
        this.c = (c)? c : COLORSDIC.NULL;
    }
    /**
     * Prints on screen the sticker.
     */
    show(){
        push();
        noStroke(); //Without borders
        fill(this.c); //Fill with sticker's color
        //Place at correct position
        rotateX(this.rX); //Rotate on the X axis
        rotateY(this.rY); //Rotate on the Y axis
        translate(0,0, this.width * 0.52); //Translate to the face of the cube (width * (0.5 + offset to see the sticker)).
        
        plane(this.width * 0.88); //Draw the sticker a bit smaller than the piece
        pop();
    }
    /**
     * Changes the color of the sticker
     * @param {P5Color} color (P5Color)
     */
    setColor(color){
        this.c = color;
    }
}
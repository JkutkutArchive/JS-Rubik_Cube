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
        this.wPercent = 0.88;
        this.c = (c)? c : COLORSDIC.NULL;
    }
    /**
     * Prints on screen the sticker.
     */
    show(){
        mainCanvas.push();
        mainCanvas.noStroke(); //Without borders
        mainCanvas.fill(this.c); //Fill with sticker's color
        //Place at correct position
        mainCanvas.rotateX(this.rX); //Rotate on the X axis
        mainCanvas.rotateY(this.rY); //Rotate on the Y axis
        mainCanvas.translate(0,0, this.width * 0.52); //Translate to the face of the cube (width * (0.5 + offset to see the sticker)).
        
        mainCanvas.plane(this.width * this.wPercent); //Draw the sticker a bit smaller than the piece
        mainCanvas.pop();
    }
    /**
     * Changes the color of the sticker
     * @param {P5Color} color (P5Color)
     */
    setColor(color){
        this.c = color;
    }
    /**
     * Changes the with of the sticker
     * @param {number} w - The new width
     */
    setWidth(w){
        try{
            if(typeof(w) != "number"){
                throw "it is not a number";
            }
            this.w = w;
        }
        catch(error){
            console.log(error);
        }
    }
    /**
     * Changes the percentage that multiplies the width in order to generate the sticker.
     * @param {number} wP - The new percentage to generate the sticker
     */
    setWPercent(wP){
        try{
            if(typeof(w) != "number"){
                throw "it is not a number";
            }
            this.wPercent = wP;
        }
        catch(error){
            console.log(error);
        }
    }
}
/**
 * @class This class generates the base to generate all pieces of the rubik's cube
 */
class RubikPiece{
  /**
   * Initialize and store all properties
   * @param {P5Color} [c=COLORSDIC.NULL] - Color of the piece (P5Color) 
   * @param {number} [w=cubeW] - Size of the piece
   */
  constructor(c, w){
    this.stickers = []; //array to keep track of the stickers
    this.posMatrix = matrix.make.identity(4); //position matrix.
    this.rMatrix = matrix.make.identity(4); //rotation around origin matrix.
    this.matrix = matrix.make.identity(4); //result of posMatrix * rMatrix

    this.color = (c)? c : COLORSDIC.NULL; //P5color of the piece
    this.w = (w)? w : RubikCube.cubeW;
  }

  /**
   * Shows on screen the piece with all of the stickers asociated to this piece
   */
  show(){};
  /**
   * Changes the color of the stickers.
   * @param {P5color[]} colorArray - array of colors to the stickers.
   * @throws error if not correct lenght of array (number of stickers). 
   */
  changeStickers(colorArray){};
  /**
   * updates the width of the stickers in this piece
   */
  changeStickersW(){}
  /**
   * Changes the percentage of the stickers in this piece
   * @param {number} wP - The new percentage.
   */
  changeStickersWPercent(wP){}

  //Matrix manipulation
  /**
   * Rotates the piece from the origin axis.
   * @param {string} axis - The axis of rotation. It follows the vector.re expressions.
   * @param {number} angle - The radians of rotation.
   */
  rotateOrigin(axis, angle){};
  /**
   * Moves the piece relative to the current position (the new vector is added).
   * 
   * Input: p5 vector or coordinates
   * @param {P5vector|number} posiOrX - P5Vector or diccionary ({x: 100, y: 0, z: 0}) with the coord.
   * @param {number} [y] - y coord.
   * @param {number} [z] - z coord.
   */
  move(posiOrX, y, z){};
  /**
   * Each time the position or rotation matrix (this.posMatrix or this.rMatrix) is changed, this method should be called to commit the change to the piece.
   */
  updateMatrix(){};
  /**
   * Rotates the piece by it's own axis.
   * @deprecated
   * @param {string} axis - The axis of rotation. It follows the vector.re expressions.
   * @param {number} angle - The radians of rotation.
   */
  rotatePiece(axis, angle){};

  //Setters and getters:
  /**
   * Set the position of the piece.
   * 
   * Input: p5 vector or coordinates
   * @param {P5vector|number} posiOrX - P5Vector or diccionary ({x: 100, y: 0, z: 0}) with the coord.
   * @param {number} [y] - y coord.
   * @param {number} [z] - z coord.
   */
  setPos(posiOrX, y, z){};
  /**
   * Returns the current position of the piece relative to the origin of coordinates.
   * @param {boolean} P5Vect - whenever or not the output should be a P5Vector or array
   */
  getPos(P5Vect){};
  /**
   * Changes the with of the sticker
   * @param {number} w - The new width
  */
  setWidth(w){}
}

class RubikPieceCenter extends RubikPiece{
  /**
   * This constructor adds one sticker to the top of the cube
   * @extends RubikPiece
   */
  constructor(c, w){
    super(c, w);
    // this.setPos(createVector(0, 0, this.w)); //set the position of the center in a correct spot
    this.stickers.push(new RubikSticker(0, 0, COLORSDIC.NULL, this.w)); //add the sticker
  }
  show(){
    fill(this.color);
    push();
    strokeWeight(4);
    applyMatrix(...matrix.p.applyRotation(this.matrix));

    if(Array.isArray(this.w)){
      box(...this.w);
    }
    else{
      box(this.w);
    }    
    for(let i = 0; i < this.stickers.length; i++){
      this.stickers[i].show();
    }
    pop();
  }
  changeStickers(colorArray){
    try{
      if(colorArray.length != this.stickers.length){
        throw "Incorrect lenght of array at RubikPiece.changeStickers"
      }
      for(let i = 0; i < this.stickers.length; i++){
        this.stickers[i].setColor(colorArray[i]);
      }
    }
    catch(error){
      console.log(error);
    }
  }
  changeStickersW(){
    for(let i = 0; i < this.stickers.length; i++){
      this.stickers[i].setWidth(this.w);
    }
  }
  changeStickersWPercent(wP){
    for(let i = 0; i < this.stickers.length; i++){
      this.stickers[i].setWPercent(wP);
    }
  }
  
  //Matrix operations:
  rotateOrigin(axis, angle){
    let m = matrix.make.rotationOrigin(axis, angle, this.rMatrix);
    this.rMatrix = matrix.o.mult(m,this.rMatrix);
    this.updateMatrix();
  }
  move(posiOrX, y, z){
    let tM = matrix.make.translation(posiOrX, y, z);
    this.posMatrix = matrix.o.mult(tM,this.posMatrix);
    this.updateMatrix();
  }
  updateMatrix(){
    this.matrix = matrix.o.mult(this.posMatrix, this.rMatrix);
  }
  rotatePiece(axis, angle){
    let m = matrix.make.rotationOrigin(axis, angle);
    this.rMatrix = matrix.o.mult(m,this.rMatrix);
    this.updateMatrix();
  }
  
  //Setters and getters:
  setPos(posi, y, z){
    this.posMatrix = matrix.make.translation(posi, y, z);
    this.updateMatrix();
  }
  getPos(P5Vect){
    let v = [0, 0, 0];
    let vectors = matrix.make.identity(4);
    let m = matrix.o.mult(this.posMatrix, this.rMatrix);
    for(let i = 0; i < 3; i++){
      v[i] = matrix.o.mult(m, matrix.o.transpose([vectors[i]]))[3][0];
    }
    return (P5Vect)? v : createVector(v[0], v[1], v[2]);
  }
  setWidth(w){
    try{
        if(typeof(w) != "number"){
            throw "it is not a number";
        }
        this.w = w;
        this.changeStickersW();
    }
    catch(error){
        console.log(error);
    }
  }
}


class RubikPieceEdge extends RubikPieceCenter{
  /**
   * This constructor adds one sticker to side
   * @extends RubikPieceCenter
   */
  constructor(c, w){
    super(c, w);
    // this.setPos(createVector(0, this.w, this.w)); //set the position of the center in a correct spot
    this.stickers.push(new RubikSticker(-1, 0, COLORSDIC.NULL, this.w)); //add the sticker
  }
}

class RubikPieceCorner extends RubikPieceEdge{
  /**
   * This constructor adds one sticker to the other side
   * @extends RubikPieceEdge
   */
  constructor(c, w){
    super(c, w);
    // this.setPos(createVector(this.w, this.w, this.w)); //set the position of the center in a correct spot
    this.stickers.push(new RubikSticker(0, 1, COLORSDIC.NULL, this.w)); //add the sticker
  }
}
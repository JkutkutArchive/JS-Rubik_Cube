class RubikPiece{
  /*
  TO DO:
    - Enable rotations
    - Use matrices
    - Keep track of sticker's orientation
  */
  constructor(pos){
    this.pos = pos;//the actual pos
    // this.moves = [];//[["x", 0.5]] -> rotateX(Math.PI / 2);
  }
  show(){
    /*
    size = cubeW
    color = last color in 'colors' array
    */
    
  }

  rotate(rM){
    //rM = rotation matrix
    console.log("holaaa");
  }
  move(posi){
    //moves the piece to a new pos
    this.pos = posi.copy();
  }
}

class Edge extends RubikPiece{
  constructor(pos){
    super(pos);
    this.stickers = [];
  }
}

class Corner extends RubikPiece{
  constructor(pos){
    super(pos);
    this.stickers = [];
  }
}
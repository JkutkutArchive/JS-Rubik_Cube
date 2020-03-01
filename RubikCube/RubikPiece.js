class RubikPiece{
  /*
  TO DO:
    - Enable rotations
    - Use matrices
    - Keep track of sticker's orientation
  */
  constructor(pos, width, c){
    this.pos = pos;//the actual pos
    this.width = (width)? width : cubeW;
    // this.color = (c)? c : COLORS[COLORS.length - 1];
    this.rMatrix = matrix.make.identity(4);
    this.stickers = [];
  }

  show(){
    // fill(this.color);
    push();
    strokeWeight(4)
    // resetMatrix();
    applyMatrix(...this.applyRotation(this.rMatrix));
    box(this.width);
    // translate(this.pos);
    
    for(let i = 0; i < this.stickers.length; i++){
      this.stickers[i].show();
    }
    pop();
  }
  applyRotation(m){
    return [m[0][0],m[0][1],m[0][2],0,m[1][0],m[1][1],m[1][2],0,m[2][0],m[2][1],m[2][2],0,0,0,0,1];
  }

  rotate(axis, angle){
    this.applyM(matrix.make.rotate(axis, angle));
  }
  applyM(rM){ //rM = rotation matrix
    this.rMatrix = matrix.o.mult(this.rMatrix, rM);
  }
  move(posi){
    //moves the piece to a new pos
    this.pos = posi.copy();
  }
}

class Edge extends RubikPiece{
  constructor(pos){
    super(pos);
  }
}

class Corner extends RubikPiece{
  constructor(pos){
    super(pos);
    
  }
}
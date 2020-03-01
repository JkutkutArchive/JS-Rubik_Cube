class RubikPiece{
  /*
  TO DO:
    - Enable rotations
    - Use matrices
    - Keep track of sticker's orientation
  */
  constructor(w, c){
    this.rMatrix = matrix.make.identity(4);
    this.posM;//the actual pos (translation matrix)


    this.width = (w)? w : cubeW;
    this.color = (c)? c : COLORS[COLORS.length - 1];
    this.stickers = [];
  }

  show(){
    fill(this.color);
    push();
    strokeWeight(4)
    // resetMatrix();
    let m = matrix.o.mult(this.posM, this.rMatrix);

    // applyMatrix(...matrix.p.applyRotation(this.rMatrix));
    applyMatrix(...matrix.p.applyRotation(m));
    box(this.width);
    // translate(this.pos);
    
    for(let i = 0; i < this.stickers.length; i++){
      this.stickers[i].show();
    }
    pop();
  }

  rotate(axis, angle){
    this.applyM(matrix.make.rotation4D(axis, angle));
  }
  applyM(rM){ //rM = rotation matrix
    printMatrix_nD(rM);
    printMatrix_nD(this.rMatrix);
    this.rMatrix = matrix.o.mult(rM,this.rMatrix);
  }
  move(posi){
    //moves the piece to a new pos
    this.pos = posi.copy();
  }
  setPos(posi){
    this.posM = matrix.make.translation(posi);
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
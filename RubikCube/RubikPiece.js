class RubikPiece{
  /*
  TO DO:
    - Enable rotations
    - Use matrices
    - Keep track of sticker's orientation
  */
  constructor(w, c){
    this.matrix = matrix.make.identity(4);
    this.rMatrix = matrix.make.identity(4);
    this.posM;//the actual pos (translation matrix)

    this.width = (w)? w : cubeW;
    this.color = (c)? c : COLORS[COLORS.length - 1];
    this.stickers = [];
  }

  show(){
    fill(this.color);
    push();
    strokeWeight(4);
    applyMatrix(...matrix.p.applyRotation(this.matrix));
    applyMatrix(...matrix.p.applyRotation(this.rMatrix));
    box(this.width,50,25);
    
    for(let i = 0; i < this.stickers.length; i++){
      this.stickers[i].show();
    }
    pop();
  }

  rotatePiece(axis, angle){
    this.applyM(matrix.make.rotation(axis, angle));
  }
  rotateOrigin(axis, angle){

    // this.applyM(matrix.make.rotationOrigin(axis, angle));
    let m = matrix.make.rotationOrigin(axis, angle);
    this.rMatrix = matrix.o.mult(m,this.rMatrix);
    
  }
  applyM(rM){ //rM = rotation matrix
    printMatrix_nD(rM);
    printMatrix_nD(this.matrix);
    this.matrix = matrix.o.mult(rM,this.matrix);
  }
  move(posi){
    this.applyM(matrix.make.translation(posi));
    //moves the piece to a new pos
    // this.pos = posi.copy();
  }
  setPos(posi){
    this.applyM(matrix.make.translation(posi));
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
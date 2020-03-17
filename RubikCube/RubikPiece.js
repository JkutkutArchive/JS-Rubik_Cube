class RubikPiece{
  /*
  TO DO:
    - Enable rotations
    - Use matrices
    - Keep track of sticker's orientation
  */
  constructor(w, c){
    this.matrix = matrix.make.identity(4);
    this.rMatrix = matrix.make.identity(4);//rotation around origin.
    //this.oriMatrix = matrix.make.identity(4); //rotation of the piece

    this.posM;//the actual pos (translation matrix)

    this.width = (w)? w : cubeW;
    this.color = (c)? c : COLORS[COLORS.length - 1];
    this.stickers = [];
  }

  show(){
    fill(this.color);
    push();
    strokeWeight(4);
    let m = matrix.o.mult(this.matrix, this.rMatrix);
    // applyMatrix(...matrix.p.applyRotation(this.rMatrix));
    // applyMatrix(...matrix.p.applyRotation(this.matrix));
    applyMatrix(...matrix.p.applyRotation(m));
    box(this.width,50,25);
    
    for(let i = 0; i < this.stickers.length; i++){
      this.stickers[i].show();
    }
    pop();
  }

  // rotatePiece(axis, angle){
  //   this.applyM(matrix.make.rotation(axis, angle));
  // }

  rotateOrigin(axis, angle){

    // this.applyM(matrix.make.rotationOrigin(axis, angle));
    let m = matrix.make.rotationOrigin(axis, angle);
    // let M = matrix.o.mult(matrix.o.inverse(m), this.matrix);//M = m * This * m^-1
    // this.rMatrix = matrix.o.mult(M, m);

    this.rMatrix = matrix.o.mult(m,this.rMatrix);
  }

  // applyM(rM){ //rM = rotation matrix
  //   printMatrix_nD(rM);
  //   printMatrix_nD(this.matrix);
  //   this.matrix = matrix.o.mult(rM,this.matrix);
  // }

  move(posi){
    let rM = matrix.make.translation(posi);
    this.matrix = matrix.o.mult(rM,this.matrix);
  }
  setPos(posi){
    this.matrix = matrix.make.translation(posi);
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
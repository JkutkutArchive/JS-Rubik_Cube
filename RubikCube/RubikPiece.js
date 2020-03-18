class RubikPiece{
  /*
  TO DO:
    - Enable rotations
    - Use matrices
    - Keep track of sticker's orientation
  */
  constructor(w, c){
    this.stickers = [];
    this.posMatrix = matrix.make.identity(4);//position matrix.
    this.rMatrix = matrix.make.identity(4);//rotation around origin matrix.

    this.width = (w)? w : cubeW;
    this.color = (c)? c : COLORS[COLORS.length - 1];
    // this.stickers = [];
  }

  show(){
    fill(this.color);
    push();
    strokeWeight(4);
    let m = matrix.o.mult(this.posMatrix, this.rMatrix);
    applyMatrix(...matrix.p.applyRotation(m));
    box(this.width,50,25);
    
    for(let i = 0; i < this.stickers.length; i++){
      this.stickers[i].show();
    }
    pop();
  }

  rotatePiece(axis, angle){
    let m = matrix.make.rotationOrigin(axis, angle);
    this.rMatrix = matrix.o.mult(m,this.rMatrix);
  }
  rotateOrigin(axis, angle){
    let m = matrix.make.rotationOrigin(axis, angle, this.rMatrix);
    this.rMatrix = matrix.o.mult(m,this.rMatrix);
  }
  move(posi){
    let rM = matrix.make.translation(posi);
    this.posMatrix = matrix.o.mult(rM,this.posMatrix);
  }
  setPos(posi){
    this.posMatrix = matrix.make.translation(posi);
  }
}

class Center extends RubikPiece{
  constructor(w,c){
    super(w,c); 
    this.stickers.push(new RubikSticker(0, 0, COLORS[4], this.width));
  }
}

class Edge extends Center{
  constructor(w,c){
    super(w,c);
    this.stickers.push(new RubikSticker(-1, 0, COLORS[0], this.width));
  }
}

class Corner extends Edge{
  constructor(w,c){
    super(w,c);
    this.stickers.push(new RubikSticker(0, 1, COLORS[3], this.width));
  }
}
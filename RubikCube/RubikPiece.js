class RubikPiece{
  constructor(c, w){
    this.stickers = [];
    this.posMatrix = matrix.make.identity(4);//position matrix.
    this.rMatrix = matrix.make.identity(4);//rotation around origin matrix.

    this.color = (c)? c : COLORS[COLORS.length - 1];
    this.w = (w)? w : cubeW;
  }

  show(){
    fill(this.color);
    push();
    strokeWeight(4);
    let m = matrix.o.mult(this.posMatrix, this.rMatrix);
    applyMatrix(...matrix.p.applyRotation(m));
    box(this.w,50,25);
    
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
  move(posiOrX, y, z){
    let rM = matrix.make.translation(posiOrX, y, z);
    this.posMatrix = matrix.o.mult(rM,this.posMatrix);
  }
  setPos(posi){
    this.posMatrix = matrix.make.translation(posi);
  }
}

class Center extends RubikPiece{
  constructor(c, w){
    super(c, w);
    this.setPos(createVector(0, 0, this.w));
    this.stickers.push(new RubikSticker(0, 0, COLORS[4], this.w));
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
}

class Edge extends Center{
  constructor(c, w){
    super(c, w);
    this.setPos(createVector(0, this.w, this.w));
    this.stickers.push(new RubikSticker(-1, 0, COLORS[0], this.w));
  }
}

class Corner extends Edge{
  constructor(c, w){
    super(c, w);
    this.setPos(createVector(this.w, this.w, this.w))
    this.stickers.push(new RubikSticker(0, 1, COLORS[3], this.w));
  }
}
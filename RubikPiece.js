class RubikPiece{
  constructor(c, w){
    this.stickers = [];
    this.posMatrix = matrix.make.identity(4);//position matrix.
    this.rMatrix = matrix.make.identity(4);//rotation around origin matrix.
    this.matrix = matrix.make.identity(4);

    this.color = (c)? c : COLORS[COLORS.length - 1];
    this.w = (w)? w : cubeW;
  }

  show(){
    fill(this.color);
    push();
    strokeWeight(4);
    applyMatrix(...matrix.p.applyRotation(this.matrix));
    box(this.w);
    // box(this.w,50,25);
    
    for(let i = 0; i < this.stickers.length; i++){
      this.stickers[i].show();
    }
    pop();
  }

  rotatePiece(axis, angle){
    let m = matrix.make.rotationOrigin(axis, angle);
    this.rMatrix = matrix.o.mult(m,this.rMatrix);
    this.updateMatrix();
  }
  rotateOrigin(axis, angle){
    let m = matrix.make.rotationOrigin(axis, angle, this.rMatrix);
    this.rMatrix = matrix.o.mult(m,this.rMatrix);
    this.updateMatrix();
  }
  move(posiOrX, y, z){
    let rM = matrix.make.translation(posiOrX, y, z);
    this.posMatrix = matrix.o.mult(rM,this.posMatrix);
    this.updateMatrix();
  }
  setPos(posi){
    this.posMatrix = matrix.make.translation(posi);
    this.updateMatrix();
  }
  updateMatrix(){
    this.matrix = matrix.o.mult(this.posMatrix, this.rMatrix);
  }
  getPos(){
    let v = [0, 0, 0];
    let vectors = matrix.make.identity(4);
    let m = matrix.o.mult(this.posMatrix, this.rMatrix);
    for(let i = 0; i < 3; i++){
      v[i] = matrix.o.mult(m, matrix.o.transpose([vectors[i]]))[3][0];
    }
    // return createVector(v[0], v[1], v[2]);
    return v;
  }
}

class Center extends RubikPiece{
  constructor(c, w){
    super(c, w);
    this.setPos(createVector(0, 0, this.w));
    this.stickers.push(new RubikSticker(0, 0, COLORSDIC.NULL, this.w));
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
    this.stickers.push(new RubikSticker(-1, 0, COLORSDIC.NULL, this.w));
  }
}

class Corner extends Edge{
  constructor(c, w){
    super(c, w);
    this.setPos(createVector(this.w, this.w, this.w))
    this.stickers.push(new RubikSticker(0, 1, COLORSDIC.NULL, this.w));
  }
}
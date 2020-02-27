class matrix3D{
  constructor(e){
    this.e = e;
  }
  toString(){
    let str = "[";
    for(let i = 0; i < e.length; i++){
      str += "\n  [";
      for(let j = 0; j < e.length; j++){
        str += "\n    [";
      
      }
    }
  }
  setC(x, y, z, v){
    e[x][y][z] = v;
  }
  getC(x, y, z){
    return e[x][y][z];
  }
}

class matrix2D{
  constructor(nRows, nCols){
    this.e = [];
    for(i = 0; i < nRows; i++){
      col = [];
      for(j = 0; j < nCols; j++){
        col.push(0);
      }
      this.e.push(col);
    }
  }
  setC(x, y, v){
    e[x][y] = v;
  }
  getC(x, y){
    try{
      return e[x][y];
    }
    catch(error){
      console.log(error);
      return null;
    }
  }
}
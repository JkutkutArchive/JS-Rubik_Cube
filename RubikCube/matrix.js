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


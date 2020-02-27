function printArray(m){
  console.log(arrayToString(m));
}
function arrayToString(m){
  // try{
    let str = "[";
    for(let i = 0; i < m.length; i++){
      if(Array.isArray(m[i])){
        str += arrayToString(m[i]);
      }
      else{
        str += m[i];
      }
      str += ((i + 1 < m.length) ? ", " : "");
    }
    str += "]";
    return str;
  // }
  // catch(error){
  //   print(error);
  //   return null;
  // }
}


// class Matrix{
//   constructor(){}
// }

// class Matrix2D extends Matrix{
//   constructor(nRows, nCols){
//     super();
//     this.e = [];
//     // for(let i = 0; i < nRows; i++){
//     //   col = [];
//     //   for(let j = 0; j < nCols; j++){
//     //     col.push(0);
//     //   }
//     //   this.e.push(col);
//     // }
//   }
//   setC(x, y, v){
//     e[x][y] = v;
//   }
//   getC(x, y){
//     try{
//       return e[x][y];
//     }
//     catch(error){
//       console.log(error);
//       return null;
//     }
//   }
// }

// class Matrix3D{
//   constructor(e){
//     this.e = e;
//   }
//   toString(){
//     let str = "[";
//     for(let i = 0; i < e.length; i++){
//       str += "\n  [";
//       for(let j = 0; j < e.length; j++){
//         str += "\n    [";
      
//       }
//     }
//   }
//   setC(x, y, z, v){
//     e[x][y][z] = v;
//   }
//   getC(x, y, z){
//     return e[x][y][z];
//   }
// }
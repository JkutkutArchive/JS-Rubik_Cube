/* MATRIX CREATION */
matrix = {
  /*
  TO DO:
    - Rotation Matrices
    - Matrix det
    - Matrix transpose
    - Matrix inverse
    -removeRow
    -removeCol
    -square matrix (m, dim, posI) 
     
    - More Properties?
    - More Operations?

    -JS-DOC
  */
  make: { //2D square matrix
    identity: function(dimX, dimY){
      dimY = (dimY)? dimY : dimX;
      m = matrix.make.empty(dimX, dimY);
      for(let i = 0; i < dimX; i++){
        for(let j = 0; j < dimY; j++){
          m[i][j] = (i == j)? 1 : 0;
        }
      }
      return m;
    },
    
    zero: function(dimX, dimY){
      dimY = (dimY)? dimY : dimX;
      m = matrix.make.empty(dimX, dimY);
      for(let i = 0; i < dimX; i++){
        for(let j = 0; j < dimY; j++){
          m[i][j] = 0;
        }
      }
      return m;
    },
    
    empty: function(dimX, dimY){
      dimY = (dimY)? dimY : dimX;  
      m = [];
      for(let i = 0; i < dimX; i++){
        m.push(new Array(dimY));
      }
      return m;
    }
  },

  p: {  //Properties
    size: function(m){
      return createVector(m.length, m[0].length);
    },
    getRow: function(m, row){
      let r = [];
      for(let i = 0; i < m.length; i++){
        r.push(m[i][row]);
      }
      return r;
    },
    getCol: function(m, col){
      let r = [];
      for(let j = 0; j < m.length; j++){
        r.push(m[col][j]);
      }
      return r;
    },
    det: function(m){
      try{
        if(m.length == 1){
          return m[0][0];
        }
        d = 0;
        for(let i = 0; i < m.length; i++){
          //d += m[i][0] * matrix.p.det();
        }
      }
      catch(e){
        console.log(e);
      }
    }
  },

  operation: {
    add: function(a,b){
      try{
        let range = matrix.p.size(a).x;
        let m = matrix.make.zeroMatrix(range);
        for(let i = 0; i < range; i++){
          for(let j = 0; j < range; j++){
            m[i][j] = a[i][j] + b[i][j];
          }
        }
        return m;
      }
      catch(error){
        console.log(error);
        return null;
      }
    },
    mult: function(a, b){
      try{ // a and b with same dimensions or 1 matrix * scalar, else error
        if(!Array.isArray(a) || !Array.isArray(b)){
          console.log("Scalar detected, attempting scalar multiplication")
          return matrix.operation.scalar(a, b);
        }
        let range = matrix.p.size(a).x;
        let m = matrix.make.emptyMatrix(range);
        for(let i = 0; i < range; i++){
          for(let j = 0; j < range; j++){
            m[i][j] = vector.escalar(matrix.p.getRow(a, i), matrix.p.getCol(b, j));
          }
        }
        return m;
      }
      catch(error){
        console.log(error);
        return null;
      }
    },
    sub: function(a, b){
      return matrix.operation.add(a, matrix.operation.scalar(b, -1));
    },
    scalar: function(n, o){
      let a = (Array.isArray(n))? n : o; //matrix
      let b = (Array.isArray(n))? o : n; //scalar

      let range = matrix.p.size(a).x;
      let m = matrix.make.zeroMatrix(range);
      for(let i = 0; i < range; i++){
        for(let j = 0; j < range; j++){
          m[i][j] = a[i][j] * b;
        }
      }
      return m;
    },
    removeRow: function(m, row){
      // n = emptyMatrix()

    },
    removeCol: function(m, col){

    }
    // transpose: function(){

    // },
    // inverse: function(){

    // }
  }
}

vector = {
  arrSum: function(arr){ //[1,3,3] -> 7
    return arr.reduce(function(a,b){
      return a + b;
    }, 0);
  },
  escalar: function(u, v){
    try{
      let e = 0;
      for(let i = 0; i < a.length; i++){
        e += u[i] * v[i];
      }
      return e;
    }
    catch(error){
      console.log(error);
    }
  }
}
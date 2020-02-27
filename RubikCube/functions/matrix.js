/* MATRIX CREATION */
matrix = {
  /*
  TO DO:
    - Properties
    - Operations
  */
  make: { //2D square matrix
    matrixIdentity: function(range){
      m = emptyMatrix(range);
      for(let i = 0; i < range; i++){
        for(let j = 0; j < range; j++){
          m[i][j] = (i == j)? 1 : 0;
        }
      }
      return m;
    },
    
    zeroMatrix: function(range){
      m = emptyMatrix(range);
      for(let i = 0; i < range; i++){
        for(let j = 0; j < range; j++){
          m[i][j] = 0;
        }
      }
      return m;
    },
    
    emptyMatrix: function(range){
      m = [];
      for(let i = 0; i < range; i++){
        m.push(new Array(range));
      }
      return m;
    }
  },

  p: {  //Properties
    size: function(m){
      return createVector(m.length, m[0].length);
    },
    det: function(m){
      
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
      }
      catch(error){
        console.log(error);
        return null;
      }
    },
    mult: function(a, b){//NOT TRUE MULT
      try{
        if(!Array.isArray(a) || !Array.isArray(b)){
          return matrix.operation.scalar(a, b);
        }
        let range = matrix.p.size(a).x;
        let m = matrix.make.zeroMatrix(range);
        for(let i = 0; i < range; i++){
          for(let j = 0; j < range; j++){
            m[i][j] = a[i][j] * b[i][j];
          }
        }
      }
      catch(error){
        console.log(error);
        return null;
      }
    },
    sub: function(){

    },
    scalar: function(m, n){
      a = (Array.isArray(m))? m : n;
      b = (Array.isArray(m))? n : m;

      let range = matrix.p.size(a).x;
      let m = matrix.make.zeroMatrix(range);
      for(let i = 0; i < range; i++){
        for(let j = 0; j < range; j++){
          m[i][j] = a[i][j] * b;
        }
      }
    },
    transpose: function(){

    },
    inverse: function(){

    }
  }
}
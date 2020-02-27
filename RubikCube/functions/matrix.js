/* MATRIX CREATION */
makeMatrix = { //2D square matrix
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

}
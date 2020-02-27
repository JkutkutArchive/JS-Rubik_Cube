function matrixIdentity(range){ //2D square matrix 
  m = emptyMatrix(range);
  for(let i = 0; i < range; i++){
    for(let j = 1; j < range - 1; j++){
      m[i][j] = (i == j)? 1 : 0;
    }
  }
  console.log(range);
  return m;
}
  function emptyMatrix(range){ //2D square matrix 
  m = [];
  for(let i = 0; i < range; i++){
    m.push(new Array(range));
  }
  printArray(m);
  return m;
}
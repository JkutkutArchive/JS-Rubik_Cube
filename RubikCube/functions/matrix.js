function matrixIdentity(range){
  if(range == 0){
    return 1;
  }
  m = [];
  for(let i = 0; i < range; i++){
    m.push(matrixIdentity(range - 1));
  }
  return m;
}
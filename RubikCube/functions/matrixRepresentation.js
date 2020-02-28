function printMatrix_nD(m){
    console.log(matrixToString(m));
}
function matrixToString(m){
    let str = "[";
    for(let i = 0; i < m.length; i++){
        if(Array.isArray(m[i])){
            str += matrixToString(m[i]);
        }
        else{
            str += m[i];
        }
        str += ((i + 1 < m.length) ? ", " : "");
    }
    str += "]";
    return str;
}
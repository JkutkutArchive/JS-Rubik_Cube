function printMatrix_nD(m, delimeter){
    console.log(matrixToString(m, delimeter));
}
function matrixToString(m, delimeter){
    let d;
    let str = "[";
    for(let i = 0; i < m.length; i++){
        if(Array.isArray(m[i])){
            str += matrixToString(m[i], delimeter);
            d = (delimeter)? delimeter : "\n";
        }
        else{
            str += m[i];
            d = ",";
        }
        str += ((i + 1 < m.length) ?  d + " " : "");
    }
    str += "]";
    return str;
}
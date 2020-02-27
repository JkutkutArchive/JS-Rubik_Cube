function printArray(m){
    console.log(arrayToString(m));
}
function arrayToString(m){
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
}
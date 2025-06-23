/**
 * Different way of calling printArray_nD function.
 * @see {function} printArray_nD.
 * @deprecated
 */
function printMatrix_nD(m, delimeter, round){
    printArray_nD(m, delimeter, round);
}
/**
 * Function that prints the result of running the function array_nDToString.
 * @see {function} array_nDToString.
 */
function printArray_nD(m, delimeter, round){
    console.log(array_nDToString(m, delimeter, round));
}
/**
 * Way to get the toString() method of a array of (arrays of...) of order n.
 * @param {array[]} m - array of (arrays of...) of order n. 
 * @param {string} delimeter - delimiter to separate the elements of m.
 * @param {boolean} round - If the elements of m should be printed using Math.round().
 * @returs {string} the string representation of the matrix m.
*/
function array_nDToString(m, delimeter, round){
    if(round == true){ //remove the "true" when jsdoc done
        let copy = matrix.make.copy(m);
        for(let i = 0; i < m.length; i++){
            for(let j = 0; j < m[0].length; j++){
                copy[i][j] = Math.round(m[i][j]);
            }
        }
        m = copy;
        return array_nDToString(copy, delimeter);
    }
    else{
        let d, end = "";
        let str = "[";
        for(let i = 0; i < m.length; i++){
            if(Array.isArray(m[i])){
                if(Array.isArray(m[i][0])){
                    end = "\n";
                }
                str += array_nDToString(m[i], delimeter);
                d = (delimeter)? delimeter : "\n";
            }
            else{
                str += (typeof(m[i]) == "object")? m[i].constructor.name : m[i];
                d = ",";
            }
            str += ((i + 1 < m.length) ?  d + " " : "") + end;
        }
        str += "]";
        return str;
    }
}
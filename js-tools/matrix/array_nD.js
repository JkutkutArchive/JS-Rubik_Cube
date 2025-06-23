/**
 * Diccionary with some funcionalities to work with nD arrays.
 * 
 * @see Some functions here are designed for a 3D array, so check the functions' names.
 * @property make - Diccionary to generate this type of arrays.
 * @property p - Dicctionary to get properties of this arrays.
 * @property o - Diccionary to operate with this arrays.
 */
array_nD = {
    /**
     * Dictionary to generate nD arrays.
     * @property {function} empty - Generate empty array of the given dimensions.
     * @property {function} copy - Makes a copy of the given array.
     */
    make: {
        /**
         * Generate empty array of the given dimensions
         * @param  {...number} dims - Dimensions of the desired array
         * @returns {any[][]} A array with the dimensions selected and undefined value on every cell.
         */
        empty: function(...dims){
            try{
                let arr = [];
                if(dims.length == 2){
                    let arr = [];
                    for(let i = 0; i < dims[0]; i++){
                        arr.push(new Array(dims[1]));
                    }
                    return arr;
                }
                for(let i = 0; i < dims[0]; i++){
                    arr.push(array_nD.make.empty(...dims.slice(1)));
                }
                return arr;
            }
            catch(error){
                console.log(error);
                return null;
            }
        },
        /**
         * Makes a copy of the given array.
         * @param {any[][]} arrND - Desired nD array.
         * @returns {any[][]} Copy of the selected array.
         */
        copy: function(arrND){
            try{
                let d = array_nD.p.size(arrND);
                let copy = [];
                if(d.length == 2){
                    return matrix.make.copy(arrND); 
                }
                for(let i = 0; i < d.length; i++){
                    copy.push(array_nD.make.copy(arrND[i]));
                }
                return copy;
            }
            catch(error){
                console.log(error);
                return null;
            }
        }
    },
    /**
     * Dicctionary to get properties of this arrays.
     * @property {function} size - Returns a 1D array with the dimensions of the given nD array. 
     */
    p: {
        /**
         * Returns a 1D array with the dimensions of the given nD array.
         * @param {any[][]} arr - nD array.
         * @returns {number[]} The array with the dimensions
         * @see array_nD.p.size(arr[2][3][5]) --> [2, 3, 5];
         */
        size: function(arr){
            let dim = [];
            if(Array.isArray(arr[0])){
                dim.unshift(...array_nD.p.size(arr[0]));
                dim.unshift(arr.length);
            }
            else{
                dim.unshift(arr.length);
            }
            return dim;
        }
    },
    /**
     * Dictionary to operate with type of arrays
     * @see Some functions are made for 3D arrays. Check the JSDOC to see if compatible.
     * @property {function} permutation_3D - Enables to rotate the elements of the 3D array in any direction.
     * @property {function} get3DSlice - Returns the selected slice from the array.
     * @property {function} set3DSlice - Overwrites the selected slice of the array with the given slice.
     */
    o: {
        /**
         * Enables to rotate the elements of the 3D array in any direction.
         * @param {any[][]} arr3D - 3D array with all the elements (The length of this array could be any).
         * @param {string} axis - string denoting the axis of rotation. It must match vector.re.AXIS regex expressions in order to work.
         * @param {number} h - (0 based) the height of the rotation (if axis = "x" and h = 1, rotate on the X axis the second layer). 
         * @returns {any[][]} 2D array with the rotated slice.
         * @see due to the nature of JavaScript, this function makes 2 acctions: return the rotated slice and the native arr3D modified with this rotation.
         * @see This function is based on http://jsfiddle.net/FloydPink/0fg4rLf9/.
         */
        permutation_3D: function(arr3D, axis, h){
            try{
                // reverse the individual rows
                let m = array_nD.o.get3DSlice(arr3D, axis, h);
                m = m.map(function(row) { return row.reverse();});
                for (var i = 0; i < m.length; i++) { //Swap the symmetric elements
                    for (let j = 0; j < i; j++) {
                        let temp = m[i][j];
                        m[i][j] = m[j][i];
                        m[j][i] = temp;
                    }
                }
                array_nD.o.set3DSlice(arr3D, axis, h, m);
                return m;
            }
            catch(error){
                console.log(error);
                return null;
            }
        },
        /**
         * Returns the selected slice from the array.
         * @param {any[][]} arr3D - nD array with all the elements. It does not need to be squared.
         * @param {string} axis - string denoting the axis of rotation. It must match vector.re.AXIS regex expressions in order to work.
         * @param {number} h - (0 based) the height of the rotation (if axis = "x" and h = 1, get the X axis the second layer).
         * @returns {any[][]} 2D array with the array.
        */
        get3DSlice: function(arr3D, axis, h){
            try{
                let size = array_nD.p.size(arr3D);
                let m;
                switch(true){
                    case vector.re.X.test(axis)://x = cte = h 
                        m = matrix.make.empty(size[1], size[2]);
                        for(let j = 0; j < size[1]; j++){
                            for(let k = 0; k < size[2]; k++){
                                m[j][k] = arr3D[h][j][k];
                            }
                        }
                        break;
                    case vector.re.Y.test(axis)://y = cte = h
                        m = matrix.make.empty(size[0], size[2]);
                        for(let i = 0; i < size[0]; i++){
                            for(let k = 0; k < size[2]; k++){
                                m[i][k] = arr3D[k][h][i];
                            }
                        }
                        break;
                    case vector.re.Z.test(axis)://z = cte = h
                        m = matrix.make.empty(size[0], size[1]);
                        for(let i = 0; i < size[0]; i++){
                            for(let j = 0; j < size[1]; j++){
                                m[i][j] = arr3D[i][j][h];
                            }
                        }
                        break;
                }
                return m;
            }
            catch(error){
                console.log(error);
                return null;
            }
        },
        /**
         * Overwrites the selected slice of the array with the given slice.
         * @param {any[][]} arr3D - nD array with all the elements.
         * @param {string} axis - string denoting the axis of rotation. It must match vector.re.AXIS regex expressions in order to work.
         * @param {number} h - (0 based) the height of the rotation (if axis = "x" and h = 1, get the X axis the second layer).
         * @param {any[][]} slice - 2D array with the sliced slice.
         * @returns {any[][]} The new array with the modified slice.
         */
        set3DSlice: function(arr3D, axis, h, slice){
            try{
                let size = array_nD.p.size(arr3D);
                switch(true){
                    case vector.re.X.test(axis)://x = cte = h
                        for(let j = 0; j < size[1]; j++){
                            for(let k = 0; k < size[2]; k++){
                                arr3D[h][j][k] = slice[j][k];
                            }
                        }
                        break;
                    case vector.re.Y.test(axis)://y = cte = h
                        for(let i = 0; i < size[0]; i++){
                            for(let k = 0; k < size[2]; k++){
                                arr3D[i][h][k] = slice[k][i];
                            }
                        }
                        break;
                    case vector.re.Z.test(axis)://z = cte = h
                        for(let i = 0; i < size[0]; i++){
                            for(let j = 0; j < size[1]; j++){
                                arr3D[i][j][h] = slice[i][j];
                            }
                        }
                        break;
                }
                return arr3D;
            }
            catch(error){
                console.log(error);
                return null;
            }
        }
    }
}
/**
 * Matrix diccionary with multiple functionalities
 * 
 * @see X Row = arr.length
 * @see Y Rol = arr[0].length
 * @property make - Dictionary with some functions to generate matrices.
 * @property p - Dictionary with some functions to get matrices' properties.
 * @property o - Dictionary with some functions to operate matrices.
*/
var matrix = {
  /**
   * matrices generators.
   * @property {function} identity - Indentity matrices.
   * @property {function} zero - Matrices filled with ceros.
   * @property {function} empty - Matrices filled with undefined values.
   * @property {function} copy - Copy of a matrix.
   * @property {function} rotation - Matrix to rotate around itself.
   * @property {function} rotationOrigin - Matrix to rotate around the origin of coordinates.
   * @property {function} translation - Matrix to translate in some direction.
   * @property {function} scale - Matrix to scale by the axis-factors.
   * @property {function} reflexion - Matrix to apply a reflexion around the selected axis.
   */
  make: { //2D square matrix
    /**
     * Generates indentity matrices.
     * @param {number} dimX - number of rows
     * @param {number} dimY - number of cols
     * @returns {number[][]} indentity matrix of order dimX-dimY (if not square, the fist diagonal is filled with ones).
     */
    identity: function(dimX, dimY){
      dimY = (dimY)? dimY : dimX;
      let m = matrix.make.empty(dimX, dimY);
      for(let i = 0; i < dimX; i++){
        for(let j = 0; j < dimY; j++){
          m[i][j] = (i == j)? 1 : 0;
        }
      }
      return m;
    },
    /**
     * Generates matrices filled with ceros.
     * @param {number} dimX - number of rows
     * @param {number} dimY - number of cols
     * @returns {number[][]} matrices filled with ceros of order dimX-dimY.
     */
    zero: function(dimX, dimY){
      dimY = (dimY)? dimY : dimX;
      let m = matrix.make.empty(dimX, dimY);
      for(let i = 0; i < dimX; i++){
        for(let j = 0; j < dimY; j++){
          m[i][j] = 0;
        }
      }
      return m;
    },
    /**
     * Generates matrices filled with undefined values.
     * @param {number} dimX - number of rows
     * @param {number} dimY - number of cols
     * @returns {undefined[][]} matrices filled with undefined values of order dimX-dimY.
     */
    empty: function(dimX, dimY){
      dimY = (dimY)? dimY : dimX; //if only one given, make it square
      return array_nD.make.empty(dimX, dimY);
    },
    /**
     * Makes a copy of a matrix
     * @param {any[][]} m - matrix
     * @returns {any[][]} copy of the matrix given.
     */
    copy: function(m){
      let c = [];
      let dim = matrix.p.size(m);
      for(i = 0; i < dim.x; i++){
          c.push([]);
          for(j = 0; j < dim.y; j++){
              c[i][j] = m[i][j];
          }
      }
      return c;
    },
    /**
     * Generates rotation matrices on any of the 3 axis. See https://sites.google.com/site/glennmurray/Home/rotation-matrices-and-formulas/rotation-about-an-arbitrary-axis-in-3-dimensions for more information.
     * @param {number} axis - The axis of rotation (Regex sensitive): X:[xXi], Y:[yYj], Z:[zZk]
     * @param {number} o - Angle of rotation (radians)
     * @returns {number[][]} 3D rotation-matrix in order to rotate "o" radians on the "axis" axis.
     */
    rotation(axis, o){//4D matrix
      o = -o;
      let v = new p5.Vector(0, 0, 0);
      switch(true){
        case vector.re.X.test(axis):
          v.x = 1;
          break;
        case vector.re.Y.test(axis):
          v.y = 1;
          break;
        case vector.re.Z.test(axis):
          v.z = 1;
          break;
        case true:
          console.log("Not correct axis");
          return null;
      }
      let m = matrix.make.zero(4);
      let c = Math.cos(o);
      let s = Math.sin(o);
      
      m[0][0] = v.x * v.x + (1 - v.x * v.x) * c;
      m[1][0] = v.x * v.y * (1 - c) - v.z * s;
      m[2][0] = v.x * v.z * (1 - c) + v.y * s;
      
      m[0][1] = v.x * v.y * (1 - c) + v.z * s;
      m[1][1] = v.y * v.y + (1 - v.y * v.y) * c;
      m[2][1] = v.y * v.z * (1 - c) - v.x * s;
      
      m[0][2] = v.x * v.z * (1 - c) - v.y * s;
      m[1][2] = v.y * v.z * (1 - c) + v.x * s;
      m[2][2] = v.z * v.z + (1 - v.z * v.z) * c;
      
      m[3][3] = 1;
      return m;
    },
    /**
     * Generates rotation matrices from the origin's axis. 
     * @param {string} axis - The axis of rotation (Regex sensitive): X:[xXi], Y:[yYj], Z:[zZk]
     * @param {number} o - Angle of rotation (radians)
     * @param {number[][]} rMatrix - Current rotation matrix to select the equivalent axis.
     * @returns {number[][]} 3D rotation-matrix in order to rotate "o" radians from the "axis" axis.
     */
    rotationOrigin(axis, o, rMatrix){
      if(rMatrix){ //conversor
        let v = [[0],[0],[0],[0]];
        switch(true){ //Make axis-vector
          case vector.re.X.test(axis):
            v[0][0] = 1;
            break;
          case vector.re.Y.test(axis):
            v[1][0] = 1;
            break;
          case vector.re.Z.test(axis):
            v[2][0] = 1;
            break;
        }
        v = vector.toVector(matrix.o.mult(rMatrix, v), true);
        let tAi = 0, aOri = 1;//tAi -> trueAxisIndex; aOri -> axis orientation
        for(let i = 0; i < v.length; i++){
          tAi += Math.abs(v[i]) * i;
          aOri = (v[i] < 0)? -1 : aOri;
        }
        return matrix.make.rotation(vector.re.conversor[tAi], aOri * o);
      }
      return matrix.make.rotation(axis, o);
    },
    /**
     * Generates translation matrices
     * @param {number|P5Vector} x - The x coordinate or the P5Vector if given.
     * @param {number} y - y coordinate. 
     * @param {number} z - z coordinate.
     * @returns {number[][]} 3D translation matrix to the input coordinates.
     */
    translation(x,y,z){
      try{
        if(typeof(x) != "number"){ //atempt to get x,y,z from a P5/diccionary
          y = x.y;
          z = x.z;
          x = x.x;
        }
        let m = matrix.make.identity(4);
        m[3][0] = (x)? x : 0;
        m[3][1] = (y)? y : 0;
        m[3][2] = (z)? z : 0;
        return  m;
      }
      catch(error){
        console.log(error);
        return null;
      }
    },
    /**
     * Generates scale matrices.
     * @param {number} sX - factor to scale on the X axis.
     * @param {number} [sY=1] - factor to scale on the Y axis.
     * @param {number} [sZ=1] - factor to scale on the Z axis.
     * @returns {number[][]} 3D matrix to scale by the given inputs.
     */
    scale: function(sX, sY, sZ){
      let m = matrix.make.identity(4);
      let arr = [sX, (sY)? sY : 1, (sZ)? sZ : sZ];
      for(let i = 0; i < 3; i++){
        m[i][i] = arr[i];
      }
      return m;
    },
    /**
     * (Not finish) Generates a reflexion matrix around the selected axis.
     * @param {string} axis - Wanted axis. It needs to match the vector.re. expressions.
     * @returns {number[][]} 3D matrix to apply a reflexion on the desired axis.
     */
    reflexion(axis){
      let m = matrix.make.identity(4);
      switch(true){
        case vector.re.X.test(axis):
          
          break;
        case vector.re.Y.test(axis):
          
          break;  
        case vector.re.Z.test(axis):

          break;           
        case true:
          console.log("Not correct axis");
          return null;
      }
      return m;
    }
  },
  /**
   * Properties of matrices.
   * @property {function} size - Size of the matrix.
   * @property {function} isSquare - Checks if square matrix.
   * @property {function} getRow - Returns selected row.
   * @property {function} getCol - Returns selected col.
   * @property {function} subMatrix - Returns the sub-matrix.
   * @property {function} applyRotation - Conversor to use this matrices with P5's applyMatrix().
   */
  p: {
    /**
     * Gives the size of the matrix as a P5-Vector.
     * @param {any[][]} m - matrix.
     * @param {boolean} arr - if the output should be an array or not (P5Vector).
     * @returns {Object} P5-Vector with the size of the matrix.
     */
    size: function(m, arr){
      try{
        if(arr == true){
          return [m.length, m[0].length];
        }
        else{
          return new p5.Vector(m.length, m[0].length);
        }
      }
      catch(error){
        console.log(error);
        return new p5.Vector(undefined, undefined);
      }
    },
    /**
     * Checks if same number of rows and cols.
     * @param {any[][]} m - matrix.
     * @returns {boolean} if same number of rows and cols.
     * @throws not correct defined matrix.
     */
    isSquare: function(m){
      try{
        let size = matrix.p.size(m);
        if(size.x == undefined || size.y == undefined){
          throw "Undefined size of matrix";
        }
        return size.x == size.y;
      }
      catch(error){
        console.log(error);
        return false;
      }

    },
    /**
     * Returns the row selected as array.
     * @param {any[][]} m - matrix
     * @param {number} row - 0 based
     * @returns {any[]} Array with the row selected.
     */
    getRow: function(m, row){
      try{
        let r = [];
        for(let j = 0; j < m[0].length; j++){
          r.push(m[row][j]); //On a especific row, all the elements
        }
        return r;
      }
      catch(error){
        console.log(error);
        return null;
      }
    },
    /**
     * Returns the col selected as array.
     * @param {any[][]} m - matrix
     * @param {number} col - 0 based
     * @returns {any[]} Array with the col selected.
     */
    getCol: function(m, col){
      try{
        let r = [];
        for(let i = 0; i < m.length; i++){
          r.push(m[i][col]);//for each row, the col position
        }
        return r;
      }
      catch(error){
        console.log(error);
        return null;
      }
    },
    /**
     * Returns the sub-matrix of order dimSubMx-dimSubMy starting at (posI.x, posI,y) of the matrix
     * @param {any[][]} m - matrix 
     * @param {Object} posI - P5 vector with the starting position (also works with diccionary {x: i, y: j}; i and j being numbers).
     * @param {number} dimSubMx - nº of elements in a row 
     * @param {number} dimSubMy - nº of elements in a col
     * @return {any[][]} matrix of order dimSubMx-dimSubMy starting at (posI.x, posI,y) of the matrix
     */
    subMatrix(m, posI, dimSubMx, dimSubMy){
      try{ 
        dimSubMy = (dimSubMy)? dimSubMy : dimSubMx;
        let n = matrix.make.empty(dimSubMx, dimSubMy);
        for(let i = 0; i < dimSubMx; i++){
          for(let j = 0; j < dimSubMy; j++){
            n[i][j] = m[posI.x + i][posI.y + j];
          }
        }
        return n;
      }
      catch(error){
        console.log(error);
        return null;
      }
    },
    /**
     * Returns an array in order to use the applyMatrix() function from P5.
     * @param {any[][]} m - matrix 
     * @returns {any[]} array with all the elements of the matrix following the WHATWG specification naming
     */
    applyRotation(m){
      let s = matrix.p.size(m);
      let arr = [];
      for(let i = 0; i < s.x; i++){
        for(j = 0; j < s.y; j++){
          arr.push(m[i][j]);
        }
      }
      return arr;
    }
  },
  /**
   * operations
   * @property {function} det - Determinant (recursive)
   * @property {function} add - Addition
   * @property {function} mult - Multiplication
   * @property {function} sub - Substraction
   * @property {function} scalar - Matrix * number
   * @property {function} removeRow - Remove selected row
   * @property {function} removeCol - Remove selected col
   * @property {function} transpose - Transposed matrix
   * @property {function} inverse - Inversed matrix (Guassian Elimination method)
   */
  o: {
    /**
     * Determinant of the given matrix (recursive).
     * @param {number[][]} m - matrix.
     * @returns {number} determinant of given matrix.
     * @throws Not square matrix.
     */
    det: function(m){
      try{
        let size = matrix.p.size(m);
        if(!matrix.p.isSquare(m)){
          throw "Not square matrix";
        }
        if(size.x == 2){
          return m[0][0] * m[1][1] - m[0][1] * m[1][0];
        }
        else{
          let row = matrix.p.getRow(m, 0);
          let M = matrix.make.copy(m);
          M = matrix.o.removeRow(M, 0);
          let detValue = 0;
          for(let i = 0; i < size.x; i++){
            detValue += (Math.pow(-1, i)) * row[i] * matrix.o.det(matrix.o.removeCol(M, i));
          }
          return detValue;
        }
    
      }
      catch(error){
        console.log(error);
        return null;
      }
    },
    /**
     * Addition of two matrices.
     * @param {number[][]} a - Matrix
     * @param {number[][]} b - Matrix
     * @return {number[][]} the result of "a + b".
     */
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
    /**
     * Multiplication of two matrices.
     * @see If a or b is not an array, it atempts the scalar product.
     * @param {number[][]} a - Matrix
     * @param {number[][]} b - Matrix
     * @return {number[][]} the result of "a * b". If any of them is a number, it will try the scalar function.
     * @throws error if not same dimentions.
     */
    mult: function(a, b){
      try{ // a and b with same dimensions or matrix * scalar, else error
        if(!Array.isArray(a) || !Array.isArray(b)){
          console.log("Scalar detected, attempting scalar multiplication")
          return matrix.o.scalar(a, b);
        }
        let sizeA = matrix.p.size(a);
        let sizeB = matrix.p.size(b);
        if(sizeA.y != sizeB.x){
          throw "not the same dimensions";
        }
        let m = matrix.make.empty(sizeA.x, sizeB.y);
        for(let i = 0; i < sizeB.y; i++){ //for each col in b
          for(let j = 0; j < sizeA.x; j++){ //for each row in a
            m[j][i] = vector.escalar(matrix.p.getRow(a, j), matrix.p.getCol(b, i));
          }
        }
        return m;
      }
      catch(error){
        console.log(error);
        return null;
      }
    },
    /**
     * Substraction of two matrices.
     * @param {number[][]} a - Matrix
     * @param {number[][]} b - Matrix
     * @return {number[][]} the result of "a - b".
     */
    sub: function(a, b){
      try{
        return matrix.o.add(a, matrix.o.scalar(b, -1));
      }
      catch(error){
        console.log(error);
        return null;
      }
    },
    /**
     * Matrix * number | number * Matrix.
     * @param {(number[][]|number)} a - Matrix or scalar.
     * @param {(number[][]|number)} b - Matrix or scalar.
     * @return {number[][]} the result of "a * b".
     * @throws error if both numbers or both matrices.
     */
    scalar: function(n, o){
      try{
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
      }
      catch(error){
        console.log(error);
        return null;
      }
    },
    /**
     * Removes the selected row.
     * @param {any[][]} m - matrix.
     * @param {number} row - index of the row to remove.
     * @return {any[][]} New matrix without the selected row.
    */
    removeRow: function(m, row){
      try{
        let size = matrix.p.size(m); 
        let n = matrix.make.empty(size.x - 1, size.y);
        for(let i = 0, iN = 0; i < size.x; i++){
          if(i != row){
            for(let j = 0; j < size.y; j++){
              n[iN][j] = m[i][j];
            }
            iN++;
          }
        }
        return n;
      }
      catch(error){
        console.log(error);
      }
    },
    /**
     * Removes the selected col
     * @param {any[][]} m - matrix
     * @param {number} col - index of the col to remove
     * @return {any[][]} New matrix without the col
     */
    removeCol: function(m, col){
      try{
        let size = matrix.p.size(m); 
        let n = matrix.make.empty(size.x, size.y - 1);
        for(let i = 0; i < size.x; i++){
          for(let j = 0, jN = 0; j < size.y; j++){
            if(j != col){
              n[i][jN] = m[i][j];
              jN++;
            }
          }
        }
        return n;
      }
      catch(error){
        console.log(error);
      }
    },
    /**
     * Returns the transposed matrix
     * @param {number[][]} m - matrix
     * @returns {number[][]} Transposed matrix.
     */
    transpose: function(m){
      try{
        let size = matrix.p.size(m);
        let n = matrix.make.empty(size.y, size.x);
        for(let i = 0; i < size.x; i++){
          for(let j = 0; j < size.y; j++){
            n[j][i] = m[i][j];
          }
        }
        return n;
      }
      catch(error){
        console.log(error);
      }
    },
    /**
     * Returns the inverted matrix using Gaussian Elimination.
     * @see http://blog.acipo.com/matrix-inversion-in-javascript/
     * @param {number[][]} m - matrix
     * @returns {number[][]} Inverted matrix.
     * @throws error if not possible to invert or not square
     */
    inverse: function(m){
      //http://blog.acipo.com/matrix-inversion-in-javascript/
      // I use Guassian Elimination to calculate the inverse:
      // (1) 'augment' the matrix (left) by the identity (on the right)
      // (2) Turn the matrix on the left into the identity by elemetry row ops
      // (3) The matrix on the right is the inverse (was the identity matrix)
      // There are 3 elemtary row ops: (I combine b and c in my code)
      // (a) Swap 2 rows
      // (b) Multiply a row by a scalar
      // (c) Add 2 rows
      try{
        let dim = matrix.p.size(m);    
        //if the matrix isn't square: exit (error)
        if(!matrix.p.isSquare(m)){throw "Error, not same dimension";}
        dim = dim.x;//square mtrix => dim.x == dim.y
        //create the identity matrix (I), and a copy (C) of the original
        let I = matrix.o.transpose(matrix.make.identity(dim));
        let C = matrix.make.copy(m);
        // Perform elementary row operations
        for(let i = 0; i < dim; i++){
            // get the element e on the diagonal
            let e = C[i][i];
            // if we have a 0 on the diagonal (we'll need to swap with a lower row)
            if(e == 0){
                //look through every row below the i'th row
                for(let ii = i + 1; ii < dim; ii++){
                    //if the ii'th row has a non-0 in the i'th col
                    if(C[ii][i] != 0){
                        //it would make the diagonal have a non-0 so swap it
                        for(let j = 0; j < dim; j++){
                            e = C[i][j];       //temp store i'th row
                            C[i][j] = C[ii][j];//replace i'th row by ii'th
                            C[ii][j] = e;      //repace ii'th by temp
                            e = I[i][j];       //temp store i'th row
                            I[i][j] = I[ii][j];//replace i'th row by ii'th
                            I[ii][j] = e;      //repace ii'th by temp
                        }
                        //don't bother checking other rows since we've swapped
                        break;
                    }
                }
                //get the new diagonal
                e = C[i][i];
                //if it's still 0, not invertable (error)
                if(e == 0){throw "Not possible to invert"}
            }
            // Scale this row down by e (so we have a 1 on the diagonal)
            for(let j = 0; j < dim; j++){
                C[i][j] = C[i][j]/e; //apply to original matrix
                I[i][j] = I[i][j]/e; //apply to identity
            }
            // Subtract this row (scaled appropriately for each row) from ALL of
            // the other rows so that there will be 0's in this column in the
            // rows above and below this one
            for(let ii = 0; ii < dim; ii++){
                // Only apply to other rows (we want a 1 on the diagonal)
                if(ii == i){continue;}
                // We want to change this element to 0
                e = C[ii][i];
                // Subtract (the row above(or below) scaled by e) from (the
                // current row) but start at the i'th column and assume all the
                // stuff left of diagonal is 0 (which it should be if we made this
                // algorithm correctly)
                for(let j = 0; j < dim; j++){
                    C[ii][j] -= e*C[i][j]; //apply to original matrix
                    I[ii][j] -= e*I[i][j]; //apply to identity
                }
            }
        }
        //we've done all operations, C should be the identity
        //matrix I should be the inverse:
        return I;
      }
      catch(error){
        console.log(error);
        return null;
      }
    }
  }
}
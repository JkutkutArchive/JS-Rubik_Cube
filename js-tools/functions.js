/**
 * Vector diccionary with some funcionalities:
 * @property {function} arrSum - Returns the sum of the elements of the array. 
 * @property {function} escalar - Returns the result of applying the scalar operation between 2 vectors.
 * @property {function} toVector - Transforms a row or col vector (matrix) to a array/vector. 
 * @property {diccionary} re - Diccionary with some regex expressions related to vectors.
 */
var vector = {
  /**
   * Makes the sum of the elements of the arrays.
   * @param {number[]} arr1 - 1º array
   * @param {number[]} arr2 - 2º array
   * @returns new array with the sum of the given arrays
   */
  addition: function(arr1, arr2){
    try{
      if(!Array.isArray(arr1) || !Array.isArray(arr2)){
        throw "arguments are not arrays";
      }
      else if(arr1.length != arr2.length){
        throw "Not same lenght";
      }
      else{
        let arr = new Array(arr1.length);
        for(let i = 0; i < arr1.length; i++){
          arr[i] = arr1[i] + arr2[i];
        }
        return arr;
      }
    }
    catch(error){
      console.log(error);
      return null;
    }
  },
  /**
   * Makes the multiplication of the elements of the arrays.
   * @param {number[]} arr1 - 1º array
   * @param {number[]} arr2 - 2º array
   * @returns new array with the sum of the given arrays
   */
  multiplication: function(arr1, arr2){
    try{
      if(!Array.isArray(arr1) || !Array.isArray(arr2)){
        throw "arguments are not arrays";
      }
      else if(arr1.length != arr2.length){
        throw "Not same lenght";
      }
      else{
        let arr = new Array(arr1.length);
        for(let i = 0; i < arr1.length; i++){
          arr[i] = arr1[i] * arr2[i];
        }
        return arr;
      }
    }
    catch(error){
      console.log(error);
      return null;
    }
  },
  /**
   * Returns the sum of the elements of the array.
   * @param {number[]} arr - Array to do the sum.
   * @returns {number} the result of this operation.
   */
  arrSum: function(arr){ //[1,3,3] -> 7
    try{
      return arr.reduce(function(a,b){
        return a + b;
      }, 0);
    }
    catch(error){
      console.log(error);
      return null;
    }
  },
  /**
   * Returns the result of applying the scalar product between two vectors.
   * @param {number[]} u - First array / P5Vector / Diccionary({x: 0, y: 0, z:0}).
   * @param {number[]} v - Second array / P5Vector / Diccionary({x: 0, y: 0, z:0}).
   * @returns {number} the result of this operation.
   */
  escalar: function(u, v){
    try{
      let e = 0;
      for(let i = 0; i < u.length; i++){
        e += u[i] * v[i];
      }
      return e;
    }
    catch(error){
      console.log(error);
      return null;
    }
  },
  /**
   * Transforms a row or col vector (matrix) to a array / vector.
   * @param {any[][]} m - matrix / array[array[any]].
   * @param {string} [type] - The type of desired output. 
   * @param {boolean} [round] - If the elements should be rounded.
   */
  toVector: function(m, round, type){ //col vector or row vector to true vector;
    try{
      let v = [];
      if(!round){
        if(m.length == 1){//row vector
          return m[0];
        }
        else if(m[0].length == 1){//col vector
          for(let i = 0; i < m.length; i++){
            v.push(m[i][0]);
          }
        }
        else{
          throw "Not correct dimensions to transform into a Vector/Array";
        }
      }
      else{
        if(m.length == 1){//row vector
          for(let i = 0; i < m[0].length; i++){
            v.push(Math.round(m[0][i]));
          }
        }
        else if(m[0].length == 1){//col vector
          for(let i = 0; i < m.length; i++){
            v.push(Math.round(m[i][0]));
          }
        }
        else{
          throw "Not correct dimensions to transform into a Vector/Array";
        }
      }
      if(type){
        switch(true){
          case /[aA]rr(ay)?/.test(type):
            break;
          case /[dD]ict(ionary)?/.test(type):
            return {x: v[0], y: v[1], z: v[2]};
          case /[pP]5([Vv]ector)?/.test(type):
            return new p5.Vector(v[0], v[1], v[2]);
          case true:
            console.log("Not correct type");
            return v;
        }
      }
      return v;
    }
    catch(error){
      console.log(error);
      return null;
    }

  },

  /**
   * Regex dicionary to store some expressions related to the axis + conversor.
   * @property {regex} regex expresions to test if string refer to axis of R³.
   * @property {string[]} conversor index to axis (0 = "x", 1 = "y" and 2 = "z").
   */
  re: {
    X: /[xXi0]/,
    Y: /[yYj1]/,
    Z: /[zZk2]/,
    conversor: ["x","y","z"]
  }
}

/**
 * Dictionary with the keyCodes of some keys of the keyboard.
 */
var keyCodes = {
  85: "U",
  68: "D",
  82: "R",
  76: "L",
  66: "B",
  70: "F"
};

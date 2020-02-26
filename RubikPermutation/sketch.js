var c = [];
function setup() {
  createCanvas(600, 600, WEBGL);
  camera(500, 500, 500, 0, 0, 0);
  for(let i = 0; i < 3; i++){
    c.push([]);//2d array
    for(let j = 0; j < 3; j++){
      c[i].push([]);//3d Array
      for(let k = 0; k < 3; k++){
        c[i][j].push(createVector(i, j, k));
      }
    }
  }
  
  
  //now program
  
  let l = "R";
  
  c = a(c, "R");
  
  M3DtoString(c, "H");
  
  c = a(c, "U");
  
  M3DtoString(c, "H");
  
  // LtoString(c, l);
//   for(let i = 0; i < 1; i++){
//     c = a(c, l);
//     LtoString(c, l);
//   }

//   console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~\n\n");
  
//   M3DtoString(c, "H");
  
}

function draw() {
  background(220);
  
  noLoop();
}

function toS(arr, e){
  
  switch(e){
    case "U":
      return "(" + arr.x + ", " + arr.y + ")"; 
    case "R":
      // return "(" + arr.y + ", " + arr.z + ")"; 
    case "H":
      return "(" + arr.x + ", " + arr.y + ", " + arr.z + ")"; 
      
  }
  return "";
}

function M3DtoString(copi, e){
  let str;
  console.log("-----------------------------");
  for(let i = 2; i >= 0; i--){
    console.log("\n");
    for(let j = 2; j >= 0; j--){
      str = "";
      for(let k = 2; k >= 0; k--){
        // console.log(toS(copi[j][k][i]));
        str += toS(copi[j][k][i], e);
        
        push();
        translate();
        pop();
      }
      console.log(str);
    }
  }
  console.log("-----------------------------");
}

function LtoString(copi, e){ 
  let str;
  console.log("-----------------------------");
    for(let j = 0; j < 3; j++){
      str = "";
      for(let k = 0; k < 3; k++){
        // console.log(toS(copi[j][k][i]));
        str += toS(copi[j][k][2], e);
      }
      console.log(str);
    }
  console.log("-----------------------------");
}


function a(copi, e) {
  let copy = [
    [],
    [],
    []
  ]; //make a copy
  
  switch(e){
    case "U":
      for (let n = 0; n < 3; n++) {
        for (let m = 0; m < 3; m++) {
          copy[n].push(copi[-(m - 1) + 1][n][2]);
        }
      }
      for (let n = 0; n < 3; n++) {
        for (let m = 0; m < 3; m++) {
          copi[n][m][2] = copy[n][m];
        }
      }
      break;

    case "R":
      for (let n = 0; n < 3; n++) {
        for (let m = 0; m < 3; m++) {
          copy[n].push(copi[2][-(m - 1) + 1][n]);
        }
      }
      for (let n = 0; n < 3; n++) {
        for (let m = 0; m < 3; m++) {
          copi[2][n][m] = copy[n][m];
        }
      }
      break;
  }
  return copi;
}



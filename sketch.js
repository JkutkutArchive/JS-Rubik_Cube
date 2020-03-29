
const screenWidth = 1080;
var screenHeight = 1080;
var buffer;
var buffSize = 100;

var rubik;
var COLORSDIC = {};


//Controls
var moving = false;
var prev = {x: 0, y: 0};//(x,y) mouse coord
var ampli = 1000;
var angX = -0.25 * Math.PI;
var angZ = 0.5 * Math.PI;
var incX = 0, incZ = 0;



function setup() {
  // createCanvas(1000, 1000, WEBGL);
  createCanvas(screenWidth, screenHeight + buffSize, WEBGL);
  buffer = createGraphics(buffSize, buffSize, WEBGL);
  frameRate(30);
  COLORSDIC = {
    //x
    RED: color(255,0,0),//red
    ORANGE: color(245, 135, 66),//orange
    //y
    BLUE: color(0, 144, 247),//blue
    GREEN: color(0, 255, 0),//green
    //z
    WHITE: color(255),//white
    YELLOW: color(247, 239, 0), //yellow
    CUBECOLOR: color(50),//cubeColor
    NULL: color(100)
    
  };

  // rubik = new RubikCube(2);
  rubik = new InvisibleRubikCube(5);
  // rubik = new MirrorRubikCube(null, color(255, 204 ,0))
}

function draw() {
  background(220);
  let camX = -ampli * Math.sin(angX + incX);
  let camY = ampli * Math.cos(angX + incX);
  let camZ = ampli * Math.sin(angZ + incZ);
  
  // camera(0, ampli * Math.cos(angX + incX), 0, 0, 0, 0, 0, 0, -1);
  camera(camX, camY, camZ, 0, 0, 0, 0, 0, -1);

  //camera Controls
  if(moving){
    incX = (mouseX - prev.x) / 500 * Math.pow(1.005, Math.abs(incX));
    incZ = (mouseY - prev.y) / 500 * Math.pow(1.001, Math.abs(incX));
  }

  buffer.background(0)
  buffer.rect(10, 10, 90, 90);

  //debug planes

  let pihalf = Math.PI / 2;
  let l = 1000;
  push();
  fill(color(200, 200, 0, 250));
  noStroke();
  push();
  rotateX(pihalf / 2);
  plane(l / 2, l);
  rotateX(-pihalf);
  plane(l / 2, l);
  pop();
  push();
  rotateY(pihalf / 2);
  plane(l, l / 2);
  rotateY(-pihalf);
  plane(l, l / 2);
  pop();
  push();
  rotateZ(pihalf / 2);
  rotateX(pihalf);
  plane(l, l / 2);
  rotateY(-pihalf);
  plane(l, l / 2);
  pop();
  pop();

  let offset = 0;

  let coordH = Math.round((mouseX - width/2) / rubik.w) - offset;
  let coordV = -Math.round((mouseY - height/2) / rubik.w) - offset;
  
  if(Math.abs(coordH) < rubik.dim * 0.5 && Math.abs(coordV) < rubik.dim * 0.5){
    if(Math.abs(angZ) > Math.PI / 4){ //CHECK FACE
      if(angZ > 0){
        console.log("White");
        zIndex = 0;
      }
      else{
        console.log("Yellow");
      }
    }
    else{
      if(Math.abs(Math.sin(angX)) > Math.abs(Math.cos(angX))){
        if(Math.sin(angX) < 0){
          console.log("Orange");
          // xIndex = 0;
        }
        else{
          console.log("Red");
          // xIndex = rubik.dim - 1;
        }
      }
      else{
        if(Math.cos(angX) > 0){
          console.log("Blue");
          // yIndex = 0;
        }
        else{
          console.log("Green");
          // yIndex = rubik.dim - 1;
        }
      }
    }
  }
















  // cube move controls

  // const r = height * Math.sin(Math.PI / 3);
  // const d = r * Math.cos(Math.PI / 6);

  // let alphaH = Math.atan2((mouseY)? mouseY : 0, d);
  // let alphaW = Math.atan2((mouseX)? mouseX : 0, d);
  
  // let trueD = Math.sqrt(Math.pow(camX, 2) + Math.pow(camY, 2) + Math.pow(camZ, 2));

  // let x = -Math.sin(alphaW) * trueD;
  // let y = Math.cos(alphaW) * trueD;
  // let z = Math.sin(alphaH) * trueD;

  // console.log(camX, camY, camZ);

  // console.log(trueD);
  // console.log(alphaH);

  // console.log(...[x, y, z].map(x => Math.floor(x)));

  // push();
  // translate(x, y, z);
  // fill(color(60,100,120));
  // box(100);
  // pop();

  // let offset = 0;
  // if(rubik.dim % 2 == 0){//if 2n+1 cube => need of center piece => offset needed
  //   offset = - 0.5;
  // }
  // let coordH = Math.round((mouseX - width/2) / rubik.w) - offset;
  // let coordV = -Math.round((mouseY - height/2) / rubik.w) - offset;
  
  // if(Math.abs(coordH) < rubik.dim * 0.5 && Math.abs(coordV) < rubik.dim * 0.5){
  //   let x, y, z;
  //   let xIndex = 0, yIndex = 0, zIndex = 0;
  //   if(Math.abs(angZ) > Math.PI / 4){ //CHECK FACE
  //     xIndex = Math.round((mouseX - width/2) / rubik.w) + Math.abs(rubik.dim / 4);
  //     yIndex = -Math.round((mouseY - height/2) / rubik.w) + Math.abs(rubik.dim / 4);
  //     if(angZ > 0){
  //       console.log("White");
  //       zIndex = 0;
  //     }
  //     else{
  //       console.log("Yellow");
  //       yIndex = Math.round((mouseY - height/2) / rubik.w);
  //       zIndex = -(rubik.dim - 1);
  //     }
  //   }
  //   else{
  //     if(Math.abs(Math.sin(angX)) > Math.abs(Math.cos(angX))){
  //       if(Math.sin(angX) < 0){
  //         console.log("Orange");
  //         xIndex = 0;
  //       }
  //       else{
  //         console.log("Red");
  //         xIndex = rubik.dim - 1;
  //       }
  //     }
  //     else{
  //       if(Math.cos(angX) > 0){
  //         console.log("Blue");
  //         yIndex = 0;
  //       }
  //       else{
  //         console.log("Green");
  //         yIndex = rubik.dim - 1;
  //       }
  //     }
  //   }
  //   x = (xIndex) + offset;
  //   y = (yIndex) + offset;
  //   z = (zIndex + Math.abs(rubik.dim / 2) + offset);

  //   // console.log(coordH + ", " + coordV);
  //   push();
  //   // translate(coordH * rubik.w, 0, coordV * rubik.w);
  //   translate(...[x, -y, z].map(x => x * rubik.w));
  //   fill(color(60,100,120));
  //   box(100);
  //   pop();
  // }

  rubik.show();
}

function keyPressed() {
  // console.log(keyCode);
  if(keyCodes[keyCode] !== undefined){
    rubik.move(keyCodes[keyCode]);
  }
}

function mousePressed() {
  cursor('grab');
  moving = true;
  prev.x = mouseX;
  prev.y = mouseY;
}
function mouseReleased() {
  moving = false;
  angX += incX;
  angZ += incZ;
  incX = 0;
  incZ = 0;
  cursor();
}
function mouseWheel(event) {
  if(ampli > rubik.w * rubik.dim){
    ampli += event.delta;
  }
  else if(event.delta > 0){
    ampli += event.delta;
  }
  else{
    ampli = rubik.w * rubik.dim;
  }

  return false; //prevent scrolling
}
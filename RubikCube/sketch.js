// var easycam;

var cubeW = 100;
var angle = 0;
var colors = [];
var moves = [];
var delayMoves = 60;
var t = 0;

var rubik;

function setup() {
  createCanvas(600, 600, WEBGL);
  // console.log("hola");
  frameRate(30);
  colors = [
    //x
    color(0, 144, 247),//blue
    color(0, 255, 0),//green
    //y
    color(255,0,0),//red
    color(245, 135, 66),//orange
    //z
    color(255),//white
    color(247, 239, 0), //yellow
    color(50)//cubeColor
  ];
  
  rubik = new RubikCube(3);
  
}

function draw() {
  background(220);
  camera(500 * Math.sin(-angle), 500 * Math.cos(angle), 500 , 0, 0, 0, 0, 0, -1);
  // camera(700 * Math.sin(-angle), 700 * Math.cos(angle), 700 , 0, 0, 0, 0, 0, -1);
  
  // angle = (-Math.PI / 4);
  angle = (angle + Math.PI / 720);
  
  rubik.show();
  
  // if(t++ > delayMoves && moves.length > 0){
  //   t = 0;
  //   rubik.m(moves[0]);
  //   // moves.push(moves[0]);
  //   moves.splice(0,1);
  // }
}
function applyM(axis, angle){
  let u = axis.copy().normalize();

  let c = Math.cos(angle);
  let s = Math.sin(angle);
  let oneC = 1 - c;
  
  
  let a = c + u.x * u.x * oneC;
  let b = u.x * u.y * oneC - u.z * s;
  let ce = u.x * u.z * oneC + u.y * s;
  
  let d = u.y * u.x * oneC + u.z * s;
  let e = c + u.y * u.y * oneC;
  let f = u.y * u.z * oneC - u.x * s;
  
  let g = u.z * u.x * oneC - u.y * s;
  let h = u.z * u.y * oneC + u.x * s;
  let i = c + u.z * u.z * oneC;
  
  
  applyMatrix(a, b, ce,
              d, e, f,
              g, h, i);
}
function keyPressed() {
  switch(keyCode){
    case 85:
      rubik.m("U");
      break;
    case 68:
      rubik.m("D");
      break;
    case 82:
      rubik.m("R");
      break;
    case 76:
      rubik.m("L");
      break;
  }
}
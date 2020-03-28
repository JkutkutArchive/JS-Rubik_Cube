
const screenWidth = 1920;
var screenHeight = 1080;

var rubik;
var COLORSDIC = {};


//Controls
var moving = false;
var prev = {x: 0, y: 0};//(x,y) mouse coord
var ampli = 700;
var angX = -0.25 * Math.PI;
var angY = 0.5 * Math.PI;
var incX = 0, incY = 0;



function setup() {
  // createCanvas(1000, 1000, WEBGL);
  createCanvas(screenWidth, screenHeight, WEBGL);
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

  rubik = new InvisibleRubikCube(4);
}

function draw() {
  background(220);
  camera(-ampli * Math.sin(angX + incX), ampli * Math.cos(angX + incX), ampli * Math.sin(angY + incY), 0, 0, 0, 0, 0, -1);

  if(moving){
    incX = (mouseX - prev.x) / 500 * Math.pow(1.001, Math.abs(incX));
    incY = (mouseY - prev.y) / 500 * Math.pow(1.001, Math.abs(incX));
  }

  rubik.show();
}

function keyPressed() {
  console.log(keyCode);
  if(keyCodes[keyCode] !== undefined){
    rubik.move(keyCodes[keyCode]);
  }
}

function mousePressed() {
  moving = true;
  prev.x = mouseX;
  prev.y = mouseY;
}
function mouseReleased() {
  moving = false;
  angX += incX;
  angY += incY;
  incX = 0;
  incY = 0;
}
function mouseWheel(event) {
  ampli += event.delta;
  return false; //prevent scrolling
}
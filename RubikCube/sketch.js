// var easycam;

var cubeW = 100;
var angle = 0;
var COLORS = [];
var COLORSDIC = {};
var moves = [];
var delayMoves = 60;
var t = 0;

var rubik;

var a,b,c,d,e;//debug

function setup() {
  createCanvas(1000, 1000, WEBGL);
  // console.log("hola");
  frameRate(30);
  COLORS = [
    //x
    color(255,0,0),//red
    color(245, 135, 66),//orange
    //y
    color(0, 144, 247),//blue
    color(0, 255, 0),//green
    //z
    color(255),//white
    color(247, 239, 0), //yellow
    color(50)//cubeColor
  ];
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
  
  rubik = new RubikCube(3);
  // a = new Edge();
  // a.setPos(createVector(0, 100, 100));
  // b = new Corner();
  // b.color = COLORS[3];
  // b.setPos(createVector(100, 100, 100));
}

function draw() {
  background(220);
  camera(500 * Math.sin(-angle), 500 * Math.cos(angle), 500 * Math.cos(angle), 0, 0, 0, 0, 0, -1);
  // camera(700 * Math.sin(-angle), 700 * Math.cos(angle), 700 , 0, 0, 0, 0, 0, -1);
  
  // angle = (Math.PI / 4);
  w = Math.PI / 180
  // w = Math.PI / 720
  angle = (angle - w);


  push();
  stroke(0);
  strokeWeight(3);
  fill(100, 100, 100);
  box(cubeW);
  pop();

  
  // a.show();
  // b.show();

  
  rubik.show();
  
  // if(t++ > delayMoves && moves.length > 0){
  //   t = 0;
  //   rubik.m(moves[0]);
  //   // moves.push(moves[0]);
  //   moves.splice(0,1);
  // }

  // noLoop();
}
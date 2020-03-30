/**
 * @author Jkutkut
 * @see https://github.com/Jkutkut/
 */
const mainCanvasWidth = 1920;
const mainCanvasHeight = 1080;

const secondCanvasWidth = 500;
const secondCanvasHeight = 500;

var rubik;
var COLORSDIC = {};


//Controls
var camX, camY, camZ;
var moving = false;
var prev = {x: 0, y: 0};//(x,y) mouse coord
var ampli = 1000;
var angX = 1.2 * 0.25 * Math.PI;
var angZ = 3.2 * 0.25 * Math.PI;
var incX = 0, incZ = 0;
var trueIncX = 0, trueIncZ = 0;

var look = [0, 0, 0];
var boxCoordBase = [0,0,0];
var boxCoordRela = [0,0,0];

var s1 = function( sketch ) {//main canvas
  sketch.setup = function() {
    let canvas1 = sketch.createCanvas(mainCanvasWidth, mainCanvasHeight, sketch.WEBGL);
    canvas1.position(0,0);
    sketch.frameRate(30);

    COLORSDIC = {
      //x
      RED: sketch.color(255,0,0),//red
      ORANGE: sketch.color(245, 135, 66),//orange
      //y
      BLUE: sketch.color(0, 144, 247),//blue
      GREEN: sketch.color(0, 255, 0),//green
      //z
      WHITE: sketch.color(255),//white
      YELLOW: sketch.color(247, 239, 0), //yellow
      CUBECOLOR: sketch.color(50),//cubeColor
      
      NULL: sketch.color(100)
    };
    // rubik = new RubikCube(2);
    rubik = new InvisibleRubikCube(5);
    // rubik = new RubikCube(5);
    // rubik = new MirrorRubikCube(null, color(255, 204 ,0))
  }
  sketch.draw = function() { //main canvas
    sketch.background(220);
    let mouseX = sketch.mouseX;
    let mouseY = sketch.mouseY;

    //camera Controls
    if(moving){
      incX = (mouseX - prev.x) / 500 * Math.pow(1.005, Math.abs(incX));
      incZ = (mouseY - prev.y) / 500 * Math.pow(1.001, Math.abs(incX));

      trueIncX = incX;
      trueIncZ = ((angZ + incZ) / Math.PI > 1)? Math.PI - angZ : ((angZ + incZ) < 0)? -angZ + 0.0001 : incZ;
    }

    camX =  ampli * Math.cos(angX + trueIncX) * Math.sin(angZ + trueIncZ);
    camY =  ampli * Math.sin(angX + trueIncX) * Math.sin(angZ + trueIncZ);
    camZ =  -ampli * Math.cos(angZ + trueIncZ);
    
    sketch.camera(camX, camY, camZ, 0, 0, 0, 0, 0, -1);
    
    //debug planes
    let pihalf = Math.PI / 2;
    let l = 1000;
    sketch.push();
    sketch.fill(sketch.color(200, 200, 0, 250));
    sketch.noStroke();
    sketch.push();
    sketch.rotateX(pihalf / 2);
    sketch.plane(l / 2, l);
    sketch.rotateX(-pihalf);
    sketch.plane(l / 2, l);
    sketch.pop();
    sketch.push();
    sketch.rotateY(pihalf / 2);
    sketch.plane(l, l / 2);
    sketch.rotateY(-pihalf);
    sketch.plane(l, l / 2);
    sketch.pop();
    sketch.push();
    sketch.rotateZ(pihalf / 2);
    sketch.rotateX(pihalf);
    sketch.plane(l, l / 2);
    sketch.rotateY(-pihalf);
    sketch.plane(l, l / 2);
    sketch.pop();
    sketch.pop();


    sketch.push();
    sketch.translate(...vector.addition(boxCoordBase, boxCoordRela.map(x => x * rubik.w)));
    sketch.box(rubik.w);
    sketch.pop();


    rubik.show();
    // sketch.noLoop();
  }


  sketch.lookingAt = function(){
    look = [];
    if(angZ / Math.PI > 0.75){
      console.log("White");
      look.push([0, 0, 1]);
    }
    else if(angZ / Math.PI < 0.25){
      console.log("Yellow");
      look.push([0, 0, -1]);
    }
    else{
      if(Math.abs(Math.cos(angX)) > Math.abs(Math.sin(angX))){
        if(Math.cos(angX) > 0){
          console.log("Orange");
          look.push([1, 0, 0]);
        }
        else{
          console.log("Red");
          look.push([-1, 0, 0]);
        }
      }
      else{
        if(Math.sin(angX) > 0){
          console.log("Blue");
          look.push([0, 1, 0]);
        }
        else{
          console.log("Green");
          look.push([0, -1, 0]);
        }
      }
    }

    let x = Math.cos(angX + trueIncX);
    let y = Math.sin(angX + trueIncX);
    x = (Math.abs(x) > Math.abs(y))? x : 0;
    y = (x == 0)? y : 0;
    look.push([Math.round(x), Math.round(y), 0]);
    return look;
  }

  //~~~~~~~~~~~~~~~~~~    CONTROLS    ~~~~~~~~~~~~~~~~~~
  sketch.keyPressed = function(){
    console.log(sketch.keyCode);
    // if(keyCodes[keyCode] !== undefined){
    //   rubik.move(keyCodes[keyCode]);
    // }
  }
  sketch.mousePressed = function(){
    sketch.cursor('grab');
    moving = true;
    prev.x = sketch.mouseX;
    prev.y = sketch.mouseY;
  }
  sketch.mouseReleased = function(){
    sketch.cursor();
    moving = false;
    angX += trueIncX;
    angZ += trueIncZ;

    incX = 0;
    incZ = 0;
    trueIncX = 0;
    trueIncZ = 0;
    // sketch.lookingAt();

    secondCanvas.update();
  }
  sketch.mouseWheel = function(){
    try{
      if(ampli > rubik.w * rubik.dim){
        ampli += event.delta;
      }
      else if(event.delta > 0){
        ampli += event.delta;
      }
      else{
        ampli = rubik.w * rubik.dim;
      }
    }
    catch(error){
      ampli += event.delta;
    }
    return false; //prevent scrolling
  }
};

var s2 = function(sketch) {

   sketch.setup = function() {
    let canvas2 = sketch.createCanvas(secondCanvasWidth, secondCanvasHeight, sketch.WEBGL);
    canvas2.position(mainCanvasWidth - secondCanvasWidth, mainCanvasHeight - secondCanvasHeight);
    sketch.frameRate(5);
    sketch.camera(0, 1, rubik.w * rubik.dim * 2, 0, 0, 0, 0, 0, -1);
    sketch.update();
  }
  sketch.draw = function() {
    sketch.background(200);

    if(sketch.mouseX > 0 && sketch.mouseY > 0 &&
      sketch.mouseX < secondCanvasWidth && sketch.mouseY < secondCanvasHeight){
      let x = Math.floor(sketch.mouseX / (secondCanvasWidth / rubik.dim));
      let y = Math.floor(sketch.mouseY / (secondCanvasHeight / rubik.dim));
      
      printArray_nD(look);

      
      // printArray_nD([x, y]);
      let dX, dY, dZ;
      if(look[0][2] == 0){//horizontal
        dX = (look[0][0] == 0)? (x - Math.floor(rubik.dim / 2)) * ((look[0][1] == -1)? -1 : 1) : 0;
        dY = (look[0][1] == 0)? (x - Math.floor(rubik.dim / 2)) * ((look[0][0] == 1)? -1 : 1) : 0;
        dZ = -(y - Math.floor(rubik.dim / 2));
      }
      else{//yellow or white
        if(look[1][0] == 0){
          dX = (x - Math.floor(rubik.dim / 2)) * look[1][1];
          dY = (y - Math.floor(rubik.dim / 2)) * look[1][1];
        }
        else if(look[1][1] == 0){
          dX =  (y - Math.floor(rubik.dim / 2)) * ((look[0][2] == -1)? -1 : 1) * look[1][0];
          dY = -(x - Math.floor(rubik.dim / 2)) * ((look[0][2] == -1)? -1 : 1) * look[1][0];
        }
        dY *= look[0][2];//invert move if on bottom face
        dZ = 0;
      }
      boxCoordRela = [dX, dY, dZ];

      sketch.push();
      sketch.translate(...vector.addition(boxCoordBase, boxCoordRela.map(x => x * rubik.w)));
      sketch.box(rubik.w);
      sketch.pop();
      
    }
    rubik.show(secondCanvas);
    // sketch.noLoop();
  }

  sketch.update = function(){
    let look = mainCanvas.lookingAt();
    let dist = rubik.w * rubik.dim;
    let coord = vector.addition(look[0].map(x => x * dist * 1.4), look[1]);
    sketch.camera(...coord, 0, 0, 0, 0, 0, -1);

    boxCoordBase = look[0].map(x => x * rubik.w * Math.floor(rubik.dim / 2));
  }

  sketch.mouseOver = function(){
    console.log("in")
  }
};


// create a new instance of p5 and pass in the function for sketch 1 and 2
var mainCanvas = new p5(s1);
var secondCanvas = new p5(s2);
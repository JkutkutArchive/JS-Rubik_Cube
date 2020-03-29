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
var moving = false;
var prev = {x: 0, y: 0};//(x,y) mouse coord
var ampli = 1000;
var angX = -0.25 * Math.PI;
var angZ = 0.5 * Math.PI;
var incX = 0, incZ = 0;

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

    let camX = -ampli * Math.sin(angX + incX);
    let camY = ampli * Math.cos(angX + incX);
    let camZ = ampli * Math.sin(angZ + incZ);
    
    sketch.camera(camX, camY, camZ, 0, 0, 0, 0, 0, -1);

    let mouseX = sketch.mouseX;
    let mouseY = sketch.mouseY;
    
    //camera Controls
    if(moving){
      incX = (mouseX - prev.x) / 500 * Math.pow(1.005, Math.abs(incX));
      incZ = (mouseY - prev.y) / 500 * Math.pow(1.001, Math.abs(incX));
    }
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



    // let offset = 0;
    // let coordH = Math.round((mouseX - mainCanvasWidth / 2) / rubik.w) - offset;
    // let coordV = -Math.round((mouseY - mainCanvasHeight / 2) / rubik.w) - offset;
    // if(Math.abs(coordH) < rubik.dim * 0.5 && Math.abs(coordV) < rubik.dim * 0.5){
    //   if(Math.abs(angZ) > Math.PI / 4){ //CHECK FACE
    //     
    //   }
      
    // }
    rubik.show();
    // sketch.noLoop();
  }


  sketch.lookingAt = function(){
    let look = [];
    if(Math.abs(angZ) > Math.PI / 3.5){
      if(angZ > 0){
        console.log("White");
        look.push([0, 0, 1]);
      }
      else{
        console.log("Yellow");
        look.push([0, 0, -1]);
      }
    }
    else{
      if(Math.abs(Math.sin(angX)) > Math.abs(Math.cos(angX))){
        if(Math.sin(angX) < 0){
          console.log("Orange");
          look.push([1, 0, 0]);
        }
        else{
          console.log("Red");
          look.push([-1, 0, 0]);
        }
      }
      else{
        if(Math.cos(angX) > 0){
          console.log("Blue");
          look.push([0, 1, 0]);
        }
        else{
          console.log("Green");
          look.push([0, -1, 0]);
        }
      }
    }

    look.push([-Math.round(Math.sin(angX + incX)), Math.round(Math.cos(angX + incX)), 0]);
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
    angX += incX % Math.PI;
    angZ += (incZ % Math.PI);
    incX = 0;
    incZ = 0;
    sketch.lookingAt();

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
    sketch.background(200);
  }
  sketch.draw = function() {
    sketch.noLoop();
  }

  sketch.update = function(){
    let look = mainCanvas.lookingAt();
    let dist = rubik.w * rubik.dim;

    let coord = vector.addition(look[0].map(x => x * dist * 2), look[1]);

    console.log(coord);

    sketch.camera(...coord, 0, 0, 0, 0, 0, -1);
    // printArray_nD(look.map(x => x * dist));
    sketch.background(200);

    rubik.show(secondCanvas);
  }
};


// create a new instance of p5 and pass in the function for sketch 1 and 2
var mainCanvas = new p5(s1);
var secondCanvas = new p5(s2);
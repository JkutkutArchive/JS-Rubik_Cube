/**
 * @author Jkutkut
 * @see https://github.com/Jkutkut/
 */
const mainCanvasWidth = 1920;
// const mainCanvasWidth = 720;
const mainCanvasHeight = 1080;
// const mainCanvasHeight = 480;

const secondCanvasWidth = 500;
// const secondCanvasWidth = mainCanvasWidth * 0.260417;
const secondCanvasHeight = 500;
// const secondCanvasHeight = secondCanvasWidth;

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


var selectingMove = false;
var startMove = {x: 0, y: 0};//select move start coord

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
      INVERSECUBECOLOR: sketch.color(255 - 50),
      NULL: sketch.color(100),

    };
    // rubik = new RubikCube(4);
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
      incX = (mouseX - prev.x) / mainCanvasWidth * Math.pow(1.005, Math.abs(incX));
      incZ = (mouseY - prev.y) / mainCanvasHeight * Math.pow(1.001, Math.abs(incX));

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
    // sketch.push();
    // sketch.fill(sketch.color(200, 200, 0, 250));
    // sketch.noStroke();
    // sketch.push();
    // sketch.rotateX(pihalf / 2);
    // sketch.plane(l / 2, l);
    // sketch.rotateX(-pihalf);
    // sketch.plane(l / 2, l);
    // sketch.pop();
    // sketch.push();
    // sketch.rotateY(pihalf / 2);
    // sketch.plane(l, l / 2);
    // sketch.rotateY(-pihalf);
    // sketch.plane(l, l / 2);
    // sketch.pop();
    // sketch.push();
    // sketch.rotateZ(pihalf / 2);
    // sketch.rotateX(pihalf);
    // sketch.plane(l, l / 2);
    // sketch.rotateY(-pihalf);
    // sketch.plane(l, l / 2);
    // sketch.pop();
    // sketch.pop();


    // sketch.push();
    // sketch.fill(COLORSDIC.INVERSECUBECOLOR);
    // sketch.translate(...vector.addition(boxCoordBase, boxCoordRela.map(x => x * rubik.w)));
    // sketch.box(rubik.w);
    // sketch.pop();


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
          // console.log("Orange");
          look.push([1, 0, 0]);
        }
        else{
          // console.log("Red");
          look.push([-1, 0, 0]);
        }
      }
      else{
        if(Math.sin(angX) > 0){
          // console.log("Blue");
          look.push([0, 1, 0]);
        }
        else{
          // console.log("Green");
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
    if(!secondCanvas.inBounds()){
      sketch.cursor('grab');
      moving = true;
      prev.x = sketch.mouseX;
      prev.y = sketch.mouseY;
    }
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
  /**
   * Setup of the second sketch.
   */
   sketch.setup = function() {
    let canvas2 = sketch.createCanvas(secondCanvasWidth, secondCanvasHeight, sketch.WEBGL); //make canvas
    canvas2.position(mainCanvasWidth - secondCanvasWidth, mainCanvasHeight - secondCanvasHeight); //set canvas pos
    sketch.frameRate(15); //set frameRate
    sketch.update(); //Update the canvas
  }
  /**
   * Second canvas Draw.
   */
  sketch.draw = function() {
    sketch.background(200);
    if(!selectingMove){ //if not on selecting move
      if(sketch.inBounds()){ //if on bounds, get the coords of the facing piece
        let x = Math.floor(sketch.mouseX / (secondCanvasWidth / rubik.dim));
        let y = Math.floor(sketch.mouseY / (secondCanvasHeight / rubik.dim));        
        let dX, dY, dZ;
        if(look[0][2] == 0){ //looking at horizontal face
          dX = (look[0][0] == 0)? (x - Math.floor(rubik.dim / 2)) * ((look[0][1] == -1)? -1 : 1) : 0;
          dY = (look[0][1] == 0)? (x - Math.floor(rubik.dim / 2)) * ((look[0][0] == 1)? -1 : 1) : 0;
          dZ = -(y - Math.floor(rubik.dim / 2));
        }
        else{ //looking at yellow or white face
          if(look[1][0] == 0){
            dX = (x - Math.floor(rubik.dim / 2)) * look[1][1];
            dY = (y - Math.floor(rubik.dim / 2)) * look[1][1];
          }
          else if(look[1][1] == 0){
            dX =  (y - Math.floor(rubik.dim / 2)) * ((look[0][2] == -1)? -1 : 1) * look[1][0];
            dY = -(x - Math.floor(rubik.dim / 2)) * ((look[0][2] == -1)? -1 : 1) * look[1][0];
          }
          dY *= look[0][2];//invert move if on bottom face (-1) or do nothing (1)
          dZ = 0;
        }
        boxCoordRela = [dX, dY, dZ];
      }
      else{ //if not in bounds
        boxCoordBase = [0, 0, 0]; //Reset relative position
      }
    }
    else{//if selecting a move
      if(!sketch.mouseIsPressed){
        startMove = false;
      }
    }
    rubik.show(secondCanvas);
  }

  /**
   * If mouse on bounds, starts the movement mode.
   */
  sketch.mousePressed = function(){
    if(sketch.inBounds()){ //Only if mouse on bounds
      selectingMove = true; //Start the movement mode
      startMove = {x: sketch.mouseX, y: sketch.mouseY}; //Save the initial coordinates of the mouse
      }
  }

  /**
   * If movement made, analice that move and perform it
   */
  sketch.mouseReleased = function(){
    if(!selectingMove || !Number.isInteger(startMove.x) || !Number.isInteger(startMove.x)){
      return; //if not selecting a move or not correct array, do not continue
    }

    let delta = {x: sketch.mouseX - startMove.x, y: sketch.mouseY - startMove.y};
    if(Math.max(Math.abs(delta.x), Math.abs(delta.y)) < rubik.w){
      return;//If move length small (less than one cube), do not do it
    }
    //If here, correct selection of move made
    selectingMove = false; //Selecting move ended

    //analize the move
    let m = {x: 0, y: 0}; //Mouse coordinates index (top = {0, 0}, botom = {rubik.dim - 1, rubik.dim - 1})
    m.x = Math.floor(startMove.x / secondCanvasWidth * rubik.dim);
    m.y = Math.floor(startMove.y / secondCanvasHeight * rubik.dim);
    let moveMade = sketch.movementMade(delta.x, delta.y); //[right (1) or left (-1), up (1) or down (-1)]
    
    let axis, h, inverted;
    let isBlue, isOrange;
    let isHoriMove, hSmall, hBigOrSmall, preInverted;
    
    isHoriMove = moveMade[0] != 0; //true => Right or left (1, -1) move of the mouse. false => Up or down (1, -1) move of the mouse
    hSmall = function(h){return h < (rubik.dim - rubik.dim % 2) / 2};
    preInverted = (isHoriMove)? moveMade[0] == 1 : moveMade[1] == 1; //used to calc inverted
    let v = (isHoriMove)? m.y : m.x; //Used later to calc h

    if(look[0][2] == 0){ //horizontal faces
      if(isHoriMove){ //Right or left (1, -1) move of the mouse
        axis = "z";
        h = v;
        inverted = hSmall(h) == (moveMade[0] == 1);//xnor(hSmall, moveMade[0] == 1)
      }
      else{ //moveMade[1] != 0 => Up or down (1, -1) move of the mouse
        axis = (look[0][0] != 0)? "y" : "x";
        h = (look[0][0] == 1 || look[0][1] == -1)? v : rubik.dim - 1 - v; //if rotation on y axis, index is inverted
        inverted = hSmall(h) != (moveMade[1] == -1);// XOR (hSmall, (moveMade[1] == -1))
        inverted = (look[0][0] == 1 || look[0][1] == -1) != inverted;//XOR(special cases, inverted)
      }
    }
    else if(look[0][2] == 1){ //White face
      if(look[1][1] != 0){ //over blue or green
        isBlue = look[1][1] == 1; //is over blue face
        h = (isBlue)? rubik.dim - 1 - v : v;
        hBigOrSmall = (isBlue == isHoriMove) != hSmall(h); //xOr(xnOr(isBlue, isHoriMove), hSmall)
        axis = (isHoriMove)? "y" : "x"; //axis of movement
        inverted = !(hBigOrSmall != preInverted); //Invert preInverted if hBigOrSmall is true (it is inverted because inverted works :S)
      }
      else{ //over orange or red face (look[1][0] != 0)
        isOrange = look[1][0] == 1; //if over orange face
        h = (isHoriMove == isOrange)? rubik.dim - 1 - v : v;//xnor condition
        axis = (isHoriMove)? "x" : "y"; //axis of movement
        inverted = (isOrange == hSmall(h)) != preInverted; //XOR(XNOR(isOrange, hSmall), preInverted);
      }
    }
    else{ //Yellow face      
      if(look[1][1] != 0){ //under blue or green
        isBlue = look[1][1] == 1; //is under blue face
        axis = (isHoriMove)? "y" : "x"; //axis of movement
        h = (isBlue != isHoriMove)? rubik.dim - 1 - v : v;
        hBigOrSmall = isBlue != hSmall(h);
        inverted = hBigOrSmall != preInverted; //Invert preInverted if hBigOrSmall is true
      }
      else{ //under orange or red face (look[1][0] != 0)
        isOrange = look[1][0] == 1; //if under orange face
        axis = (isHoriMove)? "x" : "y"; //axis of movement
        h = (isOrange)? v : rubik.dim - 1 - v;
        hBigOrSmall = (isOrange == isHoriMove) != hSmall(h);
        inverted = hBigOrSmall != preInverted; //Invert preInverted if hBigOrSmall is true
      }
    }
    startMove = {x: null, y: null}; //Reset start move
    rubik.makeMove(axis, h, inverted); //makeMove(axis, h, inverse)
  }

  /**
   * Updates the canvas and stores the coord of the face facing
   */
  sketch.update = function(){ 
    let look = mainCanvas.lookingAt();
    let cameraCoord = vector.addition(look[0].map(x => x * rubik.w * rubik.dim * 1.4), look[1]); //camera Coordinates
    sketch.camera(...cameraCoord, 0, 0, 0, 0, 0, -1);
    boxCoordBase = look[0].map(x => x * rubik.w * Math.floor(rubik.dim / 2)); //coordinates of the center of the face facing
  }

  /**
   * Given the params, calc what type of movement has been done
   * @see increment is defined as deltaX = finalCoord.x - initialCoord.x;
   * @param {number} deltaX - The increment of the mouse on the X (Horizontal) axis.
   * @param {number} deltaY - The increment of the mouse on the Y (Vertical) axis.
   * @returns {number[]} Array with the movement made; [x, y],, if negative => oposite position
   */
  sketch.movementMade = function(deltaX, deltaY){
    let moveMade = [0, 0];//[right (1) or left (-1), up (1) or down (-1)]
    if(Math.abs(deltaX) > Math.abs(deltaY)){
      moveMade[0] = (deltaX > 0)? 1 : -1; //1 => Right; -1 => Left
    }
    else{
      moveMade[1] = (deltaY > 0)? 1 : -1; //1 => Up; -1 => Down
    }
    return moveMade;
  }

  /**
   * Returns whenever the mouse is in bounds
   * @return {boolean} (0 < mouseX < width and 0 < mouseY < height)
   */
  sketch.inBounds = function(){
    return sketch.mouseX > 0 && sketch.mouseY > 0 && sketch.mouseX < secondCanvasWidth && sketch.mouseY < secondCanvasHeight;
  }
};

// create a new instance of p5 and pass in the function for sketch 1 and 2
var mainCanvas = new p5(s1);
var secondCanvas = new p5(s2);
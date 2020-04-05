/**
 * @author Jkutkut
 * @see https://github.com/Jkutkut/
 */
// var mainCanvasWidth = 1920;
var mainCanvasWidth;
var mainCanvasHeight;
var secondCanvasWPercent = 0.25;
var secondCanvasWidth; //square Canvas

var rubik; //Here the cube will be stored
var COLORSDIC = {}; //Diccionary with the colors used at this project


//Canvas 1
var ampli = 1000; //Initial amplitude of the movement / distace in every axis
var camX, camY, camZ; //Coordinates of the camera.
var moving = false; //Whenever a movement of the camera is happening.
var iniMousePos = {x: 0, y: 0};//(x,y) initial mouse coord (used to move camera)
var angX = 1.2 * 0.25 * Math.PI; //Angle for X and Y camCoordinates
var angZ = 3.2 * 0.25 * Math.PI; //Angle for Z camCoordinate
var deltaMoveCam = {h: 0, v: 0}; //increment on the Horizontal and Vertical Axis when doing a move
var trueIncX = 0, trueIncZ = 0; //True increment on those axis


//Canvas 2
var selectingMove = false;
var startMove; //diccionary to select move start coord {x: 0, y: 0}
var look; //Double array with the axis looking to at Canvas 1 => Canvas 2
var boxCoordBase = [0,0,0]; //Coord of the Center of that face
var boxCoordRela = [0,0,0]; //Coord relative from there

var s1 = function( sketch ) {//main canvas
  /**
   * Setup of the Canvas 1
   */
  sketch.setup = function() {
    mainCanvasWidth = (mainCanvasWidth)? mainCanvasWidth : sketch.windowWidth;
    mainCanvasHeight = (mainCanvasHeight)? mainCanvasHeight : mainCanvasWidth * 9 / 16;
    let canvas1 = sketch.createCanvas(mainCanvasWidth, mainCanvasHeight, sketch.WEBGL); //Create the canvas
    canvas1.position(0,0); //Set canvas (left corner) position
    sketch.frameRate(30); //Set frameRate

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
      NULL: sketch.color(100)
    };
    rubik = new RubikCube(3); //create the cube
    // rubik = new MirrorRubikCube();
    secondCanvasWidth = mainCanvasWidth * secondCanvasWPercent; //to make the second canvas
    secondCanvas = new p5(s2); //create the second canvas
  }

  /**
   * Draw of the Canvas 1
   */
  sketch.draw = function() { //main canvas
    sketch.background(220);
    if(moving){ //if moving the camera: camera Controls 
      deltaMoveCam.h = (sketch.mouseX - iniMousePos.x) / mainCanvasWidth * Math.pow(1.005, Math.abs(deltaMoveCam.h));
      deltaMoveCam.v = (sketch.mouseY - iniMousePos.y) / mainCanvasHeight * Math.pow(1.001, Math.abs(deltaMoveCam.v));
      trueIncX = deltaMoveCam.h; //true deltaMoveCam.h
      trueIncZ = ((angZ + deltaMoveCam.v) / Math.PI > 1)? Math.PI - angZ : ((angZ + deltaMoveCam.v) < 0)? -angZ + 0.0001 : deltaMoveCam.v;
    }
    camX =  ampli * Math.cos(angX + trueIncX) * Math.sin(angZ + trueIncZ);
    camY =  ampli * Math.sin(angX + trueIncX) * Math.sin(angZ + trueIncZ);
    camZ =  -ampli * Math.cos(angZ + trueIncZ);
    sketch.camera(camX, camY, camZ, 0, 0, 0, 0, 0, -1); //Set camera at position
    rubik.show();
  }
  /**
   * Calculates the position looking to at the cube
   * @returns {number[][]} [[Position of the center of the face facing], [Same with the increment]]
   */
  sketch.lookingAt = function(){
    look = [];
    if(angZ / Math.PI > 0.75){
      look.push([0, 0, 1]); //White
    }
    else if(angZ / Math.PI < 0.25){
      look.push([0, 0, -1]); //Yellow
    }
    else{
      if(Math.abs(Math.cos(angX)) > Math.abs(Math.sin(angX))){
        look.push([(Math.cos(angZ) > 0)? 1 : -1, 0, 0]); //1 => Orange, -1 => Red
      }
      else{
        look.push([0, (Math.cos(angX) > 0)? 1 : -1, 0]); //1 => Blue, -1 => Green
      }
    }
    let x = Math.cos(angX + trueIncX);
    let y = Math.sin(angX + trueIncX);
    x = (Math.abs(x) > Math.abs(y))? x : 0; //Keep only the one with the greatest magnitude
    y = (x == 0)? y : 0;
    look.push([Math.round(x), Math.round(y), 0]); //Where the angle tells the camera is looking with the increment
    return look;
  }

  //~~~~~~~~~~~~~~~~~~    CONTROLS    ~~~~~~~~~~~~~~~~~~
  /**
   * If mouse on the canvas, start movement of the camera
   */
  sketch.mousePressed = function(){
    if(!secondCanvas.inBounds()){
      sketch.cursor('grab'); //Change mouse icon
      moving = true; //Start movement of the camera
      iniMousePos = {x: sketch.mouseX, y: sketch.mouseY}; //Get initial position
    }
  }
  /**
   * End camera movement. Save new position + update 2º Canvas
   */
  sketch.mouseReleased = function(){
    sketch.cursor(); //Set cursor to normal
    moving = false; //Stop movement
    angX += trueIncX; //Save the increment on the angle
    angZ += trueIncZ; //Save the increment on the angle
    deltaMoveCam = {h: 0, v: 0}; //Reset increment
    trueIncX = 0; //Reset increment
    trueIncZ = 0; //Reset increment
    secondCanvas.update(); //update the second canvas with the new position
  }
  /**
   * Enables to zoom in and out on the 1º Canvas
   */
  sketch.mouseWheel = function(){
    try{
      if(secondCanvas.inBounds()){
        return false; //stop if mouse on second canvas
      }
      if(ampli > rubik.w * rubik.dim){ //If zoom in but far enough to not collapse with the cube
        ampli += event.delta; 
      }
      else if(event.delta > 0){ //If zoom out
        ampli += event.delta;
      }
      else{
        ampli = rubik.w * rubik.dim; //set zoom to min possible
      }
    }
    catch(error){
      console.log(error);
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
    let canvas2 = sketch.createCanvas(secondCanvasWidth, secondCanvasWidth, sketch.WEBGL); //make canvas
    canvas2.position(mainCanvasWidth - secondCanvasWidth, mainCanvasHeight - secondCanvasWidth); //set canvas pos
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
        let y = Math.floor(sketch.mouseY / (secondCanvasWidth / rubik.dim));        
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
        selectingMove = false;
        console.log("not pressed anymore")
      }
    }
    rubik.show(secondCanvas);
  }

  /**
   * If mouse on bounds, starts the movement mode.
   */
  sketch.mousePressed = function(){
    if(sketch.inBounds()){ //Only if mouse on bounds
      sketch.cursor('grab'); //Change mouse icon
      selectingMove = true; //Start the movement mode
      console.log("move started");
      startMove = {x: sketch.mouseX, y: sketch.mouseY}; //Save the initial coordinates of the mouse
      }
  }

  /**
   * If movement made, analice that move and perform it
   */
  sketch.mouseReleased = function(){
    sketch.cursor(); //Reset mouse icon
    console.log(startMove);
    if(!selectingMove || typeof(startMove.x) != "number" || typeof(startMove.x) != "number"){
      return; //if not selecting a move or not correct array, do not continue
    }

    let delta = {x: sketch.mouseX - startMove.x, y: sketch.mouseY - startMove.y};
    if(Math.max(Math.abs(delta.x), Math.abs(delta.y)) < secondCanvasWidth / rubik.dim){
      return;//If move length small (less than one cube), do not do it
    }
    //If here, correct selection of move made
    selectingMove = false; //Selecting move ended

    //analize the move
    let m = {x: 0, y: 0}; //Mouse coordinates index (top = {0, 0}, botom = {rubik.dim - 1, rubik.dim - 1})
    m.x = Math.floor(startMove.x / secondCanvasWidth * rubik.dim);
    m.y = Math.floor(startMove.y / secondCanvasWidth * rubik.dim);
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

  //~~~~~~~~~~~~~~~~~~    CONTROLS    ~~~~~~~~~~~~~~~~~~
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
    return sketch.mouseX > 0 && sketch.mouseY > 0 && sketch.mouseX < secondCanvasWidth && sketch.mouseY < secondCanvasWidth;
  }

  /**
   * Enables to zoom in and out on the 1º Canvas
   */
  sketch.mouseWheel = function(){
    try{
      if(!sketch.inBounds()){
        return false; //stop if mouse on main canvas
      }
      let increment = -1 * event.delta / 5000;
      console.log(secondCanvasWPercent);
      if(secondCanvasWPercent > 0.1){ //If zoom in but far enough to not collapse with the cube
        secondCanvasWPercent += increment; 
      }
      else if(increment > 0){ //If zoom out
        secondCanvasWPercent += increment;
      }
      else if(secondCanvasWPercent < 0.365){ //if zoom out but less than max
        secondCanvasWPercent += increment;
      }
      secondCanvasWPercent = (secondCanvasWPercent < 0.1)? 0.1 : secondCanvasWPercent; //set zoom to min possible if minor
      secondCanvasWPercent = (secondCanvasWPercent > 0.365)? 0.365 : secondCanvasWPercent; //set zoom to min possible if minor

      secondCanvasWidth = mainCanvasWidth * secondCanvasWPercent;
      sketch.setup();
    }
    catch(error){
      console.log(error);
    }
    return false; //prevent scrolling
  }
};

// create a new instance of p5 and pass in the function for sketch 1 and 2
var mainCanvas = new p5(s1);
var secondCanvas; //Defined at the end of mainCanvas.setup
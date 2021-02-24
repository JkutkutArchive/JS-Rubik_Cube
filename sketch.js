/**
 * @author Jkutkut
 * @see https://github.com/Jkutkut/
 */

var mainCanvas, secondCanvas; //here the canvas are stored

var rubik; //Here the cube will be stored
var COLORSDIC = {}; //Diccionary with the colors used at this project
var rubikType = "normal";
var rubikDim = 3;

//Canvas 1
var canvasImg = {}; //Main menu imgs 
var mainCanvasWidth;
var mainCanvasHeight;
var ampli = 700; //Initial amplitude of the movement / distace in every axis
var camX, camY, camZ; //Coordinates of the camera.
var moving = false; //Whenever a movement of the camera is happening.
var iniMousePos = {x: 0, y: 0};//(x,y) initial mouse coord (used to move camera)
var angX = 0.25 * Math.PI; //Angle for X and Y camCoordinates
var angZ = 3 * 0.25 * Math.PI; //Angle for Z camCoordinate
var deltaMoveCam = {h: 0, v: 0}; //increment on the Horizontal and Vertical Axis when doing a move
var trueIncX = 0, trueIncZ = 0; //True increment on those axis


//Canvas 2
var secondCanvasWPercent = 0.25;
var secondCanvasWidth; //square Canvas
var selectingMove = false;
var startMove; //diccionary to select move start coord {x: 0, y: 0}
var look; //Double array with the axis looking to at Canvas 1 => Canvas 2
var boxCoordBase = [0,0,0]; //Coord of the Center of that face
var boxCoordRela = [0,0,0]; //Coord relative from there


var s1 = function(sketch) {//main canvas
  /**
   * Preload all images.
   */
  sketch.preload = function() {    
    canvasImg.bg = sketch.loadImage('https://raw.githubusercontent.com/Jkutkut/JS-Rubik_Cube/master/assets/img/mainBG.jpg');
    canvasImg.title = sketch.loadImage('https://raw.githubusercontent.com/Jkutkut/JS-Rubik_Cube/master/assets/img/title.png');
    canvasImg.selectTC = sketch.loadImage('https://raw.githubusercontent.com/Jkutkut/JS-Rubik_Cube/master/assets/img/select-type-cube.png');
    canvasImg.normal = sketch.loadImage('https://raw.githubusercontent.com/Jkutkut/JS-Rubik_Cube/master/assets/img/cube-3x3.jpg');
    canvasImg.mirror = sketch.loadImage('https://raw.githubusercontent.com/Jkutkut/JS-Rubik_Cube/master/assets/img/cube-mirror.jpg');
    canvasImg.invisible = sketch.loadImage('https://raw.githubusercontent.com/Jkutkut/JS-Rubik_Cube/master/assets/img/cube-invisible.jpg');
    canvasImg.stickerless = sketch.loadImage('https://raw.githubusercontent.com/Jkutkut/JS-Rubik_Cube/master/assets/img/cube-stickerless.jpg');
    canvasImg.start = sketch.loadImage('https://raw.githubusercontent.com/Jkutkut/JS-Rubik_Cube/master/assets/img/start-icon.png')
    
    canvasImg.github = sketch.loadImage('https://image.flaticon.com/icons/svg/25/25231.svg');
  }
  /**
   * Setup of the Canvas 1
   */
  sketch.setup = function() {
    mainCanvasWidth = (mainCanvasWidth)? mainCanvasWidth : sketch.windowWidth;
    mainCanvasHeight = (mainCanvasHeight)? mainCanvasHeight : mainCanvasWidth * 9 / 16;
    sketch.createCanvas(mainCanvasWidth, mainCanvasHeight); //Create the canvas
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
      MIRRORBODY: sketch.color(0, 0, 153),
      NULL: sketch.color(100)
    };
  }

  /**
   * Draw of the Canvas 1, see startGame() to see the logic on the game
   */
  sketch.draw = function() { //main canvas
    sketch.background(canvasImg.bg);
    //title label
    sketch.image(canvasImg.title, ...sketch.relativePos([510, 60, 900, 230]));
    //select type cube label
    sketch.image(canvasImg.selectTC, ...sketch.relativePos([560, 320, 800, 100]));

    // mode selector frame
    sketch.fill(0);
    if(rubikType == "normal"){
      sketch.rect(...sketch.relativePos([455-10, 480-10, 200+20, 200+20]));
    }
    else if(rubikType == "mirror"){
      sketch.rect(...sketch.relativePos([725-10, 480-10, 200+20, 200+20]));
    }
    else if(rubikType == "invisible"){
      sketch.rect(...sketch.relativePos([995-10, 480-10, 200+20, 200+20]));
    } 
    else if(rubikType == "stickerless"){
      sketch.rect(...sketch.relativePos([1265-10, 480-10, 200+20, 200+20]));
    } 
    
    //modes imgs
    sketch.image(canvasImg.normal, ...sketch.relativePos([455, 480, 200, 200]));
    sketch.image(canvasImg.mirror, ...sketch.relativePos([725, 480, 200, 200]));
    sketch.image(canvasImg.invisible, ...sketch.relativePos([995, 480, 200, 200]));
    sketch.image(canvasImg.stickerless, ...sketch.relativePos([1265, 480, 200, 200]));

    //dim label
    if(rubikType != "mirror"){
      sketch.fill(255);
      sketch.textSize(40);
      let texto = rubikDim + "x" + rubikDim + "x" + rubikDim;
      let diff = 110000 / mainCanvasWidth;
      sketch.text(texto, ...sketch.relativePos([960-diff, 800]));
    }
    
    sketch.image(canvasImg.start, ...sketch.relativePos([885, 850, 150, 150]));//start btn
    sketch.image(canvasImg.github, ...sketch.relativePos([1800, 960, 100, 100]));//github Icon
  }

  /**
   * Handles when clicked on the main menu.
   */
  sketch.mousePressed = function(){
    let gitCoord = sketch.relativePos([1800, 960, 1900, 1060]); //Coordinates of the github icon with the current window size
    let mC = {
      x: [455, 725, 995, 1265, 200].map(x => x * mainCanvasWidth / 1920), //modes coord + boxSize
      y: [480, 680].map(x => x * mainCanvasHeight / 1080)
    }
    let startCoord = sketch.relativePos([905, 850, 1155, 1000]);
    if(sketch.mouseX >= gitCoord[0] && sketch.mouseY >= gitCoord[1] &&
       sketch.mouseX <= gitCoord[2] && sketch.mouseY <= gitCoord[3] ){ //Github
      window.open('https://github.com/Jkutkut');
    }
    else if(sketch.mouseY >= mC.y[0] && sketch.mouseY <= mC.y[1]){ //Modes
      if(sketch.mouseX >= mC.x[0] && sketch.mouseX <= mC.x[0] + mC.x[4]){
        rubikType = "normal";
      }
      else if(sketch.mouseX >= mC.x[1] && sketch.mouseX <= mC.x[1] + mC.x[4]){
        rubikType = "mirror";
      }
      else if(sketch.mouseX >= mC.x[2] && sketch.mouseX <= mC.x[2] + mC.x[4]){
        rubikType = "invisible";
      }
      else if(sketch.mouseX >= mC.x[3] && sketch.mouseX <= mC.x[3] + mC.x[4]){
        rubikType = "stickerless";
      }
    }
    else if(sketch.mouseX >= startCoord[0] && sketch.mouseY >= startCoord[1] &&
            sketch.mouseX <= startCoord[2] && sketch.mouseY <= startCoord[3] ){ //start btn
      sketch.startGame();
    }
  }

  /**
   * Changes the cube's dimension (3x3x3, 4x4x4...).
   */
  sketch.mouseWheel = function(){
    if(event.delta < 0){
      rubikDim++;
    }
    else{
      rubikDim--;
    }
    if(rubikDim < 2){
      rubikDim = 2;
    }
  }

  /**
   * Get the equivalent coordinates of a 1920x1080 canvas with the current window size.
   * @param {number[]} arr - array with 2n elements.
   * @returns {number[]} array with the fixed coordinates.
   */
  sketch.relativePos = function(arr){
    let newArr = [];
    for(let i = 0; i < arr.length; i += 2){
        newArr.push(arr[i] * mainCanvasWidth / 1920);
        newArr.push(arr[i + 1] * mainCanvasHeight / 1080);
    }
    return newArr;
  }

  /**
   * This function starts the game:
   * - Create the rubik object based on the parametres.
   * @see rubikType and rubikDim
   * 
   * - Shuffle the cube.
   * - Create the new 3DCanvas with the desired framerate.
   * - Add the functions to make the game work: draw, lookingAt, mousePressed, mouseReleased and mouseWheel.
   * - Create the second canvas for controls.
   */
  sketch.startGame = function(){
    switch(rubikType){ //Init rubik:
      case "normal":
        rubik = new RubikCube(rubikDim);
        break;
      case "stickerless":
        rubik = new StickerlessRubikCube(rubikDim);
        break;
      case "invisible":
        rubik = new InvisibleRubikCube(rubikDim);
        break;
      case "mirror":
        rubik = new MirrorRubikCube(false, COLORSDIC.MIRRORBODY);
        break;
    }

    // Shuffle:
    // for(let i = 0; i < rubik.dim * 8; i++){
    //   //Move a random axis, at a random level/height, on a random direction of rotation.
    //   rubik.makeMove(Math.floor(Math.random() * 3), Math.floor(Math.random() * rubik.dim), Math.random() >= 0.5);
    // }

    sketch.createCanvas(mainCanvasWidth, mainCanvasHeight, sketch.WEBGL); //Create the canvas
    sketch.frameRate(30); //Set frameRate
    ampli = Math.pow(2, 0.25*rubik.dim) * 300;

    //-------------------   Addition of the code to run the game   -------------------
    sketch.draw = function(){
      sketch.background(sketch.color(0, 204, 255));

      let multiplier
      let invertedView = 0;

      let scaleFactorCameraMovement = {h:  Math.pow(1.005, Math.abs(deltaMoveCam.h)) * 2, v: Math.pow(1.001, Math.abs(deltaMoveCam.v)) * 2};

      if(moving){ //if moving the camera: camera Controls 
        deltaMoveCam.h = (iniMousePos.x - sketch.mouseX) / mainCanvasWidth  * scaleFactorCameraMovement.h;
        deltaMoveCam.v = (sketch.mouseY - iniMousePos.y) / mainCanvasHeight * scaleFactorCameraMovement.v;
      }

      trueIncX = deltaMoveCam.h; //true deltaMoveCam.h

      let theoryAngZ = deltaMoveCam.v + angZ;
      
      if (theoryAngZ >= 0){
        let halfTurns = Math.floor((theoryAngZ)/ Math.PI)
        multiplier = Math.pow(-1, halfTurns);
      }
      else {
        let halfTurns = Math.floor((Math.abs(theoryAngZ)) / Math.PI);
        multiplier = Math.pow(-1, halfTurns + 1);
      }
      trueIncZ = deltaMoveCam.v;

      invertedView = (multiplier == 1)? 0 : 2 * Math.PI;
      trueIncX = deltaMoveCam.h * multiplier + invertedView;


      camX =  ampli * Math.cos(angX + trueIncX) * Math.sin(angZ + trueIncZ)// * multiplier;
      camY =  ampli * Math.sin(angX + trueIncX) * Math.sin(angZ + trueIncZ)// * multiplier;
      camZ =  ampli * Math.cos(angZ + trueIncZ);

      let upX = 0;
      let upY = 0;
      let upZ = multiplier;

      sketch.camera(camX, camY, camZ, 0, 0, 0, upX, upY, upZ); //Set camera at position

      rubik.show();
    }

    /**
     * Calculates the position looking to at the cube
     * @returns {number[][]} [[Position of the center of the face facing], [Same with the increment]]
     */
    sketch.lookingAt = function(){
      look = [];

      let inverted;
      let sector = {h: 0, v: angZ / (Math.PI/4)}; // angZ / (Math.PI / 4)
      if (Math.abs(sector.v) < 0){
        sector.v = 8 + sector.v;
      }


      if (Math.abs(Math.abs(sector.v) - 4) <= 1) { //Yellow
        look.push([0, 0, -1]); //White
      }
      else if (Math.abs(sector.v) < 1) { // White
        look.push([0, 0, +1]); //Yellow
      }
      else { // Horizontal
        inverted = sector.v < 0 || sector.v > 4;
        sector.h = angX / (Math.PI / 4); // Normal situation

        if (sector.h < 0) { // if sector negative
          sector.h = 8 + sector.h; // Reverse it
        }
        if (inverted) { // If inverted, is the oposite
          sector.h = (sector.h + 4) % 8;
        }

        if (Math.abs(sector.h - 2) < 1) { // Blue
          look.push([0, 1, 0]); //1 => Blue
        }
        else if(Math.abs((sector.h - 6) % 8) < 1) { //Green
          look.push([0, -1, 0]); //-1 => Green
        }
        else if (Math.abs(sector.h - 4) < 1) { //Red
          look.push([-1, 0, 0]); //-1 => Red
        }
        else { //Orange
          look.push([1, 0, 0]); //1 => Orange
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
      angX %= (2 * Math.PI);
      angZ %= (2 * Math.PI);
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

    secondCanvasWidth = mainCanvasWidth * secondCanvasWPercent; //to make the second canvas
    secondCanvas = new p5(s2); //create the second canvas
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
    sketch.background(sketch.color(0, 204, 255));
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
      startMove = {x: sketch.mouseX, y: sketch.mouseY}; //Save the initial coordinates of the mouse
      }
  }

  /**
   * If movement made, analice that move and perform it
   */
  sketch.mouseReleased = function(){
    sketch.cursor(); //Reset mouse icon
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

    let sectorVertical = angZ / (Math.PI/4)
    let invertedAxis = sectorVertical < 0 || sectorVertical > 4;

    if(look[0][2] == 0){ //horizontal faces
      if(isHoriMove){ //Right or left (1, -1) move of the mouse
        axis = "z";
        h = v;
        inverted = hSmall(h) == (moveMade[0] == 1);//xnor(hSmall, moveMade[0] == 1)

        if (!invertedAxis) {
          h = rubik.dim - 1 - v;
          if (rubik.dim % 2 == 1 && h == (rubik.dim - 1) / 2) {
            inverted = !inverted;
          }
        }
      }
      else{ //moveMade[1] != 0 => Up or down (1, -1) move of the mouse
        axis = (look[0][0] != 0)? "y" : "x";
        h = (look[0][0] == 1 || look[0][1] == -1)? v : rubik.dim - 1 - v; //if rotation on y axis, index is inverted
        inverted = hSmall(h) != (moveMade[1] == -1);// XOR (hSmall, (moveMade[1] == -1))
        inverted = (look[0][0] == 1 || look[0][1] == -1) != inverted;//XOR(special cases, inverted)

        if (!invertedAxis) {
          h = (h == v)? rubik.dim - 1 - v : v;
          if (rubik.dim % 2 == 1 && h == (rubik.dim - 1) / 2) {
            inverted = !inverted;
          }
        }
      }
    }
    else if(look[0][2] == 1){ //White face
      if(look[1][1] != 0){ //over blue or green
        isBlue = look[1][1] == -1; //is over blue face
        h = (isBlue)? rubik.dim - 1 - v : v;
        hBigOrSmall = (isBlue == isHoriMove) != hSmall(h); //xOr(xnOr(isBlue, isHoriMove), hSmall)
        axis = (isHoriMove)? "y" : "x"; //axis of movement
        inverted = !(hBigOrSmall != preInverted); //Invert preInverted if hBigOrSmall is true (it is inverted because inverted works :S)
      }
      else{ //over orange or red face (look[1][0] != 0)
        isOrange = look[1][0] == -1; //if over orange face
        h = (isHoriMove == isOrange)? rubik.dim - 1 - v : v;//xnor condition
        axis = (isHoriMove)? "x" : "y"; //axis of movement
        inverted = (isOrange == hSmall(h)) != preInverted; //XOR(XNOR(isOrange, hSmall), preInverted);
      }
    }
    else{ //Yellow face
      if(look[1][1] != 0){ //under blue or green
        isBlue = look[1][1] == -1; //is under blue face
        axis = (isHoriMove)? "y" : "x"; //axis of movement
        h = (isBlue != isHoriMove)? rubik.dim - 1 - v : v;
        hBigOrSmall = isBlue != hSmall(h);
        inverted = hBigOrSmall != preInverted; //Invert preInverted if hBigOrSmall is true
      }
      else{ //under orange or red face (look[1][0] != 0)
        isOrange = look[1][0] == -1; //if under orange face
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
    let cameraCoord = vector.addition(look[0].map(x => x * rubik.w * rubik.dim * 1.4 * ((rubik.constructor.name == "MirrorRubikCube")? 2.2 : 1)), look[1]); //camera Coordinates

    let sectorVertical = angZ / (Math.PI/4);
    let invertedAxis = sectorVertical < 0 || sectorVertical > 4;
    let currentAxis = (invertedAxis)? -1 : 1;

    sketch.camera(...cameraCoord, 0, 0, 0, 0, 0, currentAxis);
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

mainCanvas = new p5(s1);
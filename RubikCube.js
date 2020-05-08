/**
 * This class enables to create a fully functional Rubik's Cube.
 * @see Some classes inheritance from this class.
 */
class RubikCube{
  /**
   * Construct the rubik's cube class.
   * @param {number} dim - dimension of the cube (3 => 3x3x3 cube)
   * @param {number} w - Width of each piece in the cube
   * @param {P5-Color} c - Color of the base of the cube (color of the pieces)
   * @see this.pieces = array with the pieces is position
   */
  constructor(dim, w, c){
    this.dim = (dim)? dim : 3;
    this.color = (c)? c : COLORSDIC.CUBECOLOR;
    this.w = (w)? w : RubikCube.cubeW;
    this.pieces = [];
    this.movesMade = [];//To keep track of the movements made => undo function
    const RUBIKCOLOR = [ //color of the pieces
      [//X = 0
        [//Y = 0
          [COLORSDIC.WHITE, COLORSDIC.BLUE, COLORSDIC.ORANGE],//Z = 0
          [COLORSDIC.ORANGE, COLORSDIC.BLUE],//Z = 1
          [COLORSDIC.ORANGE, COLORSDIC.BLUE, COLORSDIC.YELLOW],//Z = 2
        ],
        [//Y = 1
          [COLORSDIC.WHITE, COLORSDIC.ORANGE],//Z = 0 (EDGE RIGHT TOP = ORANGE TOP)
          [COLORSDIC.ORANGE],//Z = 1 (CENTER RIGHT = ORANGE)
          [COLORSDIC.ORANGE, COLORSDIC.YELLOW],//Z = 2 (EDGE RIGHT BOTTOM = ORANGE BOTTOM)
        ],
        [//Y = 2
          [COLORSDIC.ORANGE, COLORSDIC.GREEN, COLORSDIC.WHITE],//Z = 0
          [COLORSDIC.ORANGE, COLORSDIC.GREEN],//Z = 1
          [COLORSDIC.YELLOW, COLORSDIC.GREEN, COLORSDIC.ORANGE],//Z = 2
        ],
      ],
      [//X = 1
        [//Y = 0
          [COLORSDIC.WHITE, COLORSDIC.BLUE],//Z = 0
          [COLORSDIC.BLUE],//Z = 1 (CENTER BLUE = FRONT)
          [COLORSDIC.YELLOW, COLORSDIC.BLUE],//Z = 2
        ],
        [//Y = 1
          [COLORSDIC.WHITE],//Z = 0 (CENTER TOP = WHITE)
          [],//Z = 1
          [COLORSDIC.YELLOW],//Z = 2 (CENTER BOTTOM = YELLOW)
        ],
        [//Y = 2
          [COLORSDIC.WHITE, COLORSDIC.GREEN],//Z = 0
          [COLORSDIC.GREEN],//Z = 1 (CENTER BACK = GREEN)
          [COLORSDIC.YELLOW, COLORSDIC.GREEN],//Z = 2
        ],
      ],
      [//X = 2
        [//Y = 0
          [COLORSDIC.RED, COLORSDIC.BLUE, COLORSDIC.WHITE],//Z = 0
          [COLORSDIC.RED, COLORSDIC.BLUE],//Z = 1
          [COLORSDIC.YELLOW, COLORSDIC.BLUE, COLORSDIC.RED],//Z = 2
        ],
        [//Y = 1
          [COLORSDIC.WHITE, COLORSDIC.RED],//Z = 0 (EDGE LEFT TOP = RED TOP)
          [COLORSDIC.RED],//Z = 1 (CENTER LEFT = RED)
          [COLORSDIC.RED, COLORSDIC.YELLOW],//Z = 2 (EDGE LEFT BOTTOM = RED BOTTOM)
        ],
        [//Y = 2
          [COLORSDIC.WHITE, COLORSDIC.GREEN, COLORSDIC.RED],//Z = 0
          [COLORSDIC.RED, COLORSDIC.GREEN],//Z = 1
          [COLORSDIC.RED, COLORSDIC.GREEN, COLORSDIC.YELLOW],//Z = 2
        ],
      ]
      
    ];

    //Used at Smooth Rotation
    this.smoothRotationSlice = []; 
    this.smoothRotationAxis = ""; 
    this.smoothRotationAngle = -1;
    this.smoothRotationOri = 0;

    //~~~~~~~~~~~~~~~~~~~~~~~   this.pieces initialization  ~~~~~~~~~~~~~~~~~~~~~~~
    let index; //index in the z axis
    let xGood, yGood; //conditions of the x and y axis
    for(let i = 0; i < this.dim; i++){
      this.pieces.push([]);
      for(let j = 0; j < this.dim; j++){
        index = 0;//start at z = 0
        this.pieces[i].push(matrix.make.empty(1, this.dim)); //make and empty row to store the pieces
        xGood = (i == 0) || (i == this.dim - 1); //if true, on the edge of the x axis
        yGood = (j == 0) || (j == this.dim - 1); //if true, on the edge of the y axis
        if(xGood && yGood){ //if both true => This is a corner col
          this.pieces[i][j][index++] = new RubikPieceCorner(this.color, this.w); //now, index = 1    
          for(; index < this.dim - 1; index++){
            this.pieces[i][j][index] = new RubikPieceEdge(this.color, this.w); //Create edges pieces between corners
          }
          this.pieces[i][j][index] = new RubikPieceCorner(this.color, this.w); //end of this iteration so no need for index++.
        }
        else if(xGood || yGood){ //if one true, we are on a side of the cube. So same logic but with edge, center(s), edge.
          this.pieces[i][j][index++] = new RubikPieceEdge(this.color, this.w);   
          for(; index < this.dim - 1; index++){      
            this.pieces[i][j][index] = new RubikPieceCenter(this.color, this.w);
          }
          this.pieces[i][j][index] = new RubikPieceEdge(this.color, this.w);
        }
        else{ //if none of the above => same with Center, none (RubikPiece is empty), center
          this.pieces[i][j][index++] = new RubikPieceCenter(this.color, this.w);
          for(; index < this.dim - 1; index++){
            this.pieces[i][j][index] = new RubikPiece(this.color, this.w);//center of the cube
          }
          this.pieces[i][j][index] = new RubikPieceCenter(this.color, this.w);
        }
      }
    }
    
    //  ~~~~~~~~~~~~~~~~~~~~~~~   Corners   ~~~~~~~~~~~~~~~~~~~~~~~
    let coV = [ //corner coordinates (x,z)
      [0, 0],
      [this.dim - 1, 0],
      [this.dim - 1, this.dim - 1],
      [0, this.dim - 1],
    ];
    //if 2n+1 cube => need for a midle piece => different coordinates
    let coord = (this.dim % 2 == 0)? this.w * (this.dim - 1) * 0.5 : Math.floor(this.dim / 2) * this.w;
    for(let i = 0; i < this.dim; i += this.dim - 1){//for each corner
      for(let j = 0; j < this.dim; j += this.dim - 1){
        for(let k = 0; k < this.dim; k += this.dim - 1){
          this.pieces[i][j][k].setPos(coord, coord, coord); //translation to the start place (later rotated to correct coord).
          this.pieces[i][j][k].changeStickers(RUBIKCOLOR[(i == 0)? 0:2][(j == 0)? 0:2][(k == 0)? 0:2]);//stickers
        }
      }
    }
    for(let i = 0; i < 4; i++){ //Rotation of corners to true position
      this.pieces[coV[i][0]][0][coV[i][1]].rotateOrigin("y", Math.PI * 0.5 * i);//blue face pieces
      this.pieces[coV[i][0]][this.dim - 1][coV[i][1]].rotateOrigin("z", Math.PI);
      this.pieces[coV[i][0]][this.dim - 1][coV[i][1]].rotateOrigin("y", Math.PI * 0.5 * (i-1));
    }

    if(this.dim > 2){//if this.dim > 2 => need for edges and centers
      let offset = 0;
      if(this.dim % 2 == 0){//if 2n+1 cube => need of center piece => offset needed
        offset = -this.w / 2;
      }
      //~~~~~~~~~~~~~~~~~~~~~~~   Centers   ~~~~~~~~~~~~~~~~~~~~~~~
      let cen =  [//coordinates of the centers of every 2n+1 cube
        [1, 1, 0],
        [1, this.dim - 1, 1],
        [1, 1, this.dim - 1],
        [1, 0, 1],
        [0, 1, 1],
        [this.dim - 1, 1, 1]
      ];
      for(let i = 0; i < 6; i++){ //for each center
        let dX = (cen[i][0] == 1)? 1 : 0; //if the centers are on the X axis = 0
        let dY = (cen[i][1] == 1)? 1 : 0; //if the centers are on the Y axis
        let dZ = (cen[i][2] == 1)? 1 : 0; //if the centers are on the Z axis
        for(let j = 0; j < this.dim - 2; j++){//for each center piece
          for(let k = 0; k < this.dim - 2; k++){
            let x = cen[i][0] + j * dX;                               //index of the center in the X axis
            let y = cen[i][1] + ((cen[i][0] == 1)? k * dY : j * dY);  //index of the center in the Y axis
            let z = cen[i][2] + k * dZ;                               //index of the center in the Z axis
            
            //initial pos
            this.pieces[x][y][z].setPos(((i == 4)? -1 : 1) * offset, ((i == 2 || i == 3)? -1 : 1) * offset, this.w * (this.dim - 1) / 2);
            
            let l = - (Math.floor(this.dim / 2) - 1);//used to move to correct position (see rotation)
            //Rotatation
            if(i == 5 || i == 4){ // if orange or red centers
              this.pieces[x][y][z].move(((i == 4)? 1 : -1) * (k + l) * this.w, -(j + l) * this.w, 0);
              this.pieces[x][y][z].rotateOrigin("y", ((i == 4)? -1 : 1) * Math.PI / 2);

            }
            else{ // if not side centers (not orange nor red)
              let ori = i == 3 || i == 2;
              this.pieces[x][y][z].move(-(j + l) * this.w, -((ori)? -1 : 1) * (k + l) * this.w, 0);
              this.pieces[x][y][z].rotateOrigin("x", -Math.PI / 2 * i);
            }
            
            //Stickers
            let cX = (cen[i][0] > 1)? 2 : cen[i][0];
            let cY = (cen[i][1] > 1)? 2 : cen[i][1];
            let cZ = (cen[i][2] > 1)? 2 : cen[i][2];
            this.pieces[x][y][z].changeStickers(RUBIKCOLOR[cX][cY][cZ]);
          }
        }
      }
    
      //~~~~~~~~~~~~~~~~~~~~~~~   Edges   ~~~~~~~~~~~~~~~~~~~~~~~    
      let eG = [//blue and green edges
        [1, 0],
        [this.dim - 1, 1],
        [1, this.dim - 1],
        [0, 1]
      ];
      let edge = [ //orange and red edges
        [0, 1, 0],
        [0, 1, this.dim - 1],
        [this.dim - 1, 1, 0],
        [this.dim - 1, 1, this.dim - 1]
      ];
      let x, y, trueX, trueZ;
      for(let i = 0; i < 4; i++){
        let dX = (eG[i][0] == 1)? 1 : 0;
        let dZ = (eG[i][1] == 1)? 1 : 0;
        
        for(let j = 0; j < this.dim - 2; j++){ //for each edge-piece in edge line
          //******  Blue and green  ******
          trueX = eG[i][0] + dX * j; //index position at x coord
          trueZ = eG[i][1] + dZ * j; //index position at z coord

          let k = - (Math.floor(this.dim / 2) - 1) + j;
          x = ((i > 1)? -1 : 1) * offset; //initial x pos
          let x2 = ((i < 2)? -1 : 1) * this.w * k; //final move in the x axis
          y = this.w * (this.dim - 1) / 2; //edges at beging are at same y, z pos (z = y) (then rotation changes this)
          
          //move to initial pos (x,y,z) and from then to true pos (x2, y2, z2) => (x,y,x2)
          this.pieces[trueX][0][trueZ].setPos(x + x2, y, y);
          this.pieces[trueX][this.dim - 1][trueZ].setPos(-(x + x2), y, y);
          
          //Rotation
          this.pieces[trueX][0][trueZ].rotateOrigin("y", Math.PI / 2 * i);
          this.pieces[trueX][this.dim - 1][trueZ].rotateOrigin("z", Math.PI);
          this.pieces[trueX][this.dim - 1][trueZ].rotateOrigin("y", Math.PI / 2 * i);
          //stickers
          let colorX = (eG[i][0] > 1)? 2 : eG[i][0];
          let colorZ = (eG[i][1] > 1)? 2 : eG[i][1];
          this.pieces[trueX][0][trueZ].changeStickers(RUBIKCOLOR[colorX][0][colorZ]);
          this.pieces[trueX][this.dim - 1][trueZ].changeStickers(RUBIKCOLOR[colorX][2][colorZ]);

          //******  Orange and red  ******
          trueX = edge[i][0];
          let trueY = edge[i][1] + j;
          trueZ = edge[i][2];

          x = ((i < 2)? -1 : 1) * offset;
          x2 = ((i > 1)? -1 : 1) * this.w * k;
          //y and z are the same

          this.pieces[trueX][trueY][trueZ].setPos(x + x2, y, y); //translation
          //rotation
          this.pieces[trueX][trueY][trueZ].rotateOrigin("z", Math.PI / 2 * ((i > 1)? -1 : 1));
          if(i % 2 == 1){
            this.pieces[trueX][trueY][trueZ].rotateOrigin("y", Math.PI / 2 * ((i > 1)? 1 : -1));
          }
          //stickers
          colorX = (trueX > 1)? 2 : trueX;               //index of the sticker at x pos
          let colorY = (edge[i][1] > 1)? 2 : edge[i][1]; //index of the sticker at y pos
          colorZ = (trueZ > 1)? 2 : trueZ;               //index of the sticker at z pos
          this.pieces[trueX][trueY][trueZ].changeStickers(RUBIKCOLOR[colorX][colorY][colorZ]);
        }
      }
    }
  }
  
  /**
   * Display the cube on the selected canvas.
   * @param {P5Canvas} canvas - Canvas to print the cube into.
   */
  show(canvas){
    for(let i = 0; i < this.dim; i++){
      for(let j = 0; j < this.dim; j++){
        for(let k = 0; k < this.dim; k++){
          this.pieces[i][j][k].show(canvas); 
        }
      }
    }
  }

  /**
   * Analize the given move and makes it.
   * @param {string} move - String with the desired move
   * @param {number} prevCube? - used for internal iteration. Defines the dim of (dim - prevCube) of the cube to search the movement 
   * @see Rubik's cube notation.
   * @throws Error if move not defined or not implemented yet.
   */
  move(move, prevCube){
    let axis, h;
    prevCube = (prevCube)? prevCube : 0; //If not given, set to 0
    switch(this.dim - prevCube){
      case 2:
        switch(true){
          case /^[uU]p?/.test(move):
            axis = "z";
            h = 0;
            break;
          case /^[dD](own)?/.test(move):
            axis = "z";
            h = this.dim - 1;
            break;
          case /^[rR](ight)?/.test(move):
            axis = "x";
            h = 0;
            break;
          case /^[lL](eft)?/.test(move):
            axis = "x";
            h = this.dim - 1;
            break;
          case /^[fF](ront)?/.test(move):
            axis = "y";
            h = 0;
            break;
          case /^[bB](ack)?/.test(move):
            axis = "y";
            h = this.dim - 1;
            break;
          case vector.re.X.test(move):
          case vector.re.Y.test(move):
          case vector.re.Z.test(move):
            axis = move;
            let rev;
            for(let i = 0; i < this.dim; i++){
              rev = /'/.test(move) != (i >= (this.dim - this.dim % 2) / 2);
              this.makeMove(axis, i, rev);
            }
            return;
          case true:
            console.log("That move is not correct or not implemented");
            return;
        }
        break;
      case 3:
        switch(true){
          case /^[mM](iddle)?/.test(move):
            axis = "x";
            h = Math.floor(this.dim / 2);
            break;
          case /^[eE](cuator)?/.test(move):
            axis = "z";
            h = Math.floor(this.dim / 2);
            break;
          case /^[sS](tanding)?/.test(move):
            axis = "y";
            h = Math.floor(this.dim / 2);
          break;
          case true:
            this.move(move, prevCube + 1);
            return;
        }
        break;
      case this.dim - prevCube:
        this.move(move, prevCube + 1);
        return;
    }
    this.makeMove(axis, h, /'/.test(move));//make the move. Reverse it if "'" given in move
  }

  /**
   * 
   * @param {string} axis - String with the desired axis
   * @param {number} h - The height of the slice to rotate 
   * @param {*} inverse 
   */
  makeMove(axis, h, inverse, smoothRotation){
    let angleOri = 1;
    let highH = h + 1 > this.dim / 2; //if on the second half of the cube
    inverse = (inverse)? inverse : false;

    if((inverse || highH) && !(inverse && highH)){ //XOR -> if the rotation is reversed
      array_nD.o.permutation_3D(this.pieces, axis, h);
      array_nD.o.permutation_3D(this.pieces, axis, h);
      angleOri = -1;
    }
    let movedPieces = array_nD.o.permutation_3D(this.pieces, axis, h);

    if(smoothRotation){ //If doing a smooth rotation
      this.smoothRotationSlice = movedPieces;
      this.smoothRotationAxis = axis;
      this.smoothRotationAngle = 0;
      this.smoothRotationOri = angleOri;
    }
    else{
      this.rotatePieces(axis, -Math.PI / 2 * angleOri, movedPieces);//normal rotation
    }

    this.movesMade.push([axis, h, inverse]); //Store the movement made at the end
  }

  /**
   * Fisically rotates the selected slice of pieces the selected amount
   * @param {string} axis - String with the axis of rotation
   * @param {number} angle - the amount of radians to rotate
   * @param {RubikCube[][]} slice - Slice of the cube that we want to rotate.
   */
  rotatePieces(axis, angle, slice){
    for(let i = 0; i < this.dim; i++){
      for(let j = 0; j < this.dim; j++){
        slice[i][j].rotateOrigin(axis, angle);
      }
    }
  }

  /**
   * Undo the last move made
   */
  undo(){
    try{
      if(this.movesMade.length == 0){
        throw "Not movement made yet, so not possible to undo any move.";
      }
      let arr = this.movesMade[this.movesMade.length - 1]; //arr = [axis, h, inverse];
      printArray_nD(arr);
      arr[2] = !arr[2]; //Now the move it is inverted
      printArray_nD(arr);
      this.movesMade.pop(); //delete the move that it's going to be undone.
      this.makeMove(...arr); //Restore the cube with an oposite move
      this.movesMade.pop(); //delete the move just made
    }
    catch(error){
      console.log(error);
    }
  }

  //getters and setters
  
  /**
   * Changes the % of the size of the stickers related to the pieces itself. 
   * @param {number} wP - percent of the size of the stickers (over 1) 
   */
  changeStickersWPercent(wP){
    for(let i = 0; i < this.dim; i++){
      for(let j = 0; j < this.dim; j++){
        for(let k = 0; k < this.dim; k++){
          this.pieces[i][j][k].changeStickersWPercent(wP); 
        }
      }
    }
  }

  /**
   * @returns {number} - The default piece size.
   */
  static get cubeW(){ return 100;};

  static get smoothAngleIncrement(){return Math.PI / 2 / 10};
  
  startSmoothRotation(axis, h, inverse){
    this.makeMove(axis, h, inverse, true);

    //Used at Smooth Rotation
    // this.smoothRotationSlice = []; 
    // this.smoothRotationAxis = axis; 
    // this.smoothRotationAngle = 0;
    // this.smoothRotationOri = angleOri;



  }
/** Check setup */
  updateSmoothRotation(){
    if(this.smoothRotationSlice.length != 0){
      this.smoothRotationAngle += this.smoothAngleIncrement();

      if(this.smoothRotationAngle >= Math.PI / 2){
        this.smoothRotationSlice = []; 
        this.smoothRotationAxis = ""; 
        this.smoothRotationAngle = -1;
        this.smoothRotationOri = 0;
      }
    }

    // this.rotatePieces()
    this.show();
  }

}

/**
 * Rubik's Cube without stickers, so the faces are filled with the colors of those stickers.
 * @extends RubikCube
 */
class StickerlessRubikCube extends RubikCube{
  constructor(dim, w, c){
    super(dim, w, c);
    this.changeStickersWPercent(1.0);
  }
}

/**
 * Rubik's Cube without pieces, so only the stickers are visible.
 * @extends RubikCube
 */
class InvisibleRubikCube extends RubikCube{
  constructor(dim, w, c){
    super(dim, w, c);
    for(let i = 0; i < this.dim; i++){
      for(let j = 0; j < this.dim; j++){
        for(let k = 0; k < this.dim; k++){
          this.pieces[i][j][k].w = 0; 
        }
      }
    }
  }
}

/**
 * 3x3x3 Mirror Rubik's Cube.
 * @extends RubikCube
 */
class MirrorRubikCube extends RubikCube{
  constructor(w, c){
    super(2, w, c);//min process time
    this.dim = 3;
    const RCx = [1.75, 0, -2];
    const RCy = [1.5, 0, -2.25];
    const RCz = [1.5, 0, -2.25];
    const RSx = [1.5, 2, 2];
    const RSy = [1, 2, 2.5];
    const RSz = [1, 2, 2.5];
    this.pieces = array_nD.make.empty(3,3,3); //init the array
    for(let i = 0; i < 3; i++){ //For each piece
      for(let j = 0; j < 3; j++){
        for(let k = 0; k < 3; k++){
          this.pieces[i][j][k] = new RubikPieceCenter(c, w); //Create the piece
          this.pieces[i][j][k].stickers = []; //Mirror has no stickers but diferent shape
          this.pieces[i][j][k].w = [RSx[i], RSy[j], RSz[k]].map(x => x * this.w); //Set the custom width
          this.pieces[i][j][k].move(...[RCx[i], RCy[j], RCz[k]].map(x => x * this.w)); //Move to correct position
        }
      }
    }
  }
}
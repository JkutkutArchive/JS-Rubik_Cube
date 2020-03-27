class RubikCube{
  constructor(dim, w, c){
    this.pos = createVector(0, 0, 0);
    this.dim = (dim)? dim : 3;

    this.color = (c)? c : COLORSDIC.CUBECOLOR;
    this.w = (w)? w : RubikCube.cubeW;
    
    this.pieces = [];
    
    //color
    const RUBIKCOLOR = [
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
    //  ~~~~~~~~~~~~~~~~~~~~~~~   Centers   ~~~~~~~~~~~~~~~~~~~~~~~
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
    
      //  ~~~~~~~~~~~~~~~~~~~~~~~   Edges   ~~~~~~~~~~~~~~~~~~~~~~~    
      
      //green and blue
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
  
  show(){
    for(let i = 0; i < this.dim; i++){
      for(let j = 0; j < this.dim; j++){
        for(let k = 0; k < this.dim; k++){
          this.pieces[i][j][k].show(); 
        }
      }
    }
  }

  move(move, prevCube){
    let axis, h;
    prevCube = (prevCube)? prevCube : 0;
    switch(this.dim - prevCube){
      case 2:
        switch(true){
          case /^[uU]p?/.test(move):
            axis = "z";
            h = 0;
            break;
          case /^[dD](own)?/.test(move):
            axis = "z";
            h = 2;
            break;
          case /^[rR](ight)?/.test(move):
            axis = "x";
            h = 0;
            break;
          case /^[lL](eft)?/.test(move):
            axis = "x";
            h = 2;
            break;
          case /^[fF](ront)?/.test(move):
            axis = "y";
            h = 0;
            break;
          case /^[bB](ack)?/.test(move):
            axis = "y";
            h = 2;
            break;
        }
        break;
      case 3:
        switch(true){
          case /c/.test(move):
            break;
          case true:
            this.move(move, 1);
            return;
        }
        break;
    }
    this.makeMove(axis, h, /'/.test(move));
  }

  makeMove(axis, h, inverse){
    let angleOri = 1;
    let highH = h + 1 > this.dim / 2; //if on the second half of the cube
    inverse = (inverse)? inverse : false;

    if((inverse || highH) && !(inverse && highH)){ //XOR -> if the rotation is reversed
      array_nD.o.permutation_3D(this.pieces, axis, h);
      array_nD.o.permutation_3D(this.pieces, axis, h);
      angleOri = -1;
    }
    let movedPieces = array_nD.o.permutation_3D(this.pieces, axis, h);
    this.rotatePieces(axis, -Math.PI / 2 * angleOri, movedPieces);
  }

  rotatePieces(axis, angle, slice){
    for(let i = 0; i < this.dim; i++){
      for(let j = 0; j < this.dim; j++){
        // slice[i][j].w = 107;
        slice[i][j].rotateOrigin(axis, angle);
      }
    }
  }

  //getters and setters
  
  changeStickersWPercent(wP){
    for(let i = 0; i < this.dim; i++){
      for(let j = 0; j < this.dim; j++){
        for(let k = 0; k < this.dim; k++){
          this.pieces[i][j][k].changeStickersWPercent(wP); 
        }
      }
    }
  }
  static get cubeW(){ return 100;};
}

class StickerlessRubikCube extends RubikCube{
  constructor(dim, w, c){
    super(dim, w, c);
    this.changeStickersWPercent(1.0);
  }
}

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

class MirrorRubikCube extends RubikCube{
  constructor(w, c){
    super(3, w, c);
    let RUBIKSIZE =[
      [ //X = 0
        [ //Y = 0
          [0, 0, 0], //Z = 0
          [0, 0, 0], //Z = 1
          [0, 0, 0]  //Z = 2
        ],
        [ //Y = 1
          [0, 0, 0], //Z = 0
          [0, 0, 0], //Z = 1
          [0, 0, 0]  //Z = 2
        ],
        [ //Y = 2
          [0, 0, 0], //Z = 0
          [0, 0, 0], //Z = 1
          [0, 0, 0]  //Z = 2
        ]
      ],
      [ //X = 1
        [ //Y = 0
          [0, 0, 0], //Z = 0
          [0, 0, 0], //Z = 1
          [0, 0, 0]  //Z = 2
        ],
        [ //Y = 1
          [0, 0, 0], //Z = 0
          [0, 0, 0], //Z = 1
          [0, 0, 0]  //Z = 2
        ],
        [ //Y = 2
          [0, 0, 0], //Z = 0
          [0, 0, 0], //Z = 1
          [0, 0, 0]  //Z = 2
        ]
      ],
      [ //X = 2
        [ //Y = 0
          [0, 0, 0], //Z = 0
          [0, 0, 0], //Z = 1
          [0, 0, 0]  //Z = 2
        ],
        [ //Y = 1
          [0, 0, 0], //Z = 0
          [0, 0, 0], //Z = 1
          [0, 0, 0]  //Z = 2
        ],
        [ //Y = 2
          [0, 0, 0], //Z = 0
          [0, 0, 0], //Z = 1
          [0, 0, 0]  //Z = 2
        ]
      ]
    ];
    
    for(let i = 0; i < this.dim; i++){
      for(let j = 0; j < this.dim; j++){
        for(let k = 0; k < this.dim; k++){
          this.pieces[i][j][k].w = RUBIKSIZE[i][j][k].map(x => x * this.w); 
        }
      }
    }
  }
}
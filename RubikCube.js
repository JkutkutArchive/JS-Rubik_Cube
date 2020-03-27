class RubikCube{
  constructor(dim, w, c){
    // this.pos = (pos)? pos : createVector(0, 0, 0);
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




    // console.log("Starting constructor:");

    /** MISSING THE LOCATION OF THE PIECES */
    let index; //index
    let xGood, yGood;
    for(let i = 0; i < this.dim; i++){
      this.pieces.push([]);
      for(let j = 0; j < this.dim; j++){
        index = 0;
        this.pieces[i].push(matrix.make.empty(1, this.dim));
        xGood = (i == 0) || (i == this.dim - 1);
        yGood = (j == 0) || (j == this.dim - 1);
        if(xGood && yGood){ // Corner collums
          this.pieces[i][j][index++] = new RubikPieceCorner(this.color, this.w); //index = 1 now     
          for(; index < this.dim - 1; index++){
            this.pieces[i][j][index] = new RubikPieceEdge(this.color, this.w); //Create edges pieces
          }
          this.pieces[i][j][index] = new RubikPieceCorner(this.color, this.w); //index does no increment cause end of this iteration.
        }
        else if(xGood || yGood){
          this.pieces[i][j][index++] = new RubikPieceEdge(this.color, this.w);  
          for(; index < this.dim - 1; index++){      
            this.pieces[i][j][index] = new RubikPieceCenter(this.color, this.w);
          }
          this.pieces[i][j][index] = new RubikPieceEdge(this.color, this.w);
        }
        else{
          this.pieces[i][j][index++] = new RubikPieceCenter(this.color, this.w);
          for(; index < this.dim - 1; index++){
            this.pieces[i][j][index] = new RubikPiece(this.color, this.w);//center of the cube
          }
          this.pieces[i][j][index] = new RubikPieceCenter(this.color, this.w);
        }
      }
    }
    
    //  ~~~~~~~~~~~~~~~~~~~~~~~   Corners   ~~~~~~~~~~~~~~~~~~~~~~~ (DONE)
    let coV = [ //corner vectors
      [0, 0],
      [this.dim - 1, 0],
      [this.dim - 1, this.dim - 1],
      [0, this.dim - 1],
    ];
    //front => y = 0

    let coord = (this.dim % 2 == 0)? this.w * (this.dim - 1) * 0.5 : Math.floor(this.dim / 2) * this.w;
    for(let i = 0; i < this.dim; i += this.dim - 1){
      for(let j = 0; j < this.dim; j += this.dim - 1){
        for(let k = 0; k < this.dim; k += this.dim - 1){
          this.pieces[i][j][k].setPos(coord, coord, coord); //translarion

          this.pieces[i][j][k].changeStickers(RUBIKCOLOR[(i == 0)? 0:2][(j == 0)? 0:2][(k == 0)? 0:2]);//stickers
        }
      }
    }
    
    for(let i = 0; i < 4; i++){ //Rotation
      this.pieces[coV[i][0]][0][coV[i][1]].rotateOrigin("y", Math.PI * 0.5 * i);
      this.pieces[coV[i][0]][this.dim - 1][coV[i][1]].rotateOrigin("z", Math.PI);
      this.pieces[coV[i][0]][this.dim - 1][coV[i][1]].rotateOrigin("y", Math.PI * 0.5 * (i-1));
    }

    
    //  ~~~~~~~~~~~~~~~~~~~~~~~   Centers   ~~~~~~~~~~~~~~~~~~~~~~~
    if(this.dim > 2){
      let offset = 0;
      if(this.dim % 2 == 0){
        offset = this.w / 2
      }
      let cen =  [
        [1, 1, 0],
        [1, this.dim - 1, 1],
        [1, 1, this.dim - 1],
        [1, 0, 1],
        [0, 1, 1],
        [this.dim - 1, 1, 1]
      ];
      for(let i = 0; i < 6; i++){ //for each center
        let dX = (cen[i][0] == 1)? 1 : 0; //if the centers are on the X axis
        let dY = (cen[i][1] == 1)? 1 : 0; //if the centers are on the Y axis
        let dZ = (cen[i][2] == 1)? 1 : 0; //if the centers are on the Z axis
        // console.log("Working at " + array_nDToString(cen[i], ","));
        for(let j = 0; j < this.dim - 2; j++){
          for(let k = 0; k < this.dim - 2; k++){
            let x = j * dX;                             //index of the center in the X axis form the first center
            let y = (cen[i][0] == 1)? k * dY : j * dY;  //index of the center in the Y axis form the first center
            let z = k * dZ;                             //index of the center in the Z axis form the first center
            
            // console.log((cen[i][0] + x) + ", " + (cen[i][1] + y) + ", " + (cen[i][2] + z));

            this.pieces[cen[i][0] + x][cen[i][1] + y][cen[i][2] + z].setPos(offset, offset, this.w * (this.dim - 1) / 2);

            let l =  - (Math.floor(this.dim / 2) - 1);
            this.pieces[cen[i][0] + x][cen[i][1] + y][cen[i][2] + z].move((j + l) * this.w, (k + l) * this.w,0);

            //Rotate
            if(i == 5){
              this.pieces[cen[i][0] + x][cen[i][1] + y][cen[i][2] + z].rotateOrigin("y", Math.PI / 2);
            }
            else if(i == 4){
              this.pieces[cen[i][0] + x][cen[i][1] + y][cen[i][2] + z].rotateOrigin("y", -Math.PI / 2);
            }
            else{
              this.pieces[cen[i][0] + x][cen[i][1] + y][cen[i][2] + z].rotateOrigin("x", -Math.PI / 2 * i);
            }
            
            //Stickers
            let cX = (cen[i][0] > 1)? 2 : cen[i][0];
            let cY = (cen[i][1] > 1)? 2 : cen[i][1];
            let cZ = (cen[i][2] > 1)? 2 : cen[i][2];
            this.pieces[cen[i][0] + x][cen[i][1] + y][cen[i][2] + z].changeStickers(RUBIKCOLOR[cX][cY][cZ]);
          }
        }
      }


    }
    
    //  ~~~~~~~~~~~~~~~~~~~~~~~   Edges   ~~~~~~~~~~~~~~~~~~~~~~~    
    if(this.dim > 2){
      let offset = 0;
      if(this.dim % 2 == 0){
        offset = this.w / 2
      }
      
      //green and blue
      let eG = [
        [1, 0],
        [this.dim - 1, 1],
        [1, this.dim - 1],
        [0, 1]
      ];
      let edge = [
        [0, 1, 0],
        [0, 1, this.dim - 1],
        [this.dim - 1, 1, 0],
        [this.dim - 1, 1, this.dim - 1]
      ];

      for(let i = 0; i < 4; i++){
        let dX = (eG[i][0] == 1)? 1 : 0;
        let dZ = (eG[i][1] == 1)? 1 : 0;

        
        for(let j = 0; j < this.dim - 2; j++){ //for each edge-piece in edge line
          //******Blue and green******

          //initial pos
          this.pieces[eG[i][0] + dX * j][0][eG[i][1] + dZ * j].setPos(0, this.w * (this.dim - 1) / 2, this.w * (this.dim - 1) / 2);
          this.pieces[eG[i][0] + dX * j][this.dim - 1][eG[i][1] + dZ * j].setPos(0, this.w * (this.dim - 1) / 2, this.w * (this.dim - 1) / 2);
          //move to true pos
          let k = - (Math.floor(this.dim / 2) - 1) + j;
          this.pieces[eG[i][0] + dX * j][0][eG[i][1] + dZ * j].move(((i < 2)? -1 : 1) * this.w * k + offset, 0, 0);
          this.pieces[eG[i][0] + dX * j][this.dim - 1][eG[i][1] + dZ * j].move(((i > 1)? -1 : 1) * this.w * k + offset, 0, 0);


          //Rotation
          this.pieces[eG[i][0] + dX * j][0][eG[i][1] + dZ * j].rotateOrigin("y", Math.PI / 2 * i);
          this.pieces[eG[i][0] + dX * j][this.dim - 1][eG[i][1] + dZ * j].rotateOrigin("z", Math.PI);
          this.pieces[eG[i][0] + dX * j][this.dim - 1][eG[i][1] + dZ * j].rotateOrigin("y", Math.PI / 2 * i);

          //stickers
          let colorX = (eG[i][0] > 1)? 2 : eG[i][0];
          let colorZ = (eG[i][1] > 1)? 2 : eG[i][1];
          this.pieces[eG[i][0] + dX * j][0][eG[i][1] + dZ * j].changeStickers(RUBIKCOLOR[colorX][0][colorZ]);
          this.pieces[eG[i][0] + dX * j][this.dim - 1][eG[i][1] + dZ * j].changeStickers(RUBIKCOLOR[colorX][2][colorZ]);

          //******Orange and red******
          this.pieces[edge[i][0]][edge[i][1] + j][edge[i][2]].setPos(0, this.w * (this.dim - 1) / 2, this.w * (this.dim - 1) / 2);
          this.pieces[edge[i][0]][edge[i][1] + j][edge[i][2]].move(((i > 1)? -1 : 1) * this.w * k + offset, 0, 0);

          //rotation
          this.pieces[edge[i][0]][edge[i][1] + j][edge[i][2]].rotateOrigin("z", Math.PI / 2 * ((i > 1)? -1 : 1));
          if(i % 2 == 1){
            this.pieces[edge[i][0]][edge[i][1] + j][edge[i][2]].rotateOrigin("y", Math.PI / 2 * ((i > 1)? 1 : -1));
          }

          //stickers
          colorX = (edge[i][0] > 1)? 2 : edge[i][0];
          let colorY = (edge[i][1] > 1)? 2 : edge[i][1];
          colorZ = (edge[i][2] > 1)? 2 : edge[i][2];
          this.pieces[edge[i][0]][edge[i][1] + j][edge[i][2]].changeStickers(RUBIKCOLOR[colorX][colorY][colorZ]);

        }
      }
    }


    // console.log("Ended constructor");
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
    for(let i = 0; i < 3; i++){
      for(let j = 0; j < 3; j++){
        // slice[i][j].w = 107;
        slice[i][j].rotateOrigin(axis, angle);
      }
    }
  }

  static get cubeW(){ return 100;};
}
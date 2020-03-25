class RubikCube{
  constructor(dim, w, c){
    // this.pos = (pos)? pos : createVector(0, 0, 0);
    this.dim = (dim)? dim : 3;

    this.color = (c)? c : COLORSDIC.CUBECOLOR;
    this.w = (w)? w : RubikCube.cubeW;
    
    this.pieces = [];
    
    console.log("Starting constructor:");

    /** MISSING THE LOCATION OF THE PIECES */
    /** CONDITIONS NOT GOOD FOR OTHER CUBES */
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
    
    // if()
    
    
    // let index; //index
    // for(let i = 0; i < this.dim; i++){
    //   this.pieces.push([]);
    //   for(let j = 0; j < this.dim; j++){
    //     this.pieces[i].push(matrix.make.empty(1, this.dim));
    //     index = 0;
    //     if(i % 2 == 0 && j % 2 == 0){
    //       this.pieces[i][j][index++] = new RubikPieceCorner(this.color, this.w); //index = 1 now     
    //       for(; index < this.dim - 1; index++){
    //         this.pieces[i][j][index] = new RubikPieceEdge(this.color, this.w); //Create edges pieces
    //       }
    //       this.pieces[i][j][index] = new RubikPieceCorner(this.color, this.w); //index does not increment cause end of this iteration.
    //     }
    //     else{
    //       if(i == 1 && j == 1){
    //         this.pieces[i][j][index++] = new RubikPieceCenter(this.color, this.w);
    //         for(; index < this.dim - 1; index++){
    //           this.pieces[i][j][index] = new RubikPiece(this.color, this.w);//center of the cube
    //         }
    //         this.pieces[i][j][index] = new RubikPieceCenter(this.color, this.w);
    //       }
    //       else{
    //         this.pieces[i][j][index++] = new RubikPieceEdge(this.color, this.w);  
    //         for(; index < this.dim - 1; index++){      
    //           this.pieces[i][j][index] = new RubikPieceCenter(this.color, this.w);
    //         }
    //         this.pieces[i][j][index] = new RubikPieceEdge(this.color, this.w);        
    //       }
    //     }
    //   }
    // }

    
    //  ~~~~~~~~~~~~~~~~~~~~~~~   Corners   ~~~~~~~~~~~~~~~~~~~~~~~
    let coV = [ //corner vectors
      [0, 0],
      [this.dim - 1, 0],
      [this.dim - 1, this.dim - 1],
      [0, this.dim - 1],
    ];
    //front => y = 0
    for(let i = 0; i < 4; i++){
      this.pieces[coV[i][0]][0][coV[i][1]].rotateOrigin("y", Math.PI * 0.5 * i);
      this.pieces[coV[i][0]][this.dim - 1][coV[i][1]].rotateOrigin("z", Math.PI);
      this.pieces[coV[i][0]][this.dim - 1][coV[i][1]].rotateOrigin("y", Math.PI * 0.5 * (i-1));
    }

    //  ~~~~~~~~~~~~~~~~~~~~~~~   Centers   ~~~~~~~~~~~~~~~~~~~~~~~
    if(this.dim % 2 == 1){
      let cen =  [
        [1, 1, 0],
        [1, 2, 1],
        [1, 1, 2],
        [1, 0, 1],
        
      ];
      for(let i = 0; i < 4; i++){
        this.pieces[cen[i][0]][cen[i][1]][cen[i][2]].rotateOrigin("x", -Math.PI / 2 * i);
      }
      this.pieces[0][1][1].rotateOrigin("y", -Math.PI / 2);
      this.pieces[2][1][1].rotateOrigin("y", Math.PI / 2);
    }

    //  ~~~~~~~~~~~~~~~~~~~~~~~   Edges   ~~~~~~~~~~~~~~~~~~~~~~~    
    if(this.dim > 2){
      //green and blue
      let eG = [
        [1, 0],
        [2, 1],
        [1, 2],
        [0, 1]
      ];
      for(let i = 0; i < 4; i++){
        this.pieces[eG[i][0]][2][eG[i][1]].rotateOrigin("z", Math.PI);
        this.pieces[eG[i][0]][2][eG[i][1]].rotateOrigin("y", Math.PI / 2 * i);
        this.pieces[eG[i][0]][0][eG[i][1]].rotateOrigin("y", Math.PI / 2 * i);
      }
      //orange and red 
      let edge = [
        [0, 1, 0],
        [0, 1, 2],
        [2, 1, 0],
        [2, 1, 2]
      ];
      for(let i = 0; i < 4; i++){
        this.pieces[edge[i][0]][edge[i][1]][edge[i][2]].rotateOrigin("z", Math.PI / 2 * ((i > 1)? -1 : 1));
        if(i % 2 == 1){
          this.pieces[edge[i][0]][edge[i][1]][edge[i][2]].rotateOrigin("y", Math.PI / 2 * ((i > 1)? 1 : -1));
        }
      }
    }

    
    //color
    let RUBIKCOLOR = [
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

    for(let i = 0; i < this.dim; i++){
      for(let j = 0; j < this.dim; j++){
        for(let k = 0; k < this.dim; k++){
          this.pieces[i][j][k].changeStickers(RUBIKCOLOR[i][j][k]);
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
    for(let i = 0; i < 3; i++){
      for(let j = 0; j < 3; j++){
        // slice[i][j].w = 107;
        slice[i][j].rotateOrigin(axis, angle);
      }
    }
  }

  static get cubeW(){ return 100;};
}
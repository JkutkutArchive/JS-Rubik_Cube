class RubikCube{
  constructor(pos, dim, w, c){

    this.pos = (pos)? pos : createVector(0, 0, 0);
    this.dim = (dim)? dim : 3;

    this.color = (c)? c : COLORS[COLORS.length - 1];
    this.w = (w)? w : cubeW;
    
    this.pieces = [];
    
 
    for(let i = 0; i < 3; i++){
      this.pieces.push([]);
      for(let j = 0; j < 3; j++){
        this.pieces[i].push(matrix.make.empty(1,3));
        if(i % 2 == 0 && j % 2 == 0){
          this.pieces[i][j][0] = new Corner(this.color, this.width);        
          this.pieces[i][j][1] = new Edge(this.color, this.width);
          this.pieces[i][j][2] = new Corner(this.color, this.width);  
        }
        else{
          if(i == 1 && j == 1){
            this.pieces[i][j][0] = new Center(this.color, this.width);
            this.pieces[i][j][1] = new RubikPiece(this.color, this.width);
            this.pieces[i][j][2] = new Center(this.color, this.width);
          }
          else{
            this.pieces[i][j][0] = new Edge(this.color, this.width);        
            this.pieces[i][j][1] = new Center(this.color, this.width);
            this.pieces[i][j][2] = new Edge(this.color, this.width);        
          }
        }
      }
    }
    // printMatrix_nD(this.pieces);

    //  ~~~~~~~~~~~~~~~~~~~~~~~   Corners   ~~~~~~~~~~~~~~~~~~~~~~~
    let coV = [ //corner vectors
      [0, 0],
      [2, 0],
      [2, 2],
      [0, 2],
    ];
    //front => y = 0
    for(let i = 0; i < 4; i++){
      this.pieces[coV[i][0]][0][coV[i][1]].rotateOrigin("y", Math.PI * 0.5 * i);
      this.pieces[coV[i][0]][2][coV[i][1]].rotateOrigin("z", Math.PI);
      this.pieces[coV[i][0]][2][coV[i][1]].rotateOrigin("y", Math.PI * 0.5 * (i-1));
    }

    //  ~~~~~~~~~~~~~~~~~~~~~~~   Centers   ~~~~~~~~~~~~~~~~~~~~~~~
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

    //  ~~~~~~~~~~~~~~~~~~~~~~~   Edges   ~~~~~~~~~~~~~~~~~~~~~~~    
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

    for(let i = 0; i < 3; i++){
      for(let j = 0; j < 3; j++){
        for(let k = 0; k < 3; k++){
          this.pieces[i][j][k].changeStickers(RUBIKCOLOR[i][j][k]);
        }
      }
    }

  }
  
  show(){
    for(let i = 0; i < 3; i++){
      for(let j = 0; j < 3; j++){
        for(let k = 0; k < 3; k++){
          this.pieces[i][j][k].show(); 
        }
      }
    }
  }
  
  move(move){
    let angleOri = 1;
    if(/\'/.test(move)){
      angleOri = -1;
    }
    let axis, h;
    switch(true){
      case /^[uU]p?$/.test(move):
        axis = "z";
        h = 0;
        break;
      case /^[dD](own)?$/.test(move):
        axis = "z";
        h = 2;
        angleOri *= -1;
        break;
      case /^[rR](ight)?$/.test(move):
        axis = "x";
        h = 0;
        break;
      case /^[lL](eft)?$/.test(move):
        axis = "x";
        h = 2;
        angleOri *= -1;
        break;
      case /^[fF](ront)?$/.test(move):
        axis = "y";
        h = 0;
        break;
      case /^[bB](ack)?$/.test(move):
        axis = "y";
        h = 2;
        break;
    }
    //reversed not implemented
    let movedPieces = array_nD.o.permutation_3D(this.pieces, axis, h);
    // printMatrix_nD(movedPieces);
    this.rotatePieces(axis, Math.PI/2 * angleOri, movedPieces);

  }

  rotatePieces(axis, angle, slice){
    for(let i = 0; i < 3; i++){
      for(let j = 0; j < 3; j++){
        // slice[i][j].w = 107;
        slice[i][j].rotateOrigin(axis, angle);
      }
    }
  }
}
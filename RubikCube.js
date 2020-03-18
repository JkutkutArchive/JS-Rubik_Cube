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
    for(let i = 0; i < 3; i += 2){
      for(let j = 0; j < 3; j += 2){ 
        for(let k = 0; k < 3; k += 2){
          this.pieces[i][j][k].rotateOrigin("x", Math.PI * 0.5 * (k / 2 + j) * (Math.pow(-1, i/2)));
          this.pieces[i][j][k].rotateOrigin("z", Math.PI * 0.5 * i);
          this.pieces[i][j][k].rotateOrigin("x", Math.PI * 0.5 * i / 2);
        }
      }
    }

    //  ~~~~~~~~~~~~~~~~~~~~~~~   Centers   ~~~~~~~~~~~~~~~~~~~~~~~
    let cen =  [
      [1, 1, 0],
      [1, 0, 1],
      [1, 2, 1],
      [1, 1, 2],
    ];
    for(let i = 0; i < 4; i++){
      this.pieces[cen[i][0]][cen[i][1]][cen[i][2]].rotateOrigin("x", Math.PI / 2 * i);
      console.log(typeof(this.pieces[cen[i][0]][cen[i][1]][cen[i][2]]));
    }
    this.pieces[0][1][1].rotateOrigin("y", -Math.PI / 2);
    this.pieces[2][1][1].rotateOrigin("y", Math.PI / 2);

    //  ~~~~~~~~~~~~~~~~~~~~~~~   Centers   ~~~~~~~~~~~~~~~~~~~~~~~    
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
          [COLORSDIC.BLUE, COLORSDIC.YELLOW, COLORSDIC.ORANGE],//Z = 2
        ],
        [//Y = 1
          [COLORSDIC.WHITE, COLORSDIC.ORANGE],//Z = 0 (EDGE RIGHT TOP = ORANGE TOP)
          [COLORSDIC.ORANGE],//Z = 1 (CENTER RIGHT = ORANGE)
          [COLORSDIC.ORANGE, COLORSDIC.YELLOW],//Z = 2 (EDGE RIGHT BOTTOM = ORANGE BOTTOM)
        ],
        [//Y = 2
          [COLORSDIC.YELLOW, COLORSDIC.GREEN, COLORSDIC.ORANGE],//Z = 0
          [COLORSDIC.ORANGE, COLORSDIC.GREEN],//Z = 1
          [COLORSDIC.GREEN, COLORSDIC.WHITE, COLORSDIC.ORANGE],//Z = 2
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
          [COLORSDIC.GREEN],//Z = 2 (CENTER BACK = GREEN)
        ],
        [//Y = 2
          [COLORSDIC.WHITE, COLORSDIC.GREEN],//Z = 0
          [COLORSDIC.YELLOW],//Z = 1 (CENTER BOTTOM = YELLOW)
          [COLORSDIC.YELLOW, COLORSDIC.GREEN],//Z = 2
        ],
      ],
      [//X = 2
        [//Y = 0
          [COLORSDIC.BLUE, COLORSDIC.WHITE, COLORSDIC.RED],//Z = 0
          [COLORSDIC.RED, COLORSDIC.BLUE],//Z = 1
          [COLORSDIC.YELLOW, COLORSDIC.BLUE, COLORSDIC.RED],//Z = 2
        ],
        [//Y = 1
          [COLORSDIC.WHITE, COLORSDIC.RED],//Z = 0 (EDGE LEFT TOP = RED TOP)
          [COLORSDIC.RED],//Z = 1 (CENTER LEFT = RED)
          [COLORSDIC.RED, COLORSDIC.YELLOW],//Z = 2 (EDGE LEFT BOTTOM = RED BOTTOM)
        ],
        [//Y = 2
          [COLORSDIC.GREEN, COLORSDIC.YELLOW, COLORSDIC.RED],//Z = 0
          [COLORSDIC.RED, COLORSDIC.GREEN],//Z = 1
          [COLORSDIC.WHITE, COLORSDIC.GREEN, COLORSDIC.RED],//Z = 2
        ],
      ]
      
    ];

    for(let i = 0; i < 3; i++){
      for(let j = 0; j < 3; j++){
        for(let k = 0; k < 3; k++){
          if(RUBIKCOLOR[i][j][k].length > 0){

            this.pieces[i][j][k].changeStickers(RUBIKCOLOR[i][j][k]);
            // console.log(i + ", " + j + ", "+ k);
            // console.log(RUBIKCOLOR[i][j][k]);
            // console.log(this.pieces[i][j][k].getPos());
          }
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
  
  // m(move){
  //   let copy = [[], [], []];//make a copy;
    
  //   switch(move){
  //     case "U":
  //       //same z
  //       for(let n = 0; n < 3; n++){
  //         for(let m = 0; m < 3; m++){
  //           copy[n].push(this.pieces[-(m - 1) + 1][n][2]);//copy
  //         }
  //       }
  //       let w = 0;
  //       for(let n = 0; n < 3; n++){
  //         for(let m = 0; m < 3; m++){
  //           this.pieces[n][m][2] = copy[n][m];//move the pieces in the array
            
  //           let p = this.pieces[n][m][2];
  //           p.moves.push(["U", 0.5]);
            
            
  //           // p.pos.z = cubeW + 0.1 * w++ * cubeW;
            
  //         }
  //       }
  //       break;
  //     case "R":
  //       //same x
  //       for(let n = 0; n < 3; n++){
  //         for(let m = 0; m < 3; m++){
  //           copy[n].push(this.pieces[2][m][-(n - 1) + 1]);
  //         }
  //       }
  //       for(let n = 0; n < 3; n++){
  //         for(let m = 0; m < 3; m++){
  //           this.pieces[2][n][m] = copy[n][m];//move the pieces in the array
            
  //           let p = this.pieces[2][n][m];
  //           p.moves.push(["R", 0.5]);
  //           // p.pos.z += 3 * cubeW;
  //         }
  //       }     
  //       break;
  //   }
  // }
}
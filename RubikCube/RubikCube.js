class RubikCube{
  constructor(pos, dim){

    this.pos = (pos)? pos : createVector(0, 0, 0);
    this.dim = (dim)? dim : 3;
    
    this.pieces = [];
    
    // for(let i = 0; i < 3; i++){
    //     this.pieces.push([]);
    //   for(let j = 0; j < 3; j++){
    //     this.pieces[i].push([]);
    //     for(let k = 0; k < 3; k++){
    //       this.pieces[i][j].push(new RubikPiece(createVector(i, j, k)));
    //     }
    //   }
    // }
    for(let i = 0; i < 3; i++){
      this.pieces.push([]);
      for(let j = 0; j < 3; j++){
        this.pieces[i].push([]);
        for(let k = 0; k < 3; k++){
          this.pieces[i][j].push(new RubikPiece(createVector(i, j, k)));
        }
      }
    }

  }
  
  show(){
    // for(let i = 0; i < 3; i++){
    //   for(let j = 0; j < 3; j++){
    //     for(let k = 0; k < 3; k++){
    //       this.pieces[i][j][k].show(); 
    //     }
    //   }
    // }
    // this.pieces[0][0][2].show();
    // this.pieces[1][1][1].show();
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
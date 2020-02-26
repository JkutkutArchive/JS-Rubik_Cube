class RubikPiece{
  constructor(pos){
    this.pos = pos.sub(createVector(0,1,1)).mult(cubeW).sub(cubeW);//the actual pos
    this.truePos = pos.copy();//the inicial pos
    this.c = [];//colors array
    //x
    this.c.push((this.truePos.x != 0)? colors[(this.truePos.x > 0)? 0 : 1] : colors[6]);//xcolors
    //y
    this.c.push((this.truePos.y != 0)? colors[(this.truePos.y > 0)? 2 : 3] : colors[6]);//ycolors
    //z
    this.c.push((this.truePos.z != 0)? colors[(this.truePos.z > 0)? 4 : 5] : colors[6]);//zcolors
    
    
    
    
    this.angle = createVector(0, 0, 0);
    
    this.moves = [];//[["x", 0.5]] -> rotateX(Math.PI / 2);
    
    this.anguloP = 0;//animation
    
  }
  show(){
    /*
    11  12
    21  22  
    */
    // if(this.truePos.x == 0 && this.truePos.y == 0 && this.truePos.z == cubeW){
    //   console.log(this.truePos.toString());
    // }
    
    /*U permutation
      1º white, blue, red
      2º blue row
      3º mi oran and red row
      4º green row
    */
    while(0 != this.moves.length){
      switch(this.moves[0][0]){
        case "U":
          this.pos = createVector(-this.pos.y, this.pos.x, this.pos.z);
          // this.c = [this.c[1], this.c[0], this.c[2]];
          // this.truePos = createVector(-this.truePos.y, this.truePos.x, cubeW);
          break;
        case "R":
          this.pos = createVector(this.pos.x, this.pos.z, -this.pos.y);
          // this.c = [this.c[0], this.c[2], this.c[1]];
          // this.truePos = createVector(cubeW, -this.truePos.z, this.truePos.y);          
          break;
      }
      this.moves.splice(0, 1);
    }
    
    
    push();
    fill((this.truePos.x == 0 && this.truePos.y == 0 && this.truePos.z == 0)? color(255): colors[6]);
    
    translate(this.pos.copy());
    // translate(this.pos.copy().mult(1.5));
    // translate(this.pos.copy().mult(Math.abs(Math.sin(this.anguloP)) + 1));
    // this.anguloP += Math.PI / 360;
    box(cubeW);
    
    
//     rotateZ(theta.z);
//     rotateY(theta.x);
//     rotateX(theta.y);
    
//     rotateZ(this.angle.z);
//     rotateY(this.angle.y);
//     rotateX(this.angle.x);
    
    
    
    let r = cubeW / 2 + 1;
    let w = cubeW * 0.85;    
    fill(255);
    noStroke();
    
    //x
    push();
    fill((this.truePos.x > 0)? this.c[0] : colors[6]);
    translate(createVector(r, 0, 0));
    rotateY(Math.PI * 0.5);
    plane(w);
    pop();
    
    push();
    fill((this.truePos.x < 0)? this.c[0] : colors[6]);
    translate(createVector(-r, 0, 0));
    rotateY(Math.PI * 0.5);
    plane(w);
    pop();
    
    //y
    push();
    fill((this.truePos.y > 0)? this.c[1] : colors[6]);
    translate(createVector(0, r, 0));
    rotateX(Math.PI * 0.5);
    plane(w);
    pop();
    
    push();
    fill((this.truePos.y < 0)? this.c[1] : colors[6]);
    translate(createVector(0, -r, 0));
    rotateX(Math.PI * 0.5);
    plane(w);
    pop();
    
    //z
    push();
    fill((this.truePos.z > 0)? this.c[2] : colors[6]);
    translate(createVector(0, 0, r));
    plane(w);
    pop();
    
    push();
    fill((this.truePos.z < 0)? this.c[2] : colors[6]);
    translate(createVector(0, 0, -r));
    plane(w);
    pop();

    pop(); 
    
  }
}
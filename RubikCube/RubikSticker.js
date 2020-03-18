class RubikSticker{
    constructor(rX, rY, c, w){
        this.rX = rX * Math.PI / 2;
        this.rY = rY * Math.PI / 2;

        this.width = (w)? w : cubeW;
        this.c = (c)? c : COLORS[3];
    }
    show(){
        push();
        noStroke();
        fill(this.c);
        rotateX(this.rX);
        rotateY(this.rY);
        translate(0,0, this.width * 0.52);
        
        plane(this.width * 0.9);
        pop();
    }
    // move(posi){
    //     let rM = matrix.make.translation(posi);
    //     this.posMatrix = matrix.o.mult(rM,this.posMatrix);
    // }
    // setPos(posMatrix){
    //     this.posMatrix = posMatrix;
    // }
}
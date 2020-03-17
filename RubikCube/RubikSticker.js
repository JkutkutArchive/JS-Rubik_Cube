class Sticker{
    /*
    TO DO:
        - Get pos of the father piece
        - Get orientation of father key 
    */ 
    constructor(pos, orientation, c){
        this.pos = pos;
        this.orientation = orientation;
        this.c = (c)? c : color(colors[3]);
    }
    show(){
        push();
        noStroke();
        fill(this.c);
        translate(this.pos);
        // rotate();
        plane(100);
        pop();
    }
}
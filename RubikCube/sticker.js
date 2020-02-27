class Sticker{
    constructor(pos, orientation, color){
        this.pos = pos;
        this.orientation = orientation;
        this.color = color;
    }
    show(){
        //x
        push();
        fill(color);
        translate(pos);
        // rotate();
        plane(100);
        pop();
    }
}
class Pin{
    constructor(x, y, player){
        this.x = x;
        this.y = y;
        this.rad = pin_radius;
        this.color = color( 0, 255, 50)
        if(player==1){
            this.color = color( 255, 0 ,50)
        }
    }
    show()
    {
        fill(this.color);
        stroke(this.color);
        ellipse(this.x,this.y,this.rad,this.rad);
    }
}
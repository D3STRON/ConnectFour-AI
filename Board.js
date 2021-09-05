class Board{
    
    constructor()
    {
        this.size = board_size;
        this.height_of_column = new Array(board_size).fill(0);
        this.board_array = new Matrix(this.size*this.size,1)
        this.connect = connect
        this.display_size = this.size*this.size*10
        this.unit_size = this.size*10
        this.padding = 50;
    }

    show()
    {
        fill(222)
        stroke(150)
        rect(50,50,this.display_size,this.display_size);
        for(let i=0;i<this.size;i++)
        {
            for(let j=0;j<this.size;j++)
            {
                fill(0)
                stroke(0)
                ellipse((this.unit_size*i)+(this.unit_size/2)+this.padding,(this.unit_size*j)+(this.unit_size/2)+this.padding,pin_radius,pin_radius)
            }
        }
    }

    evaluate_move(playerType, column)
    {
        var row = this.height_of_column[column];
        if(this.put_pin(playerType,column)==false){

            return -1*playerType*Infinity;
        }
        var score = 0;
        var score_divisor = (Math.abs(Math.floor(this.size/2)-column)+1)
        score += Math.floor(7/score_divisor);
        score += this.check_score(row, column, 1, 1) + this.check_score(row,column,1,0) 
                + this.check_score(row,column, -1, 1) + this.check_score(row,column,0, 1); 
        return score*playerType;
    }

    check_score(row, column, increment_row, increment_col)
    {
        var type =  this.board_array.get(this.map_coordinates(row,column),0);
        var next_row = row;
        var next_col = column;
        var pins = 0;
        var gaps = 0;
        while(next_row>=0 && next_row<this.size 
            && next_col>=0 && next_col<this.size 
            && (this.board_array.get(this.map_coordinates(next_row,next_col),0)==type 
            || this.board_array.get(this.map_coordinates(next_row,next_col),0)==0))
        {
            next_row += increment_row;
            next_col += increment_col;
        }
        next_row -= increment_row;
        next_col -= increment_col;
        var continuous_pins = 0;
        var continuous = true;
        while(next_row>=0 && next_row<this.size 
            && next_col>=0 && next_col<this.size 
            && (this.board_array.get(this.map_coordinates(next_row,next_col),0)==type 
            || this.board_array.get(this.map_coordinates(next_row,next_col),0)==0))
        {
            
            if(this.board_array.get(this.map_coordinates(next_row,next_col),0)==type){
                pins+=1;
                continuous_pins+=1;
                continuous = true;
                if (continuous && continuous_pins ==this.connect)
                {
                    return Infinity
                }
            }
            else{
                if(this.board_array.get(this.map_coordinates(next_row,next_col),0)==0)
                {
                    gaps +=1;
                }
                continuous_pins = 0;
                continuous = false;
            }
            next_row -= increment_row;
            next_col -= increment_col;  
        }
        if(pins+gaps>=this.connect && pins>1)
        {
            return pins*points_per_pin + gaps*0.2;
        }
        return gaps*0.2;
    }
    map_coordinates(row, column)
    {
        //maps matrix coordinates to linear coordinates
        return row*this.size + column;
    }

    remove_pin(column)
    {
        this.height_of_column[column]--;
        var row = this.height_of_column[column];
        this.board_array.put(this.map_coordinates(row,column),0,0);
    }
    put_pin(playerID,column)
    {
        if(this.height_of_column[column]<this.size)
        {
            var row = this.height_of_column[column];
            this.board_array.put(this.map_coordinates(row,column),0,playerID);
            this.height_of_column[column]++;
            return true;
        }
        return false;
    }
}
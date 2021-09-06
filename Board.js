class Board{
    
    constructor()
    {
        this.size = board_size;
        this.height_of_column = new Array(board_size).fill(0);
        this.board_array = new Matrix(this.size*this.size,1);
        this.connect = connect;
        this.display_size = this.size*this.size*10;
        this.unit_size = this.size*10
        this.padding = 50;
        this.gap_point = 0.2;
        this.pin_point = 2;
        this.committed_pins = 0;
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
        //the closer to the center the more the score it gets
        //lesser the (chosen_column- Center_column) lesser will be the score divisor
        //hence more will be score
        var score_divisor = (Math.abs(Math.floor(this.size/2)-column)+1)
        var score = Math.floor(this.size/score_divisor);
        // check socre in horizontal vertical and diagonal directions
        score += this.check_score(row, column, 1, 1) 
                    + this.check_score(row,column,1,0) 
                        + this.check_score(row,column, -1, 1) 
                            + this.check_score(row,column,0, 1); 
        return score*playerType;
    }

    check_score(row, column, increment_row, increment_col)
    {
        var type =  this.get_pin_at(row,column);
        var next_row = row;
        var next_col = column;
        var pins = 0;
        var gaps = 0;
        //this loop goes the extreme end of the line we are trying to check 
        while(next_row>=0 && next_row<this.size 
            && next_col>=0 && next_col<this.size 
            && (this.get_pin_at(next_row,next_col)==type 
            || this.get_pin_at(next_row,next_col)==0))
        {
            next_row += increment_row;
            next_col += increment_col;
        }
        // we need to come a staep back if we hit another pin or the edge to start counting
        next_row -= increment_row;
        next_col -= increment_col;
        var continuous_pins = 0;
        var continuous = true;
        //now we count the pins
        while(next_row>=0 && next_row<this.size 
            && next_col>=0 && next_col<this.size 
            && (this.get_pin_at(next_row,next_col)==type 
            || this.get_pin_at(next_row,next_col)==0))
        {
            
            if(this.get_pin_at(next_row,next_col)==type){
                pins+=1;
                continuous_pins+=1;
                continuous = true;
                if (continuous && continuous_pins ==this.connect)
                {
                    return Infinity
                }
            }
            else{
                if(this.get_pin_at(next_row,next_col)==0)
                {
                    gaps +=1;
                }
                continuous_pins = 0;
                continuous = false;
            }
            next_row -= increment_row;
            next_col -= increment_col;  
        }
        //the gaps in the line + the pin should be 4 so that its possible to create a line of 4
        if(pins+gaps>=this.connect && (pins>1 || gaps>=this.connect-1))
        {
            return pins*points_per_pin + gaps*this.gap_point;
        }
        return 0
    }

    get_pin_at(row, column)
    {
        return this.board_array.get(this.map_coordinates(row,column),0)
    }

    map_coordinates(row, column)
    {
        //maps matrix coordinates to linear coordinates
        return row*this.size + column;
    }

    //this is just for min max scenario checking
    remove_pin(column)
    {
        if(this.height_of_column[column]>0)
        {
            this.height_of_column[column]--;
            var row = this.height_of_column[column];
            this.board_array.put(this.map_coordinates(row,column),0,0);
            return true;
        }
        return false;
    }
    //this is just for min max scenario checking
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

    // this uncommits the move on the board
    uncommit_move(column)
    {
        if(this.height_of_column[column]>0)
        {
            this.height_of_column[column]--;
            var row = this.height_of_column[column];
            this.board_array.put(this.map_coordinates(row,column),0,0);
            this.committed_pins--;
            return true;
        }
        return false;
    }

    // this function commits the move to the board
    commit_move(playerID,column)
    {
        if(this.height_of_column[column]<this.size)
        {
            var row = this.height_of_column[column];
            this.board_array.put(this.map_coordinates(row,column),0,playerID);
            this.height_of_column[column]++;
            this.committed_pins++;
            return true;
        }
        return false;
    }
}
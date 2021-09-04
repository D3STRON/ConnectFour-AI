class Board{
    
    constructor()
    {
        this.size = board_size;
        this.height_of_column = new Array(board_size).fill(0);
        this.board_array = new Matrix(this.size*this.size,1)
        this.connect = connect
    }

    add_and_check(playerID, column)
    {
        if(this.height_of_column[column]==this.size){
            return 0;
        }
        var row = this.height_of_column[column];
        this.board_array.put(this.map_coordinates(row,column),0,playerID);
        this.height_of_column[column]++;

        var horizontal = this.check(row,column,0,1) + this.check(row,column,0,-1) + 1;
        if(horizontal>=this.connect)
        {
            return playerID;
        }
        var vertical = this.check(row,column,1,0) + this.check(row,column,-1,0) + 1;
        if(vertical>=this.connect)
        {
            return playerID;
        }
        var diagonal_back = this.check(row,column,1,1) + this.check(row,column,-1,-1) + 1;
        if(diagonal_back>=this.connect)
        {
            return playerID;
        }
        var diagonal_front = this.check(row,column,1,-1) + this.check(row,column,-1,1) + 1
        if(diagonal_front>=this.connect)
        {
            return playerID;
        }
        
        return 0;
    }

    check(row, column, increment_row, increment_col)
    {
        var type =  this.board_array.get(this.map_coordinates(row,column),0);
        var next_row = row;
        var next_col = column;
        var pins = -1;
        while(next_row>=0 && next_row<this.size 
            && next_col>=0 && next_col<this.size 
            && this.board_array.get(this.map_coordinates(next_row,next_col),0)==type)
        {
            next_row += increment_row;
            next_col += increment_col;
            pins+=1;
        }
        return pins;
    }

    evaluate(playerType, column)
    {
        var row = this.height_of_column[column];
        var score = 0;
        if(row==this.size){

            return -1*playerType*Infinity;
        }
        this.board_array.put(this.map_coordinates(row,column),0,playerType);
        this.height_of_column[column]++;
        if(Math.floor(this.size/2)==column)
        {
            score += 3;
        }
        score += this.check_minMax(row, column, 1, 1) + this.check_minMax(row,column,1,0) 
                + this.check_minMax(row,column, -1, 1) + this.check_minMax(row,column,0, 1); 
        return score*playerType;
    }

    check_minMax(row, column, increment_row, increment_col)
    {
        var type =  this.board_array.get(this.map_coordinates(row,column),0);
        var next_row = row;
        var next_col = column;
        var pins = -1;
        while(next_row>=0 && next_row<this.size 
            && next_col>=0 && next_col<this.size 
            && this.board_array.get(this.map_coordinates(next_row,next_col),0)==type)
        {
            next_row += increment_row;
            next_col += increment_col;
        }
        next_row -= increment_row;
        next_col -= increment_col;
        var continuous = true;
        while(next_row>=0 && next_row<this.size 
            && next_col>=0 && next_col<this.size 
            && (this.board_array.get(this.map_coordinates(next_row,next_col),0)==type 
            || this.board_array.get(this.map_coordinates(next_row,next_col),0)==0))
        {
            
            if(this.board_array.get(this.map_coordinates(next_row,next_col),0)==type){
                if (continuous && pins ==this.connect-1)
                {
                    return Infinity
                }
                pins+=1;
            }
            else{
                continuous = false;
            }
            next_row -= increment_row;
            next_col -= increment_col;  
        }
        return pins*2;
    }
    map_coordinates(row, column)
    {
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
        var row = this.height_of_column[column];
        this.board_array.put(this.map_coordinates(row,column),0,playerID);
        this.height_of_column[column]++;
    }
}
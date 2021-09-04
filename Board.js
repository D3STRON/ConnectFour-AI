class Board{
    
    constructor()
    {
        this.size = board_size;
        this.height_of_column = new Array(board_size).fill(0);
        this.board_array = new Matrix(this.size*this.size,1)
        this.connect = connect
    }

    evaluate_player(playerType, column)
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
            score += 5;
        }
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
        var continuous = true;
        while(next_row>=0 && next_row<this.size 
            && next_col>=0 && next_col<this.size 
            && (this.board_array.get(this.map_coordinates(next_row,next_col),0)==type 
            || this.board_array.get(this.map_coordinates(next_row,next_col),0)==0))
        {
            
            if(this.board_array.get(this.map_coordinates(next_row,next_col),0)==type){
                pins+=1;
                continuous = true;
                if (continuous && pins ==this.connect)
                {
                    return Infinity
                }
            }
            else{
                if(this.board_array.get(this.map_coordinates(next_row,next_col),0)==0)
                {
                    gaps +=1;
                }
                continuous = false;
            }
            next_row -= increment_row;
            next_col -= increment_col;  
        }
        if(pins+gaps>=this.connect)
        {
            return pins*points_per_pin;
        }
        return 0;
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
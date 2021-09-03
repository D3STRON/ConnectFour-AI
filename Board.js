class Board{
    
    constructor()
    {
        this.size = board_size;
        this.height_of_column = new Array(board_size).fill(0);
        this.board_array = new Matrix(this.size*this.size,1)
        this.connect = 4
    }

    add_and_check(playerID, column)
    {
        if(this.height_of_column[column]==this.size){
            return -playerID;
        }
        var row = this.height_of_column[column];
        this.board_array.put(this.map_coordinates(row,column),0,playerID);
        this.height_of_column[column]++;

        var horizontal = this.check(row,column,0,1) + this.check(row,column,0,-1) + 1;
        var vertical = this.check(row,column,1,0) + this.check(row,column,-1,0) + 1;
        var diagonal_back = this.check(row,column,1,1) + this.check(row,column,-1,-1) + 1;
        var diagonal_front = this.check(row,column,1,-1) + this.check(row,column,-1,1) + 1
        if(horizontal>=this.connect ||
            vertical>=this.connect ||
            diagonal_back>=this.connect ||
            diagonal_front>=this.connect)
        {
            return playerID;
        }
        return 'not over';
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

    map_coordinates(row, column)
    {
        return row*this.size + column;
    }
}
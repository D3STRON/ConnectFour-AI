class Board{
    
    constructor(rows)
    {
        this.height_of_column = []
        this.board_matrix=[]
        this.connect = 4
        this.rows = rows
        this.cols = rows
        for(let i=0;i<this.rows;i++)
        {
            this.board_matrix[i]=[]
            for(let j=0;j<this.cols;j++)
            {
                this.board_matrix[i][j]=0;
            }
            this.height_of_column[i]=0
        }
    }

    add_and_check(playerID, column)
    {
        var row = this.height_of_column[column];
        this.board_matrix[row][column] = playerID;
        this.height_of_column[column]++;

        var horizontal = this.check(row,column,0,1) + this.check(row,column,0,-1) + 1;
        var vertical = this.check(row,column,1,0) + this.check(row,column,-1,0) + 1;
        var diagonal_back = this.check(row,column,1,1) + this.check(row,column,-1,-1) + 1;
        var diagonal_front = this.check(row,column,1,-1) + this.check(row,column,-1,1) + 1
        console.log(this.board_matrix);
        if(horizontal>=this.connect ||
            vertical>=this.connect ||
            diagonal_back>=this.connect ||
            diagonal_front>=this.connect)
        {
            return true;
        }
        return false;
    }

    check(row, column, increment_row, increment_col)
    {
        var type =  this.board_matrix[row][column];
        var next_row = row;
        var next_col = column;
        var pins = -1;
        while(next_row>=0 && next_row<this.rows && next_col>=0 && next_col<this.cols && this.board_matrix[next_row][next_col]==type)
        {
            next_row += increment_row;
            next_col += increment_col;
            pins+=1;
        }
        return pins;
    }
}
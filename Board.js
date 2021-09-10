class Board{
    
    constructor()
    {
        this.size = board_size;
        this.size_vertical = board_vertical_size;
        this.height_of_column = new Array(board_size).fill(0);
        this.board_array = new Matrix(this.size*this.size,1);
        this.connect = connect;
        this.display_size = this.size*this.size*10;
        this.unit_size = this.size*10
        this.padding = 50;
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
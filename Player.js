class Player{
    constructor(Parent)
    {
        if(Parent instanceof Player)
        {
            this.brain = Parent.brain.copy();
        }
        else{
            var numI = board_size*board_size
            var numH = Math.round(numI/2)
            var numE = Math.round(numH/2)
            this.brain = new NeuralNetwork(numI, numH, numE,1);
        }
        this.fitness = 0;
    }
    
    board_evaluation_NN(board)
    {
        let output = this.brain.feedforward(board.board_array);
        return output.data[0][0]*10;
    }

    make_move_minMax(playerType,board, depth, expectedDepth, al, be)
    {
        var max = -Infinity
        var min = Infinity
        var output = board.put_pins<board.size_vertical*board.size?-1*Infinity*playerType:0;
        var index;
        var available_column;
        for(let j=0, direction=1, i=3;j<board.size;j++, direction*=-1, i = i + direction*j)
        {
            var score;
            if(board.put_pin(playerType,i)==true)
            {
                available_column = i;
                if(this.is_winning_move(board, i)==true)
                {
                    // print_board(board)
                    // console.log('depth',depth,'move',i,'score',Infinity*playerType);
                    board.remove_pin(i);
                    index = i;
                    output = Infinity*playerType;
                    break;
                }
                if(depth<expectedDepth)
                {
                    score = this.make_move_minMax(playerType*-1,board,depth+1,expectedDepth,al,be);
                }
                else{
                    score = this.board_evaluation_NN(board);
                }
                // print_board(board)
                // console.log('depth',depth,'move',i,'score',score);
                board.remove_pin(i);
                if(score == playerType*Infinity)
                {
                    output = score;
                    index = i;
                    break;
                }
                if(playerType>0)
                {
                    al = Math.max(al,score);
                    if(score>max)
                    {
                        max = score;
                        output = score;
                        index = i;
                    }
                }
                else if(playerType<0)
                {
                    be = Math.min(be,score);
                    if(score<min){
                        min = score;
                        output = score;
                        index = i;
                    }
                }
                // console.log('alpha',al,'beta',be)
                if(al>=be)
                   { 
                    //    console.log('pruned here');
                       break;}
            }
        }
        if(depth==1)
        {
            index = index===undefined?available_column:index;
            return [index,output];
        }
        return output;
    } 

    is_winning_move(board, column)
    {
        // check winning move along all the orientation around the move
        switch(true){
            // check in forward diagonal
            case this.check_connections(board, column, 1, 1): 
                return true;
            // check in vertical
            case this.check_connections(board, column, 1,0):
                return true;
            //check in backward diagonal
            case this.check_connections(board, column, -1, 1):
                return true; 
            // check in horizontal
            case this.check_connections(board, column, 0, 1):
                return true;
        }
        return false;
    }

    check_connections(board, column, increment_row, increment_col)
    {
        // checks connections from 3 gaps to left or right or top or bottom of the made move to check if 4 is connected
        var row = board.height_of_column[column]-1;
        var outer_row_limit = row + increment_row*(board.connect-1);
        var outer_col_limit = column + increment_col*(board.connect-1);
        var type = board.get_pin_at(row,column);
        // this loops sets a slot of 4 gasp in consideration
        for(let i=0;i<board.connect;i++)
        {
            var player_pins = 0;
            var next_row = outer_row_limit;
            var next_col = outer_col_limit;
            for(let j=0;j<board.connect;j++)
            {
                // this loop analyzes that slot of 4 gaps for the pin configuration in it
                if(next_row>=0 && next_row<board.size_vertical
                    && next_col>=0 && next_col<board.size)
                {
                    var this_pin = board.get_pin_at(next_row,next_col);
                    if(this_pin==type)
                    {
                        player_pins +=1;
                        if(player_pins==board.connect)
                        {
                            return true;
                        }
                    }
                }
                else{
                    break;
                }
                next_row-=increment_row;
                next_col-=increment_col;
            }
            outer_row_limit-=increment_row;
            outer_col_limit-=increment_col;
        }
        return false;
    }
}
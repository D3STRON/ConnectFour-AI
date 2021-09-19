class Player{
    constructor(ParentPlayer)
    {
        if(ParentPlayer instanceof Player)
        {
            this.pointA = ParentPlayer.pointA;
            this.pointB = ParentPlayer.pointB;
            this.first_player_point = ParentPlayer.first_player_point;
        }
        else{
            this.pointA = -30;
            this.pointB = 30;
            this.player_point_multiplier = 3;
        }
        this.fitness = 0;
        this.default_depth = 6;
        this.first_player = 'F';
        this.second_player = 'S';
        this.both_player = 'B'
    }
    
    board_evaluation_NN(board)
    {
        let output = this.brain.feedforward(board.board_array);
        return output.data[0][0]*10;
    }

    mutate(rate)
    {
        if(Math.random()<rate)
        {
            this.pointA += Math.round(randomGaussian(0, 5));
            console.log(this.pointA)
        }
        if(Math.random()<rate)
        {
            this.pointB += Math.round(randomGaussian(0, 5));
            console.log(this.pointB)
        }
        if(Math.random()<rate)
        {
            this.player_point_multiplier += Math.round(randomGaussian(0, 2));
            console.log(this.player_point_multiplier)
        }
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
                    score = this.board_evaluation(board);
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
        // check winning move along all the diagonals around the move
        switch(true){
            case this.check_connections(board, column, 1, 1): 
                return true;
            case this.check_connections(board, column, 1,0):
                return true
            case this.check_connections(board, column, -1, 1):
                return true; 
            case this.check_connections(board, column, 0, 1):
                return true;
        }
        return false;
    }

    check_connections(board, column, increment_row, increment_col)
    {
        // checks connections 4 move to left or right
        var row = board.height_of_column[column]-1;
        var outer_row_limit = row + increment_row*(board.connect-1);
        var outer_col_limit = column + increment_col*(board.connect-1);
        var type = board.get_pin_at(row,column);
        for(let i=0;i<board.connect;i++)
        {
            var player_pins = 0;
            var next_row = outer_row_limit;
            var next_col = outer_col_limit;
            for(let j=0;j<board.connect;j++)
            {
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

    board_evaluation(board)
    {
        var score =0;
        var column_state=Array(board.size).fill().map(()=>Array(board.size_vertical).fill(''));
        for(let i =0;i<board.size ;i++)
        {
            var left = i-1;
            var right = i+1;
            var row = board.height_of_column[i];
            while(
                row<board.size_vertical &&
                    ((left>=0 && board.get_pin_at(row,left)!=0)
                ||  (right<board.size && board.get_pin_at(row,right)!=0)
                ||  (right<board.size && row>0 && board.get_pin_at(row-1,right)!=0)
                ||  (left>=0 &&  row>0 && board.get_pin_at(row-1,left)!=0))
            )
            {
                score += this.check_linear_evaluation(board,column_state, row, i, 0, 1);
                row+=1;
            }
        }
        // console.log(column_state)
        return score + this.evaluate_column_state(column_state, board);
    }

    check_linear_evaluation(board, column_state, row, column, increment_row, increment_col)
    {
        var outer_row_limit = row + increment_row*(board.connect-1);
        var outer_col_limit = column + increment_col*(board.connect-1);
        var score =0;
        for(let i=0;i<board.connect;i++)
        {
            var pinA = 0;
            var pinB = 0;
            var next_row = outer_row_limit;
            var next_col = outer_col_limit;
            for(let j=0;j<board.connect;j++)
            {
                if(next_row>=0 && next_row<board.size_vertical
                    && next_col>=0 && next_col<board.size)
                {
                    var this_pin = board.get_pin_at(next_row,next_col);
                    if(this_pin==-1)
                    {
                        pinA +=this_pin;
                    }
                    if(this_pin==1)
                    {
                        pinB +=this_pin;
                    }
                }
                else{
                    pinA = 0;
                    pinB = 0;
                    break;
                }
                next_row-=increment_row;
                next_col-=increment_col;
            }
            if(pinA==0 || pinB==0)
            {
                if(Math.abs(pinB)==board.connect-1)
                {
                    if(row == board.height_of_column[column] && board.put_pins%2!=0)
                    {
                        return Infinity;
                    }
                    else if((row+1)%2==0 && row != board.height_of_column[column])
                    {
                        column_state[column][row] = this.second_player;
                        return score;
                    }
                    else if((row+1)%2!=0 && row != board.height_of_column[column])
                    {
                        if(column_state[column][row]==this.first_player)
                        {
                            column_state[column][row] = this.both_player;
                            return score;
                        }
                        column_state[column][row] = this.second_player;
                    }
                }
                else if(Math.abs(pinA)==board.connect-1)
                {
                    if(row == board.height_of_column[column] && board.put_pins%2==0)
                    {
                        return -Infinity;
                    }
                    else if((row+1)%2!=0 && row != board.height_of_column[column])
                    {
                        if(column_state[column][row]==this.second_player)
                        {
                            column_state[column][row] = this.both_player;
                            return score;
                        }
                        column_state[column][row] = this.first_player;
                    }
                }
                else if((row+1)%2!=0 && row != board.height_of_column[column])
                {
                    score += pinA*this.player_point_multiplier;
                }
                score +=  pinB;
            }
            outer_row_limit-=increment_row;
            outer_col_limit-=increment_col;
        }
        if(increment_col==1 && increment_row==0)
        {
            score += this.check_linear_evaluation(board,column_state, row, column, 1, 1);
        }
        else if(increment_col==1 && increment_row==1)
        {
            score += this.check_linear_evaluation(board,column_state, row, column, -1, 1);
        }
        return score;
    }

    evaluate_column_state(column_state, board)
    {
        for(let column =0 ; column <board.size; column++)
        {
            var found  = false;
            var row = 0;
            while(row <column_state[column].length)
            {
                if(column_state[column][row]!='')
                {
                    found = true;
                    var points = this.get_points(column_state, column, row);
                    if(points !=0)
                    {
                        return points;
                    }
                }
                row++;
            }
            if(found == false)
            {
                column_state[column] = [];
            }
        }
        return 0;
    }

    get_points(column_state, column, row)
    {
        var type = column_state[column][row];
        var score = 0;
        if(type == this.first_player || type == this.both_player)
        {
            score = this.pointA*(board_vertical_size-row);
        }
        else if(type == this.second_player)
        {
            if((row + 1)%2==0)
            {
                score = this.pointB*(board_vertical_size-row);
            }
            else{
                score = 20;
            }
        }
        for(let j =0;j<board_size;j++)
        {
            var found  = false;
            var i = 0;
            while(i<column_state[j].length)
            {
                if(j!=column && column_state[j][i]!='')
                {
                    found = true;
                    if( (type==this.both_player || column_state[j][i]!=type) && (i+1)%2 != 0)
                    {
                        return 0;
                    }
                }
                i++;
            }
            if(found == false && j!=column)
            {
                column_state[j] = [];
            }
        }
        return score;
    }
}
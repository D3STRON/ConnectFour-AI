class Player{
    constructor(ParentPlayer)
    {
        if(ParentPlayer instanceof Player)
        {   
            this.gap_point = ParentPlayer.gap_point;
            this.pin_point = ParentPlayer.pin_point;
            this.center_point = ParentPlayer.center_point;
            this.pin_point_opponent = ParentPlayer.pin_point_opponent;
        }
        else{
            //these evaluation point were brewed by genetic algo
            //you can start with random values and reach these results
            this.gap_point = 1;
            this.pin_point = 10;
            this.center_point = [0,1,3.5,7,3.5,1,0];
            this.pin_point_opponent = 5;
            //values I started with
            // this.gap_point = 0.3;
            // this.pin_point = 2;
            // this.center_point = 7;
            // this.pin_point_opponent = 2;
        }
        this.fitness = 0;
        this.default_depth = 7;
    }
    
    make_move_NN(board)
    {
        let output = this.brain.feedforward(board.board_array);
        let max = -Infinity;
        let max_index = 0;
        for(let i =0;i<board.size;i++){
            if(board.height_of_column[i]<board.size && output.get(i,0)>max){
                
                max = output.get(i,0);
                max_index = i;
            }
        }
        return max_index;
    }

    mutate(rate)
    {

        if(Math.random()<rate)
        {
            this.gap_point += randomGaussian(0, 0.1)
            console.log(this.gap_point)
        }
        if(Math.random()<rate)
        {
            this.pin_point += Math.round(randomGaussian(0, 1));
            console.log(this.pin_point)
        }
        if(Math.random()<rate)
        {
            this.center_point += Math.round(randomGaussian(0, 1));
            console.log(this.center_point)
        }
        if(Math.random()<rate)
        {
            this.pin_point_opponent += Math.round(randomGaussian(0, 1));
            console.log(this.pin_point_opponent)
        }
    }

    make_move_minMax(playerType,board, depth, expectedDepth, al, be)
    {
        var max = -Infinity
        var min = Infinity
        var output;
        var index;
        for(let i=0;i<board.size;i++)
        {
            var score;
            if(board.put_pin(playerType,i)==true)
            {
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
                    if(score>=max)
                    {
                        max = score;
                        output = score;
                        index = i;
                    }
                }
                else if(playerType<0)
                {
                    be = Math.min(be,score);
                    if(score<=min){
                        min = score;
                        output = score;
                        index = i;
                    }
                }
                // console.log('alpha',al,'beta',be)
                // if(al>=be)
                //    { 
                //     //    console.log('pruned here');
                //        break;}
            }
        }
        if(depth==1)
        {
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
                if(next_row>=0 && next_row<board.size
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
        for(let i =0;i<board.size ;i++)
        {
            var left = i-1;
            var right = i+1;
            var row = board.height_of_column[i];
            while(
                    (left>=0 && row>=0 && row<board_vertical_size && board.get_pin_at(row,left)!=0)
                ||  (right<board.size && row>=0 && row<board_vertical_size && board.get_pin_at(row,right)!=0)
                ||  (right<board.size && row>0 && row<board_vertical_size && board.get_pin_at(row-1,right)!=0)
                ||  (left>=0 && row>0 && row<board_vertical_size && board.get_pin_at(row-1,left)!=0)
                ||  (row>0 && row<board_vertical_size && board.get_pin_at(row-1,i)!=0)
            )
            {
                score += this.check_linear_evaluation(board, row, i, 0, 1);
                score += this.check_linear_evaluation(board, row, i, 1, 0);
                score += this.check_linear_evaluation(board, row, i, 1, 1);
                score += this.check_linear_evaluation(board, row, i, -1, 1);
                row+=1;
                // console.log(row)
            }
        }
        return score;
    }

    check_linear_evaluation(board, row, column, increment_row, increment_col)
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
            var sample =[]
            for(let j=0;j<board.connect;j++)
            {
                if(next_row>=0 && next_row<board.size
                    && next_col>=0 && next_col<board.size)
                {
                    var this_pin = board.get_pin_at(next_row,next_col);
                    sample.push(this_pin);
                    if(this_pin==1)
                    {
                        pinA +=this_pin //+ this.center_point[next_col]*this_pin;
                    }
                    if(this_pin==-1)
                    {
                        pinB +=this_pin //+ this.center_point[next_col]*this_pin;
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
            // console.log(sample);
            if(pinA==0 || pinB==0)
            {
                score += pinA + pinB;
            }
            else if(pinA==1 && pinB==2)
            {
                score += pinA;
            }
            else if(pinA==1 && pinB==2)
            {   
                score += pinB;
            }
            outer_row_limit-=increment_row;
            outer_col_limit-=increment_col;
        }
        return score;
    }
}
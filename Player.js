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
            this.gap_point = 2;
            this.pin_point = 9;
            this.center_point = 5;
            this.pin_point_opponent = 10;
            //values I started with
            // this.gap_point = 0.3;
            // this.pin_point = 2;
            // this.center_point = 7;
            // this.pin_point_opponent = 2;
        }
        this.fitness = 0;
        this.default_depth = 8;
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
            this.gap_point += randomGaussian(0, 0.5)
            console.log(this.gap_point)
        }
        if(Math.random()<rate)
        {
            this.pin_point += Math.round(randomGaussian(0, 2));
            console.log(this.pin_point)
        }
        if(Math.random()<rate)
        {
            this.center_point += Math.round(randomGaussian(0, 2));
            console.log(this.center_point)
        }
        if(Math.random()<rate)
        {
            this.pin_point_opponent += Math.round(randomGaussian(0, 2));
            console.log(this.pin_point_opponent)
        }
    }

    make_move_minMax(playerType,board, depth, expectedDepth, al, be, prev_score)
    {
        var max = -Infinity
        var min = Infinity
        //output is what the function will finally give it could be 
        //minimum of maximum value depending upon the player type
        var output = -1*Infinity*playerType;
        var index;
        var available_column;
        //we order the moves around the center 3,2,4,1,5,0,6
        for(let j=0, direction=1, i=3;j<board.size;j++, direction*=-1, i = i + direction*j)
        {
            if(board.put_pin(playerType,i)==true){
                available_column = i;
                var score = this.evaluate_move(board,i) + prev_score;
                if(score == playerType*Infinity)
                {
                    board.remove_pin(i);
                    output = score;
                    index = i;
                    break;
                }
                if(depth<expectedDepth)
                {
                    score = this.make_move_minMax(-1*playerType,board, depth+1, expectedDepth, al,be ,score);
                }
                board.remove_pin(i);
                if(score == playerType*Infinity)
                {
                    output = score;
                    index = i;
                    break;
                }
                else if(playerType>0)
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
                if(al>=be)
                {
                    break;
                }
            }
        }
        if(depth==1)
        {
            index = index===undefined?available_column:index;
            return [index,output];
        }
        return output;
    } 

    evaluate_move(board, column)
    {
        //the closer to the center the more the score it gets
        //lesser the (chosen_column- Center_column) lesser will be the score divisor
        //hence more will be score
        var row = board.height_of_column[column]-1;
        var score_divisor = (Math.abs(Math.floor(board.size/2)-column)+1)
        var score = Math.floor(this.center_point/score_divisor);
        score_divisor = (Math.abs(Math.floor(board.size_vertical/2)-row)+1)
        score += Math.floor(this.center_point/score_divisor);
        var type = board.get_pin_at(row,column);
        // check socre in horizontal vertical and diagonal directions around the move
        score += this.check_move_score(board, column, 1, 1) 
                + this.check_move_score(board, column, 1,0)
                + this.check_move_score(board, column, -1, 1) 
                + this.check_move_score(board, column, 0, 1);
        return score*type;
    }

    check_move_score(board, column, increment_row, increment_col)
    {
        var row = board.height_of_column[column]-1;
        var outer_row_limit = row + increment_row*(board.connect-1);
        var outer_col_limit = column + increment_col*(board.connect-1);
        var type = board.get_pin_at(row,column);
        var score =0;
        for(let i=0;i<board.connect;i++)
        { 
            var gaps = 0;
            var opponent_pins = 0;
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
                            return Infinity;
                        }
                    }
                    else if(this_pin==0)
                    {
                        gaps+=1;
                    }
                    else{
                        opponent_pins+=1;
                    }
                }
                else{
                    break;
                }
                next_row-=increment_row;
                next_col-=increment_col;
            }
            if(player_pins+gaps==board.connect)
            {
                score += player_pins*this.pin_point + gaps*this.gap_point;
            }
            else if(player_pins==1)
            {
                //player gets thic point for eleminating the opponents chances along this file
                score += opponent_pins*this.pin_point_opponent;
            }
            outer_row_limit-=increment_row;
            outer_col_limit-=increment_col;
        }
        return score;
    }
}
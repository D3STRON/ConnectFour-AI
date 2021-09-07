class Player{
    constructor(ParentPlayer)
    {
        if(ParentPlayer instanceof Player)
        {   
            this.gap_point = ParentPlayer.gap_point;
            this.pin_point = ParentPlayer.pin_point;
            this.center_point = ParentPlayer.center_point;
        }
        else{
            this.gap_point = 0.1686881640510813;
            this.pin_point = 5.803639314321643;
            this.center_point = 13.028357709429098;
        }
        this.fitness = 0;
        this.default_depth = 6;
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
            this.pin_point += randomGaussian(0, 1)
            console.log(this.pin_point)
        }
        if(Math.random()<rate)
        {
            this.center_point += randomGaussian(0, 1)
            console.log(this.center_point)
        }
    }

    make_move_minMax(playerType,board, depth, expectedDepth)
    {
        var max = -Infinity
        var min = Infinity
        var output = 0;
        for(let i=0;i<board.size;i++)
        {
            var score = 0;
            score += this.evaluate_move(playerType,board,i);
            if(score == playerType*Infinity)
            {
                board.remove_pin(i);
                if(depth==1)
                {
                    return [i,'won'];
                }
                return score;
            }
            else if(score != -1*playerType*Infinity){
                
                if(depth+1<=expectedDepth)
                {
                    score += this.make_move_minMax(playerType*-1,board, depth+1, expectedDepth)
                }
                board.remove_pin(i);
                if(playerType>0 && score>=max)
                {
                    max = score;
                    output = score;
                    if(depth ==1)
                    {
                        output = i;
                    }
                }
                else if(playerType<0 && score<=min){
                    min = score;
                    output = score;
                    if(depth ==1)
                    {
                        output = i;
                    }
                }
            }
        }
        return output;
    } 

    evaluate_move(playerType, board, column)
    {
        if(board.put_pin(playerType,column)==false){

            return -1*playerType*Infinity;
        }
        //the closer to the center the more the score it gets
        //lesser the (chosen_column- Center_column) lesser will be the score divisor
        //hence more will be score
        var score_divisor = (Math.abs(Math.floor(board.size/2)-column)+1)
        var score = Math.floor(this.center_point/score_divisor);
        // check socre in horizontal vertical and diagonal directions
        score += this.check_score(board, column, 1, 1) 
                    + this.check_score(board, column, 1,0) 
                        + this.check_score(board, column, -1, 1) 
                            + this.check_score(board, column, 0, 1); 
        return score*playerType;
    }

    check_score(board, column, increment_row, increment_col)
    {
        var type =  board.get_pin_at(board.height_of_column[column]-1,column);
        var next_row = board.height_of_column[column]-1;
        var next_col = column;
        var pins = 0;
        var gaps = 0;
        //this loop goes the extreme end of the line we are trying to check 
        while(next_row>=0 && next_row<board.size 
                && next_col>=0 && next_col<board.size 
                     && (board.get_pin_at(next_row,next_col)==type 
                        || board.get_pin_at(next_row,next_col)==0))
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
        while(next_row>=0 && next_row<board.size 
                && next_col>=0 && next_col<board.size 
                    && (board.get_pin_at(next_row,next_col)==type 
                        || board.get_pin_at(next_row,next_col)==0))
        {
            
            if(board.get_pin_at(next_row,next_col)==type){
                pins+=1;
                continuous_pins+=1;
                continuous = true;
                if (continuous && continuous_pins ==board.connect)
                {
                    return Infinity
                }
            }
            else{
                if(board.get_pin_at(next_row,next_col)==0)
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
        if(pins+gaps>=board.connect && (pins>1 || gaps>=board.connect-1))
        {
            return pins*this.pin_point + gaps*this.gap_point;
        }
        return 0
    }
}
class Player{
    constructor(brain)
    {
        this.fitness = 0;
        if(brain instanceof NeuralNetwork)
        {
            this.brain= brain.copy()
        }
        else
        {
            this.brain = new NeuralNetwork(board_size*board_size,board_size);
        }
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

    static make_move_minMax(board, depth, expectedDepth)
    {
        var max = -Infinity
        var min = Infinity
        var output = 0;
        for(let i=0;i<board.size;i++)
        {
            var playerType = 1;
            var score = 0;
            if(depth%2==0)
            {
                playerType = -1;
            }
            score += this.evaluate_move(playerType,board,i);
            if(score == playerType*Infinity)
            {
                board.remove_pin(i);
                if(depth==1)
                {
                    return i;
                }
                return score;
            }
            else if(score != -1*playerType*Infinity){
                
                if(depth+1<=expectedDepth)
                {
                    score += this.make_move_minMax(board, depth+1, expectedDepth)
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

    static evaluate_move(playerType, board, column)
    {
        var row = board.height_of_column[column];
        if(board.put_pin(playerType,column)==false){

            return -1*playerType*Infinity;
        }
        //the closer to the center the more the score it gets
        //lesser the (chosen_column- Center_column) lesser will be the score divisor
        //hence more will be score
        var score_divisor = (Math.abs(Math.floor(board.size/2)-column)+1)
        var score = Math.floor(board.size/score_divisor);
        // check socre in horizontal vertical and diagonal directions
        score += board.check_score(row, column, 1, 1) 
                    + board.check_score(row,column,1,0) 
                        + board.check_score(row,column, -1, 1) 
                            + board.check_score(row,column,0, 1); 
        return score*playerType;
    }
}
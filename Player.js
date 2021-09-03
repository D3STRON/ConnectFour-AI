class Player{
    constructor(brain)
    {
        if(brain instanceof NeuralNetwork)
        {
            this.brain= brain.copy()
        }
        else
        {
            this.brain = new NeuralNetwork(board_size*board_size,board_size);
        }
    }
    
    make_move(board)
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

    make_move_minMax(board)
    {
        
    }
}
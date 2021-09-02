class Player{
    constructor(board_size)
    {
        this.brain = new NeuralNetwork(board_size*board_size,board_size);
    }
    
    make_move(board)
    {
        let output = this.brain.feedforward(board.board_array);
        let max = 0;
        for(let i =0;i<board.size;i++){
            if(output.get(i,0)>output.get(max,0)){
                max = i;
            }
        }
        return max;
    }
}
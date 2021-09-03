const board_size = 7;
const max_generations = 1;
const offspring_per_generation = 1024;

function setup()
{
    createCanvas(400,600);
    var generation =0;
    var ParentPlayer = new Player();
    while(generation<max_generations)
    {
        
        var players = []
        var winners = []
        for(let i =0;i<offspring_per_generation;i++)
        {
            players[i] = new Player(ParentPlayer.brain);
            // players[i].brain.mutate(0.05);
            winners[i] = 0;
        }
        var stage = Math.log2(offspring_per_generation);
        while(stage>=1)
        {
            
            stage/=2;
        }
        ParentPlayer = players[winners[0]];
        console.log(generation)
        generation++
    }

    var board = new Board();
    var players_this_game = [new Player(), new Player()];
    var game_status = 'not over';
    for(let i=0;game_status==='not over';i++)
    {
        game_status = board.add_and_check(i%2+1,players_this_game[i%2].make_move(board));
    }
    console.log(ParentPlayer.brain);
    print_board(board);
}
function draw()
{
    background(0)
    
}

function print_board(board)
{
    var data=[]
    for(let i=0;i<board_size;i++)
    {
        data[i]=[]
        for(let j=0;j<board_size;j++)
        {
            data[i][j]=board.board_array.get(board.map_coordinates(i,j),0);
        }
    }
    console.log(data);
}

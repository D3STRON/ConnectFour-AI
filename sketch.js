const board_size = 5;
const max_generations = 1000;
const offspring_per_generation = 1024;
const mr = 0.1;
const connect = 3
var ParentPlayer;

function setup()
{
    createCanvas(400,600);
}
function draw()
{
    background(0)
    
}

function train()
{
    var generation =0;
    ParentPlayer = new Player();
    while(generation<max_generations)
    {
        var players = []
        for(let i =0;i<offspring_per_generation;i++)
        {
            players.push(new Player(ParentPlayer.brain));
            players[i].brain.mutate(mr);
        }
        var matches = offspring_per_generation/2
        while(matches>=1)
        {
            var new_players =[] 
            for(let i =0;i<matches; i++)
            { 
                var board = new Board();
                new_players.push(play(players,board));
            }
            players = new_players;
            matches/=2;
            //console.log(players.length,matches)
        }
        ParentPlayer = players.pop();
        console.log("Generation",generation);
        generation++
    }

    console.log(ParentPlayer.brain);

    var board = new Board();
    play([ParentPlayer,ParentPlayer],board);
    print_board(board);
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

function play(players, board)
{
    var players_this_game = [players.pop(), players.pop()];
    var game_status = 0;
    var i = 1
    while(game_status<=0 && i<=board_size*board_size)
    {
        game_status = board.add_and_check(i%2+1,players_this_game[i%2].make_move(board));
        i+=1; 
    }
    if(game_status<=0)
    {
        return players_this_game[0]
    }
    return players_this_game[game_status-1];
}

function play_with_bot(column,board)
{
    board.add_and_check(1,column);
    board.add_and_check(2,ParentPlayer.make_move(board));
}
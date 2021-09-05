const board_size = 7;
const max_generations = 1000;
const offspring_per_generation = 1024;
const mr = 0.1;
const connect = 4;
const min_max_depth = 5;
const points_per_pin = 2;
const pin_radius = 60;
var display_board;
var ParentPlayer;
var pins = [];
var turn_of = -1;

function setup()
{
    createCanvas(700,700);
    display_board = new Board();
    ParentPlayer = new Player();
}
function draw()
{
    background(0)
    display_board.show();
    for(pin of pins)
    {
        pin.show();
    }
}

function mouseClicked() {
    if(mouseX>display_board.padding && mouseX<display_board.padding +display_board.display_size
        && mouseY>display_board.padding && mouseY<display_board.padding+display_board.display_size){
        var column = Math.floor((mouseX-display_board.padding)/display_board.unit_size)
        add_pin_at(column)
        console.log(column)
        add_pin_at(Player.make_move_minMax(display_board,turn_of,8))
        // print_board(display_board)
    }
}

function add_pin_at(column)
{
    var row = display_board.height_of_column[column]
    var pinX = column*display_board.unit_size+
        display_board.padding + display_board.unit_size/2;  
    pinY = (board_size-1-row)*display_board.unit_size+
        display_board.padding + display_board.unit_size/2;
    if(display_board.put_pin(turn_of,column)==true)
    {
        pins.push(new Pin(pinX, pinY,turn_of));
        turn_of *= -1
    }
}

function train()
{
    var generation =0;
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
            if(board.board_array.get(board.map_coordinates(i,j),0)==0)
                data[i][j]='_';
            else if(board.board_array.get(board.map_coordinates(i,j),0)==1)
                data[i][j]='A'; 
            else
                data[i][j]='B'           
        }
    }
    console.log(data);
}

function undo_move()
{
    var pin =  pins.pop();
    console.log(pin)
    var column = (pin.x-(display_board.padding + display_board.unit_size/2))/display_board.unit_size;
    display_board.remove_pin(column);
    var pin =  pins.pop();
    var column = (pin.x-(display_board.padding + display_board.unit_size/2))/display_board.unit_size;
    display_board.remove_pin(column);
}

function play(players, board)
{
    var players_this_game = [players.pop(), players.pop()];
    var game_status = 0;
    var i = 1
    while(game_status<=0 && i<=board_size*board_size)
    {
        game_status = board.add_and_check(i%2+1,players_this_game[i%2].make_move_NN(board));
        i+=1; 
    }
    if(game_status<=0)
    {
        return players_this_game[0]
    }
    return players_this_game[game_status-1];
}

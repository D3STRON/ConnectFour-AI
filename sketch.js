const board_size = 7;
const max_generations = 100;
const offspring_per_generation = 128;
const mr = 0.15;
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
        var expected_depth = Math.floor(display_board.committed_pins/5) + ParentPlayer.default_depth;
        add_pin_at(ParentPlayer.make_move_minMax(turn_of,display_board,1,expected_depth));
        // print_board(display_board)
    }
}

function add_pin_at(column)
{
    if(column.length==2)
    {
        column = column[0];
    }
    var row = display_board.height_of_column[column]
    var pinX = column*display_board.unit_size+
        display_board.padding + display_board.unit_size/2;  
    pinY = (board_size-1-row)*display_board.unit_size+
        display_board.padding + display_board.unit_size/2;
    if(display_board.commit_move(turn_of,column)==true)
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
            players.push(new Player(ParentPlayer));
            players[i].mutate(mr);
        }
        var matches = offspring_per_generation/2
        while(matches>=1)
        {
            var new_players =[] 
            for(let i =0;i<matches; i++)
            { 
                var board = new Board();
                new_players.push(play(players,board));
                console.log("Generation",generation,"stage", matches, "game",i,"done");
            }
            players = new_players;
            matches/=2;
        }
        ParentPlayer = players.pop();
        generation++
    }

    console.log(ParentPlayer);

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
    display_board.uncommit_move(column);
    var pin =  pins.pop();
    var column = (pin.x-(display_board.padding + display_board.unit_size/2))/display_board.unit_size;
    display_board.uncommit_move(column);
}

function play(players, board)
{
    var players_this_game = [players.pop(), players.pop()];
    var turn_of = 1
    while( board.committed_pins<board_size*board_size)
    {
        var i = board.committed_pins;
        var expected_depth = players_this_game[i%2].default_depth;
        var column = players_this_game[i%2].make_move_minMax(turn_of,board,1,expected_depth);
        if(column.length==2)
        {
            return players_this_game[i%2];
        }
        if(board.commit_move(turn_of,column)==true)
        {
            turn_of *= -1;
        }
    }
    return players_this_game[0];
}

const board_size = 7;
const board_vertical_size = 6;
const max_generations = 200;
const offspring_per_generation = 50;
var mr = 0.01;
const connect = 4;
const min_max_depth = 6;
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
    ParentPlayer.fitness = -100;
}
function draw()
{
    background(0)
    display_board.show();
    for(pin of pins)
    {
        pin.show();
    }
    fill(color( 255, 0 ,50))
    stroke(color( 255, 0 ,50))
    ellipse(600,100,70,70);
}

function play_first()
{
    add_pin_at(ParentPlayer.make_move_minMax(turn_of,display_board,1,ParentPlayer.default_depth,-Infinity,Infinity)[0]);
}

function mouseClicked() {
    if(mouseX>display_board.padding && mouseX<display_board.padding +display_board.display_size
        && mouseY>display_board.padding && mouseY<display_board.padding+display_board.display_size){
        var column = Math.floor((mouseX-display_board.padding)/display_board.unit_size)
        if(add_pin_at(column)==true)
        {
            console.log(column)
            // iterative deepning(deepen the depth or search with more moves played as possibilites keep reducing)
            // here the depth deepns after every 5 moves
            var expected_depth = Math.floor(display_board.committed_pins/5) + ParentPlayer.default_depth;
            add_pin_at(ParentPlayer.make_move_minMax(turn_of,display_board,1,expected_depth,-Infinity,Infinity)[0]);
        }
        // print_board(display_board)
    }
    else if(Math.sqrt(Math.pow((mouseX-600),2) + Math.pow((mouseY-100),2)) < 35 && pins.length>0)
    {
        this.undo_move();
    }
}

function add_pin_at(column)
{
    var row = display_board.height_of_column[column]
    var pinX = column*display_board.unit_size+
        display_board.padding + display_board.unit_size/2;  
    pinY = (board_size-1-row)*display_board.unit_size+
        display_board.padding + display_board.unit_size/2;
    if(display_board.commit_move(turn_of,column)==true)
    {
        pins.push(new Pin(pinX, pinY,turn_of));
        turn_of *= -1
        return true;
    }
    return false;
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
    turn_of*=-1;
    var column = (pin.x-(display_board.padding + display_board.unit_size/2))/display_board.unit_size;
    display_board.uncommit_move(column);
}

function train()
{
    var generation =0;
    var parents = [ParentPlayer]
    while(generation<max_generations)
    {
        var players = []
        for(let i =0;i<offspring_per_generation;i++)
        {
            players.push(new Player(pull_parent(parents)));
            players[i].brain.mutate(mr);
        }
        for(let i=0;i<players.length-1;i++)
        {
            for(let j =0;j<offspring_per_generation;j++)
            {
                var board = new Board();
                this.play(players[i],board);
            } 
            insert_parent(parents,players[i]);
            console.log('Generation', generation, i*100/offspring_per_generation +1,'% complete', players[i].fitness,": fitness");
        }   
        generation++
    }
    ParentPlayer = parents[0];
    console.log('best',ParentPlayer);
    console.log(JSON.stringify(ParentPlayer))
}

function insert_parent(parents, player)
{
    for(let i=0;i<parents.length;i++)
    {
        if(parents[i].fitness<player.fitness)
        {
            parents.splice(i, 0, player);
            if(parents.length>8)
            {
                parents.pop();
            }
            return;
        }
    }
    if(parents.length<8)
    {
        parents.push(player);
    }
    
}

function pull_parent(parents)
{
    if(parents.length==1)
    {
        return parents[0];
    }
    var index = Math.round(Math.random()*7);
    console.log(parents[index])
    return parents[index];
}

function play(playerA, board)
{
    var players_this_game = [playerA, new Player2()];
    var index = Math.round(Math.random());
    if(index==1)
    {
        var temp = players_this_game[index];
        players_this_game[index] = players_this_game[0];
        players_this_game[0]= temp;
    }
    var turnOf = 1;
    while( board.committed_pins<board_size*board_vertical_size)
    {
        var i = board.committed_pins;
        var expected_depth = players_this_game[i%2].default_depth;
        var column = [Math.round(Math.random()*22)];
        if(column>7)
        {
            var column = players_this_game[i%2].make_move_minMax(turnOf,board,1,expected_depth,-Infinity,Infinity);
        }
        if(column[1]==Infinity*turnOf)
        {
            if(turnOf===1)
            {
                players_this_game[0].fitness+=1;
                players_this_game[1].fitness-=1;
            }
            else{
                players_this_game[1].fitness+=1;
                players_this_game[0].fitness-=1;
            }
            return;
        }
        if(board.commit_move(turnOf,column[0])==true)
        {
            turnOf *= -1;
        }
    }
}
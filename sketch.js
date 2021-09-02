const TOTAL= 500
const board_size = 7;

function setup()
{
    createCanvas(400,600);
    var board = new Board(board_size);
    var player = [new Player(board_size), new Player(board_size)];
    var game_status = 3;
    for(let i=0;game_status==3;i++)
    {
        game_status = board.add_and_check(i%2+1,player[i%2].make_move(board));
    }
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
function draw()
{
    background(0)
    
}

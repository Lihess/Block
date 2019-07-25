const canvas = document.getElementById('ball')
let ball = canvas.getContext('2d');
const WIDTH = canvas.width,
    HEIGHT =  canvas.height;

const r = 10;
let x = WIDTH / 2, y = HEIGHT / 2, dx = 2, dy = 4;
const paddleHeigt = 10, paddleWidth = 75;
let paddleX = (WIDTH - paddleWidth) /2;

let brickRowCount = 3, brickColumnCount = 5, brickWidth = 75,
    brickHeight = 20, brickPadding = 10, brickOffsetTop = 30,  brickOffsetLeft = 30;
let bricks = [];

const color = ['#BAD2F1', '#7378D1', '#A23EE5'];

const score = document.querySelector(".score");
let sco = 0, combo = 0;

function initBricks(){
    for(var c=0; c<brickColumnCount; c++) {   
        bricks[c] = [];
            for(var r=0; r<brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status : 1 };
        }
    }
}

function addBricks(){
    brickRowCount++;
    for(var c=0; c<brickColumnCount; c++) 
        bricks[c][brickRowCount - 1] = { x: 0, y: 0, status : 1 };
}

function init(){
    initBricks();
    setInterval(addBricks, 4000);
    // 4초에 한줄씩 늘어나도록!
     return setInterval(draw, 10);
     // 10millsec 마다 draw 실행
}

function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1){
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = ((brickRowCount - r - 1)*(brickHeight+brickPadding))+brickOffsetTop;
               
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;

                ball.beginPath();
                ball.rect(brickX, brickY, brickWidth, brickHeight);
                ball.fillStyle = color[r % 3];
                ball.fill();
                ball.closePath();
            }
        }
    }
}

function collision(){
    for(var c=0; c<brickColumnCount; c++){
        for (var r = 0; r < brickRowCount; r++){
            var b = bricks[c][r];

            if(b.status == 1){
                if((x > b.x && x < b.x + brickWidth) && (y > b.y && y < b.y + brickHeight)){
                    dy = -dy;
                    b.status = 0;
                    if( y > paddleHeigt) combo++;

                    sco += 10 + (combo - 1) * 2;
                }
            }

            if(r == brickRowCount - 1 && b.status == 1 && (brickRowCount * (brickHeight + brickPadding)>= HEIGHT - paddleHeigt)){
                alert(`당신의 점수는 ${sco} 입니다!`); 
                clearInterval(init); // 반복 중인 것을 멈추도록
                document.location.reload(); // 파일을 다시 읽어들임
                
            }
        }
    }
}

function draw(){
    clear();
    paddle();
    circle(x, y, r); 
    drawPaddle();
    drawBricks()
    collision()
 
    if(x + dx> WIDTH - r || x + dx < r )
        dx = - dx;
    if(y + dy < r)
        dy = - dy;
    else if( y + dy >= HEIGHT - r){
        if (x > paddleX && x < paddleX + paddleWidth){
            dy = - dy;
            combo = 0;
        }
        else {
            alert(`당신의 점수는 ${sco} 입니다!`); 
            clearInterval(init); // 반복 중인 것을 멈추도록
            document.location.reload(); // 파일을 다시 읽어들임
        }
    }
   
    x += dx;
    y += dy;

    score.innerText = `Score : ${sco}`;
}

function drawPaddle(){
    document.onmousemove = function(){
        paddleX = (event.pageX - window.innerWidth / 2 + WIDTH / 2 ) - paddleWidth / 2;

        if (paddleX < 0) paddleX = 0;
        else if (paddleX + paddleWidth > WIDTH) paddleX = WIDTH - paddleWidth;
    }
}

function paddle(){
    ball.fillStyle = "#93D6F1";
    ball.beginPath();
    ball.rect(paddleX, HEIGHT - paddleHeigt, paddleWidth, paddleWidth);  
    ball.closePath();
    ball.fill();
}

function circle(x, y, r){
    ball.fillStyle = "#93D6F1";
    ball.beginPath();
    ball.arc(x, y, r, 0, Math.PI*2, true);   
    ball.closePath();
    ball.fill();
}

function clear(){
    ball.clearRect(0, 0, WIDTH, HEIGHT);
}

init();
const canvas = document.getElementById("pong");
const ctx = canvas.getContext('2d');

// Ball 
const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    velocityX : 5,
    velocityY : 5,
    speed : 7,
    color : "yellow"
}

// User 
const user = {
    x : 0, 
    y : (canvas.height - 100)/2, 
    width : 10,
    height : 100,
    score : 0,
    color : "blue"
}

// Computer
const com = {
    x : canvas.width - 10, 
    y : (canvas.height - 100)/2, 
    width : 10,
    height : 100,
    score : 0,
    color : "green"
}

// Middle line
const net = {
    x : (canvas.width - 2)/2,
    y : 0,
    height : 10,
    width : 2,
    color : "red"
}

// draw a rectangle 
function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// draw circle for ball
function drawArc(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

// User mousemove
canvas.addEventListener("mousemove", getMousePos);

function getMousePos(e){
    let rect = canvas.getBoundingClientRect();
    
    user.y = e.clientY - rect.top - user.height/2;
}

// reset the ball
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}

// draw the net
function drawNet(){
    for(let i = 0; i <= canvas.height; i+=15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// draw text
function drawText(text,x,y,color){
    ctx.fillStyle = color;
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}

// collision detection b for ball and p for player
function collision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

// update function
function update(){
    
    // computer win point
    if( ball.x - ball.radius < 0 ){
        com.score++;
        resetBall();
    }
        // user win point
    else if( ball.x + ball.radius > canvas.width){
        user.score++;
        resetBall();
    }
    
    // the ball has a velocity
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    
    //computer simple AI
    com.y += ((ball.y - (com.y + com.height/2)))*0.1;
    
    if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
        ball.velocityY = -ball.velocityY;
    }
    
    let player = (ball.x + ball.radius < canvas.width/2) ? user : com;
    
    if(collision(ball,player)){
       
        let collidePoint = (ball.y - (player.y + player.height/2));
      
        collidePoint = collidePoint / (player.height/2);
        
        let angleRad = (Math.PI/4) * collidePoint;
        
        let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        
        ball.speed += 0.2;
    }
}

// function that does al the drawing
function clear(){
    
    // clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, "#000");
    
    // draw the user score 
    drawText(user.score,canvas.width/4,canvas.height/5,"blue");
    
    // draw the computer score 
    drawText(com.score,3*canvas.width/4,canvas.height/5,"green");
    
    // draw the middle line
    drawNet();
    
    // draw the user's rectangle
    drawRect(user.x, user.y, user.width, user.height, user.color);
    
    // draw the computer's rectangle
    drawRect(com.x, com.y, com.width, com.height, com.color);
    
    // draw the ball
    drawArc(ball.x, ball.y, ball.radius, ball.color);
}
function game(){
    update();
    clear();
}

setInterval(game,20);


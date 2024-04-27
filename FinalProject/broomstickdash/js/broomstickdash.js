// Game Variables
var myGamePiece;
var myObstacles = [];
var myScore;
var myBackground;
var myLevel;
var gameOver;
var gameOverSound;

function Sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

// Start Game logic
function startGame() {
    document.getElementById("playAgain").style.visibility = "hidden";
    myGamePiece = new component(100, 25, "media/broom2.png", 10, 350, "image");
    myScore = new component("20px", "fantasy", "#CDCDCD", 10, 40, "text");
    myLevel = new component("20px", "fantasy", "#CDCDCD", 10, 70, "text");
    myBackground = new component(700, 500, "media/gamebackground.jpg", 0, 0, "background");
    gameOver = new component("70px", "Rubik Gemstones", "red", 150, 250, "text");
    gameOverSound = new Sound("media/gameover.mp3");
    myGameArea.start();
}

// Game area object
var myGameArea = {
    canvas: document.getElementById("myCanvas"),
    start: function () {
        this.canvas.width = 700;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d");
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);

        // Prevent default arrow key behavior
        window.addEventListener('keydown', function (e) {
            // Prevent arrow keys from scrolling the page
            if([37, 38, 39, 40].indexOf(e.keyCode) > -1){
                e.preventDefault();
            }
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
        });
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = false;
        });
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
    }
};

// Component Constructor
function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image" || type == "background") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = myGameArea.context;
        if (type == "image" || type == "background") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            if (type == "background") {
                ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
            }
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        if(this.type == "text"){
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }
    };
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.type == "background") {
            if (this.x <= 0) {
                this.x = 0; // Stop scrolling
            }
        }
    };

    // Checks collision with objects
    this.crashWith = function (otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

// Updates game area with "Game Over", clears game area and adds obstacles
function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            gameOverSound.play();
            myGameArea.stop();
            myGameArea.clear();
            myBackground.update();
            myScore.text = "SCORE: " + myGameArea.frameNo;
            myScore.update();
            gameOver.text = "GAME OVER";
            gameOver.update();
            myLevel.text = "Level: " + Math.round(myGameArea.frameNo / 500);
            myLevel.update();
            document.getElementById("playAgain").style.visibility = "visible"; 
            return;
        }
    }
    myGameArea.clear();
    myBackground.speedX = -1;
    myBackground.newPos();
    myBackground.update();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(90)) {
        x = myGameArea.canvas.width;
        minHeight = 30;
        maxHeight = 250;
        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap) - Math.floor(myGameArea.frameNo / 1000);
        myObstacles.push(new component(30, height, "#5D5D5D", x, 0));
        myObstacles.push(new component(30, x - height - gap, "#5D5D5D", x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -3 - (myGameArea.frameNo / 500); // Increase speed as game progresses
        myObstacles[i].update();
    }
    myScore.text = "SCORE: " + myGameArea.frameNo;
    myScore.update();
    myLevel.text = "Level: " + Math.round(myGameArea.frameNo / 500);
    myLevel.update();

    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    if (myGameArea.keys && myGameArea.keys[37]) { myGamePiece.speedX = -3; }
    if (myGameArea.keys && myGameArea.keys[39]) { myGamePiece.speedX = 3; }
    if (myGameArea.keys && myGameArea.keys[38]) { myGamePiece.speedY = -3; }
    if (myGameArea.keys && myGameArea.keys[40]) { myGamePiece.speedY = 3; }
    myGamePiece.newPos();
    myGamePiece.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) { return true; }
    return false;
}
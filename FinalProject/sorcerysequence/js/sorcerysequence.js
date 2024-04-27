// array of button colors
var buttonColors = ['red', 'green', 'yellow', 'blue'];

// Preload audio files
var audioFiles = {};
buttonColors.forEach(function(color) {
    var audio = new Audio('media/' + color + '.mp3');
    audioFiles[color] = audio;
});

// Load game over sound
var gameOverSound = new Audio('media/gameover.mp3');

//Game variables
var gamePattern = [];
var userClickedPattern = [];
var start = false;
var level = 0;
var isReplaying = false;

// Load highest level from localStorage if exists
var highestLevel = localStorage.getItem('highestLevel') || 0;

$(document).ready(function() {
    // Display highest level
    $('#high-score').text("Highest Level: " + highestLevel);

    //Event listener for start button click
    $('#start-btn').click(function() {
        if (!start){
            $('#game-title').text("Level: " + level);
            nextSequenceAndPlay();
            start = true;
        }
    });

    //Event listener for color button click
    $('.btn').click(function(){
        if (isReplaying) return; // Ignore clicks during pattern replay
        var playerClick = $(this).attr('id');
        userClickedPattern.push(playerClick);

        checkAnswer(userClickedPattern.length-1); 
    });
});

// Update highest level if current level is higher
function updateHighestLevel() {
    if (level > highestLevel) {
        highestLevel = level;
        localStorage.setItem('highestLevel', highestLevel);
        $('#high-score').text("Highest Level: " + highestLevel);
    }
}

//Check user's answer
function checkAnswer(currentLevel){
    if(gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
        if(userClickedPattern.length === gamePattern.length){
            // increase level and proceed to the next
            level++;
            $('#game-title').text("Level: "+ level);
            setTimeout(function(){
                nextSequenceAndPlay();
            }, 1000);

            updateHighestLevel();
        }
    } else {
        //Trigger game over for incorrect sequences
        $('body').addClass('game-over');
        $('#game-title').text("Game Over - Press the Start button to play again!");

        setTimeout(function () {
            $('body').removeClass('game-over');
        }, 200);

        startOver();
    }
}

//Reset game variables for a new game
function startOver(){
    level = 0;
    gamePattern = [];
    start = false;
    gameOverSound.currentTime = 0;
    gameOverSound.play().then(function() {
        console.log("Game over sound played");
    }).catch(function(error) {
        console.error("Error playing game over sound", error);
    });
}

//Generate and play next sequence
function nextSequenceAndPlay() {
    isReplaying = true;
    replayPattern();
    setTimeout(function() {
        isReplaying = false;
        nextSequence();
    }, (gamePattern.length + 1) * 1000); // delay for the duration of the pattern replay
}

//Replay the generated pattern
function replayPattern() {
    var i = 0;
    var interval = setInterval(function() {
        var color = gamePattern[i];
        $('#' + color).fadeIn(100).fadeOut(100).fadeIn(100);

        setTimeout(function() {
            // Play sound for each color after a delay
            playSound(color);
        }, 150);

        i++;
        if (i >= gamePattern.length) {
            clearInterval(interval);
        }
    }, 1000);
}

// Play sound for each color
function playSound(color) {
    var audio = audioFiles[color];
    audio.currentTime = 0; 
    audio.play().then(function() {
        console.log("Audio played for color: " + color);
    }).catch(function(error) {
        console.error("Error playing audio for color: " + color, error);
    });
}

//Generate the next sequence
function nextSequence() {
    userClickedPattern = [];
    var randomNum = Math.floor(Math.random() * 4);
    var randomChosenColor = buttonColors[randomNum];
    gamePattern.push(randomChosenColor);

    $('#' + randomChosenColor).fadeIn(100).fadeOut(100).fadeIn(100);
    playSound(randomChosenColor);
}

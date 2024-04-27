// Function to play the background audio
function playBackgroundAudio() {
    var audio = document.getElementById("backgroundAudio");
    audio.play().catch(function(error) {
        // Autoplay was prevented
        console.warn("Autoplay prevented: " + error);
    });
}

// Function to pause the background audio
function pauseBackgroundAudio() {
    var audio = document.getElementById("backgroundAudio");
    audio.pause();
}

// Play background sound when the page loads
window.addEventListener("load", function() {
    // Play the background audio when the page is loaded
    playBackgroundAudio();
});

// Pause background sound when the mouse leaves the document body
document.body.addEventListener("mouseleave", function() {
    pauseBackgroundAudio();
});

// Resume background sound when the mouse enters the document body
document.body.addEventListener("mouseenter", function() {
    playBackgroundAudio();
});

// Your existing event listeners for game info updates
document.getElementById("home").addEventListener("mouseover", function() {
    document.getElementById("gameInfo").innerHTML = "<h3>Harry Potter Inspired Games and Magic</h3><p>Perfect for wizards, witches, and muggles alike, our platform offers a whimsical escape into the magical realm of Hogwarts and beyond. Hover over the game names to see a description of the game and click to play!</p>";
});

document.getElementById("broomstickDash").addEventListener("mouseover", function() {
    document.getElementById("gameInfo").innerHTML = "<h3>Broomstick Dash</h3><p>Take flight on your enchanted broomstick and navigate through challenging obstacles using the arrow keys on your keyboard.</p>";
});

document.getElementById("sorcerySequence").addEventListener("mouseover", function() {
    document.getElementById("gameInfo").innerHTML = "<h3>Sorcery Sequence</h3><p>Similar to the classic game 'Simon Says', this version will challenge your magical memory and puts your reflexes to the test as you strive to match colors in sequence.</p>";
});

document.getElementById("potterPuzzle").addEventListener("mouseover", function() {
    document.getElementById("gameInfo").innerHTML = "<h3>Potter Puzzles</h3><p>With varying levels of difficulty and timer-based challenges, piece together images of beloved characters, magical creatures, and iconic locations.</p>";
});

document.getElementById("readme").addEventListener("mouseover", function() {
    document.getElementById("gameInfo").innerHTML = "<h3>Read Me</h3><p>Review our 'Read Me' section for game descriptions, file structure, and copyright information.</p>";
});

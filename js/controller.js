// Game settings
var CELL_SIZE = 64;
var CELL_PADDING = 5;
var ROW_COUNT;
var COLUMN_COUNT;
var WIN_LENGTH;
var gameWidth;
var gameHeight;
var game = new Phaser.Game(0, 0, Phaser.CANVAS, 'game-canvas', { preload: preload, create: create, update: update, currentState: "ready" });

// Graphics
var dropTiles = [];  // Top row above the board. This is where players 'drop' their pieces
var boardTiles = []; // The connect 4 board
var currentColumnHover;
var updateTime = 0;
var delayTime = 500;
var animationSpeed = 450;
var tempTile;
var shownWinner = false;

// Connect4 game object
var connect4;
var currentState;

// Players and AIs
var player1Type;
var player2Type;
var AI1Difficulty;
var AI2Difficulty;
var workerAI = new Worker('js/botworker.js');
workerAI.onmessage = getMessage;


// Initialize game
$(function() {
    game.state.restart();

    $('#startButton').click(function() {
        game.state.restart();
    });

    $( window ).resize(function() {
        clearGraphics();
        setGameScale();
        createGraphics();
        updateGraphics();
    });
});


// Load assets
function preload() {
    game.load.image('player1Graphic', 'images/player1.png');
    game.load.image('player2Graphic', 'images/player2.png');
    game.load.image('invalidTile', 'images/invalid.png');
    game.load.image('tile', 'images/tile.png');
    game.load.image('bg', 'images/bg.png');
}


// Initializes the game
function create() {
    
    // Reset AI web worker
    workerAI.terminate();
    workerAI = new Worker('js/botworker.js');
    workerAI.onmessage = getMessage;
    

    // Reset current state and clear graphics
    currentState = "thinking";
    $("#thinkingImage").css('visibility', 'hidden');//hide();
    clearGraphics();
    

    // Get user-defined settings
    ROW_COUNT = $('#numRows').val();
    COLUMN_COUNT = $('#numCols').val();
    WIN_LENGTH = $('#winLength').val();


    // Set up graphics
    gameWidth = COLUMN_COUNT * (CELL_SIZE + CELL_PADDING) + CELL_PADDING;
    gameHeight = ROW_COUNT * (CELL_SIZE + CELL_PADDING) + CELL_PADDING + (CELL_SIZE + CELL_PADDING);
    game.scale.setGameSize(gameWidth, gameHeight);
    game.stage.backgroundColor = "#2d2d2d";
    $('#winner').hide();
    currentColumnHover = 0;
    setGameScale();
    createGraphics();
    
    

    // Set up connect 4 game
    connect4 = new Connect4(ROW_COUNT, COLUMN_COUNT, WIN_LENGTH);
    connect4.reset();


    // Set up players/bots
    var index1 = $('#player1').prop('selectedIndex');
    var index2 = $('#player2').prop('selectedIndex');
    player1Type = (index1 == "0") ? PlayerType.HUMAN : PlayerType.AI;
    player2Type = (index2 == "0") ? PlayerType.HUMAN : PlayerType.AI;
    AI1Difficulty = index1;
    AI2Difficulty = index2;


    // Reset game state
    currentState = "ready";
    shownWinner = false;
    updateGraphics();
}


// Scales the game's graphics to match the container width
function setGameScale() {

    // Calculate scaled cell padding
    let windowWidth = $(window).width();
    let windowHeight = $(window).height();
    if(windowWidth <= 500) { CELL_PADDING = 1; }
    if(windowWidth > 500 && windowWidth <= 800) { CELL_PADDING = 2; }
    if(windowWidth > 800) { CELL_PADDING = 3; }
    if(COLUMN_COUNT > 20) { CELL_PADDING = 1; }

    // Calculate scaled cell size
    let maxWidth = 1000;
    let maxHeight = 800;
    let maxCellSize = 64;
    let viewportWidth = windowWidth - (2 * parseInt($('.section-wrapper').css('padding-left')));
    let viewportHeight = windowHeight - $('.section-header').outerHeight(true) - $('#header').outerHeight(true);
    
    // Calculate cell size based on # of columns and screen width
    let newWidth = Math.min(maxWidth, viewportWidth);
    let cellSizeW = (newWidth - CELL_PADDING - (COLUMN_COUNT * CELL_PADDING)) / COLUMN_COUNT;

    // Calculate cell size based on # of rows and screen height
    let newHeight = Math.min(maxHeight, viewportHeight);
    let cellSizeH = (newHeight - CELL_PADDING - (ROW_COUNT * CELL_PADDING)) / ROW_COUNT;

    CELL_SIZE = Math.min(cellSizeW, cellSizeH, maxCellSize);

    if(CELL_SIZE < 64) {
        CELL_PADDING = 1;
    }
/*
    console.log("Window Height = " + $(window).height());
    console.log("Calculated height = " + viewportHeight);
    console.log($('.section-header:first').outerHeight(true));
    console.log($('#header').outerHeight());
    console.log($(".section-header:first").text())

    console.log("maxwidth=" + maxWidth);
    console.log("viewportWidth=" + viewportWidth);
    console.log("viewportHeight=" + viewportHeight);
    let newWidth = Math.min(maxWidth, viewportWidth, viewportHeight);
    console.log("newwidth=" + newWidth)
*/  
    //CELL_SIZE = (newWidth - CELL_PADDING - (COLUMN_COUNT * CELL_PADDING)) / COLUMN_COUNT;
    //CELL_SIZE = Math.min(CELL_SIZE, maxCellSize);


    // Scale game area
    let w = COLUMN_COUNT * (CELL_SIZE + CELL_PADDING) + CELL_PADDING;
    let h = ROW_COUNT * (CELL_SIZE + CELL_PADDING) + CELL_PADDING + (CELL_SIZE + CELL_PADDING);
    game.scale.setGameSize(w, h);
}


// Clears the game's graphics
function clearGraphics() {

    // Clear drop tiles
    if(dropTiles.length > 0) {
        for(var i = 0; i < COLUMN_COUNT; i++) {
            dropTiles[i].destroy();
        }
    }

    // Clear board tiles
    if(boardTiles.length > 0) {
        for(var i = 0; i < ROW_COUNT; i++) {
            for(var j = 0; j < COLUMN_COUNT; j++) {
                boardTiles[i][j].destroy();
            }
        }
    }

    if(tempTile) {
        tempTile.destroy();
    }
}


// Creates the drop, board, and temp tiles
function createGraphics() {

    // Create drop tiles
    for(var i = 0; i < COLUMN_COUNT; i++) {
        var newTile = game.add.sprite(0, 0, 'tile');
        newTile.width = CELL_SIZE;
        newTile.height = CELL_SIZE;
        newTile.x = CELL_PADDING + i * CELL_SIZE + i * CELL_PADDING;
        newTile.y = CELL_PADDING;
        newTile.row = -1;
        newTile.col = i;
        newTile.graphic = 'tile';
        newTile.inputEnabled = true;
        newTile.alpha = 0;
        newTile.events.onInputOver.add(tileHover, this);
        newTile.events.onInputDown.add(tileClick, this);
        dropTiles[i] = newTile;
    }

    // Create board tiles
    for(var i = 0; i < ROW_COUNT; i++) {
        boardTiles[i] = [];

        for(var j = 0; j < COLUMN_COUNT; j++) {
            var newTile = game.add.sprite(0, 0, 'tile');
            newTile.width = CELL_SIZE;
            newTile.height = CELL_SIZE;
            newTile.x = CELL_PADDING + (j * CELL_SIZE) + (j * CELL_PADDING);
            newTile.y = CELL_PADDING + ((i + 1) * CELL_SIZE) + ((i + 1) * CELL_PADDING);
            newTile.row = i;
            newTile.col = j;
            newTile.graphic = 'tile';
            newTile.inputEnabled = true;
            newTile.events.onInputOver.add(tileHover, this);
            newTile.events.onInputDown.add(tileClick, this);
            boardTiles[i][j] = newTile;
        }
    }

    // Create temporary tile for dropping animation
    tempTile = game.add.sprite(-1000, -1000, 'tile');
    tempTile.width = CELL_SIZE;
    tempTile.height = CELL_SIZE;
}


/**
* The update function. Called 60 timer per second
*/
function update() {

    // Display winner if there is one and we haven't already shown them
    if(connect4.gameOver && !shownWinner) {
        showWinner();
        shownWinner = true;
        console.log(connect4.board.getScore());
    }


    // Make sure we need to update
    if(currentState == "thinking" || connect4.gameOver) {
        return;
    }


    // Check if we are waiting for a piece to drop
    if(currentState == "delay") {
        if(game.time.now > updateTime) {
            currentState = "ready";
            updateGraphics();
            console.log(connect4.board.getScore());
        } else {
            return;
        }
    }


    // Check if current player is AI
    if(!currentPlayerIsHuman()) {
        currentState = "thinking";

        // Get AI's move
        if(connect4.currentPlayer == 1) {
            $("#thinkingImage").attr("src", "images/player1Thinking.gif");
            $("#thinkingImage").css('visibility', 'visible');//show();
            workerAI.postMessage([AI1Difficulty, 1, JSON.parse(JSON.stringify(connect4.board))]);
        } else {
            $("#thinkingImage").attr("src", "images/player2Thinking.gif");
            $("#thinkingImage").css('visibility', 'visible');//show();
            workerAI.postMessage([AI2Difficulty, 2, JSON.parse(JSON.stringify(connect4.board))]);
        }
    }
}


/**
* The onmessage function for the AI webworker. This is called when the AI 
* is done thinking. This allows the UI to be unblocked while the AI is calculating
* its move. When called, this function performs the AI's move and changes the game's
* status from 'thinking' to 'delay'
* @param e: The AI webworker's response
*/
function getMessage(e) {

    // Perform AI's move
    let move = e.data[0];
    var animation = saveAnimation(move);
    connect4.performTurn(move);
    playAnimation(animation);


    // Set status
    currentState = "delay";
    updateTime = game.time.now + delayTime;
    $("#thinkingImage").css('visibility', 'hidden');//hide();


    // Set # of iterations
    let iterations = e.data[1];
    console.log("iterations=" + iterations);
}


/**
* Tile mouse hover event. Highlights the player's move
* @param tile: The tile that is being hovered over
*/
function tileHover(tile) {

    // Save mouse position
    currentColumnHover = tile.col;


    // Make sure play is allowed
    var ready = (currentState == "ready");
    var gameOver = connect4.gameOver;
    var humanPlayer = currentPlayerIsHuman();
    if(!ready || gameOver || !humanPlayer) { 
        return; 
    }


    // Highlight move
    updateGraphics();
}


/**
* Places piece for current player (if possible), then lets any bots play
* @param tile: The tile that was clicked
*/
function tileClick(tile) {

    // Make sure play is allowed
    var ready = (currentState == "ready");
    var validMove = connect4.board.isValidMove(tile.col);
    var gameOver = connect4.gameOver;
    var humanPlayer = currentPlayerIsHuman();
    if(!ready || !validMove || gameOver || !humanPlayer) { 
        return; 
    }


    // Perform turn
    var animation = saveAnimation(tile.col);
    connect4.performTurn(tile.col);
    playAnimation(animation);
    

    // Set status
    currentState = "delay";
    updateTime = game.time.now + delayTime;
}


/**
* Highlights the tile where the player's piece will land or shows error if placement is invalid
*/
function addHighlight() {

    // Get row/col where player's piece will land
    var row = connect4.board.getAvailableRow(currentColumnHover);
    var col = currentColumnHover;
    var dropTileTexture = '';


    // Check if move is valid (if true, highlight the correct board tile)
    if(row != -1) {
        var texture = 'player' + connect4.currentPlayer + 'Graphic';
        dropTileTexture = texture;
        boardTiles[row][col].loadTexture(texture, 0);
        boardTiles[row][col].alpha = 0.4;
        boardTiles[row][col].width = CELL_SIZE;
        boardTiles[row][col].height = CELL_SIZE;
    } else {
        dropTileTexture = 'invalidTile';
    }


    // Highlight the drop tile
    dropTiles[col].loadTexture(dropTileTexture, 0);
    dropTiles[col].width = CELL_SIZE;
    dropTiles[col].height = CELL_SIZE;
    dropTiles[col].alpha = 1;
}


/**
* Shows the winner (if there is one)
*/
function showWinner() {
    var winner = connect4.board.getWinner();
    if(winner != Winner.NONE) {
        var winText;
        var color;
        switch(winner) {
            case Winner.TIE:
                winText = "It's a tie!";
                color = "#000000";
                break;
            case Winner.PLAYER1:
                winText = "Red wins!";
                color = "#ED1C24";
                break;
            case Winner.PLAYER2:
                winText = "Blue wins!";
                color = "#00A2E8";
                break;
        }
        $('#winner').text(winText);
        $('#winner').css("color", color);
        $('#winner').show();

        // Highlight winning tiles
        if(winner != Winner.TIE) {
            var winningTiles = connect4.board.getWinningTiles();
            
            // Dim all tiles
            for(var i = 0; i < ROW_COUNT; i++) {
                for(var j = 0; j < COLUMN_COUNT; j++) {
                    boardTiles[i][j].alpha = 0.4;
                }
            }

            // Highlight winning tiles
            for(var i = 0; i < winningTiles.length; i++) {
                var x = winningTiles[i].x;
                var y = winningTiles[i].y;
                boardTiles[x][y].alpha = 1;
            }
        }
    }
}


/**
* Updates the game graphics grid to reflect the state of the game's tiles
*/
function updateGraphics() {

    // Clear drop tiles
    for(var i = 0; i < COLUMN_COUNT; i++) {
        dropTiles[i].graphic = 'tile';
        dropTiles[i].alpha = 1;
        dropTiles[i].loadTexture('tile', 0);
        dropTiles[i].width = CELL_SIZE;
        dropTiles[i].height = CELL_SIZE;
        dropTiles[i].alpha = 0;
    }


    // Update each board tile
    var tiles = connect4.board.tiles;
    for(var i = 0; i < ROW_COUNT; i++) {
        for(var j = 0; j < COLUMN_COUNT; j++) {
            
            // Get texture for this tile
            var tileValue = tiles[i][j];
            var texture;
            if(tileValue == 0) {
                texture = 'tile';
            } else {
                texture = 'player' + tileValue + 'Graphic';
            }

            // Update tile
            boardTiles[i][j].graphic = texture;
            boardTiles[i][j].alpha = 1;
            boardTiles[i][j].loadTexture(texture, 0);
            boardTiles[i][j].width = CELL_SIZE;
            boardTiles[i][j].height = CELL_SIZE;
        }
    }

    showWinner();
    
    if(currentPlayerIsHuman()) {
        addHighlight();
    }
}


/**
* Checks if the current player is human
* @return: True if the current player is human
*/
function currentPlayerIsHuman() {
    var humanPlayer = false; 
    
    if(player1Type == PlayerType.HUMAN && connect4.currentPlayer == 1) { humanPlayer = true; }
    if(player2Type == PlayerType.HUMAN && connect4.currentPlayer == 2) { humanPlayer = true; }
    
    return humanPlayer;
}


/**
* Saves the animation for a piece being dropped in a given column
* @param col: The column to drop the piece into
* @return: An object representing the animation to perform
*/
function saveAnimation(col) {

    var endRow = connect4.board.getAvailableRow(col);

    var variables = {
        texture:  'player' + connect4.currentPlayer + 'Graphic',
        startX:  CELL_PADDING + (col * CELL_SIZE) + (col * CELL_PADDING),
        startY:  CELL_PADDING,
        endX:  CELL_PADDING + (col * CELL_SIZE) + (col * CELL_PADDING),
        endY:  CELL_PADDING + ((endRow + 1) * CELL_SIZE) + ((endRow + 1) * CELL_PADDING)
    };
    
    return variables;
}


/**
* Plays an animation for a piece dropping
* @param animation: The animation to play
*/
function playAnimation(animation) {

    // Remove highlights
    for(var i = 0; i < dropTiles.length; i++) {
        dropTiles[i].width = CELL_SIZE;
        dropTiles[i].height = CELL_SIZE;
        dropTiles[i].alpha = 0;
    }

    // Play animation
    tempTile.x = animation.startX;
    tempTile.y = animation.startY;
    tempTile.loadTexture(animation.texture, 0);
    tempTile.width = CELL_SIZE;
    tempTile.height = CELL_SIZE;
    game.add.tween(tempTile).to( { x: animation.endX, y: animation.endY }, animationSpeed, Phaser.Easing.Bounce.Out, true);
}

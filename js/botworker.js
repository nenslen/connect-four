var iterations = 0;

/**
* Computes the AI's move using a web worker
* @param e.data[0]: An integer specifying the AI's difficulty
* @param e.data[1]: The AI's player number
* @param e.data[2]: The board
* @return: The bot's move
*/
onmessage = function(e) {
	
    // Get parameters
    let difficulty = e.data[0];
	let playerNumber = e.data[1];
	let board = e.data[2];
	board = new Board(board.rows, board.columns, board.winLength);
    board.tiles = e.data[2].tiles;
    iterations = 0;


    // Calculate AI's move and return it
	let move = getMove(difficulty, playerNumber, board);
	postMessage([move, iterations]);
}


/**
* Gets the bot's desired move
* @param board: The board to check for moves
* @return: An integer specifying which column the bot chose
*/
function getMove(difficulty, playerNumber, board) {
	var maxplayer = (playerNumber == 1);
	var result = alphabeta(new State(0, board, 0, 0), 0, difficulty, -Infinity, Infinity, maxplayer);
	return result.action;
};


/**
* Runs the minimax algorithm with alpha-beta pruning.
* @param state: The state to run minimax alpha-beta on
* @param depth: How far we are in the tree so far
* @param alpha: The largest value that maxplayer can guarantee at this level or higher
* @param beta: The smallest value that minplayer can guarantee at this level or higher
* @param maxplayer: A boolean indicating if it's maxplayer's turn
*/
function alphabeta(state, depth, maxDepth, alpha, beta, maxplayer) {

    // End search if we've reached maximum depth or the game is over
    if(depth == maxDepth || state.board.getWinner() != Winner.NONE) {
        return new State(state.action, state.board, state.board.getScore(), depth);
    }
    

    /**
    * Max player is playing. This means that maxplayer will look at his possible moves and return the one
    * that has the largest score.
    */
    if(maxplayer) {

        // The highest score among this state's children and its associated action
        var highestScore = -Infinity;
        var deepestDepth = 0;
        var bestAction = -1;


        /**
        * Generate successor states of this state. We do this by looking at each possible action
        * that maxplayer can perform while in this current state. Actions are represented by the
        * current value of i. For example, when i = 4, this represents the action of maxplayer dropping
        * his piece in the 5th column. We do this for each column and only examine the successor state
        * if it is valid.
        */
        let actions = orderActions(state.board, 1);
        for(let i = 0; i < actions.length; i++) {
        //for(var i = 0; i < state.board.columns; i++) {
            iterations++;
            let action = actions[i];

            // Only check valid actions
            if(state.board.isValidMove(action)) {
                
                // Get resulting state from performing this action
                var newBoard = state.board.copy();
                newBoard.placePiece(action, 1);
                var nextState = alphabeta(new State(action, newBoard, 0, depth + 1), depth + 1, maxDepth, alpha, beta, false);


                /**
                * Find out if this move is the best move we've found so far. We determine this by seeing if any of the
                * following are true:
                * - This is the first move we've checked
                * - The move has a higher score than the current best move
                * - The move is a winning move. If the current best move is also a winning move, choose the shallowest move
                * - The move is not a winning move but has the same score as the current best move. Choose the deepest move
                */
                var nextScore = nextState.score;
                var nextDepth = nextState.depth;
                if(bestAction == -1) {
                    highestScore = nextScore;
                    bestAction = action;
                    deepestDepth = nextDepth;
                } else if(nextScore >= highestScore) {
                    if(nextScore == highestScore) {
                        if(nextScore == Infinity && nextDepth <= deepestDepth || 
                           nextScore != Infinity && nextDepth > deepestDepth) {
                                highestScore = nextScore;
                                bestAction = action;
                                deepestDepth = nextDepth;
                            
                        }
                    } else {
                        highestScore = nextScore;
                        bestAction = action;
                        deepestDepth = nextDepth;
                    }
                }

                // Save the largest score found among all states in this entire branch so far
                alpha = Math.max(alpha, highestScore);
                

                /**
                * We can ignore the rest of the successor states in this branch because they will result in worse scores
                * than if we choose one of the actions in a previous branch
                */
                if(beta <= alpha) {
                    return new State(bestAction, state.board, highestScore, depth);
                }
            }
        }

        return new State(bestAction, state.board, highestScore, depth);
    }


    /**
    * Min player is playing. This means that minplayer will look at his possible moves and return the one
    * that has the smallest score.
    */
    if(!maxplayer) {

        // The smallest score among this state's children and its associated action
        var smallestScore = Infinity;
        var deepestDepth = 0;
        var bestAction = -1;


        /**
        * Generate successor states of this state. We do this by looking at each possible action
        * that minplayer can perform while in this current state. Actions are represented by the
        * current value of i. For example, when i = 4, this represents the action of minplayer dropping
        * his piece in the 5th column. We do this for each column and only examine the successor state
        * if it is valid.
        */
        let actions = orderActions(state.board, 2);
        for(let i = 0; i < actions.length; i++) {
        //for(var i = 0; i < state.board.columns; i++) {
            iterations++;

            let action = actions[i];

            // Only check valid actions
            if(state.board.isValidMove(action)) {
                
                // Get resulting state from performing this action
                var newBoard = state.board.copy();
                newBoard.placePiece(action, 2);
                var nextState = alphabeta(new State(action, newBoard, 0, depth + 1), depth + 1, maxDepth, alpha, beta, true);


                /**
                * Find out if this move is the best move we've found so far. We determine this by seeing if any of the
                * following are true:
                * - This is the first move we've checked
                * - The move has a lower score than the current best move
                * - The move is a winning move. If the current best move is also a winning move, choose the shallowest move
                * - The move is not a winning move but has the same score as the current best move. Choose the deepest move
                */
                var nextScore = nextState.score;
                var nextDepth = nextState.depth;
                if(bestAction == -1) {
                    smallestScore = nextScore;
                    bestAction = action;
                    deepestDepth = nextDepth;
                } else if(nextScore <= smallestScore) {
                    if(nextScore == smallestScore) {
                        if(nextScore == -Infinity && nextDepth <= deepestDepth || 
                           nextScore != -Infinity && nextDepth > deepestDepth) {
                                smallestScore = nextScore;
                                bestAction = action;
                                deepestDepth = nextDepth;
                            
                        }
                    } else {
                        smallestScore = nextScore;
                        bestAction = action;
                        deepestDepth = nextDepth;
                    }
                }

                // Save the smallest score found among all states in this entire branch so far
                beta = Math.min(beta, smallestScore);
                

                /**
                * We can ignore the rest of the successor states in this branch because they will result in worse scores
                * than if we choose one of the actions in a previous branch
                */
                if(beta <= alpha) {
                    return new State(bestAction, state.board, smallestScore, depth);
                }
            }
        }

        return new State(bestAction, state.board, smallestScore, depth);
    }
};


/**
* Returns an ordered list of the possible actions in a given state. Order is based on the board score. The moves are ordered
* from best to worst, so moves[0] will be the best move, moves[1] will be the second best, etc.
* @param board: The board to check for moves on
* @return: An array of moves, ordered from best to worst. An empty array means no moves were possible
*/
function orderActions(board, player) {

    let states = [];

    // Get each resulting state
    for(let i = 0; i < board.columns; i++) {

        // Perform the action if possible
        if(board.isValidMove(i)) {
            var newBoard = board.copy();
            newBoard.placePiece(i, player);
            states.push(new State(i, newBoard, newBoard.getScore(), 0));
        }
    }

    
    // Sort states on score and return a list of actions
    states = states.sort(compareStates);
    let orderedActions = [];
    
    for(let i = 0; i < states.length; i++) {
        orderedActions.push(states[i].action);
    }

    let result = (player == 1) ? orderedActions : orderedActions.reverse();
    return result;
}


/**
* Compares the scores of 2 states. Used for sorting an array of states based on their score.
* @param state1: The first State
* @param state2: The second State
* @return: 1, -1, or 0 to indicate the sort order
*/
function compareStates(state1, state2) {
    if(state1.score > state2.score) {
        return -1;
    }

    if(state1.score < state2.score) {
        return 1;
    }

    return 0;
}


function State(action, board, score, depth) {
    this.action = action;
    this.board = board;
    this.score = score;
    this.depth = depth;
}

/**
* The game board class
* @param rows: The number of rows
* @param columns: The number of columns
* @param winLength: The number of pieces needed in a row to win
*/
function Board(rows, columns, winLength) {

    // Variables
    this.rows = rows;
    this.columns = columns;
    this.winLength = winLength;
    this.tiles = [];


    /**
    * Resets the tiles of this board to be empty
    */
    this.reset = function() {
        for(var i = 0; i < rows; i++) {
            this.tiles[i] = [];

            for(var j = 0; j < columns; j++) {
                this.tiles[i][j] = TileValues.EMPTY;
            }
        }
    };


    /**
    * Places a piece for a player (if possible)
    * @param column: The column to place the piece in
    * @return: True if the place was successfully placed
    */
    this.placePiece = function(column, player) {
        if(this.isValidMove(column) == true) {
            var row = this.getAvailableRow(column);
            this.tiles[row][column] = player;
            return true;
        } else {
            return false;
        }
    };


    /**
    * Returns the score of this board relative to a given player
    * @param player: The player to find the score of
    * @return: An integer representing the score of a given player
    */
    this.getScore = function(player) {
        var player1Lines = [];
        var player2Lines = [];
        var winSize = this.winLength - 1;
        for(var i = 0; i < this.winLength; i++) {
            player1Lines[i] = 0;
            player2Lines[i] = 0;
        }


        // Check each tile
        for (var r = 0; r < this.rows; r++) {
            for (var c = 0; c < this.columns; c++) {

                /**
                * These are the lines that are check for each tile. They represent how many
                * pieces each player has in the line, and whether or not the line is valid.
                * Format: [player1pieces, player2pieces, valid]
                */
                var lineRight = [0, 0, true];
                var lineDown = [0, 0, true];
                var lineDownLeft = [0, 0, true];
                var lineDownRight = [0, 0, true];


                // Get line segments for each player
                for(var w = 0; w < this.winLength; w++) {

                    // Check right
                    if (c + winSize < this.columns) {
                        if(this.tiles[r][c+w] == Winner.PLAYER1) {
                            lineRight[0]++;
                        }

                        if(this.tiles[r][c+w] == Winner.PLAYER2) {
                            lineRight[1]++;
                        }
                    } else {
                        lineRight[2] = false;
                    }


                    // Check down and diagonals
                    if (r + winSize < this.rows) {
                        
                        // Down
                        if(this.tiles[r+w][c] == Winner.PLAYER1) {
                            lineDown[0]++;
                        }

                        if(this.tiles[r+w][c] == Winner.PLAYER2) {
                            lineDown[1]++;
                        }


                        // Down left
                        if (c - winSize >= 0) {
                            if(this.tiles[r+w][c-w] == Winner.PLAYER1) {
                                lineDownLeft[0]++;
                            }

                            if(this.tiles[r+w][c-w] == Winner.PLAYER2) {
                                lineDownLeft[1]++;
                            }
                        } else {
                            lineDownLeft[2] = false;
                        }


                        // Down right
                        if (c + winSize < this.columns) {
                            if(this.tiles[r+w][c+w] == Winner.PLAYER1) {
                                lineDownRight[0]++;
                            }

                            if(this.tiles[r+w][c+w] == Winner.PLAYER2) {
                                lineDownRight[1]++;
                            }
                        } else {
                            lineDownRight[2] = false;
                        }
                    } else {
                        lineDown[2] = false;
                        lineDownLeft[2] = false;
                        lineDownRight[2] = false;
                    }
                }



                // Update player's line counts
                function updateLines(line) {

                    // Make sure line is valid
                    if(line[0] > 0 && line[1] > 0) {
                        line[2] = false;
                    }

                    // Update line counts
                    if(line[2] == true) {
                        if(line[0] > 0) {
                            player1Lines[line[0] - 1]++;
                        }
                        if(line[1] > 0) {
                            player2Lines[line[1] - 1]++;
                        }
                    }
                }
                updateLines(lineRight);
                updateLines(lineDown);
                updateLines(lineDownLeft);
                updateLines(lineDownRight);
            }
        }


        // Set score to infinity if any winning lines are found
        if(player1Lines[player1Lines.length - 1] > 0) {
            return Infinity;
        }
        if(player2Lines[player2Lines.length - 1] > 0) {
            return -Infinity;
        }


        // Sum scores for each player
        var player1Score = 0;
        var player2Score = 0;

        for(var i = 0; i < player1Lines.length - 1; i++) {
            player1Score += Math.pow(10 * i, i) * player1Lines[i];
            player2Score -= Math.pow(10 * i, i) * player2Lines[i];
        }

        return player1Score + player2Score;
    };


    /**
    * Checks whether there is a winner
    * @return: A Winner.enum indicating if there is a winner
    */
    this.getWinner = function() {
        var isFull = true;
        var winSize = this.winLength - 1;


        // Check each tile
        for (var r = 0; r < this.rows; r++) {
            for (var c = 0; c < this.columns; c++) {
                var tileValue = this.tiles[r][c];
                

                // Skip empty tiles
                if (tileValue == TileValues.EMPTY) {
                    isFull = false;
                    continue;
                }


                var winRight = true;
                var winDown = true;
                var winDownLeft = true;
                var winDownRight = true;


                // Check each direction for a win
                for(var w = 1; w <= winSize; w++) {

                    // Check right
                    if (c + winSize < this.columns) {
                        if(tileValue != this.tiles[r][c+w]) {
                            winRight = false;
                        }
                    } else {
                        winRight = false;
                    }


                    // Check down and diagonals
                    if (r + winSize < this.rows) {
                        
                        // Down
                        if(tileValue != this.tiles[r+w][c]) {
                            winDown = false;
                        }


                        // Down left
                        if (c - winSize >= 0) {
                            if(tileValue != this.tiles[r+w][c-w]) {
                                winDownLeft = false;
                            }
                        } else {
                            winDownLeft = false;
                        }


                        // Down right
                        if (c + winSize < this.columns) {
                            if(tileValue != this.tiles[r+w][c+w]) {
                                winDownRight = false;
                            }
                        } else {
                            winDownRight = false;
                        }
                    } else {
                        winDown = false;
                        winDownLeft = false;
                        winDownRight = false;
                    }
                }

                if(winRight || winDown || winDownLeft || winDownRight) {
                    return tileValue;
                }
            }
        }


        // There is no winner or there is a tie
        return isFull ? Winner.TIE : Winner.NONE;
    };


    /**
    * Check if a given move is valid
    * @param column: The column to check
    * @return: True if the move is valid, false otherwise
    */
    this.isValidMove = function(column) {
        return this.tiles[0][column] == TileValues.EMPTY;
    };


    /**
    * Returns a copy of this board
    */
    this.copy = function() {
        var newBoard = new Board(this.rows, this.columns, this.winLength);

        for(var i = 0; i < this.rows; i++) {
            newBoard.tiles[i] = this.tiles[i].slice();
        }

        return newBoard;
    };


    /**
    * Gets the row where a player's piece will land if dropped in a given column
    * @param column: The column where the player's piece will drop
    * @return: The row where the piece will land (or -1 if move is invalid)
    */
    this.getAvailableRow = function(column) {

        // Check from the bottom up for an empty space
        for(var i = this.rows - 1; i >= 0; i--) {
            if(this.tiles[i][column] == TileValues.EMPTY) {
                return i;
            }
        }

        // Move is invalid
        return -1;
    };
}

var TileValues = Object.freeze({EMPTY: 0, PLAYER1: 1, PLAYER2: 2});
var Winner = Object.freeze({NONE: 0, PLAYER1: 1, PLAYER2: 2, TIE: 3});
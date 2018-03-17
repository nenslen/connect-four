/**
* The bot class
* @param difficulty: An integer specifying how hard the bot is
* @param playerNumber: The player's number
*/
function Bot(difficulty, playerNumber) {

	// Variables
	this.difficulty = difficulty;
	this.playerNumber = playerNumber;


	/**
	* Gets the bot's desired move
	* @param board: The board to check for moves
	* @return: An integer specifying which column the bot chose
	*/
	this.getMove = function(board) {
		var maxplayer = (this.playerNumber == 1);
		var result = this.alphabeta(new State(0, board, 0, 0), 0, -Infinity, Infinity, maxplayer);
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
	this.alphabeta = function(state, depth, alpha, beta, maxplayer) {

	    // End search if we've reached maximum depth or the game is over
	    if(depth == this.difficulty || state.board.getWinner() != Winner.NONE) {
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
	        for(var i = 0; i < state.board.columns; i++) {
	            
	            // Only check valid actions
	            if(state.board.isValidMove(i)) {
	                iterations++;


	                // Get resulting state from performing this action
	                var newBoard = state.board.copy();
	                newBoard.placePiece(i, 1);
	                var nextState = this.alphabeta(new State(i, newBoard, 0, depth + 1), depth + 1, alpha, beta, false);


	                /**
	                * Update the largest score found among this state's children so far, as well as
	                * update the action that was taken to get that score. If 2 states have the same score,
	                * break the ties by choosing the state with a deeper depth
	                */
	                var score = nextState.score;//board.getScore(1);
	                if(bestAction == -1 || score >= highestScore) {

	                	// Break ties by choosing the deeper state
	                	if(score == highestScore) {
	                		sameScore++;
	                		//console.log("Same score=" + score);
	                		//console.log("nextstate.depth=" + nextState.depth + ",deepestDepth=" + deepestDepth);
	                		if(nextState.depth > deepestDepth) {
	                			highestScore = score;
	                			bestAction = i;
	                			deepestDepth = nextState.depth;
	                		}
	                	} else {
	                		highestScore = score;
	                    	bestAction = i;
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
	        for(var i = 0; i < state.board.columns; i++) {
	            
	            // Only check valid actions
	            if(state.board.isValidMove(i)) {
	                iterations++;


	                // Get resulting state from performing this action
	                var newBoard = state.board.copy();
	                newBoard.placePiece(i, 2);
	                var nextState = this.alphabeta(new State(i, newBoard, 0, depth + 1), depth + 1, alpha, beta, true);


	                /**
	                * Update the smallest score found among this state's children so far, as well as
	                * update the action that was taken to get that score
	                */
	                var score = nextState.score;//board.getScore(2);
	                if(bestAction == -1 || score <= smallestScore) {

	                	// Break ties by choosing the deeper state
	                	if(score == smallestScore) {
	                		sameScore++;
	                		//console.log("Same score=" + score);
	                		//console.log("nextstate.depth=" + nextState.depth + ",deepestDepth=" + deepestDepth);
	                		if(nextState.depth > deepestDepth) {
	                			smallestScore = score;
	                			bestAction = i;
	                			deepestDepth = nextState.depth;
	                		}
	                	} else {
	                		smallestScore = score;
	                    	bestAction = i;
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
}

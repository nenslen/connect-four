/**
* The connect4 game model
* @param row_count: The number of rows
* @param column_count: The number of columns
* @param win_size: The number of pieces needed in a row to win
*/
function Connect4(rows, columns, winLength) {

	// Variables
	this.currentPlayer = 1;
	this.stateChanged = true;
	this.board = new Board(rows, columns, winLength);
	this.gameOver = true;
	

	/**
	* Resets all values
	*/
	this.reset = function() {
		this.currentPlayer = 1;
		this.stateChanged = true;
		this.board.reset();
		this.gameOver = false;
	};


	/**
	* Performs a turn for a player (if possible)
	*/
	this.performTurn = function(column) {
		if(this.board.placePiece(column, this.currentPlayer)) {
			this.stateChanged = true;
			this.swapTurns();
		}

		if(this.board.getWinner() != Winner.NONE) {
			this.gameOver = true;
		}
	};


	/**
	* Performs a turn for a human player
	* @param column: The column where the player wants to put their piece
	*/
	this.humanMove = function(column) {
		if(this.board.placePiece(column, this.currentPlayer)) {
			this.stateChanged = true;
			this.swapTurns();
		}
	};


	/**
	* Performs a turn for the computer player
	* @param difficulty: How hard the computer player will be
	*/
	this.computerMove = function(difficulty) {
		var bot = new Bot(difficulty, this.currentPlayer);
		var move = bot.getMove(this.board);
		this.board.placePiece(move, this.currentPlayer);
		this.stateChanged = true;
		this.swapTurns();
	};


	/**
	* Swaps whose turn it is
	*/
	this.swapTurns = function() {
		this.currentPlayer = (this.currentPlayer == 1) ? 2 : 1;
	};
};


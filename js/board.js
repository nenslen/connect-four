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
	* Returns the winning tiles (or empty if there is no winner)
	* @return: An array of points representing the winning tiles
	*/
	this.getWinningTiles = function() {
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
	            var rightTiles = [new Point(r, c)];
	            var downTiles = [new Point(r, c)];
	            var downLeftTiles = [new Point(r, c)];
	            var downRightTiles = [new Point(r, c)];


	            // Check each direction for a win
	            for(var w = 1; w <= winSize; w++) {

            	    // Check right
            	    if (c + winSize < this.columns) {
        	        	if(tileValue != this.tiles[r][c+w]) {
        	        		winRight = false;
        	        	} else {
        	        		rightTiles.push(new Point(r, c+w));
        	        	}
        	        } else {
        	        	winRight = false;
        	        }


                	// Check down and diagonals
                    if (r + winSize < this.rows) {
                    	
                    	// Down
                		if(tileValue != this.tiles[r+w][c]) {
                			winDown = false;
                		} else {
                			downTiles.push(new Point(r+w, c));
                		}


                    	// Down left
                    	if (c - winSize >= 0) {
    	            		if(tileValue != this.tiles[r+w][c-w]) {
    	            			winDownLeft = false;
    	            		} else {
    	            			downLeftTiles.push(new Point(r+w, c-w));
    	            		}
        	            } else {
        	            	winDownLeft = false;
        	            }


        	            // Down right
                    	if (c + winSize < this.columns) {
    	            		if(tileValue != this.tiles[r+w][c+w]) {
    	            			winDownRight = false;
    	            		} else {
    	            			downRightTiles.push(new Point(r+w, c+w));
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

	            if(winRight) {
	            	return rightTiles;
	            }

	            if(winDown) {
	            	return downTiles;
	            }

	            if(winDownLeft) {
	            	return downLeftTiles;
	            }

	            if(winDownRight) {
	            	return downRightTiles;
	            }
	        }
	    }


	    // There is no winner or there is a tie
	    return [];
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

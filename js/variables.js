// Enums
var Winner = Object.freeze({NONE: 0, PLAYER1: 1, PLAYER2: 2, TIE: 3});
var TileValues = Object.freeze({EMPTY: 0, PLAYER1: 1, PLAYER2: 2});
var PlayerType = Object.freeze({HUMAN: 0, AI: 1});
const Status = {READY: 0, THINKING: 1, DELAY: 2};


function State(action, board, score, depth) {
    this.action = action;
    this.board = board;
    this.score = score;
    this.depth = depth;
}

function Line(vertical, horizontal) {
	this.player1Pieces = 0;
	this.player2Pieces = 0;
	this.vertical = vertical;
	this.horizontal = horizontal;
}

function Point(x, y) {
	this.x = x;
	this.y = y;
}

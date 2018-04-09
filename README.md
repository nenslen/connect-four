# Connect Four
The focus of this project was to use [alpha-beta pruning](https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning) and a scoring heuristic to create an AI that can play [Connect Four](https://en.wikipedia.org/wiki/Connect_Four).


## Features
### Three ways to play
- Human vs Human
- Human vs AI
- AI vs AI

### Custom game settings
- Any number of rows (default is 6)
- Any number of columns (default is 7)
- Any number of pieces in a line to win (default is 4)


## Demo
[Try the demo now!](http://nicolasenslen.com/projects/demos/connect-four/)


## AI Details
### Computing moves
To compute a move, the AI uses the [alpha-beta pruning search algorithm](https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning) up to a maximum depth specified by the difficulty of the AI player. Each state in the search space has the following characteristics:
- Action: What action was performed to get to this state (ie. what column was a piece dropped into)
- Board: The game board at this particular state (ie. The arrangement of the player pieces in the Connect Four grid)
- Score: The score of this state, based on a heuristic (explained in the next section)
- Depth: How deep this state is in the search
The move that results in the best score for the current player is the chosen move.

### Scoring Heuristic
This is

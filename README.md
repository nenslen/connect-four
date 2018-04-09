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
When the AI is deciding what move to play, it 
### Minimax
The [minimax algorithm](https://en.wikipedia.org/wiki/Minimax) is the basis for how the AI works in this game. Here's is a very brief explanation of how it works:
1. All possible game states are generated based on the current state of the game
2. Each state is assigned a score (using the heuristic described later)
3. The move that results in the best score for the current AI player is the move it will choose

### Alpha-Beta Pruning
[Alpha-beta pruning](https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning) is a more efficient variation of minimax that produces the same results. Instead of generating all possible game states, alpha-beta is smart enough to understand that certain states aren't worth exploring any further. This way, we can ignore large parts of the search space and have a more efficient search.

### Scoring Heuristic
This is

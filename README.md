# Connect Four
The classic game of Connect Four with 3 different game modes
1) human vs human
2) human vs AI
3) AI vs AI
Users can change the number of rows and columns, as well as the number of tiles in a row needed to win. This makes for some unique gameplay not seen in the traditional game with 6 rows and 7 columns.

## Demo
[Try the demo now!](http://nicolasenslen.com/projects/demos/connect-four/)

## AI Implementation
The AI computes its move via minimax with alpha-beta pruning. This is done by constructing a tree where the nodes are game states and edges are actions.
To determine the score of a state, a heuristic is used that counts the number of ways a player can still win. Large scores are good for player 1 (max), and small scores are good for player 2 (min).
The difficulty of an AI represents the depth of the search. So if an AI is level 8, it will perform minimax up to a maximum depth of 8.

# Connect Four
The focus of this project was to use [alpha-beta pruning](https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning) and a scoring heuristic to create an AI that can play [Connect Four](https://en.wikipedia.org/wiki/Connect_Four).

### Demo
[Try the demo here!](http://nicolasenslen.com/projects/demos/connect-four/)


### Features
#### Three ways to play
- Human vs Human
- Human vs AI
- AI vs AI

#### Custom game settings
- Any number of rows (default is 6)
- Any number of columns (default is 7)
- Any number of pieces in a line to win (default is 4)


### AI Details
#### Computing moves
To compute a move, the AI uses the [alpha-beta pruning search algorithm](https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning) up to a maximum depth equal to the AI's level of difficulty. The red and blue players represent the max and min players, respectively. Each state in the search space has the following characteristics:
- Action: What action was performed to get to this state (ie. what column the piece was dropped into)
- Board: The game board at this particular state (ie. The arrangement of the player pieces in the Connect Four grid)
- Score: The score of this state, based on a heuristic (explained in the next section)
- Depth: How deep this state is in the search

The move that results in the best score for the current player is the chosen move.

#### Scoring Heuristic
The score of a state is assigned based on how good the state's board is for each player. How good a state is for a particular player depends on how many possible ways they can still win, and how many moves it will take to reach a winning state. To compute the score of a state, we look at each possible line of 4 consecutive tiles on the board and:
- Count the number of:
  - Red pieces 
  - Blue pieces
  - Empty tiles
- If the line is empty or contains both red and blue pieces: Don't change the score
- If the line contains only red or only blue pieces: Calculate the line's value based on how many pieces are in the line (more pieces = larger value). Then use the line's value to increase/decrease the total score depending on which player's pieces are in the line.
- If the line wins the game for a player, then the score becomes either +Infinity or -Infinity, depending on whether red or blue won.

# Connect Four
This focus of this project was to use [alpha-beta pruning](https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning) and a scoring heuristic to create an AI that can play [Connect Four](https://en.wikipedia.org/wiki/Connect_Four).

## Features
### Three ways to play
- Human vs Human
- Human vs AI
- AI vs AI
### Custom game settings
- Any number of rows (default is 6)
- Any number of columns (default is 7)
- Any number of pieces in a row to win (default is 4)

## Demo
[Try the demo now!](http://nicolasenslen.com/projects/demos/connect-four/)

## Algorithm Details

The difficulty of an AI represents the depth of the search. So if an AI is level 8, it will perform minimax up to a maximum depth of 8.

### Implementation
The AI computes its move using a web worker. This allows the UI to remain unblocked, which is very important because on higher difficulties, the computing time can be 30+ seconds.

Once the web worker has finished computing the move, it alerts the controller and the move is performed.

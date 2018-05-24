<!DOCTYPE html>
<?php require '../../../functions.php'; ?>
<html>
<head>
	<?php drawHead('Connect 4 Demo', '../../../'); ?>

	<link rel="stylesheet" type="text/css" href="css/connect4.css">
	<script src="js/phaser.js"></script>
	<script src="js/variables.js"></script>
	<script src="js/bot.js"></script>
	<script src="js/connect4.js"></script>
	<script src="js/board.js"></script>
	<script src="js/controller.js"></script>
</head>
<body>
	<?php drawHeader('small'); ?>


	<div class="wrapper wrapper-no-margin-top">
		<div class='section-wrapper'>
			<div class="section">
				<h1 class="section-header top-header">Connect Four</h1>
				<div class="section-content">
					<div id="game-canvas"></div>

					<div class="grid">
						<button class="button button-green" id="startButton">New Game</button>
					</div>
					
					<div id="settings-menu">
						<div class="card" id="thinking-container">
							<!--<span class="center">-->
								<h1 id="winner"></h1>
								<img id="thinkingImage" src="images/player1Thinking.gif">
							<!--</span>-->
						</div>
						
						<div class="grid grid-2-1-1">
							<div class="card settings-group">
								<div class="settings-group-inner">
									<span class="settings-item-header">Game Options</span>

									<span class="settings-item">
										<span class="settings-item-header-small">Game Speed</span>
										<div class="gameSpeed_slider">
											<input class="gameSpeed_range" type="range" value="1500" min="5" max="2000">
										</div>
									</span> 
									<span class="settings-item">
										<span class="settings-item-header-small">Rows</span>
										<input type="number" id="numRows" value="6">
									</span>
									<span class="settings-item">
										<span class="settings-item-header-small">Columns</span>
										<input type="number" id="numCols" value="7">
									</span>
									<span class="settings-item">
										<span class="settings-item-header-small">Winning Length</span>
										<input type="number" id="winLength" value="4">
									</span>
								</div>
							</div>
							
							<div class="card settings-group">
								<div class="settings-group-inner">
									<span class="settings-item-header">Players</span>
									
									<span class="settings-item">
										<!-- Red Player -->
										<select class="button-red" id="player1">
											<option value="0" selected="selected">Human</option>
											<option value="1">AI: Level 1</option>
											<option value="2">AI: Level 2</option>
											<option value="3">AI: Level 3</option>
											<option value="4">AI: Level 4</option>
											<option value="5">AI: Level 5</option>
											<option value="6">AI: Level 6</option>
											<option value="7">AI: Level 7</option>
											<option value="8">AI: Level 8</option>
											<option value="9">AI: Level 9</option>
											<option value="10">AI: Level 10</option>
										</select>
									</span>
									<span class="settings-item">
										<!-- Blue Player -->
										<select class="button-blue" id="player2">
											<option value="0">Human</option>
											<option value="1">AI: Level 1</option>
											<option value="2">AI: Level 2</option>
											<option value="3">AI: Level 3</option>
											<option value="4">AI: Level 4</option>
											<option value="5" selected="selected">AI: Level 5</option>
											<option value="6">AI: Level 6</option>
											<option value="7">AI: Level 7</option>
											<option value="8">AI: Level 8</option>
											<option value="9">AI: Level 9</option>
											<option value="10">AI: Level 10</option>
										</select>
									</span>
									<!--
									<span class="settings-item">
										<!-- Yellow Player --
										<select class="button-yellow" id="player3">
											<option value="0">Human</option>
											<option value="1">AI: Level 1</option>
											<option value="2">AI: Level 2</option>
											<option value="3">AI: Level 3</option>
											<option value="4">AI: Level 4</option>
											<option value="5">AI: Level 5</option>
											<option value="6">AI: Level 6</option>
											<option value="7">AI: Level 7</option>
											<option value="8">AI: Level 8</option>
											<option value="9">AI: Level 9</option>
											<option value="10">AI: Level 10</option>
											<option value="11" selected="selected">None</option>

										</select>
									</span>
									<span class="settings-item">
										<!-- Green Player --
										<select class="button-green" id="player4">
											<option value="0">Human</option>
											<option value="1">AI: Level 1</option>
											<option value="2">AI: Level 2</option>
											<option value="3">AI: Level 3</option>
											<option value="4">AI: Level 4</option>
											<option value="5">AI: Level 5</option>
											<option value="6">AI: Level 6</option>
											<option value="7">AI: Level 7</option>
											<option value="8">AI: Level 8</option>
											<option value="9">AI: Level 9</option>
											<option value="10">AI: Level 10</option>
											<option value="11" selected="selected">None</option>
										</select>
									</span>
								-->
								</div>
							</div>
						</div>
					</div>
					

			        <h1 class="section-header top-header">About</h1>

			        <p id="description">This project started as an assignment question for a university class. It is the classic game of Connect Four, with an AI opponent
			        that uses some interesting methods to play. Give it a try and see if you can win!</p>
			        

			        <h1 class="section-header top-header">Details</h1>

			        <h2 class="section-header section-header-small">How it works</h2>
			        <p>The AI opponent has 10 difficulties (1 - 10). The difficulty is how many moves it is allowed to 'look ahead' while searching for the best move. So if the difficulty is set to 4, the AI will look at all of the possible states the game could be in after 4 more turns have been played. Each possible move that the AI can make is assigned a score, based on how 'good' it thinks that move is. The move with the highest score is the one that the AI will choose.</p>
			        
			        <p>For source code, visit the <a href="https://github.com/nenslen/Connect4">github page for this project</a>.</p>
			        
			        <canvas id="hiddenCanvas" width="280" height="280" style="display: none"></canvas>
				</div>
			</div>
		</div>

		<?php drawFooter(); ?>
	</div>
</body>
</html>
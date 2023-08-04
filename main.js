const game = new Game('gameCanvas');

// Add players
const player1 = new Player(100, 100, 'right', 'blue', { 'w': 'up', 'a': 'left', 's': 'down', 'd': 'right' });
const player2 = new Player(500, 500, 'left', 'red', { 'ArrowUp': 'up', 'ArrowLeft': 'left', 'ArrowDown': 'down', 'ArrowRight': 'right' });
game.addPlayer(player1);
game.addPlayer(player2);

// Run game
game.run();

window.addEventListener('keydown', (event) => {
    if (game.running) {
        game.handleInput(event.key);
    } else {
        game.restart();
    }
});
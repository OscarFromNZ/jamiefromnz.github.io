document.getElementById('singlePlayer').addEventListener('click', function () {
    startGame('single-player');
});

document.getElementById('twoPlayer').addEventListener('click', function () {
    startGame('two-player');
});


document.getElementById('ai').addEventListener('click', function () {
    startGame('ai');
});

let game;

function startGame(mode) {
    // Hide the start menu
    document.getElementById('startMenu').style.display = 'none';

    switch (mode) {
        case 'single-player':
            game = new SinglePlayerMode('gameCanvas');
            break;
        case 'two-player':
            game = new TwoPlayerMode('gameCanvas');
            break;
        case 'ai':
            game = new AIPlayerMode('gameCanvas');
            break;
    }
    game.start();
    game.run();

    window.addEventListener('keydown', (event) => {
        if (game.running) {
            game.handleInput(event.key);
        } else {
            game.restart();
        }
    });
}

function createAndAddAI() {
    const aiPlayer = new AIPlayer(400, 400, 'up', 'pink', {}, game);
    game.addPlayer(aiPlayer);
}

function createAndAddPlayer() {
    if (game.players.length === 1) {
        const player = new Player(100, 100, 'right', 'blue', { 'w': 'up', 'a': 'left', 's': 'down', 'd': 'right', 'c': 'shoot' }, game);
        game.addPlayer(player);
    } else {
        const player = new Player(500, 500, 'left', 'red', { 'ArrowUp': 'up', 'ArrowLeft': 'left', 'ArrowDown': 'down', 'ArrowRight': 'right', 'm': 'shoot' }, game);
        game.addPlayer(player);
    }
}
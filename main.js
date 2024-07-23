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
            if (event.key === 'r') {
                game = new SinglePlayerMode('gameCanvas');
                game.start();
                game.run();
            }

            if (event.key === 't') {
                game = new TwoPlayerMode('gameCanvas');
                game.start();
                game.run();
            }
        }
    });
}

function createAndAddAI() {
    const aiPlayer = new AIPlayer(400, 400, 'up', 'pink', {}, game);
    game.addPlayer(aiPlayer);
}

// KEYS DONT WORK
function createAndAddPlayer() {
    if (game.players.length == 1) {
        const player = new Player(100, 100, 'right', 'red', { 'w': 'up', 'a': 'left', 's': 'down', 'd': 'right', 'c': 'shoot', 'caos': 'turnOff' }, game);
        game.addPlayer(player);
    } else {
        const player = new Player(500, 500, 'left', 'cyan', { 'ArrowUp': 'up', 'ArrowLeft': 'left', 'ArrowDown': 'down', 'ArrowRight': 'right', 'Shift': 'shoot', 'enter': 'turnOff' }, game);
        game.addPlayer(player);
    }
}
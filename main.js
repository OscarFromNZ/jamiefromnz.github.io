document.getElementById('singlePlayer').addEventListener('click', function () {
    startGame('single-player');
});

document.getElementById('twoPlayer').addEventListener('click', function () {
    startGame('two-player');
});

function startGame(mode) {
    // Hide the start menu
    document.getElementById('startMenu').style.display = 'none';

    let game;

    switch (mode) {
        case 'single-player':
            game = new SinglePlayerMode('gameCanvas');
            break;
        case 'two-player':
            game = new TwoPlayerMode('gameCanvas');
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
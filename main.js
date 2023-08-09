document.getElementById('singlePlayer').addEventListener('click', function () {
    startGame('single');
});

document.getElementById('twoPlayer').addEventListener('click', function () {
    startGame('two-player');
});

document.getElementById('sandbox').addEventListener('click', function () {
    startGame('sandbox');
});

let game;

function startGame(mode) {
    switch (mode) {
        case 'single':
            game = new SinglePlayerGame('gameCanvas');
            break;
        case 'two-player':
            game = new TwoPlayerGame('gameCanvas');
            break;
        case 'sandbox':
            game = new SandboxGame('gameCanvas');
            break;
    }
    game.run();
}

window.addEventListener('keydown', (event) => {
    if (game.running) {
        game.handleInput(event.key);
    } else {
        game.restart();
    }
});

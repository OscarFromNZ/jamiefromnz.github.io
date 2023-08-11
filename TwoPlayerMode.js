class TwoPlayerMode extends Game {
    constructor(canvasId) {
        super(canvasId);
    }

    update() {
        super.update();

    }

    start() {
        const player1 = new Player(100, 100, 'right', 'blue', { 'w': 'up', 'a': 'left', 's': 'down', 'd': 'right', 'c': 'shoot' }, this);
        const player2 = new Player(500, 500, 'left', 'red', { 'ArrowUp': 'up', 'ArrowLeft': 'left', 'ArrowDown': 'down', 'ArrowRight': 'right', 'm': 'shoot' }, this);
        this.addPlayer(player1);
        this.addPlayer(player2);

        this.generateRandomFood();
        this.generateRandomFood();
    }

    run() {
        super.run();
    }

    draw() {
        super.draw();

    }
}
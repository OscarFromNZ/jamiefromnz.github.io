class SinglePlayerMode extends Game {
    constructor(canvasId) {
        super(canvasId);
    }

    update() {
        super.update();

    }

    start() {
        const player1 = new Player(100, 100, 'right', 'blue', { 'w': 'up', 'a': 'left', 's': 'down', 'd': 'right' });
        this.addPlayer(player1);

        this.generateRandomFood();
    }

    run() {
        super.run();
    }

    draw() {
        super.draw();
    }
}
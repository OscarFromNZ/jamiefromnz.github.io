class SinglePlayerMode extends Game {
    constructor(canvasId) {
        super(canvasId);
    }

    update() {
        super.update();

    }

    start() {
        const player1 = new Player(100, 100, 'right', 'blue', { 'w': 'up', 'a': 'left', 's': 'down', 'd': 'right', 'c': 'shoot' }, this);
        this.addPlayer(player1);

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
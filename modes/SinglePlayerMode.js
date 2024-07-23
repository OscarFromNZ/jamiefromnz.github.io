class SinglePlayerMode extends Game {
    constructor(canvasId) {
        super(canvasId);
    }

    update() {
        super.update();

    }

    start() {
        createAndAddPlayer();

        this.generateRandomFood();
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
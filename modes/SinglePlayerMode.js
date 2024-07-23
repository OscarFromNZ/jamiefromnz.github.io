class SinglePlayerMode extends Game {
    constructor(canvasId) {
        super(canvasId);
    }

    update() {
        super.update();

    }

    // duped code
    start() {
        createAndAddPlayer();

        for (let i = 0; i < 10; i++) {
            this.generateRandomFood();

        }
    }

    run() {
        super.run();
    }

    draw() {
        super.draw();
    }
}
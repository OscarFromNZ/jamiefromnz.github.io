class TwoPlayerMode extends Game {
    constructor(canvasId) {
        super(canvasId);
    }

    update() {
        super.update();

    }

    start() {
        createAndAddPlayer();
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
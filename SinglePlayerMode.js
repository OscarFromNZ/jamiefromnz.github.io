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

        const aiPlayer = new AIPlayer(400, 400, 'up', 'pink', {});
        //this.addPlayer(aiPlayer);

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
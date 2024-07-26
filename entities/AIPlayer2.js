class AIPlayer2 extends AIPlayer {
    constructor(x, y, direction, colour, keys, game) {
        super(x, y, direction, colour, keys, game);
    }

    moveSmartly(game) {
        let defaultNextY = this.getDefaultNextY(this.direction, this.y);
        let defaultNextX = this.getDefaultNextX(this.direction, this.x);

        let nextMove = { x: defaultNextX, y: defaultNextY};

        if (!this.isValidMove(defaultNextX, defaultNextY, game)) {
            // change move
            nextMove = get
        }

        this.direction = this.getDirection(nextMove);
    }

    calculatePath(game, targetPosition) {
 
    }
}
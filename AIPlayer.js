class AIPlayer extends Player {
    constructor(x, y, direction, colour, keys) {
        super(x, y, direction, colour, keys);
        this.isAI = true;
    }
}
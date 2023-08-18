class AIPlayer extends Player {
    constructor(x, y, direction, colour, keys) {
        super(x, y, direction, colour, keys);
        this.isAI = true;
    }

    moveSmartly(game) {
        const directions = ['up', 'down', 'left', 'right'];
        let validDirections = [];

        // Evaluate each possible direction
        directions.forEach(direction => {
            if (this.isOppositeDirection(this.direction, direction)) return; // Skip opposite direction

            let nextX = this.x;
            let nextY = this.y;
            switch (direction) {
                case 'up':
                    nextY -= this.gridSize * this.speed;
                    break;
                case 'down':
                    nextY += this.gridSize * this.speed;
                    break;
                case 'left':
                    nextX -= this.gridSize * this.speed;
                    break;
                case 'right':
                    nextX += this.gridSize * this.speed;
                    break;
            }

            if (!this.willCollideWithSelf(nextX, nextY) && !game.willCollideWithOthers(nextX, nextY, this) && !this.isOutsideCanvas(nextX, nextY, game.canvas.width, game.canvas.height)) {
                validDirections.push(direction);
            }
        });

        if (!validDirections.includes(this.direction)) {
            this.direction = validDirections[Math.floor(Math.random() * validDirections.length)];
        }
    }

    willCollideWithSelf(nextX, nextY) {
        return this.trail.some(trailPos => trailPos.x === nextX && trailPos.y === nextY);
    }

    isOutsideCanvas(nextX, nextY, width, height) {
        return nextX < 0 || nextY < 0 || nextX >= width || nextY >= height;
    }
}
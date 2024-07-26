class AIPlayer extends Player {
    constructor(x, y, direction, colour, keys, game) {
        super(x, y, direction, colour, keys, game);
        this.isAI = true;
        this.target = game.players[0];
        this.randomMoveFrequency = 0.1; // 10% of the time make a random move
        this.lastDirection = this.direction;
        this.aggressiveMode = false; // Start in defensive mode
    }

    isValidMove(nextX, nextY, game) {
        return (
            !this.willCollideWithSelf(nextX, nextY) &&
            !game.willCollideWithOthers(nextX, nextY, this) &&
            !this.isOutsideCanvas(nextX, nextY, game.canvas.width, game.canvas.height)
        );
    }

    getDefaultNextY(direction, y) {
        if (direction == 'up') {
            return  y + this.game.gridSize;
        }

        if (direction == 'down') {
            return y - this.game.gridSize;
        }
    }

    getDefaultNextX(direction, x) {
        if (direction == 'right') {
            return  x - this.game.gridSize;
        }

        if (direction == 'left') {
            return x + this.game.gridSize;
        }
    }

    getTargetPosition() {
        return { x: this.target.x, y: this.target.y };
    }

    heuristic(x1, y1, x2, y2) {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }

    getNeighbors(x, y, game) {
        const neighbors = [];

        const potentialMoves = [
            { x: x + this.gridSize, y: y },
            { x: x - this.gridSize, y: y },
            { x: x, y: y + this.gridSize },
            { x: x, y: y - this.gridSize }
        ];

        potentialMoves.forEach(move => {
            if (this.isValidMove(move.x, move.y, game)) {
                neighbors.push(move);
            }
        });

        return neighbors;
    }

    getDirection(nextMove) {
        if (nextMove.x > this.x) return 'right';
        if (nextMove.x < this.x) return 'left';
        if (nextMove.y > this.y) return 'down';
        if (nextMove.y < this.y) return 'up';
        return this.direction;
    }

    // valid
    getRandomValidDirection(game) {
        const directions = ['up', 'down', 'left', 'right'];
        let validDirections = [];

        directions.forEach(direction => {
            if (this.isOppositeDirection(this.lastDirection, direction)) return;

            let nextX = this.x;
            let nextY = this.y;
            switch (direction) {
                case 'up':
                    nextY -= this.gridSize;
                    break;
                case 'down':
                    nextY += this.gridSize;
                    break;
                case 'left':
                    nextX -= this.gridSize;
                    break;
                case 'right':
                    nextX += this.gridSize;
                    break;
            }

            if (this.isValidMove(nextX, nextY, game)) {
                validDirections.push(direction);
            }
        });

        if (validDirections.length > 0) {
            this.lastDirection = this.direction;
            return validDirections[Math.floor(Math.random() * validDirections.length)];
        } else {
            return this.direction;
        }
    }

    willCollideWithSelf(nextX, nextY) {
        return this.trail.some(trailPos => trailPos.x === nextX && trailPos.y === nextY);
    }

    isOutsideCanvas(nextX, nextY, width, height) {
        return nextX < 0 || nextY < 0 || nextX >= width || nextY >= height;
    }

    isOppositeDirection(currentDirection, newDirection) {
        return (currentDirection === 'up' && newDirection === 'down') ||
            (currentDirection === 'down' && newDirection === 'up') ||
            (currentDirection === 'left' && newDirection === 'right') ||
            (currentDirection === 'right' && newDirection === 'left');
    }

    getProximityToPlayer(game) {
        const dx = Math.abs(this.x - this.target.x);
        const dy = Math.abs(this.y - this.target.y);
        return Math.sqrt(dx * dx + dy * dy);
    }
}
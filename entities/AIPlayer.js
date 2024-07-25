class AIPlayer extends Player {
    constructor(x, y, direction, colour, keys, game) {
        super(x, y, direction, colour, keys, game);
        this.isAI = true;
        this.target = game.players[0];
        this.randomMoveFrequency = 0.1; // 10% of the time make a random move
        this.lastDirection = this.direction;
        this.trapHistory = new Set();
        this.aggressiveMode = false; // Start in aggressive mode
    }

    moveSmartly() {
        if (Math.random() < this.randomMoveFrequency) {
            this.direction = this.getRandomDirection(this.game);
        } else {
            const targetPosition = this.getTargetPosition();
            const path = this.calculatePath(this.game, targetPosition);

            if (path.length > 1) {
                const nextMove = path[1]; // Get the next move
                this.direction = this.getDirection(nextMove);
            }

            // Add avoidance and prediction behavior
            if (this.shouldAvoidTrap(this.game)) {
                this.direction = this.getSafeDirection(this.game);
            } else if (this.shouldPredictPlayerMove(this.game)) {
                this.direction = this.predictPlayerMove(this.game);
            }
        }

        this.rememberPosition();
    }

    updateMode(game) {
        // Switch between aggressive and defensive modes based on the game state
        const myFreeSpace = this.evaluateSafeArea(this.x, this.y, game);
        const playerFreeSpace = this.evaluateSafeArea(this.target.x, this.target.y, game);

        if (myFreeSpace < playerFreeSpace / 2) {
            this.aggressiveMode = false; // Switch to defensive mode
        } else {
            this.aggressiveMode = true; // Stay in aggressive mode
        }
    }

    getTargetPosition() {
        return { x: this.target.x, y: this.target.y };
    }

    calculatePath(game, targetPosition) {
        const openSet = [];
        const closedSet = new Set();
        const startNode = { x: this.x, y: this.y, g: 0, f: this.heuristic(this.x, this.y, targetPosition.x, targetPosition.y), parent: null };
        openSet.push(startNode);

        while (openSet.length > 0) {
            openSet.sort((a, b) => a.f - b.f);
            const currentNode = openSet.shift();

            if (currentNode.x === targetPosition.x && currentNode.y === targetPosition.y) {
                return this.reconstructPath(currentNode);
            }

            closedSet.add(`${currentNode.x},${currentNode.y}`);
            const neighbors = this.getNeighbors(currentNode.x, currentNode.y, game);

            neighbors.forEach(neighbor => {
                if (closedSet.has(`${neighbor.x},${neighbor.y}`)) return;

                const tentativeG = currentNode.g + 1;
                let neighborNode = openSet.find(node => node.x === neighbor.x && node.y === neighbor.y);

                if (!neighborNode) {
                    neighborNode = {
                        x: neighbor.x,
                        y: neighbor.y,
                        g: tentativeG,
                        f: tentativeG + this.heuristic(neighbor.x, neighbor.y, targetPosition.x, targetPosition.y),
                        parent: currentNode
                    };
                    openSet.push(neighborNode);
                } else if (tentativeG < neighborNode.g) {
                    neighborNode.g = tentativeG;
                    neighborNode.f = tentativeG + this.heuristic(neighbor.x, neighbor.y, targetPosition.x, targetPosition.y);
                    neighborNode.parent = currentNode;
                }
            });
        }

        return []; // No path found
    }

    reconstructPath(node) {
        const path = [];
        let current = node;

        while (current) {
            path.push({ x: current.x, y: current.y });
            current = current.parent;
        }

        return path.reverse();
    }

    heuristic(x1, y1, x2, y2) {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }

    getNeighbors(x, y, game) {
        const neighbors = [];

        const potentialMoves = [
            { x: x + this.gridSize * this.speed, y: y },
            { x: x - this.gridSize * this.speed, y: y },
            { x: x, y: y + this.gridSize * this.speed },
            { x: x, y: y - this.gridSize * this.speed }
        ];

        potentialMoves.forEach(move => {
            if (!this.willCollideWithSelf(move.x, move.y) &&
                !game.willCollideWithOthers(move.x, move.y, this) &&
                !this.isOutsideCanvas(move.x, move.y, game.canvas.width, game.canvas.height) &&
                !this.trapHistory.has(`${move.x},${move.y}`)) {
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

    getRandomDirection(game) {
        const directions = ['up', 'down', 'left', 'right'];
        let validDirections = [];

        directions.forEach(direction => {
            if (this.isOppositeDirection(this.lastDirection, direction)) return; // Skip opposite direction

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

            if (!this.willCollideWithSelf(nextX, nextY) &&
                !game.willCollideWithOthers(nextX, nextY, this) &&
                !this.isOutsideCanvas(nextX, nextY, game.canvas.width, game.canvas.height)) {
                validDirections.push(direction);
            }
        });

        if (validDirections.length > 0) {
            this.lastDirection = this.direction;
            return validDirections[Math.floor(Math.random() * validDirections.length)];
        } else {
            return this.direction; // No valid directions found, keep current direction
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

    shouldAvoidTrap(game) {
        // Implement logic to check if the AI is heading into a trap
        const currentDirection = this.direction;
        const directions = ['up', 'down', 'left', 'right'];
        let validDirections = [];

        directions.forEach(direction => {
            if (this.isOppositeDirection(currentDirection, direction)) return; // Skip opposite direction

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

            if (!this.willCollideWithSelf(nextX, nextY) &&
                !game.willCollideWithOthers(nextX, nextY, this) &&
                !this.isOutsideCanvas(nextX, nextY, game.canvas.width, game.canvas.height)) {
                validDirections.push(direction);
            }
        });

        return validDirections.length < 2; // If less than 2 valid directions, we're likely heading into a trap
    }

    getSafeDirection(game) {
        // Implement logic to find a safe direction to avoid the trap
        const directions = ['up', 'down', 'left', 'right'];
        let validDirections = [];

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

            if (!this.willCollideWithSelf(nextX, nextY) &&
                !game.willCollideWithOthers(nextX, nextY, this) &&
                !this.isOutsideCanvas(nextX, nextY, game.canvas.width, game.canvas.height)) {
                validDirections.push(direction);
            }
        });

        if (validDirections.length > 0) {
            return validDirections[Math.floor(Math.random() * validDirections.length)];
        } else {
            return this.direction; // No valid directions found, keep current direction
        }
    }

    shouldPredictPlayerMove(game) {
        // Implement logic to predict player's move
        const distance = Math.abs(this.x - this.target.x) + Math.abs(this.y - this.target.y);
        return distance < 100; // If player is within 100 units, predict their move
    }

    predictPlayerMove(game) {
        // Implement logic to predict player's move based on their current direction
        const playerDirection = this.target.direction;
        let predictedX = this.target.x;
        let predictedY = this.target.y;

        switch (playerDirection) {
            case 'up':
                predictedY -= this.gridSize * this.speed;
                break;
            case 'down':
                predictedY += this.gridSize * this.speed;
                break;
            case 'left':
                predictedX -= this.gridSize * this.speed;
                break;
            case 'right':
                predictedX += this.gridSize * this.speed;
                break;
        }

        const path = this.calculatePath(game, { x: predictedX, y: predictedY });
        if (path.length > 1) {
            const nextMove = path[1];
            return this.getDirection(nextMove);
        }

        return this.direction;
    }

    rememberPosition() {
        // Remember positions to avoid getting trapped in the same spot
        this.trapHistory.add(`${this.x},${this.y}`);
        if (this.trapHistory.size > 100) {
            this.trapHistory.delete(this.trapHistory.values().next().value); // Keep the history size manageable
        }
    }

    getProximityToObstacle(game) {
        const directions = ['up', 'down', 'left', 'right'];
        let minDistance = Infinity;

        directions.forEach(direction => {
            let distance = 0;
            let nextX = this.x;
            let nextY = this.y;

            while (true) {
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

                if (this.willCollideWithSelf(nextX, nextY) ||
                    game.willCollideWithOthers(nextX, nextY, this) ||
                    this.isOutsideCanvas(nextX, nextY, game.canvas.width, game.canvas.height)) {
                    break;
                }

                distance++;
            }

            if (distance < minDistance) {
                minDistance = distance;
            }
        });

        return minDistance * this.gridSize;
    }

    getProximityToPlayer(game) {
        const dx = Math.abs(this.x - this.target.x);
        const dy = Math.abs(this.y - this.target.y);
        return Math.sqrt(dx * dx + dy * dy);
    }
}

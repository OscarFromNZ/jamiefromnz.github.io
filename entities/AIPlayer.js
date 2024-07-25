// MAKE AI PLAYER BASE CLASS AND MAKE OTHER THINGS EXTEND IT

class AIPlayer extends Player {
    constructor(x, y, direction, colour, keys, game) {
        super(x, y, direction, colour, keys, game);
        this.isAI = true;
        this.target = game.players[0];
        this.randomMoveFrequency = 0.1; // 10% of the time make a random move
        this.lastDirection = this.direction;
        this.trapHistory = new Set();
        this.aggressiveMode = false; // Start in defensive mode
    }

    moveSmartly(game) {
        if (Math.random() < this.randomMoveFrequency) {
            this.direction = this.getRandomDirection(game);
        } else {
            const targetPosition = this.getTargetPosition();
            const path = this.calculatePath(game, targetPosition);

            if (path.length > 1) {
                const nextMove = path[1];
                this.direction = this.getDirection(nextMove);
            }

            if (this.shouldAvoidTrap(game)) {
                this.direction = this.getSafeDirection(game);
            } else if (this.shouldPredictPlayerMove(game)) {
                this.direction = this.predictPlayerMove(game);
            }
        }

        this.rememberPosition();
    }

    updateMode(game) {
        const myFreeSpace = this.evaluateSafeArea(this.x, this.y, game);
        const playerFreeSpace = this.evaluateSafeArea(this.target.x, this.target.y, game);

        this.aggressiveMode = myFreeSpace >= playerFreeSpace / 2;
    }

    isValidMove(nextX, nextY, game) {
        return (
            !this.willCollideWithSelf(nextX, nextY) &&
            !game.willCollideWithOthers(nextX, nextY, this) &&
            !this.isOutsideCanvas(nextX, nextY, game.canvas.width, game.canvas.height) &&
            !this.trapHistory.has(`${nextX},${nextY}`)
        );
    }

    getTargetPosition() {
        return { x: this.target.x, y: this.target.y };
    }

    calculatePath(game, targetPosition) {
        const openSet = [];
        const closedSet = new Set();
        const startNode = {
            x: this.x,
            y: this.y,
            g: 0,
            f: this.heuristic(this.x, this.y, targetPosition.x, targetPosition.y),
            parent: null
        };
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

    getRandomDirection(game) {
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

    shouldAvoidTrap(game) {
        const directions = ['up', 'down', 'left', 'right'];
        let validDirections = [];

        directions.forEach(direction => {
            if (this.isOppositeDirection(this.direction, direction)) return;

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

        return validDirections.length < 2;
    }

    getSafeDirection(game) {
        const directions = ['up', 'down', 'left', 'right'];
        let validDirections = [];

        directions.forEach(direction => {
            if (this.isOppositeDirection(this.direction, direction)) return;

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
            return validDirections[Math.floor(Math.random() * validDirections.length)];
        } else {
            return this.direction;
        }
    }

    shouldPredictPlayerMove(game) {
        const distance = Math.abs(this.x - this.target.x) + Math.abs(this.y - this.target.y);
        return distance < 100;
    }

    predictPlayerMove(game) {
        const playerDirection = this.target.direction;
        let predictedX = this.target.x;
        let predictedY = this.target.y;

        switch (playerDirection) {
            case 'up':
                predictedY -= this.gridSize;
                break;
            case 'down':
                predictedY += this.gridSize;
                break;
            case 'left':
                predictedX -= this.gridSize;
                break;
            case 'right':
                predictedX += this.gridSize;
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
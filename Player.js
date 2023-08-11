class Player {
    constructor(x, y, direction, colour, keys) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.colour = colour;
        this.trail = [];
        this.keys = keys;
        this.gridSize = 20;

        this.hasBomb = false;
        this.hasAnchor = false;
        this.speed = 1;
    }

    updatePosition() {
        console.log(this.direction);
        switch (this.direction) {
            case 'up':
                this.y = this.y - this.gridSize * this.speed;
                break;
            case 'down':
                this.y = this.y + this.gridSize * this.speed;
                break;
            case 'left':
                this.x = this.x - this.gridSize * this.speed;
                break;
            case 'right':
                this.x = this.x + this.gridSize * this.speed;
                break;
        }

        // Round to nearest multiple of 10, should already be a multiple of 10
        this.x = Math.ceil(this.x / this.gridSize) * this.gridSize;
        this.y = Math.ceil(this.y / this.gridSize) * this.gridSize;
    }

    updateTrail() {
        this.trail.push({ x: this.x, y: this.y });
    }

    draw(context) {
        if (this.speed === 2) {
            context.strokeStyle = 'greenyellow';
        }

        for (let i = 1; i < this.trail.length; i++) {
            const prevPos = this.trail[i - 1];
            const currPos = this.trail[i];

            context.lineWidth = 20;

            // Draw a line between the previous position and the current position
            context.beginPath();
            context.moveTo(prevPos.x + this.gridSize / 2, prevPos.y + this.gridSize / 2);
            context.lineTo(currPos.x + this.gridSize / 2, currPos.y + this.gridSize / 2);
            context.stroke();
        }

        // reset colour
        context.strokeStyle = this.colour;
    }

    handleInput(key) {
        const newDirection = this.keys[key];

        if (!newDirection) return;

        // Check if new direction is opposite of current direction
        if (!this.isOppositeDirection(this.direction, newDirection)) {
            this.direction = newDirection;
        }
    }

    isOppositeDirection(oldDirection, newDirection) {
        return (newDirection == this.getOppositeDirection(oldDirection))
    }

    getOppositeDirection(direction) {
        switch (direction) {
            case 'up':
                return 'down';
            case 'down':
                return 'up';
            case 'left':
                return 'right';
            case 'right':
                return 'left';
            default:
                return '';
        }
    }

    moveRandomly() {
        const directions = ['up', 'down', 'left', 'right'];
        const randomIndex = Math.floor(Math.random() * directions.length);

        if (!this.isOppositeDirection(this.direction, directions[randomIndex])) {
            this.direction = directions[randomIndex];
        }
    }
}
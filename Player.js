class Player {
    constructor(x, y, direction, color, keys) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.color = color;
        this.trail = [];
        this.keys = keys;
        this.gridSize = 20;
    }

    updatePosition() {
        switch (this.direction) {
            case 'up':
                this.y = this.y - this.gridSize
                break;
            case 'down':
                this.y = this.y + this.gridSize;
                break;
            case 'left':
                this.x = this.x - this.gridSize;
                break;
            case 'right':
                this.x = this.x + this.gridSize;
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
        context.fillStyle = this.color;
        this.trail.forEach(pos => {
            context.fillRect(pos.x, pos.y, this.gridSize, this.gridSize);
        });
    }

    handleInput(key) {
        const newDirection = this.keys[key];
        if (newDirection) {
            this.direction = newDirection;
        }
    }
}
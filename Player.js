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
        this.speed = 1;
    }

    updatePosition() {
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
        /*
        this.trail.forEach(pos => {
            context.fillRect(pos.x, pos.y, this.gridSize, this.gridSize);
            if (this.speed !== 1) {
                context.fillStyle = 'green';
                context.fillRect(pos.x, pos.y, this.gridSize, this.gridSize);
                context.fillStyle = this.color;
            }
        });
        */

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
        if (newDirection) {
            this.direction = newDirection;
        }
    }
}
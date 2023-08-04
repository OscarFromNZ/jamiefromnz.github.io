class Player {
    constructor(x, y, direction, color, keys) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.color = color;
        this.trail = [];
        this.keys = keys;
        this.speed = 10;
        this.size = 10;
    }

    updatePosition() {
        switch (this.direction) {
            case 'up':
                this.y = this.y - this.speed;
                break;
            case 'down':
                this.y = this.y + this.speed;;
                break;
            case 'left':
                this.x = this.x - this.speed;
                break;
            case 'right':
                this.x = this.x + this.speed;
                break;
        }

        // Round to nearest multiple of 10, should already be a multiple of 10
        this.x = Math.ceil(this.x / 10) * 10;
        this.y = Math.ceil(this.y / 10) * 10;
    }

    updateTrail() {
        this.trail.push({ x: this.x, y: this.y });
    }

    draw(context) {
        context.fillStyle = this.color;
        this.trail.forEach(pos => {
            context.fillRect(pos.x, pos.y, this.size, this.size);
        });
    }

    handleInput(key) {
        const newDirection = this.keys[key];
        if (newDirection) {
            this.direction = newDirection;
        }
    }
}
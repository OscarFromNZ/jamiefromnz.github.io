class Player {
    constructor(x, y, direction, colour, keys, game) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.colour = colour;
        this.trail = [];
        this.keys = keys;
        this.gridSize = 20;

        this.game = game;

        this.bullets = 0;
        this.speedboosts = 0;
        this.bombs = 0;
        this.hasAnchor = false;
        this.speed = 1;

        this.trailOn = true;
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
        if (this.trailOn) {
            this.trail.push({ x: this.x, y: this.y });
        }
    }

    draw(context) {
        const shadowIntensity = Math.random() * 10 + 5;
        const shadowFlicker = Math.random() > 0.9 ? 'rgba(0, 0, 0, 0)' : this.speed === 2 ? 'greenyellow' : this.colour;

        context.shadowColor = shadowFlicker;
        context.shadowBlur = shadowIntensity;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;

        context.strokeStyle = this.colour;
        context.lineWidth = 1;

        for (let i = 0; i < this.trail.length; i++) {
            const pos = this.trail[i];

            context.beginPath();
            context.rect(pos.x, pos.y, this.gridSize, this.gridSize);
            context.stroke();
        }

        context.shadowColor = 'transparent';
        context.shadowBlur = 0;
    }

    // BAD CODE
    // MAKE THIS USE CONSTANTS
    handleInput(key) {
        // Detect if the player is shooting, maybe a better way of doing this
        if (key === 'c' && this.keys.c) {
            if (this.bullets > 0) {
                this.shoot();
            }
        } else if (key === 'Shift') {
            if (this.bullets > 0) {
                this.shoot();
            }
        } else if (key === ' ') {
            if (this.speedboosts > 0) {
                this.speedboost();
            }

        } else if (key === 'Enter' && this.keys.enter) {
            this.trailOn = !this.trailOn;

        } else if (key === 'CapsLock' && this.keys.caps) {
            this.trailOn = !this.trailOn;
        }
        else {
            const newDirection = this.keys[key];

            if (!newDirection) return;

            // Check if new direction is opposite of current direction
            if (!this.isOppositeDirection(this.direction, newDirection)) {
                this.direction = newDirection;
            }
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

    shoot() {
        console.log('shooting,', this.colour);
        let bullet = new Bullet(this.x, this.y, this.direction, 2, this.gridSize, this);
        this.game.addBullet(bullet);
        this.bullets -= 1;
    }

    speedboost() {
        this.speed = 2;

        game.alert(`${this.colour.toUpperCase()} got the speedboost!`);

        setTimeout(() => {
            this.speed = 1;
        }, 1000);

        this.speedboosts--;
    }
}
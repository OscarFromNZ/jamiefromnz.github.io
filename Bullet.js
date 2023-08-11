class Bullet {
    constructor(x, y, direction, speed, gridSize) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = speed;
        this.gridSize = gridSize;
    }

    updatePosition() {
        console.log("updating pos");
        switch (this.direction) {
            case 'up':
                this.y -= this.gridSize * this.speed;
                break;
            case 'down':
                this.y += this.gridSize * this.speed;
                break;
            case 'left':
                this.x -= this.gridSize * this.speed;
                break;
            case 'right':
                this.x += this.gridSize * this.speed;
                break;
        }
    }

    draw(context) {
        context.fillStyle = 'white';
        context.beginPath();
        context.arc(this.x + this.gridSize / 2, this.y + this.gridSize / 2, this.gridSize / 4, 0, 2 * Math.PI);
        context.fill();
    }
}
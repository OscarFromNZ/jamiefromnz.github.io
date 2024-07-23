class Bullet {
    constructor(x, y, direction, speed, gridSize, player) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = speed;
        this.gridSize = gridSize;
        this.player = player; // the player who shot it
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
        console.log(game.players)
        const centerX = this.x + this.gridSize / 2;
        const centerY = this.y + this.gridSize / 2;
        const outerRadius = this.gridSize / 2;
        const innerRadius = this.gridSize / 4;

        // Determine colors based on player's color
        let glowColor, outerColor, innerColor;

        if (this.player.colour === 'red') {
            glowColor = 'rgba(255, 0, 0, 0.5)'; // red glow
            outerColor = 'red'; // solid red
            innerColor = 'darkred'; // darker red
        } else if (this.player.colour === 'cyan') {
            glowColor = 'rgba(0, 255, 255, 0.5)'; // light blue glow
            outerColor = 'cyan'; // solid light blue color
            innerColor = 'darkcyan'; // darker blue
        }

        // Draw outer glow
        context.fillStyle = glowColor;
        context.beginPath();
        context.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
        context.fill();

        // Draw outer disc
        context.fillStyle = outerColor;
        context.beginPath();
        context.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
        context.fill();

        // Draw inner disc (darker)
        context.fillStyle = innerColor;
        context.beginPath();
        context.arc(centerX, centerY, innerRadius / 2, 0, 2 * Math.PI);
        context.fill();
    }
}
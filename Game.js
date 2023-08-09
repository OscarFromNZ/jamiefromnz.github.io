class Game {
    constructor(canvasId, mode) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');
        this.players = [];
        this.running = true;
    }

    addPlayer(player) {
        this.players.push(player);
    }

    update() {
        this.players.forEach(player => player.updatePosition());
        this.checkCollision();
        this.players.forEach(player => player.updateTrail());
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.players.forEach(player => player.draw(this.context));
    }

    run() {
        this.intervalId = setInterval(() => {
            if (this.running) {
                this.update();
                this.draw();
            }
        }, 100);
    }

    handleInput(key) {
        this.players.forEach(player => player.handleInput(key));
    }

    checkCollision() {
        this.players.forEach(player => {
            // Check if player is outside the canvas
            if (player.x < 0 || player.y < 0 || player.x > this.canvas.width - player.size || player.y > this.canvas.height - player.size) {
                this.gameOver(player);
            }

            // Check if player is on another player's trail
            this.players.forEach(otherPlayer => {
                otherPlayer.trail.forEach(pos => {
                    if (player.x === pos.x && player.y === pos.y) {
                        this.gameOver(player);
                    }
                });
            });
        });
    }

    restart() {

    }

    gameOver() {
        this.running = false;
        clearInterval(this.intervalId);
    }
}
class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');
        this.players = [];
        this.food = [];
        this.running = true;
    }

    addPlayer(player) {
        this.players.push(player);
    }

    addFood(food) {
        this.food.push(food);
    }

    update() {
        this.players.forEach(player => player.updatePosition());
        this.checkCollision();
        this.players.forEach(player => player.updateTrail());
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.players.forEach(player => player.draw(this.context));
        this.food.forEach(foodItem => foodItem.draw(this.context));
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
            if (player.x < 0 || player.y < 0 || player.x >= this.canvas.width || player.y >= this.canvas.height) {
                this.gameOver(player);
            }

            // Check if player is on another player's trail
            this.players.forEach(otherPlayer => {
                for (let i = 1; i < otherPlayer.trail.length; i++) {
                    const prevPos = otherPlayer.trail[i - 1];
                    const currPos = otherPlayer.trail[i];

                    // Check if the player's current position is on the line between prevPos and currPos
                    if (this.isPointOnLine(player.x, player.y, prevPos.x, prevPos.y, currPos.x, currPos.y)) {
                        if (player.hasBomb) {
                            otherPlayer.context.strokeStyle = 'tomato';
                            otherPlayer.trail.splice(i, 1);
                        } else {
                            this.gameOver(player);
                        }
                    }
                }
            });

            this.food.forEach((foodItem, index) => {
                if (player.x === foodItem.x && player.y === foodItem.y) {
                    foodItem.eat(player, this);
                    this.food.splice(index, 1);
                }
            });
        });
    }

    // some chat gpt stuff
    isPointOnLine(px, py, x1, y1, x2, y2) {
        let tolerance = 1;
        let dist1 = Math.sqrt((x1 - px) ** 2 + (y1 - py) ** 2);
        let dist2 = Math.sqrt((x2 - px) ** 2 + (y2 - py) ** 2);
        let lineDist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        return Math.abs(dist1 + dist2 - lineDist) < tolerance;
    }

    gameOver(player) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.running = false;
    }

    restart() {
        // Stop the current game loop
        clearInterval(this.intervalId);

        // Reset the game state
        this.players = [];
        this.food = [];

        this.running = true;

        this.start();

        // Start the game loop again
        this.run();
    }

    generateRandomFood() {
        let foods = ['SpeedBoost', 'Bomb', 'Anchor'];

        // Generate random x and y coordinates within the canvas
        const x = Math.floor(Math.random() * ((this.canvas.width - 20) / 20)) * 20;
        const y = Math.floor(Math.random() * ((this.canvas.height - 20) / 20)) * 20;
        const foodIndex = Math.floor(Math.random() * foods.length);
        let food;

        switch (foods[foodIndex]) {
            case 'SpeedBoost':
                food = new SpeedBoost(x, y, 20);
                break;
            case 'Bomb':
                food = new Bomb(x, y, 20);
                break;
            case 'Anchor':
                food = new Anchor(x, y, 20);
                break;
        }

        // Add the food to the game
        this.addFood(food);
    }
}
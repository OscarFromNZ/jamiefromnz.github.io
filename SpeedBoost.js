class SpeedBoost extends Food {
    constructor(x, y, size) {
        // Call the superclass constructor with the specific color for a speed boost
        super(x, y, size, 'green');
    }

    // Override the applyEffect method to apply a speed boost to the player
    eat(player) {
        console.log('Speed boost eaten');
        this.generateRandomFood();

        player.speed *= 2; // Double the player's speed
    }
}
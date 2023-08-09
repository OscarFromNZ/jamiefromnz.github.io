class SpeedBoost extends Food {
    constructor(x, y, size) {
        super(x, y, size, 'green');
    }

    eat(player, game) {
        console.log('Speed boost eaten');
        game.generateRandomFood();

        player.speed *= 2;
    }
}
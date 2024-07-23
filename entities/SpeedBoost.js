class SpeedBoost extends Food {
    constructor(x, y, size) {
        super(x, y, size, 'green');
    }

    eat(player, game) {
        game.generateRandomFood();
        player.speedboosts++;
    }
}
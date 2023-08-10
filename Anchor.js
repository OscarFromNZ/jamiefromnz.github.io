class Anchor extends Food {
    constructor(x, y, size) {
        super(x, y, size, 'blue');
    }

    eat(player, game) {
        game.generateRandomFood();

        player.speed = 0;

        setInterval(function() {
            player.speed = 1;
        }, 1000);
    }
}
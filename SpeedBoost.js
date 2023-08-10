class SpeedBoost extends Food {
    constructor(x, y, size) {
        super(x, y, size, 'green');
    }

    eat(player, game) {
        game.generateRandomFood();

        player.speed = 2;

        game.alert(`${player.colour.toUpperCase()} got the speedboost!`);

        setInterval(function() {
            player.speed = 1;
        }, 1000);
    }
}
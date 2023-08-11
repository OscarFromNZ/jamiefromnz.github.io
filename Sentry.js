class Sentry extends Food {
    constructor(x, y, size) {
        super(x, y, size, 'yellow');
    }

    eat(player, game) {
        game.generateRandomFood();

        player.isSentry = true;

        game.alert(`${player.colour.toUpperCase()} got the sentry!`);

        setInterval(function() {
            player.isSentry = false;
        }, 1000);
    }
}
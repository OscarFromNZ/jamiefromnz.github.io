class Sentry extends Food {
    constructor(x, y, size) {
        super(x, y, size, 'yellow');
    }

    eat(player, game) {
        game.generateRandomFood();

        player.bullets += 10;

        game.alert(`${player.colour.toUpperCase()} got 10 bullets!`);
    }
}
class Anchor extends Food {
    constructor(x, y, size) {
        super(x, y, size, 'blue');
    }

    eat(player, game) {
        game.generateRandomFood();

        player.speed = 0;

        game.alert(`${player.colour.toUpperCase()} got the anchor!`);

        setInterval(function() {
            player.speed = 1;
        }, 1000);
    }
}
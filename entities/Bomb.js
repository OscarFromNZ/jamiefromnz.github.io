class Bomb extends Food {
    constructor(x, y, size) {
        super(x, y, size, 'orange');
    }

    eat(player, game) {
        game.generateRandomFood();

        player.bombs += 1;

        game.alert(`${player.colour.toUpperCase()} got the bomb!`);
    }
}
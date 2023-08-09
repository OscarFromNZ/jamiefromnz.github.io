class Food {
    constructor(x, y, size, colour) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.colour = colour;
    }

    draw(context) {
        context.fillStyle = this.colour;
        context.fillRect(this.x, this.y, this.size, this.size);
    }
}
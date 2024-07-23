class Food {
    constructor(x, y, size, colour) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.colour = colour;
    }

    draw(context) {
        const shadowIntensity = Math.random() * 10 + 5;
        const shadowFlicker = Math.random() > 0.9 ? 'rgba(0, 0, 0, 0)' : this.speed === 2 ? 'greenyellow' : this.colour;

        context.shadowColor = shadowFlicker;
        context.shadowBlur = shadowIntensity;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;

        context.fillStyle = this.colour;
        context.fillRect(this.x, this.y, this.size, this.size);

        context.shadowColor = 'transparent';
        context.shadowBlur = 0;
    }
}
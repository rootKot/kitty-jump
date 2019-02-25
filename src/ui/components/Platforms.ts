import Rectangle = PIXI.Rectangle;

export class Platforms extends Phaser.Group {
    public platform: Phaser.Sprite;
    public stopped = false;
    private platformWidth = 180;
    private platformHeight = 100;
    private speed = 10;
    private stopX: number;
    private startX: number;
    private direction = 1;

    constructor(private groundY: number, game: Phaser.Game, parent: PIXI.DisplayObjectContainer) {
        super(game, parent);
        this.startX = 0 - this.platformWidth;
        this.stopX = this.game.world.centerX;
        this.createPlatform();
    }

    public getTopPlatformBounds(): Rectangle {
        let bounds = this.platform.getBounds();
        bounds.y -= this.game.world.y;
        return bounds;
    }

    public getTopPlatformDirection(): number {
        return this.direction;
    }

    public stop(): void {
        this.changeDirection();
        this.createPlatform();
        this.speed += 1;
    }

    private changeDirection(): void {
        this.direction *= -1;
        if (this.direction > 0) {
            this.startX = 0 - this.platformWidth;
        } else {
            this.startX = this.game.world.width;
        }
    }

    private createPlatform(): void {
        const platformRectangle = new Phaser.Graphics(this.game, 0, 0);
        platformRectangle.beginFill(0xf0f0f0);
        platformRectangle.drawRect(0, 0, this.platformWidth, this.platformHeight);
        platformRectangle.endFill();

        this.stopped = false;

        this.groundY -= this.platformHeight;
        this.platform = this.game.add.sprite(this.startX, this.groundY, platformRectangle.generateTexture(), null, this);
        this.platform.anchor.set(0.5, 0);
    }

    update(): void {
        if (this.direction > 0 && this.platform.x < this.stopX
            || this.direction < 0 && this.platform.x > this.stopX) {

            this.platform.x += this.speed * this.direction;
        } else {
            this.stopped = true;
        }
    }

}

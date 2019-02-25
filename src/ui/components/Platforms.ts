import Rectangle = PIXI.Rectangle;

export class Platforms extends Phaser.Group {
    public platform: Phaser.Sprite;
    public stopped = false;
    private platformWidth = 150;
    private platformHeight = 100;
    private speed = 0;//15;
    private stopX: number;
    private startX: number;
    private direction = 1;

    constructor(private groundY: number, game: Phaser.Game) {
        super(game);
        this.startX = 0 - this.platformWidth;
        this.stopX = this.game.world.centerX;
        this.createPlatform();
    }

    public getTopPlatformBounds(): Rectangle {
        return this.platform.getBounds();
    }

    public getTopPlatformDirection(): number {
        return this.direction;
    }

    public stop(): void {
        this.createPlatform();
    }

    private createPlatform(): void {
        const platformRectangle = new Phaser.Graphics(this.game, 0, 0);
        platformRectangle.beginFill(0xf0f0f0);
        platformRectangle.drawRect(0, 0, this.platformWidth, this.platformHeight);
        platformRectangle.endFill();

        this.groundY -= this.platformHeight;
        this.platform = this.game.add.sprite(this.startX, this.groundY, platformRectangle.generateTexture(), null, this);
        this.platform.anchor.set(0.5, 0);
        this.stopped = false;
    }

    update(): void {
        if (this.platform.x < this.stopX) {

            this.platform.x += this.speed * this.direction;
        } else {
            this.stopped = true;
        }
    }

}

export class Player extends Phaser.Group {
    public jumpPower = 0;
    public jumpSpeed = 10;
    public isJumping = true;
    public isAlive = true;
    public player: Phaser.Sprite;
    private playerHeight = 100;
    private playerWidth = 80;
    private jumpTween: Phaser.Tween;
    private alreadyAnimated = false;

    constructor(game: Phaser.Game, parent: PIXI.DisplayObjectContainer) {
        super(game, parent);
        this.initialize();
        this.fall();
    }

    public die(direction: number): void {
        console.log('die');
        this.isAlive = false;
        this.x += 200 * direction;
        this.isJumping = true;
        this.fall();
    }

    public jump(): void {
        if (this.isJumping || !this.isAlive) return;
        this.isJumping = true;
        this.alreadyAnimated = false;
        this.jumpTweenStart(0.8, 1.3, 80);
        this.jumpPower = -12;
    }

    private fall(): void {
        this.jumpTweenStart(1.2, 0.7, 120);
        this.alreadyAnimated = true;
        this.jumpPower = 0;
    }

    public onGround(): void {
        this.jumpTweenStart(1, 1, 80);
        this.isJumping = false;
    }

    private jumpTweenStart(x: number, y: number, duration: number): void {
        this.jumpTween.stop();
        this.jumpTween = this.game.add.tween(this.scale);
        this.jumpTween.to({x: x, y: y}, duration, Phaser.Easing.Linear.None, true);
    }

    private initialize(): void {
        const playerGraphics = new Phaser.Graphics(this.game, 0, 0);
        playerGraphics.beginFill(0xffffff);
        playerGraphics.drawRect(0, 0, this.playerWidth, this.playerHeight);
        playerGraphics.endFill();
        this.player = this.game.add.sprite(0, 0, playerGraphics.generateTexture(), null, this);
        this.jumpTween = this.game.add.tween(this.scale);
        this.player.anchor.set(0.5, 1);
    }

    update(): void {
        super.update();

        if (this.isJumping && !this.alreadyAnimated && this.jumpPower > 0) {
            this.fall();
        }
    }
}

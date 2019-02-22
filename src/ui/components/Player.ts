export class Player extends Phaser.Group {
    public jumpSpeed = 10;
    public isJumping = true;
    public isAlive = true;
    private player: Phaser.Sprite;
    private playerHeight = 100;
    private playerWidth = 80;
    private jumpTween: Phaser.Tween;

    constructor(game: Phaser.Game) {
        super(game, game.world);
        this.initialize();
        this.fall();
    }

    public die(direction: number): void {
        console.log('die');
        this.isAlive = false;
        this.x += 200 * direction;
        this.fall();
    }

    public jump(): void {
        if (this.isJumping) return;
        this.isJumping = true;
        this.jumpTweenStart(0.8, 1.5, 80);
        this.jumpSpeed = -10;
        setTimeout(() => this.fall(), 350);
    }

    private fall(): void {
        this.jumpTweenStart(1.2, 0.7, 120);
        this.jumpSpeed = 10;
    }

    public onGround(): void {
        this.jumpTweenStart(1, 1, 80);
        this.jumpSpeed = 0;
        this.isJumping = false;
    }

    private jumpTweenStart(x: number, y: number, duration: number): void {
        this.jumpTween.stop();
        this.jumpTween = this.game.add.tween(this.player.scale);
        this.jumpTween.to({x: x, y: y}, duration, Phaser.Easing.Linear.None, true);
    }

    private initialize(): void {
        this.x = this.game.world.centerX;
        this.y = this.game.world.centerY;
        const playerGraphics = new Phaser.Graphics(this.game, 0, 0);
        playerGraphics.beginFill(0xffffff);
        playerGraphics.drawRect(0, 0, this.playerWidth, this.playerHeight);
        playerGraphics.endFill();
        this.player = this.game.add.sprite(0, 0, playerGraphics.generateTexture(), null, this);
        // this.player.pivot.set(this.playerWidth / 2, 0);
        this.jumpTween = this.game.add.tween(this.player.scale);
        this.player.anchor.set(0.5, 1);
    }
}

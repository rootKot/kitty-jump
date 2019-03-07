import {Spritesheets, Audio, Audiosprites} from '../../assets';
import {AudioManager} from '../../managers/AudioManager';

export class Player extends Phaser.Group {
    public jumpPower = 0;
    public isJumping = true;
    public isAlive = true;
    public player: Phaser.Sprite;
    private jumpTween: Phaser.Tween;
    private alreadyAnimated = false;

    constructor(game: Phaser.Game, parent: PIXI.DisplayObjectContainer) {
        super(game, parent);
        this.initialize();
    }

    public die(direction: number): void {
        this.isAlive = false;
        this.x += 250 * direction;
        this.isJumping = true;
        this.jumpTweenStart(1, 1, 80);
        this.jumpPower = 0;
        AudioManager.i.play(Audiosprites.AudiospritesSounds.Sprites.Jump);
        this.player.play('die');
    }

    public jump(): void {
        if (this.isJumping || !this.isAlive) return;
        this.isJumping = true;
        this.alreadyAnimated = false;
        this.jumpTweenStart(0.8, 1.3, 80);
        this.jumpPower = -20;
        this.player.play('jump');
    }

    private fall(): void {
        this.jumpTweenStart(1.1, 0.8, 150);
        this.alreadyAnimated = true;
        this.jumpPower = 0;
        this.player.play('fall');
    }

    public onGround(): void {
        this.jumpTweenStart(1, 1, 80);
        this.isJumping = false;
        this.player.play('idle');
    }

    private jumpTweenStart(x: number, y: number, duration: number): void {
        this.jumpTween.stop();
        this.jumpTween = this.game.add.tween(this.scale);
        this.jumpTween.to({x: x, y: y}, duration, Phaser.Easing.Linear.None, true);
    }

    private initialize(): void {
        this.player = this.game.add.sprite(0, 0, Spritesheets.SpritesPlayer140210.getName(), 0, this);
        this.player.animations.add('idle', [0]);
        this.player.animations.add('jump', [1]);
        this.player.animations.add('fall', [2]);
        this.player.animations.add('die', [3]);
        this.player.play('idle');

        this.jumpTween = this.game.add.tween(this.scale);
        this.player.anchor.set(0.5, 1);
    }

    update(): void {
        super.update();

        if (this.isAlive && this.isJumping && !this.alreadyAnimated && this.jumpPower > 0) {
            this.fall();
        }
    }
}

import {Ground} from './components/Ground';
import {Player} from './components/Player';
import {KeyBinds} from '../controllers/KeyBinds';
import {KeyPress} from '../enums/Events';
import {Platforms} from './components/Platforms';

export class GameScreen extends Phaser.Group {
    public onEvent: Phaser.Signal;
    private player: Player;
    private ground: Ground;
    private keyBinds: KeyBinds;
    private platforms: Platforms;
    private newGroundY: number;

    constructor(game: Phaser.Game, parent: PIXI.DisplayObjectContainer) {
        super(game, parent);
        this.initialize();
    }

    private initialize(): void {
        this.initGround();
        this.initPlayer();
        this.initKeyBinds();
        this.initPlatforms();
    }

    private initKeyBinds(): void {
        this.keyBinds = new KeyBinds(this.game);
        this.keyBinds.onEvent.add(this.keyPressHandler, this);
    }

    private initGround(): void {
        this.ground = new Ground(this.game, this);
        this.newGroundY = this.ground.groundY;
    }

    private initPlayer(): void {
        this.player = new Player(this.game, this);
        this.player.x = this.game.world.centerX;
        this.player.y = this.newGroundY;
    }

    private initPlatforms(): void {
        this.platforms = new Platforms(this.ground.groundY, this.game, this);
    }

    private keyPressHandler(event: KeyPress): void {
        switch (event) {
            case KeyPress.Jump: {
                this.player.jump();
                break;
            }
        }
    }

    private updateWorldY(y: number) {
        this.platforms.y -= y;
        this.player.y -= y;
        this.ground.y -= y;
        this.newGroundY -= y;
        // this.y -= y;

    }

    update(): void {
        super.update();

        console.log(this.y);

        if (this.player.isJumping) {
            this.player.jumpPower += 0.3;
            this.player.y += this.player.jumpPower;
            if (this.player.y < this.game.world.centerY) this.updateWorldY(this.player.jumpPower);
        }

        const platformBounds = this.platforms.getTopPlatformBounds();
        if (platformBounds.contains(this.player.x, this.player.y)) {
            if (platformBounds.y + 20 < this.player.y) {
                this.player.die(this.platforms.getTopPlatformDirection());
            } else {
                this.player.onGround();
                this.newGroundY = platformBounds.y;
                this.platforms.stop();
            }
        } else if (platformBounds.y < this.player.y && this.platforms.stopped && this.player.isAlive) {
            this.player.die(this.platforms.getTopPlatformDirection());
        } else if (this.player.isJumping && this.player.y >= this.newGroundY && this.player.isAlive) {
            this.player.onGround();
        }
    }
}

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
        this.ground = new Ground(this.game);
    }

    private initPlayer(): void {
        this.player = new Player(this.game);
    }

    private initPlatforms(): void {
        this.platforms = new Platforms(this.ground.groundY, this.game);
    }

    private keyPressHandler(event: KeyPress): void {
        switch (event) {
            case KeyPress.Jump: {
                this.player.jump();
                break;
            }
        }
    }

    update(): void {
        super.update();

        this.player.y += this.player.jumpSpeed;

        const platformBounds = this.platforms.getTopPlatformBounds();
        if (platformBounds.contains(this.player.x, this.player.y)) {
            console.log(platformBounds.top, this.player.y);
            if (platformBounds.y < this.player.y) {
                this.player.die(this.platforms.getTopPlatformDirection());
            } else {
                this.player.onGround();
                this.platforms.stop();
            }
        }

        if (this.player.isJumping && this.player.y >= this.ground.groundY) {
            this.player.onGround();
        }
    }
}

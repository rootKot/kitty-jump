import {Ground} from './components/Ground';
import {Player} from './components/Player';
import {KeyBinds} from '../controllers/KeyBinds';
import {KeyPress} from '../enums/Events';

export class GameScreen extends Phaser.Group {
    public onEvent: Phaser.Signal;
    private player: Player;
    private ground: Ground;
    private keyBinds: KeyBinds;

    constructor(game: Phaser.Game, parent: PIXI.DisplayObjectContainer) {
        super(game, parent);
        this.initialize();
    }

    private initialize(): void {
        this.initGround();
        this.initPlayer();
        this.initKeyBinds();
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

        if (this.player.isJumping && this.player.y >= this.ground.groundY) {
            this.player.onGround();
        }
    }
}

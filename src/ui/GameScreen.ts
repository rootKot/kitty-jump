import {Ground} from './components/Ground';
import {Player} from './components/Player';
import {KeyBinds} from '../controllers/KeyBinds';
import {KeyPress} from '../enums/Events';
import {Platforms} from './components/Platforms';
import {PlatformInfo} from '../models/interfaces/PlatformInfo';

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
        this.ground = new Ground(this.game, this);
    }

    private initPlayer(): void {
        this.player = new Player(this.game, this);
        this.player.x = this.game.world.centerX;
        this.player.y = this.ground.groundY;
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
        // this.y -= y;

    }

    private gameOver(platformDirection: number): void {
        this.player.die(platformDirection);
        this.platforms.stopAll();
    }

    private checkPlatformCollision(platformObj: PlatformInfo, index: number): void {
        const platformBounds = this.platforms.getPlatformBounds(index);
        if (platformBounds.contains(this.player.x, this.player.y)) {
            if (platformBounds.y + 20 < this.player.y) {
                // player die by touching the platform side
                this.gameOver(platformObj.direction);
            } else if (this.player.isJumping) {
                // player is on platform
                this.player.onGround();
                this.player.y = platformBounds.y;
                this.platforms.stop(index);
            }
        } else if (platformBounds.y < this.player.y && platformObj.stopped && this.player.isAlive) {
            // player die by touching the platform side
            this.gameOver(platformObj.direction);
        }
    }

    update(): void {
        super.update();

        if (!this.player.isAlive && this.player.y > this.game.camera.height + this.player.height) {
            return;
        }

        if (this.player.isJumping) {
            this.player.jumpPower += 0.3;
            this.player.y += this.player.jumpPower;
            if (this.player.y < this.game.world.centerY) this.updateWorldY(this.player.jumpPower);
        }

        this.platforms.getPlatformsArr().forEach((platformObj, index) => {
            this.checkPlatformCollision(platformObj, index);
        });

        if (this.player.isJumping && this.player.y >= this.ground.groundY && this.player.isAlive) {
            this.player.onGround();
        }
    }
}

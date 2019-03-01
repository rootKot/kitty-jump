import {Ground} from './components/Ground';
import {Player} from './components/Player';
import {KeyBinds} from '../controllers/KeyBinds';
import {GameState, KeyPress} from '../enums/Events';
import {Platforms} from './components/Platforms';
import {PlatformInfo} from '../models/interfaces/PlatformInfo';
import {Audiosprites, Images} from '../assets';
import {Background} from './components/Background';
import {GameOverPopup} from './components/GameOverPopup';
import {AudioManager} from '../managers/AudioManager';
import {Score} from './components/Score';

export class GameScreen extends Phaser.Group {
    public onEvent: Phaser.Signal;
    private player: Player;
    private ground: Ground;
    private platforms: Platforms;
    private background: Background;
    private score: Score;
    private gameOverPopup: GameOverPopup;
    private popupTween: Phaser.Tween;

    constructor(game: Phaser.Game, parent: PIXI.DisplayObjectContainer) {
        super(game, parent);
        this.initialize();
    }

    private initialize(): void {
        this.playBackgroundMusic();
        this.initBackground();
        this.initPlayer();
        this.initPlatforms();
        this.initScore();
        this.initEventsHandler();
    }

    private playBackgroundMusic(): void {
        AudioManager.i.play(Audiosprites.AudiospritesSounds.Sprites.NightMusic, 2);
    }

    private initEventsHandler(): void {
        const keyBinds = new KeyBinds(this.game);
        keyBinds.onEvent.add(this.keyPressHandler, this);
    }

    private initBackground(): void {
        this.background = new Background(this.game, this);
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

    private initScore(): void {
        this.score = new Score(this.game, this);
    }

    private keyPressHandler(event: KeyPress): void {
        switch (event) {
            case KeyPress.Jump: {
                this.player.jump();
                break;
            }
        }
    }

    private gameStateEventsHandler(event: GameState): void {
        switch (event) {
            case GameState.Replay: {
                this.replay();
                break;
            }
        }
    }

    private updateWorldY(y: number) {
        this.platforms.y -= y;
        this.player.y -= y;
        this.ground.y -= y;
        this.background.clouds.y -= y / 2;

    }

    private gameOver(platformDirection: number): void {
        this.player.die(platformDirection);
        this.platforms.stopAll();
        AudioManager.i.stop(Audiosprites.AudiospritesSounds.Sprites.NightMusic);

        this.gameOverPopup = new GameOverPopup(this.game, this);
        this.gameOverPopup.onEvent.add(this.gameStateEventsHandler, this);

        const x = this.game.world.centerX - this.gameOverPopup.width / 2;
        this.gameOverPopup.position.set(x, 0 - this.gameOverPopup.height);

        const marginTop = this.game.world.centerY - this.gameOverPopup.height / 1.5;
        const popupTween = this.game.add.tween(this.gameOverPopup);
        popupTween.to({y: marginTop}, 500, Phaser.Easing.Elastic.Out, true, 1000);
    }

    private replay(): void {
        const popupTween = this.game.add.tween(this.gameOverPopup);
        popupTween.to({y: 0 - this.gameOverPopup.height}, 500, Phaser.Easing.Elastic.In, true, 0);

        setTimeout(() => {
            this.platforms.destroy();
            this.background.destroy();
            this.player.destroy();
            this.gameOverPopup.destroy();
            this.gameOverPopup.onEvent.dispose();
            // this.onEvent.dispose();
            this.game.state.start('game');
        }, 1000);
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
                this.score.addScore();
                this.player.y = platformBounds.y;
                this.platforms.stop(index);
            }
        } else if (platformBounds.y < this.player.y && platformObj.stopped && this.player.isAlive) {
            // player die by touching the platform side and player in same Y
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

        if (this.player.isAlive) {
            if (this.player.isJumping && this.player.y >= this.ground.groundY && this.player.isAlive) {
                this.player.onGround();
            }
            this.platforms.getPlatformsArr().forEach((platformObj, index) => {
                this.checkPlatformCollision(platformObj, index);
            });
        }
    }
}

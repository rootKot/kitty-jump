import {Ground} from './components/Ground';
import {Player} from './components/Player';
import {KeyBinds} from '../controllers/KeyBinds';
import {GameState, KeyPress} from '../enums/Events';
import {Platforms} from './components/Platforms';
import {PlatformInfo} from '../models/interfaces/PlatformInfo';
import {Audiosprites, CustomWebFonts} from '../assets';
import {Background} from './components/Background';
import {GameOverPopup} from './components/GameOverPopup';
import {AudioManager} from '../managers/AudioManager';
import {Score} from './components/Score';

export class GameScreen extends Phaser.Group {
    private player: Player;
    private ground: Ground;
    private platforms: Platforms;
    private background: Background;
    private score: Score;
    private gameOverPopup: GameOverPopup;
    private keyBinds: KeyBinds;
    private tapToStartText: Phaser.Text;
    private gameStarted = false;

    constructor(game: Phaser.Game, parent: PIXI.DisplayObjectContainer) {
        super(game, parent);
        this.initialize();
    }

    private initialize(): void {
        this.playBackgroundMusic();
        this.initBackground();
        this.initPlayer();
        this.initScore();
        this.initEventsHandler();
        this.initTapToStart();
    }

    private initTapToStart(): void {
        const fontStyle = {
            fontSize: 40,
            fill: '#ffffff',
            font: CustomWebFonts.FontsFreeh521Freeh521.getName()
        };
        this.tapToStartText = this.game.add.text(0, 300, 'tap to start', fontStyle, this);
        this.tapToStartText.x = this.game.world.centerX - this.tapToStartText.width / 2;
    }

    private playBackgroundMusic(): void {
        AudioManager.i.play(Audiosprites.AudiospritesSounds.Sprites.NightMusic, 2);
    }

    private initEventsHandler(): void {
        this.keyBinds = new KeyBinds(this.game);
        this.keyBinds.onEvent.add(this.keyPressHandler, this);
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
        if (event === KeyPress.Jump) {
            if (this.gameStarted === false) {
                this.startGame();
            } else {
                this.player.jump();
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
        this.background.changeY(y / 2);

    }

    private startGame(): void {
        this.gameStarted = true;
        this.initPlatforms();

        this.game.add.tween(this.tapToStartText).to(
            {y: 0 - this.tapToStartText.height}, 500, Phaser.Easing.Elastic.In, true);
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

        this.game.time.events.add(Phaser.Timer.SECOND, () => {
            this.keyBinds.destroy();
            this.game.state.start('game');
        }, this);
    }

    private checkPlatformCollision(platformObj: PlatformInfo, index: number): void {
        // const platformBounds = this.platforms.getPlatformBounds(index);

        if (((this.player.x + this.player.player.width / 2) > (platformObj.platform.worldPosition.x - platformObj.platform.width / 2)) &&
            ((this.player.x - this.player.player.width / 2) < (platformObj.platform.worldPosition.x + platformObj.platform.width / 2))) {

            if ((this.player.y) > (platformObj.platform.worldPosition.y) &&
                ((this.player.y - this.player.player.height) < (platformObj.platform.worldPosition.y + platformObj.platform.height))) {

                if (this.player.y < platformObj.platform.worldPosition.y + 20) {
                    if (this.player.isJumping) {
                        this.player.onGround();
                        this.score.addScore();
                        this.player.y = platformObj.platform.worldPosition.y;
                        this.platforms.stop(index);
                    }
                } else {
                    this.gameOver(platformObj.direction);
                }
            }
        }
    }

    update(): void {
        super.update();
        if (!this.gameStarted) return;
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

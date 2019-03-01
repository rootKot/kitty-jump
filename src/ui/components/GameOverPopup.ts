import {Images, Spritesheets} from '../../assets';
import {GameState} from '../../enums/Events';

export class GameOverPopup extends Phaser.Group {
    public onEvent: Phaser.Signal;
    private popup: Phaser.Sprite;
    private gameOverImage: Phaser.Sprite;
    private replayBtn: Phaser.Button;

    constructor(game: Phaser.Game, parent: PIXI.DisplayObjectContainer) {
        super(game, parent);
        this.onEvent = new Phaser.Signal();
        this.initPopup();
    }

    public initPopup(): void {
        this.popup = this.game.add.sprite(0, 0, Images.ImagesPopup.getName(), null, this);
        this.popup.alpha = 0.7;

        this.initGameOverImage();
        this.initReplayBtn();
    }

    private initGameOverImage(): void {
        this.gameOverImage = this.game.add.sprite(0, 0, Images.ImagesGameOver.getName(), null, this);
        const x = this.popup.width / 2 - this.gameOverImage.width / 2;
        this.gameOverImage.position.set(x, 50);
    }

    private initReplayBtn(): void {
        this.replayBtn = this.game.add.button(
            0, 0, Spritesheets.SpritesReplay135136.getName(),
            this.replayBtnListener, this, 1, 0, 1, 1, this);

        const x = this.popup.width / 2 - this.replayBtn.width / 2;
        const y = this.gameOverImage.y + this.gameOverImage.height + 50;
        this.replayBtn.position.set(x, y);

    }

    private replayBtnListener(): void {
        this.onEvent.dispatch(GameState.Replay);
    }
}

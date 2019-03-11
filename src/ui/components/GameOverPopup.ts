import {Images, Spritesheets} from '../../assets';
import {GameState} from '../../enums/Events';
import {ScoreManager} from '../../managers/ScoreManager';

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
        this.initScoreText();
        this.initReplayBtn();
    }

    private initGameOverImage(): void {
        this.gameOverImage = this.game.add.sprite(0, 0, Images.ImagesGameOver.getName(), null, this);
        const x = this.popup.width / 2 - this.gameOverImage.width / 2;
        this.gameOverImage.position.set(x, 50);
    }


    private initScoreText(): void {
        const scoreInfo = ScoreManager.i.getBestScore();
        const score = scoreInfo.score;
        const bestScore = scoreInfo.bestScore;
        let _bestScoreText = 'Best score: ' + bestScore.toString();
        let _scoreText = 'Score: ' + score.toString();

        const x1 = this.popup.width / 2;
        const y1 = this.gameOverImage.y + this.gameOverImage.height + 15;
        const fontStyle1 = {
            fontSize: 37,
            fontWeight: 100,
            fill: '#ffffff'
        };
        const fontStyle2 = {
            fontSize: 30,
            fontWeight: 100,
            fill: '#ffffff'
        };

        if (scoreInfo.isRecord) {
            _bestScoreText = 'New score: ' + score.toString();
            _scoreText = 'Old score: ' + bestScore.toString();
        }

        const BestScoreText = this.game.add.text(x1, y1, _bestScoreText, fontStyle1, this);
        BestScoreText.anchor.set(0.5, 0);

        const y2 = y1 + BestScoreText.height + 5;
        const scoreText = this.game.add.text(x1, y2, _scoreText, fontStyle2, this);
        scoreText.anchor.set(0.5, 0);
    }

    private initReplayBtn(): void {
        this.replayBtn = this.game.add.button(
            0, 0, Spritesheets.SpritesReplay135136.getName(),
            this.replayBtnListener, this, 1, 0, 1, 1, this);

        const x = this.popup.width / 2 - this.replayBtn.width / 2;
        const y = this.gameOverImage.y + this.gameOverImage.height + 110;
        this.replayBtn.position.set(x, y);

    }

    private replayBtnListener(): void {
        this.onEvent.dispatch(GameState.Replay);
    }

    destroy(destroyChildren?: boolean, soft?: boolean): void {
        super.destroy(destroyChildren, soft);
        this.onEvent.dispose();
    }
}

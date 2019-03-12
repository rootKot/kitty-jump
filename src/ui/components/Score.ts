import {CustomWebFonts} from '../../assets';
import {ScoreManager} from '../../managers/ScoreManager';
import {PlatformProps, PlatformInfo} from '../../models/interfaces/PlatformInfo';

export class Score {
    public bestScoreGraphics: Phaser.Graphics;
    private score = 0;
    private scoreText: Phaser.Text;
    private pulseTween: Phaser.Tween;

    constructor(private game: Phaser.Game, parent: PIXI.DisplayObjectContainer) {
        const marginTop = 80;
        const fontStyle = {
            fontSize: 60,
            fill: '#ffffff',
            font: CustomWebFonts.FontsFreeh521Freeh521.getName()
        };
        this.scoreText = this.game.add.text(this.game.world.centerX, marginTop, this.score.toString(), fontStyle);
        this.scoreText.anchor.set(0.5, 0.5);
        this.pulseTween = this.game.add.tween(this.scoreText.scale);
        this.pulseTween.to({x: 1.3, y: 1.3}, 50, Phaser.Easing.Linear.None, false, 0, 0, true);
    }

    public addScore(score: number = 1): void {
        this.score += score;
        ScoreManager.i.setScore(this.score);
        this.scoreText.setText(this.score.toString());

        this.pulseTween.stop();
        this.scoreText.scale.set(1, 1);
        this.pulseTween.start();
    }

    public initBestScoreLine(platformProps: PlatformProps): void {
        const scoreInfo = ScoreManager.i.getBestScore();

        const y = platformProps.groundY - scoreInfo.bestScore * (platformProps.platformHeight + platformProps.marginBottom);
        this.bestScoreGraphics = this.game.add.graphics(0, y);
        this.bestScoreGraphics.lineStyle(2, 0xbca2cd, 0.8);
        this.bestScoreGraphics.lineTo(this.game.world.width, 0);

        const fontStyle = {
            fill: '#ffffff',
            fontSize: 24,
            fontWeight: 100
        };
        const bestScoreText = this.game.add.text(
            this.game.world.centerX - platformProps.platformWidth * 2, 0, 'Best Score', fontStyle);
        bestScoreText.anchor.set(1, 1);
        bestScoreText.alpha = 0.8;
        this.bestScoreGraphics.addChild(bestScoreText);
        this.game.add.tween(this.bestScoreGraphics).to({alpha: 0}, 800, Phaser.Easing.Linear.None,
            true, 0, -1, true);

        if (scoreInfo.bestScore === 0) this.bestScoreGraphics.visible = false;

    }
}


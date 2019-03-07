import {CustomWebFonts} from '../../assets';

export class Score {
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
        this.scoreText.setText(this.score.toString());

        this.pulseTween.stop();
        this.scoreText.scale.set(1, 1);
        this.pulseTween.start();
    }
}


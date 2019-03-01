import {CustomWebFonts} from '../../assets';

export class Score {
    private score = 0;
    private scoreText: Phaser.Text;
    private pulseTween: Phaser.Tween;

    constructor(private game: Phaser.Game, parent: PIXI.DisplayObjectContainer) {
        const marginTop = 40;
        const fontStyle = {
            fontSize: 60,
            fill: '#BCA2CD',
            font: CustomWebFonts.FontsFreeh521Freeh521.getName()
        };
        this.scoreText = this.game.add.text(0, marginTop, this.score.toString(), fontStyle);
        this.scoreText.x = this.game.world.centerX;
        this.pulseTween = this.game.add.tween(this.scoreText.scale);
        this.pulseTween.to({x: 1.1, y: 1.1}, 50, Phaser.Easing.Linear.None, false, 0, 0, true);
    }

    public addScore(score: number = 1): void {
        this.score += score;
        this.scoreText.setText(this.score.toString());

        this.pulseTween.stop();
        this.scoreText.scale.set(1, 1);
        this.pulseTween.start();
    }
}


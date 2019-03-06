export class LoadingScreen extends Phaser.Group {
    private _progress: number;
    private progressText: Phaser.Text;

    constructor(game: Phaser.Game) {
        super(game);
        this.initialize();
    }

    set progress(value: number) {
        this._progress = value;
    }

    private initialize(): void {
        this.progressText = this.game.add.text(100, 100, 'Loading 0%', {fill: '#ffffff', fontSize: 40});
    }

    update(): void {
        const progress = this._progress || this.game.load.progress;
        this.progressText.text = `Loading ${progress}%`;
    }
}

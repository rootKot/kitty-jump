import {CustomWebFonts, Images} from '../assets';

export class LoadingScreen extends Phaser.Group {
    private _progress: number;
    private progressText: Phaser.Text;
    private arch: Phaser.Graphics;
    private archStartRadian: number;
    private archStrokeWidth: number;
    private archLineWidth: number;
    private archRadius: number;
    private _centerX: number;
    private _centerY: number;

    constructor(game: Phaser.Game) {
        super(game);
        this.initialize();
    }

    set progress(value: number) {
        this._progress = value;
        this.redrawArch(value);
    }

    private initialize(): void {
        this._centerX = this.game.world.centerX;
        this._centerY = this.game.world.centerY;

        this.initBackground();
        this.initGameName();
        this.initProgressText();
        this.initArch();
    }

    private initBackground(): void {
        this.game.add.tileSprite(0, 0, this.game.width, this.game.height, Images.ImagesLoadingBackground.getName(), null, this);
    }

    private initGameName(): void {
        const fontStyle = {
            fill: '#ffffff',
            fontSize: 80,
            font: CustomWebFonts.FontsFreeh521Freeh521.getName()
        };
        const gameNameText = this.game.add.text(this._centerX, this._centerY - 300, 'Up To The Moon', fontStyle);
        gameNameText.stroke = '#362836';
        gameNameText.strokeThickness = 20;
        gameNameText.anchor.set(0.5, 0);
    }

    private initProgressText(): void {
        const fontStyle = {
            fill: '#ffffff',
            fontSize: 38,
            font: CustomWebFonts.FontsFreeh521Freeh521.getName()
        };
        this.progressText = this.game.add.text(this._centerX, this._centerY, '0%', fontStyle);
        this.progressText.anchor.set(0.5, 0.5);
    }

    private initArch(): void {
        this.arch = this.game.add.graphics(0, 0, this);
        this.archStartRadian = Phaser.Math.degToRad(-90);
        this.archLineWidth = 24;
        this.archStrokeWidth = 40;
        this.archRadius = 120;
    }

    private redrawArch(progress: number): void {
        const archEndRadian = Phaser.Math.degToRad(3.6 * progress - 90);
        this.arch.clear();
        this.arch.lineStyle(this.archStrokeWidth, 0x362836);
        this.arch.arc(this._centerX, this._centerY, this.archRadius, this.archStartRadian, archEndRadian, false);
        this.arch.lineStyle(this.archLineWidth, 0xB9A2CD);
        this.arch.arc(this._centerX, this._centerY, this.archRadius, this.archStartRadian, archEndRadian, false);
    }

    update(): void {
        const progress = this._progress || this.game.load.progress;
        this.progressText.text = `${progress}%`;
        this.redrawArch(progress);
    }
}

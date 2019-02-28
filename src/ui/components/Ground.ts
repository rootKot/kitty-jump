import {Images} from '../../assets';

export class Ground extends Phaser.Group {
    private readonly _groundY: number;
    private readonly groundWidth: number;
    private readonly groundHeight = 2;
    private ground: Phaser.Sprite;

    constructor(game: Phaser.Game, parent: PIXI.DisplayObjectContainer) {
        super(game, parent);
        this._groundY = game.world.height - 100;
        this.groundWidth = this.game.world.width;
        this.initGround();
    }

    get groundY(): number {
        return this._groundY;
    }

    private initGround() {
        this.ground = this.game.add.sprite(0, this.game.world.height, Images.ImagesGround.getName(), null, this);
        this.ground.anchor.set(0, 1);
    }
}

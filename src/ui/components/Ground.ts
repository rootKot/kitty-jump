export class Ground extends Phaser.Group {
    private readonly _groundY: number;
    private readonly groundWidth: number;
    private readonly groundHeight = 2;
    private ground: Phaser.Graphics;

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
        this.ground = this.game.add.graphics(0, this._groundY, this);
        this.ground.beginFill(0xf7f7f7);
        this.ground.drawRect(0, 0, this.groundWidth, this.groundHeight);
        this.ground.endFill();
    }
}

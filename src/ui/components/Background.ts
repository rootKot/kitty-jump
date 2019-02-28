import {Images} from '../../assets';

export class Background extends Phaser.Group {
    public clouds: Phaser.Sprite;

    constructor(game: Phaser.Game, parent: PIXI.DisplayObjectContainer) {
        super(game, parent);
        this.game.add.sprite(0, 0, Images.ImagesSky1.getName(), null, this);

        this.clouds = this.game.add.sprite(0, 0, Images.ImagesClouds.getName(), null, this);
        this.clouds.x = this.game.world.centerX - this.clouds.width / 2;
        this.clouds.y = this.game.world.centerY - this.clouds.height;
    }
}

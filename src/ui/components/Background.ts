import {Images} from '../../assets';

export class Background extends Phaser.Group {
    private currentClouds: Phaser.Sprite;
    private upcomingClouds: Phaser.Sprite;

    constructor(game: Phaser.Game, parent: PIXI.DisplayObjectContainer) {
        super(game, parent);
        this.game.add.sprite(0, 0, Images.ImagesSky1R1280x720.getName(), null, this);
        this.currentClouds = this.createClouds();
        this.upcomingClouds = this.createClouds(true);
    }

    public changeY(y: number): void {
        this.currentClouds.y -= y;
        this.upcomingClouds.y -= y;

        if (this.currentClouds.y > 0) { // clouds ending
            this.upcomingClouds.y = this.currentClouds.y;
            this.currentClouds.y = this.upcomingClouds.y - this.currentClouds.height - 100;
        } else if (this.upcomingClouds.y > this.game.height) { // clouds under screen
            this.upcomingClouds.y = this.currentClouds.y - this.upcomingClouds.height;
        }
    }

    private createClouds(upcoming: boolean = false): Phaser.Sprite {
        const clouds = this.game.add.sprite(0, 0, Images.ImagesClouds.getName(), null, this);
        clouds.x = this.game.world.centerX - clouds.width / 2;
        clouds.alpha = 0.5;
        if (upcoming) {
            clouds.y = this.currentClouds.y - clouds.height;
        } else {
            clouds.y = this.game.world.centerY - clouds.height;
        }
        return clouds;
    }
}

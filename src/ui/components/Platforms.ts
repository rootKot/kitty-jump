import Rectangle = PIXI.Rectangle;
import {PlatformInfo} from '../../models/interfaces/PlatformInfo';


export class Platforms extends Phaser.Group {
    private platformWidth = 180;
    private platformHeight = 100;
    private speed = 10;
    private stopX: number;
    private startX: number;
    private direction = 1;
    private platformsArr: PlatformInfo[];
    private isWorking = true;

    constructor(private groundY: number, game: Phaser.Game, parent: PIXI.DisplayObjectContainer) {
        super(game, parent);
        this.startX = 0 - this.platformWidth;
        this.stopX = this.game.world.centerX;
        this.platformsArr = [];
        this.createPlatform();
    }

    public getPlatformBounds(index: number): Rectangle {
        let bounds = this.platformsArr[index].platform.getBounds();
        bounds.y -= this.game.world.y;
        return bounds;
    }

    public getPlatformsArr(): PlatformInfo[] {
        return this.platformsArr;
    }

    public stop(index: number): void {
        this.platformsArr[index].stopped = true;
    }

    public stopAll(): void {
        this.isWorking = false;
    }

    private changeDirection(): void {
        this.direction *= -1;
        if (this.direction > 0) {
            this.startX = 0 - this.platformWidth;
        } else {
            this.startX = this.game.world.width;
        }
    }

    private createPlatform(): void {
        if (!this.isWorking) return;

        this.changeDirection();
        const platformRectangle = new Phaser.Graphics(this.game, 0, 0);
        platformRectangle.beginFill(0xf0f0f0);
        platformRectangle.drawRect(0, 0, this.platformWidth, this.platformHeight);
        platformRectangle.endFill();

        this.groundY -= this.platformHeight;
        const platform = this.game.add.sprite(this.startX, this.groundY, platformRectangle.generateTexture(), null, this);
        platform.anchor.set(0.5, 0);
        this.platformsArr.push({
            speed: this.speed,
            direction: this.direction,
            platform: platform,
            stopped: false
        });

        this.game.time.events.add(Phaser.Timer.SECOND * 1.2, this.createPlatform, this);
    }

    update(): void {
        if (!this.isWorking) return;

        this.platformsArr.forEach((platformObj, index) => {
            if (platformObj.stopped) {
                if (!platformObj.platform.inCamera) { // destroy outCamera platforms
                    this.platformsArr[index].platform.destroy();
                    this.platformsArr.splice(index, 1);
                }
                return;
            }

            if (platformObj.direction > 0 && platformObj.platform.x < this.stopX
                || platformObj.direction < 0 && platformObj.platform.x > this.stopX) {

                platformObj.platform.x += platformObj.speed * platformObj.direction;
            } else {
                platformObj.stopped = true;
            }
        });
    }

}

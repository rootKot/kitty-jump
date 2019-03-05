import Rectangle = PIXI.Rectangle;
import {PlatformInfo} from '../../models/interfaces/PlatformInfo';
import {Audiosprites, Spritesheets} from '../../assets';
import {AudioManager} from '../../managers/AudioManager';


export class Platforms extends Phaser.Group {
    private platformWidth = 200;
    private platformHeight = 80;
    private marginBottom = 40;
    private speed = 10;
    private stopX: number;
    private startX: number;
    private direction = 1;
    private platformsArr: PlatformInfo[];
    private isWorking = true;
    private platformDeepness = 15;

    constructor(private groundY: number, game: Phaser.Game, parent: PIXI.DisplayObjectContainer) {
        super(game, parent);
        this.startX = 0 - this.platformWidth;
        this.stopX = this.game.world.centerX;
        this.platformsArr = [];
        this.game.time.events.loop(Phaser.Timer.SECOND * 1.2, this.createPlatform, this);
    }

    public getPlatformBounds(index: number): Rectangle {
        let bounds = this.platformsArr[index].platform.getBounds();
        bounds.x = this.platformsArr[index].platform.worldPosition.x;
        bounds.y -= this.game.world.y - this.platformDeepness;
        return bounds;
    }

    public getPlatformsArr(): PlatformInfo[] {
        return this.platformsArr;
    }

    public stop(index: number): void {
        this.platformsArr[index].stopped = true;
        AudioManager.i.play(Audiosprites.AudiospritesSounds.Sprites.Land);

        const platformShakeTween = this.game.add.tween(this.platformsArr[index].platform.scale);
        platformShakeTween.to({x: 1.05, y: 1.05}, 20, Phaser.Easing.Linear.None, true, 0, 0, true);
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
        const frame = this.game.rnd.integerInRange(0, 3);
        this.groundY -= this.platformHeight + this.marginBottom;
        const platform = this.game.add.sprite(this.startX, this.groundY, Spritesheets.SpritesClouds20080.getName(), frame, this);
        platform.anchor.set(0.5, 0);
        this.platformsArr.push({
            speed: this.speed,
            direction: this.direction,
            platform: platform,
            stopped: false
        });
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

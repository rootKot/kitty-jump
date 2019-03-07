import Rectangle = PIXI.Rectangle;
import {PlatformInfo} from '../../models/interfaces/PlatformInfo';
import {Audiosprites, Spritesheets} from '../../assets';
import {AudioManager} from '../../managers/AudioManager';


export class Platforms extends Phaser.Group {
    private platformWidth = 200;
    private platformHeight = 80;
    private marginBottom = 40;
    private speed = 6;
    private readonly stopX: number;
    private startX: number;
    private direction = 1;
    private platformsArr: PlatformInfo[];
    private isWorking = true;
    private platformXDeepness = 50;
    private platformYDeepness = 15;

    constructor(private groundY: number, game: Phaser.Game, parent: PIXI.DisplayObjectContainer) {
        super(game, parent);
        this.startX = 0 - this.platformWidth;
        this.stopX = this.game.world.centerX;
        this.platformsArr = [];
        this.game.time.events.loop(Phaser.Timer.SECOND * 1.2, this.createPlatform, this);
    }

    public getDeepness(): { [key: string]: number } {
        return {
            x: this.platformXDeepness,
            y: this.platformYDeepness
        };
    }

    public getPlatformsArr(): PlatformInfo[] {
        return this.platformsArr;
    }

    public stop(index: number): void {
        this.platformsArr[index].stopped = true;
        AudioManager.i.play(Audiosprites.AudiospritesSounds.Sprites.Land);

        const platformShakeTween = this.game.add.tween(this.platformsArr[index].platform.scale);
        platformShakeTween.to({x: 1.08, y: 1.08}, 40, Phaser.Easing.Linear.None, true, 0, 0, true);

        this.speed += 0.1;
    }

    public stopAll(): void {
        this.isWorking = false;
    }

    private changeDirection(): void {
        this.direction *= -1;
        if (this.direction > 0) {
            this.startX = 0 - this.platformWidth / 2;
        } else {
            this.startX = this.game.world.width + this.platformWidth / 2;
        }
    }

    private createPlatform(): void {
        if (!this.isWorking) return;

        this.changeDirection();
        const frame = this.game.rnd.integerInRange(0, 3);
        this.groundY -= this.platformHeight + this.marginBottom;
        const platform = this.game.add.sprite(this.startX, this.groundY, Spritesheets.SpritesClouds20080.getName(), frame, this);
        platform.alpha = 0.9;
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

import * as AssetUtils from '../utils/assetUtils';
import {AudioManager} from '../managers/AudioManager';
import {LoadingScreen} from '../ui/LoadingScreen';

export default class Preloader extends Phaser.State {
    private preloadBarSprite!: Phaser.Sprite;
    private preloadFrameSprite!: Phaser.Sprite;
    private loadingScreen: LoadingScreen;

    public preload(): void {
        // Setup your loading screen and preload sprite (if you want a loading progress indicator) here
        this.loadingScreen = new LoadingScreen(this.game);

        AssetUtils.Loader.loadAllAssets(this.game, this.waitForSoundDecoding, this);
    }

    private waitForSoundDecoding(): void {
        this.loadingScreen.progress = 99;
        AssetUtils.Loader.waitForSoundDecoding(this.startGame, this);
    }

    private startGame(): void {
        this.loadingScreen.progress = 100;
        this.game.camera.onFadeComplete.addOnce(this.loadGame, this);
        this.game.camera.fade(0x000000, 1000);
    }

    private loadGame(): void {
        AudioManager.i.setGame(this.game);
        this.game.state.start('game');
    }
}

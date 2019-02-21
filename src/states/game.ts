import {GameScreen} from '../ui/GameScreen';

export default class Game extends Phaser.State {

    private currentScreen: GameScreen;

    public create(): void {
        this.game.camera.flash(0x000000, 1000);
        this.currentScreen = new GameScreen(this.game, this.game.world);
    }
}

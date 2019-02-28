import {Audio} from '../assets';

export class AudioManager {
    private static _instance: AudioManager;
    private game: Phaser.Game;
    private sounds: {[name: string]: Phaser.Sound} = {};


    public static get i(): AudioManager {
        if (!AudioManager._instance) AudioManager._instance = new AudioManager();
        return AudioManager._instance;
    }

    public setGame(game: Phaser.Game): void {
        this.game = game;
        this.initSounds();
    }

    public play(name: string): void {
        this.sounds[name].play();
    }

    private initSounds(): void {
        this.sounds[Audio.SoundsLand.getName()] = this.game.sound.add(Audio.SoundsLand.getName());
        this.sounds[Audio.SoundsLost.getName()] = this.game.sound.add(Audio.SoundsLost.getName());
    }
}

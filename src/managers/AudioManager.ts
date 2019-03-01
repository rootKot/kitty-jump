import {Audiosprites} from '../assets';

export class AudioManager {
    private static _instance: AudioManager;
    private game: Phaser.Game;
    private audioSprite: Phaser.AudioSprite;

    public static get i(): AudioManager {
        if (!AudioManager._instance) AudioManager._instance = new AudioManager();
        return AudioManager._instance;
    }

    public setGame(game: Phaser.Game): void {
        this.game = game;
        this.initSounds();
    }

    public play(name: string, volume: number = 1): void {
        this.audioSprite.play(name, volume);
    }

    public stop(name: string): void {
        this.audioSprite.stop(name);
    }

    private initSounds(): void {
        this.audioSprite = this.game.sound.addSprite(Audiosprites.AudiospritesSounds.getName());
    }
}

import {KeyPress} from '../enums/Events';

export class KeyBinds {
    public onEvent: Phaser.Signal;
    private jumpKey: Phaser.Key;

    constructor(private game: Phaser.Game) {
        this.onEvent = new Phaser.Signal();
        this.jumpKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.jumpKey.onDown.add(this.jump, this);
    }

    private jump(): void {
        this.onEvent.dispatch(KeyPress.Jump);
    }
}

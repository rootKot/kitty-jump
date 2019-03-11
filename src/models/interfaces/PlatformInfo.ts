export interface PlatformInfo {
    speed: number;
    direction: number;
    platform: Phaser.Sprite;
    stopped: boolean;
}

export interface PlatformProps {
    groundY: number;
    platformWidth: number;
    platformHeight: number;
    marginBottom: number;
}

import {ScoreInfo} from '../models/interfaces/ScoreInfo';

export class ScoreManager {
    private static _instance: ScoreManager;
    private bestScore = 0;
    private score = 0;

    constructor() {
        if (localStorage.getItem('bestScore')) {
            this.bestScore = parseInt(localStorage.getItem('bestScore'));
        } else {
            localStorage.setItem('bestScore', '0');
        }
    }

    public static get i(): ScoreManager {
        if (!ScoreManager._instance) ScoreManager._instance = new ScoreManager();
        return ScoreManager._instance;
    }

    public setScore(score: number): void {
        this.score = score;
    }

    public getBestScore(): ScoreInfo {
        const isRecord = this.score > this.bestScore;
        const result = {
            score: this.score,
            bestScore: this.bestScore,
            isRecord: isRecord
        };
        this.saveBestScore();
        return result;
    }

    private saveBestScore(): void {
        this.bestScore = this.score > this.bestScore ? this.score : this.bestScore;
        localStorage.setItem('bestScore', this.bestScore.toString());
    }
}

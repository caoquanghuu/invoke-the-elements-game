import { Container } from '@pixi/display';
import { Sprite } from '@pixi/sprite';
import { ObjectPool } from '../ObjectsPool/ObjectsPool';
import { BaseObject } from './BaseObject';
import { UIController } from './Controller/UIController';
import Emitter, { HardLevel } from './Util';
import { AppConstants } from './Constants';
import { GamePlayController } from './Controller/GamePlayController';
import { IPointData } from 'pixijs';

export class GameScene extends Container {

    private _objectPool: ObjectPool;
    private _UIController: UIController;
    private _gamePlayController: GamePlayController;
    private _playerScore: number = 0;
    private _missedScore: number = 0;
    private _playerScoreObjects: BaseObject[] = [];
    private _missedScoreObjects: BaseObject[] = [];

    private _time = 0;

    constructor() {
        super();
        this._useEventEffect();
        this.init();
    }

    public init() {
        this._objectPool = new ObjectPool();

        this._gamePlayController = new GamePlayController(this._releaseObject.bind(this), this._returnObject.bind(this), this._plusScore.bind(this));

        this._UIController = new UIController(this._releaseObject.bind(this), this._getPlayerScore.bind(this), this._displayScore.bind(this));

        this._UIController.displayMainMenuGame();
    }

    /**
     * method to display score
     * @param isSuccessScore what type of score will be display
     * @param positionDisplay position to display score
     */
    private _displayScore(isSuccessScore: boolean, positionDisplay: IPointData): void {

        let score: number = 0;

        // remove old score if it have
        if (isSuccessScore) {
            score = this._playerScore;

            if (this._playerScoreObjects) {

                this._playerScoreObjects.forEach(object => {
                    this._returnObject(object);
                    this._removeFromScene(object.sprite);
                });
                this._playerScoreObjects = [];
            }
        } else {
            score = this._missedScore;

            if (this._missedScoreObjects) {
                this._missedScoreObjects.forEach(object => {
                    this._returnObject(object);
                    this._removeFromScene(object.sprite);
                });
                this._missedScoreObjects = [];
            }
        }

        const scoreArray: string[] = `${score}`.split('').reverse();

        const position: IPointData = { x: positionDisplay.x, y: positionDisplay.y };

        const scoreObjectsArray: BaseObject[] = scoreArray.map(scores => {
            const scoreObject = this._releaseObject(`score-number-${scores}`);

            this._addToScene(scoreObject.sprite);

            scoreObject.position = position;
            position.x -= AppConstants.distance.score;

            return scoreObject;
        });

        isSuccessScore ? this._playerScoreObjects = scoreObjectsArray : this._missedScoreObjects = scoreObjectsArray;
    }

    private _plusScore(score: number, isSuccessScore: boolean): void {
        if (isSuccessScore) {
            this._playerScore += score;
            this._displayScore(isSuccessScore, AppConstants.position.displaySuccessScore);
        } else {
            this._missedScore += score;
            this._displayScore(isSuccessScore, AppConstants.position.displayMissedScore);
        }
    }

    private _releaseObject(id: string): BaseObject {
        return this._objectPool.releaseObject(id);
    }

    private _returnObject(object: BaseObject): void {
        this._objectPool.returnObject(object);
    }

    private _addToScene(sprite: Sprite): void {
        this.addChild(sprite);
    }

    private _removeFromScene(sprite: Sprite): void {
        this.removeChild(sprite);
    }

    private _useEventEffect(): void {
        Emitter.on(AppConstants.eventName.addToScene, this._addToScene.bind(this));
        Emitter.on(AppConstants.eventName.removeFromScene, this._removeFromScene.bind(this));
        Emitter.on(AppConstants.eventName.playGame, (hardLevel: HardLevel) => {
            this._gamePlayController.hardLevel = hardLevel;
            Emitter.emit(AppConstants.eventName.displayGamePlay, null);
        });
        Emitter.on(AppConstants.eventName.playAgain, () => {
            this._playerScore = 0;
            this._missedScore = 0;
            this._gamePlayController.reset();
            Emitter.emit(AppConstants.eventName.displayMainMenu, null);
        });
    }

    private _getPlayerScore(): number {
        return this._playerScore;
    }

    public update(deltaTime: number): void {
        this._time += deltaTime;
        if (this._time > 1000) {
            this._time -= 1000;
            console.log('GameScene update');
        }
        this._gamePlayController.update(deltaTime);

        if (this._missedScore === AppConstants.maxMissedPoint) {
            Emitter.emit(AppConstants.eventName.displayGameOver, null);
        }
    }
}
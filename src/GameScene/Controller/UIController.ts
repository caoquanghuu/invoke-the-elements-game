
import { DisplayScoreFn, GetPlayerScoreFn, ReleaseObjectFn, ReturnObjectFn } from '../Type';
import { AppConstants } from '../Constants';
import Emitter, { HardLevel } from '../Util';
import { Text, TextStyle } from '@pixi/text';
import { IPointData } from '@pixi/core';
import { BaseObject } from '../BaseObject';

export class UIController {
    private _releaseObjectCallBack: ReleaseObjectFn;
    private _returnObjectCallBack: ReturnObjectFn;
    private _getPlayerScoreCallBack: GetPlayerScoreFn;
    private _displayScoreCallBack: DisplayScoreFn;
    private _mainMenuBackGround: BaseObject;
    private _gamePlayBackGround: BaseObject;
    private _gameOverBackGround: BaseObject;

    constructor(releaseObjectFn: ReleaseObjectFn, returnObjectFn: ReturnObjectFn, getPlayerScoreFn: GetPlayerScoreFn, displayScoreFn: DisplayScoreFn) {
        this._useEventEffect();
        this._releaseObjectCallBack = releaseObjectFn;
        this._returnObjectCallBack = returnObjectFn;
        this._getPlayerScoreCallBack = getPlayerScoreFn;
        this._displayScoreCallBack = displayScoreFn;

        this._init();
    }

    private _useEventEffect() {
        Emitter.on(AppConstants.eventName.displayMainMenu, this.displayMainMenuGame.bind(this));
        Emitter.on(AppConstants.eventName.displayGamePlay, this._displayGamePlayBackGround.bind(this));
        Emitter.on(AppConstants.eventName.displayGameOver, this._displayGameOver.bind(this));
    }

    public displayMainMenuGame(): void {
        // remove display game over bg
        Emitter.emit(AppConstants.eventName.removeFromScene, this._gameOverBackGround.sprite);

        // display main game bg
        Emitter.emit(AppConstants.eventName.addToScene, this._mainMenuBackGround.sprite);

        // stop update
        Emitter.emit(AppConstants.eventName.setUpdateStatus, false);

        this._createText(AppConstants.text.title, AppConstants.position.titleText, AppConstants.textStyle.title);
        this._createText(AppConstants.text.choseHardLevel, AppConstants.position.hardLevelOptionText, AppConstants.textStyle.normalText);

        const easyLevel = this._createText(AppConstants.text.easyLevel, AppConstants.position.easyText, AppConstants.textStyle.hardLevelText);
        const normalLevel = this._createText(AppConstants.text.normalLevel, AppConstants.position.normalText, AppConstants.textStyle.hardLevelText);
        const hardLevel = this._createText(AppConstants.text.hardLevel, AppConstants.position.hardText, AppConstants.textStyle.hardLevelText);

        easyLevel.cursor = 'pointer';
        easyLevel.eventMode = 'static';

        normalLevel.cursor = 'pointer';
        normalLevel.eventMode = 'static';

        hardLevel.cursor = 'pointer';
        hardLevel.eventMode = 'static';

        easyLevel.on('pointertap', () => {
            Emitter.emit(AppConstants.eventName.playGame, HardLevel.easy);
        });
        normalLevel.on('pointerdown', () => {
            Emitter.emit(AppConstants.eventName.playGame, HardLevel.normal);
        });
        hardLevel.on('pointerdown', () => {
            Emitter.emit(AppConstants.eventName.playGame, HardLevel.hard);
        });
    }

    private _displayGamePlayBackGround(): void {
        Emitter.emit(AppConstants.eventName.removeFromScene, this._mainMenuBackGround.sprite);
        Emitter.emit(AppConstants.eventName.addToScene, this._gamePlayBackGround.sprite);
        this._displayScoreCallBack(true, AppConstants.position.displaySuccessScore);
        this._displayScoreCallBack(false, AppConstants.position.displayMissedScore);

        this._createText(AppConstants.text.invokedSuccess, AppConstants.position.invokedSuccessText, AppConstants.textStyle.normalText);
        this._createText(AppConstants.text.invokedMissed, AppConstants.position.invokedMissedText, AppConstants.textStyle.normalText);

        // start update
        Emitter.emit(AppConstants.eventName.setUpdateStatus, true);
    }

    private _displayGameOver() {
        // stop update
        Emitter.emit(AppConstants.eventName.setUpdateStatus, false);
        Emitter.emit(AppConstants.eventName.removeFromScene, this._mainMenuBackGround.sprite);
        Emitter.emit(AppConstants.eventName.addToScene, this._gameOverBackGround.sprite);

        this._createText(AppConstants.text.gameOver, AppConstants.position.gameOverTitle, AppConstants.textStyle.title);
        this._createText(AppConstants.text.yourScore, AppConstants.position.finalScoreText, AppConstants.textStyle.normalText);
        const score = this._getPlayerScoreCallBack();
        this._createText(`${score}`, AppConstants.position.scoreText, AppConstants.textStyle.finalScoreText);
        const playAgain = this._createText(AppConstants.text.playAgain, AppConstants.position.playAgainText, AppConstants.textStyle.normalText);
        playAgain.cursor = 'pointer';
        playAgain.eventMode = 'static';
        playAgain.on('pointertap', () => {
            Emitter.emit(AppConstants.eventName.playAgain, null);
        });
    }

    private _init() {
        this._mainMenuBackGround = this._releaseObjectCallBack(AppConstants.backGroundName.mainMenuBackGround);
        this._gamePlayBackGround = this._releaseObjectCallBack(AppConstants.backGroundName.gamePlayBackGround);
        this._gameOverBackGround = this._releaseObjectCallBack(AppConstants.backGroundName.gameOverBackGround);

        this._mainMenuBackGround.position = AppConstants.position.backGround;
        this._gamePlayBackGround.position = AppConstants.position.backGround;
        this._gameOverBackGround.position = AppConstants.position.backGround;
    }

    private _createText(text: string, position: IPointData, style?: TextStyle): Text {
        const displayText: Text = new Text(text, style);
        displayText.position = position;
        Emitter.emit(AppConstants.eventName.addToScene, displayText);
        return displayText;
    }
}
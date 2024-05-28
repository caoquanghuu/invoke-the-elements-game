import { IPointData } from 'pixijs';
import { BaseObject } from '../BaseObject';
import { AppConstants } from '../Constants';
import { PlusScoreFn, ReleaseObjectFn, ReturnObjectFn } from '../Type';
import Emitter, { ElementCode, HardLevel, SkillCode, keyboard, randomSkill } from '../Util';

export class GamePlayController {

    private _releaseObjectCallBack: ReleaseObjectFn;
    private _returnObjectCallBack: ReturnObjectFn;
    private _plusScoreCallBack: PlusScoreFn;
    private _hardLevel: HardLevel;
    private _timeCount: number = 0;
    private _invokedSkillName: string;

    private _usingSkills: BaseObject[] = [];
    private _usingElements: BaseObject[] = [];

    constructor(releaseObjectFn: ReleaseObjectFn, returnObjectFn: ReturnObjectFn, plusScoreFn: PlusScoreFn) {

        this._releaseObjectCallBack = releaseObjectFn;
        this._returnObjectCallBack = returnObjectFn;
        this._plusScoreCallBack = plusScoreFn;

        this._init();
    }

    private _init() {
        const quas = keyboard(AppConstants.keyboardEvent.quas);
        const exort = keyboard(AppConstants.keyboardEvent.exort);
        const wex = keyboard(AppConstants.keyboardEvent.wex);
        const invoke = keyboard(AppConstants.keyboardEvent.invoke);

        quas.press = () => {
            this._createElements(AppConstants.elementName.quas);
        };
        exort.press = () => {
            this._createElements(AppConstants.elementName.exort);
        };
        wex.press = () => {
            this._createElements(AppConstants.elementName.wex);
        };

        invoke.press = () => {
            this._invokeElements();
        };

        Emitter.emit(AppConstants.eventName.displayGamePlay, null);
    }

    public reset() {
        this._usingSkills.forEach(skill => {
            this._removeObject(skill, this._usingSkills);
        });
        this._usingElements.forEach(element => {
            this._removeObject(element, this._usingElements);
        });
        this._hardLevel = 0;
    }

    private _invokeElements() {
        let invokedElementCode: number = 0;
        let skillName: string;

        this._usingElements.forEach(element => {
            const id = element.id;
            switch (id) {
                case AppConstants.elementName.quas: {
                    invokedElementCode += ElementCode.quas;
                    return;
                }
                case AppConstants.elementName.wex: {
                    invokedElementCode += ElementCode.wex;
                    return;
                }
                case AppConstants.elementName.exort: {
                    invokedElementCode += ElementCode.exort;
                    return;
                }
                default:
                    console.log('element code wrong');
                    return;
            }
        });

        const skillCodeKeys: string[] = Object.keys(SkillCode);
        const values: SkillCode[] = skillCodeKeys.map(skillCodeKeys => SkillCode[skillCodeKeys]);

        const i = values.findIndex(skillCode => skillCode === invokedElementCode);

        if (i != -1) {
            skillName = skillCodeKeys[i];
            this._invokedSkillName = skillName;
        }
    }

    private _createSkills(speed: number, position: IPointData) {
        const randomSkillName = randomSkill();
        const skill = this._releaseObjectCallBack(randomSkillName);
        skill.speed = speed;
        skill.position = position;
        skill.sprite.width = AppConstants.iconSize.width;
        skill.sprite.height = AppConstants.iconSize.height;

        this._usingSkills.push(skill);
        Emitter.emit(AppConstants.eventName.addToScene, skill.sprite);
    }

    private _createElements(elementName: string) {
        const element = this._releaseObjectCallBack(elementName);
        element.position = AppConstants.position.element1;
        element.sprite.width = AppConstants.iconSize.width;
        element.sprite.height = AppConstants.iconSize.height;
        this._usingElements.unshift(element);
        Emitter.emit(AppConstants.eventName.addToScene, element.sprite);

        switch (this._usingElements.length) {
            case 0:
                return;
            case 1:
                return;
            case 2:
                this._usingElements[1].position = AppConstants.position.element2;
                return;
            case 3:
                this._usingElements[1].position = AppConstants.position.element2;
                this._usingElements[2].position = AppConstants.position.element3;
                return;
            case 4:
                this._usingElements[1].position = AppConstants.position.element2;
                this._usingElements[2].position = AppConstants.position.element3;

                const removedElement = this._usingElements.pop();
                Emitter.emit(AppConstants.eventName.removeFromScene, removedElement.sprite);
                this._returnObjectCallBack(removedElement);

        }

    }

    get hardLevel(): HardLevel {
        return this._hardLevel;
    }

    set hardLevel(hardLevel: HardLevel) {
        this._hardLevel = hardLevel;
    }

    private _dropSkills() {
        switch (this._hardLevel) {
            case HardLevel.easy:
            {
                this._createSkills(AppConstants.speed.easy, AppConstants.position.skillPosition1);
                return;
            }

            case HardLevel.normal:
            {
                this._createSkills(AppConstants.speed.easy, AppConstants.position.skillPosition4);
                this._createSkills(AppConstants.speed.easy, AppConstants.position.skillPosition5);
                return;
            }

            case HardLevel.hard:
            {
                this._createSkills(AppConstants.speed.easy, AppConstants.position.skillPosition1);
                this._createSkills(AppConstants.speed.easy, AppConstants.position.skillPosition2);
                this._createSkills(AppConstants.speed.easy, AppConstants.position.skillPosition3);
                return;
            }
            default:
        }
    }

    private _removeObject(objectToRemove: BaseObject, objectArray: BaseObject[]) {
        this._returnObjectCallBack(objectToRemove);
        const i = objectArray.findIndex(object => object === objectToRemove);
        Emitter.emit(AppConstants.eventName.removeFromScene, objectToRemove.sprite);
        objectArray.splice(i, 1);
    }

    public update(deltaTime: number) {
        this._timeCount += deltaTime;
        if (this._timeCount > AppConstants.timeDropSkill) {
            this._timeCount -= AppConstants.timeDropSkill;
            this._dropSkills();
        }

        this._usingSkills.forEach(skill => {
            skill.update(deltaTime);

            if (skill.position.y > AppConstants.maxDropPoint) {
                this._removeObject(skill, this._usingSkills);

                this._plusScoreCallBack(1, false);
            }

            if (this._invokedSkillName === skill.id) {
                this._removeObject(skill, this._usingSkills);
                this._plusScoreCallBack(1, true);
                this._invokedSkillName = null;
            }
        });

    }
}
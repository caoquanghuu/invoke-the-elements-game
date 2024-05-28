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
        // create keyboard event
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

        // display game play back ground
        Emitter.emit(AppConstants.eventName.displayGamePlay, null);
    }

    /**
     * method to reset the game play, which will remove objects existing and other to default
     */
    public reset() {
        this._usingSkills.forEach(skill => {
            this._removeObject(skill, this._usingSkills);
        });
        this._usingElements.forEach(element => {
            this._removeObject(element, this._usingElements);
        });
        this._hardLevel = 0;
    }

    /**
     * method to _invoke element when player trigger invoke
     */
    private _invokeElements() {
        let invokedElementCode: number = 0;
        let skillName: string;

        // use elements code to calculate what skill will be create
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

    /**
     * method will create skill and set position and speed for that skill
     * @param speed speed drop of skill
     * @param position position of skill begin drop
     */
    private _createSkills(speed: number, position: IPointData) {
        const randomSkillName = randomSkill();
        const skill = this._releaseObjectCallBack(randomSkillName);
        skill.speed = speed;
        skill.position = position;
        skill.sprite.width = AppConstants.iconSize.width;
        skill.sprite.height = AppConstants.iconSize.height;
        Emitter.emit(AppConstants.eventName.addToScene, skill.sprite);

        this._usingSkills.push(skill);
    }

    /**
     * method to create elements when player trigger
     * @param elementName type of element want create
     * @returns
     */
    private _createElements(elementName: string) {
        // call get element from object pool
        const element = this._releaseObjectCallBack(elementName);

        // set default position
        element.position = AppConstants.position.element1;
        element.sprite.width = AppConstants.iconSize.width;
        element.sprite.height = AppConstants.iconSize.height;

        // add that element to array
        this._usingElements.unshift(element);
        Emitter.emit(AppConstants.eventName.addToScene, element.sprite);

        // check status of current using element and set position for it
        switch (this._usingElements.length) {
            case 0:
                break;
            case 1:
                break;
            case 2:
                this._usingElements[1].position = AppConstants.position.element2;
                break;
            case 3:
                this._usingElements[1].position = AppConstants.position.element2;
                this._usingElements[2].position = AppConstants.position.element3;
                break;
            case 4:
                // when elements more than 3 elements, the last element will be remove and set position for remain elements
                this._usingElements[1].position = AppConstants.position.element2;
                this._usingElements[2].position = AppConstants.position.element3;

                const elementToRemove = this._usingElements.pop();
                Emitter.emit(AppConstants.eventName.removeFromScene, elementToRemove.sprite);
                this._returnObjectCallBack(elementToRemove);
                break;
            default:
        }

    }

    get hardLevel(): HardLevel {
        return this._hardLevel;
    }

    set hardLevel(hardLevel: HardLevel) {
        this._hardLevel = hardLevel;
    }

    /**
     * method to drop skill base on hard level
     * @returns default
     */
    private _dropSkills(): void {
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

    /**
     * method to remove an object from array list and return it to object pool
     * @param objectToRemove object need remove
     * @param objectArray the array which the object existing
     */
    private _removeObject(objectToRemove: BaseObject, objectArray: BaseObject[]) {
        this._returnObjectCallBack(objectToRemove);
        const i = objectArray.findIndex(object => object === objectToRemove);
        Emitter.emit(AppConstants.eventName.removeFromScene, objectToRemove.sprite);
        objectArray.splice(i, 1);
    }

    public update(deltaTime: number) {
        // drop skill each time count
        this._timeCount += deltaTime;
        if (this._timeCount > AppConstants.timeDropSkill) {
            this._timeCount -= AppConstants.timeDropSkill;
            this._dropSkills();
        }

        // check skill
        this._usingSkills.forEach(skill => {
            skill.update(deltaTime);

            // if skill drop to max drop point will remove them and missed score will be increase
            if (skill.position.y > AppConstants.maxDropPoint) {
                this._removeObject(skill, this._usingSkills);

                this._plusScoreCallBack(1, false);
            }

            // check if invoked skill match with existing skills
            if (this._invokedSkillName === skill.id) {
                this._removeObject(skill, this._usingSkills);
                this._plusScoreCallBack(1, true);
                this._invokedSkillName = null;
            }
        });

    }
}
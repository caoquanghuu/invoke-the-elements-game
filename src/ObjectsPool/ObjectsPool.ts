import { BaseObject } from '../GameScene/BaseObject';
import { AppConstants } from '../GameScene/Constants';

export class ObjectPool {
    private _objectsPool: BaseObject[] = [];

    constructor() {

        // create element objects
        for (let i = 0; i < AppConstants.maxElementPool; i++) {

            const quas = new BaseObject(AppConstants.elementName.quas);
            const wex = new BaseObject(AppConstants.elementName.wex);
            const exort = new BaseObject(AppConstants.elementName.exort);

            this._objectsPool.push(quas, wex, exort);
        }

        // craete skill objects
        for (let i = 0; i < AppConstants.maxSkillPool; i ++) {
            const coldSnap = new BaseObject(AppConstants.skillName.coldSnap);
            const ghostWalk = new BaseObject(AppConstants.skillName.ghostWalk);
            const iceWall = new BaseObject(AppConstants.skillName.iceWall);
            const EMP = new BaseObject(AppConstants.skillName.EMP);
            const tornado = new BaseObject(AppConstants.skillName.tornado);
            const alacrity = new BaseObject(AppConstants.skillName.alacrity);
            const sunStrike = new BaseObject(AppConstants.skillName.sunStrike);
            const forgeSpirit = new BaseObject(AppConstants.skillName.forgeSpirit);
            const chaosMeteor = new BaseObject(AppConstants.skillName.chaosMeteor);
            const deafeningBlast = new BaseObject(AppConstants.skillName.deafeningBlast);
            this._objectsPool.push(coldSnap, ghostWalk, iceWall, EMP, tornado, alacrity, sunStrike, forgeSpirit, chaosMeteor, deafeningBlast);
        }

        // create number objects
        for (let i = 0; i < 10; i++) {
            for (let n = 0; n < AppConstants.maxNumberPool; n ++) {
                const number = new BaseObject(`score-number-${i}`);

                number.sprite.width = AppConstants.iconSize.scoreWidth;
                number.sprite.width = AppConstants.iconSize.scoreHeight;

                this._objectsPool.push(number);
            }
        }

        const gamePlayBackGround = new BaseObject(AppConstants.backGroundName.gamePlayBackGround);
        const mainMenuBackGround = new BaseObject(AppConstants.backGroundName.mainMenuBackGround);
        const gameOverBackGround = new BaseObject(AppConstants.backGroundName.gameOverBackGround);

        this._objectsPool.push(gamePlayBackGround, mainMenuBackGround, gameOverBackGround);
    }

    public releaseObject(id: string): BaseObject {

        const i = this._objectsPool.findIndex(object => {
            return object.id === id;
        });

        if (i === -1) {
            console.log('object not found');
            return;
        }

        const object = this._objectsPool.splice(i, 1);
        return object[0];
    }

    public returnObject(object: BaseObject) {

        this._objectsPool.push(object);
    }

}
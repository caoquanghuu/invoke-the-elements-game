import EventEmitter from 'eventemitter3';
import { AppConstants } from './Constants';

export function getRandomArbitrary(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export enum ElementCode {
    'quas' = 1,
    'wex' = 3,
    'exort' = 6
}

export enum SkillCode {
    'cold-snap' = 3,
    'ghost-walk' = 5,
    'ice-wall' = 8,
    'tornado' = 7,
    'E.M.P' = 9,
    'deafening-blast' = 10,
    'alacrity' = 12,
    'forge-spirit' = 13,
    'chaos-meteor' = 15,
    'sun-strike' = 18
}

export function keyboard(value: any) {
    const key: any = {};
    key.value = value;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;

    //The `downHandler`
    key.downHandler = (event) => {
        if (event.key === key.value) {
            if (key.isUp && key.press) {
                key.press();
            }
            key.isDown = true;
            key.isUp = false;
            event.preventDefault();
        }
    };

    //The `upHandler`
    key.upHandler = (event) => {
        if (event.key === key.value) {
            if (key.isDown && key.release) {
                key.release();
            }
            key.isDown = false;
            key.isUp = true;
            event.preventDefault();
        }
    };

    //Attach event listeners
    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);

    window.addEventListener('keydown', downListener, false);
    window.addEventListener('keyup', upListener, false);

    // Detach event listeners
    key.unsubscribe = () => {
        window.removeEventListener('keydown', downListener);
        window.removeEventListener('keyup', upListener);
    };

    return key;
}

export const enum HardLevel  {
    easy,
    normal,
    hard
}

const eventEmitter = new EventEmitter();
const Emitter = {
    on: (event: string, fn) => eventEmitter.on(event, fn),
    once: (event: string, fn) => eventEmitter.once(event, fn),
    off: (event: string, fn) => eventEmitter.off(event, fn),
    emit: (event: string, payload) => eventEmitter.emit(event, payload),
    remove: () => eventEmitter.removeAllListeners(),
};
Object.freeze(Emitter);
export default Emitter;

const skillNameArray: string[] = Object.keys(AppConstants.skillName).map((key) => AppConstants.skillName[key]);

export function randomSkill(): string {
    const random = Math.floor(Math.random() * skillNameArray.length);
    return skillNameArray[random];
}
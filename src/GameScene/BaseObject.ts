import { Sprite } from '@pixi/sprite';
import { AssetsLoader } from '../AssetsLoader';
import { IPointData } from 'pixijs';

export class BaseObject {
    private _sprite: Sprite;
    private _id: string;
    private _speed: number = 0;

    constructor(nameImg: string) {
        // use name img to create sprite of object
        this._sprite = new Sprite(AssetsLoader.getTexture(nameImg));

        this._id = nameImg;

        // set middle point for sprite
        this._sprite.anchor.set(0.5);

    }

    get position(): IPointData {
        return this._sprite.position;
    }

    set position(position: IPointData) {
        this._sprite.position = position;
    }

    get id(): string {
        return this._id;
    }

    get sprite(): Sprite {
        return this._sprite;
    }

    set speed(speed: number) {
        this._speed = speed;
    }

    public update(deltaTime: number) {
        if (this._speed !== 0) {
            this.position.y = (this.position.y) + ((this._speed * deltaTime) / 1000);
        }
    }
}
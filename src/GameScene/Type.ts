/* eslint-disable no-unused-vars */
import { Sprite } from '@pixi/sprite';
import { BaseObject } from './BaseObject';
import { IPointData } from '@pixi/core';


export type ReleaseObjectFn = (id: string) => BaseObject;

export type ReturnObjectFn = (object: BaseObject) => void;

export type AddToSceneFn = (sprite: Sprite) => void;

export type RemoveFromSceneFn = (sprite: Sprite) => void;

export type DisplayScoreFn = (isSuccessScore: boolean, positionDisplay: IPointData) => void;

export type PlusScoreFn = (score: number, isSuccessScore: boolean) => void;

export type GetPlayerScoreFn = () => number;

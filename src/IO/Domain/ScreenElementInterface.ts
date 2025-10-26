import { SpriteCordsDom } from '../Infrastructure/Dom/SpriteCordsDom';
import { ScreenElementDimensionInterface } from './ScreenElementDimensionInterface';
import { ScreenElementPositionInterface } from './ScreenElementPositionInterface';

export interface ScreenElementInterface {
  getLoaded(): boolean;
  getPosition(): ScreenElementPositionInterface;
  getDimension(): ScreenElementDimensionInterface;
  setPosition(x: number, y: number): void;
  getSpriteCords(): SpriteCordsDom;
}

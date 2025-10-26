import { ScreenElementDimensionInterface } from '../../IO/Domain/ScreenElementDimensionInterface';
import { ScreenElementInterface } from '../../IO/Domain/ScreenElementInterface';
import { ScreenElementPositionInterface } from '../../IO/Domain/ScreenElementPositionInterface';

export interface MissileInterface {
  setPosition(x: number, y: number): void;
  getPosition(): ScreenElementPositionInterface;
  getDimension(): ScreenElementDimensionInterface;
  animate(repaintRatePerSecond: number): void;
  takeHit(id: string): void;
  destroyed(): boolean;
  getDestructionScore(): number;
  damageAnnounce(): boolean;
  unsetDamageAnnounce(): void;
  getScreenElement(): ScreenElementInterface;
}

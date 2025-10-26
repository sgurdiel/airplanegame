import { MissileAbstractDom } from '../Infrastructure/Dom/MissileAbstractDom';

export interface EnemyInterface {
  animate(
    repaintRatePerSecond: number,
    millisecondsSinceLastAnimateCall: number,
    screenHeight: number,
    screenWidth: number,
  ): void;
  getLaunchedMissiles(): MissileAbstractDom[];
}

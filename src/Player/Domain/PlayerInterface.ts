import { AirplaneAbstractDom } from '../Infrastucture/Dom/AirplaneAbstractDom';
import { BaseDom } from '../Infrastucture/Dom/BaseDom';

export interface PlayerInterface {
  animate(
    repaintRatePerSecond: number,
    millisecondsSinceLastAnimateCall: number,
  ): void;
  fly(x: number, y: number, screenHeight: number): void;
  fire(): void;
  reloadMagazine(): void;
  getAirplanes(): AirplaneAbstractDom[];
  updateScore(points: number): void;
  getBase(): BaseDom;
  getScrore(): number;
  defeated(): boolean;
}

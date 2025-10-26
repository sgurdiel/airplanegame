import { ScreenElementDom } from '../../IO/Infrastructure/Dom/ScreenElementDom';
import { FireRoundDom } from '../Infrastucture/Dom/FireRoundDom';

export interface AirplaneInterface {
  animate(
    repaintRatePerSecond: number,
    millisecondsSinceLastAnimateCall: number,
  ): ScreenElementDom[];
  fly(x: number, y: number, screenHeight: number): void;
  fire(): void;
  reloadMagazine(): void;
  getAvailableFireRounds(): number;
  getReloading(): boolean;
  getFireRounds(): FireRoundDom[];
}

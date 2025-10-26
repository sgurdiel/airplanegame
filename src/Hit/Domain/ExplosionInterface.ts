import { ScreenElementDom } from '../../IO/Infrastructure/Dom/ScreenElementDom';

export interface ExplosionInterface {
  getScreenElement(): ScreenElementDom;
  animate(millisecondsSinceLastAnimateCall: number): void;
  getTimeVisible(): number;
}

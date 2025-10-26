import { ScreenElementDimensionDom } from '../../../IO/Infrastructure/Dom/ScreenElementDimensionDom';
import { ScreenElementDom } from '../../../IO/Infrastructure/Dom/ScreenElementDom';
import { ScreenElementPositionDom } from '../../../IO/Infrastructure/Dom/ScreenElementPositionDom';
import { ExplosionInterface } from '../../Domain/ExplosionInterface';

export class ExplosionDom implements ExplosionInterface {
  protected readonly screenElement: ScreenElementDom;
  protected timeVisible: number = 300; // milliseconds

  constructor(
    id: string,
    missileDimension: ScreenElementDimensionDom,
    missilePosition: ScreenElementPositionDom,
  ) {
    this.screenElement = new ScreenElementDom(
      'sprite',
      'explosion' + id,
      96,
      88,
      0,
      90,
      'destination-over',
    );
    this.screenElement.setPosition(
      Math.round(
        missilePosition.getPositionX() + (missileDimension.getWidth() - 44),
      ),
      Math.round(missilePosition.getPositionY() - missileDimension.getHeight()),
    );
  }

  public getScreenElement(): ScreenElementDom {
    return this.screenElement;
  }

  public animate(millisecondsSinceLastAnimateCall: number): void {
    this.timeVisible -= millisecondsSinceLastAnimateCall;
  }

  public getTimeVisible(): number {
    return this.timeVisible;
  }
}

import { ScreenElementDom } from '../../../IO/Infrastructure/Dom/ScreenElementDom';
import { FireRoundInterface } from '../../Domain/FireRoundInterface';

export class FireRoundDom implements FireRoundInterface {
  private readonly screenElement: ScreenElementDom;
  private readonly speed: number = 800; // pixels/sec

  constructor(id: number, positionX: number, positionY: number) {
    this.screenElement = new ScreenElementDom(
      'sprite',
      'fireround' + id,
      13,
      50,
      0,
      72,
      'destination-over',
    );
    this.screenElement.setPosition(positionX, positionY);
  }

  public animate(repaintRatePerSecond: number): void {
    this.setPosition(
      this.screenElement.getPosition().getPositionX() -
        Math.round(this.speed / repaintRatePerSecond),
      this.screenElement.getPosition().getPositionY(),
    );
  }

  public getScreenElement(): ScreenElementDom {
    return this.screenElement;
  }

  public destroy(): void {
    this.setPosition(
      Math.round(0 - this.screenElement.getDimension().getWidth()),
      this.screenElement.getPosition().getPositionY(),
    );
  }

  public setPosition(x: number, y: number): void {
    this.screenElement.setPosition(x, y);
  }
}

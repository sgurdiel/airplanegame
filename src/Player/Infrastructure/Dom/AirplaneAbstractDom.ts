import { ScreenElementDom } from '../../../IO/Infrastructure/Dom/ScreenElementDom';
import { AirplaneInterface } from '../../Domain/AirplaneInterface';
import { FireRoundDom } from './FireRoundDom';

export abstract class AirplaneAbstractDom implements AirplaneInterface {
  protected screenElement: ScreenElementDom;
  protected readonly magazineCapacity: number = 1;
  private firedRounds: FireRoundDom[] = [];
  private availableFireRounds: number = 0;
  private reloading: boolean = false;
  private readonly reloadTime: number = 1000; // millisedonds
  private timeTillReload: number = this.reloadTime;

  constructor(
    domId: string,
    elementId: string,
    airplaneHeight: number,
    airplaneWidth: number,
    private readonly verticalCenter: number,
    spriteX: number,
    spriteY: number,
  ) {
    this.screenElement = new ScreenElementDom(
      domId,
      elementId,
      airplaneHeight,
      airplaneWidth,
      spriteX,
      spriteY,
      'destination-over',
    );
  }

  public animate(
    repaintRatePerSecond: number,
    millisecondsSinceLastAnimateCall: number,
  ): ScreenElementDom[] {
    const screenElementsToPaint: ScreenElementDom[] = [];
    screenElementsToPaint.push(this.screenElement);
    this.firedRounds.forEach((fireRound: FireRoundDom, index: number) => {
      if (
        fireRound.getScreenElement().getPosition().getPositionX() >
        fireRound.getScreenElement().getDimension().getWidth() * -1
      ) {
        this.firedRounds[index].animate(repaintRatePerSecond);
        screenElementsToPaint.push(fireRound.getScreenElement());
      }
    });
    if (this.reloading) {
      this.timeTillReload -= millisecondsSinceLastAnimateCall;
      if (0 > this.timeTillReload) {
        this.timeTillReload = this.reloadTime;
        this.reloadMagazine();
      }
    }
    return screenElementsToPaint;
  }

  public fly(x: number, y: number, screenHeight: number): void {
    const bottomLimit =
      screenHeight - (this.screenElement.getDimension().getHeight() + 8);
    const adjustedPosition = y - (this.verticalCenter + 6);
    this.screenElement.setPosition(
      x - (this.screenElement.getDimension().getWidth() + 10),
      adjustedPosition > bottomLimit
        ? bottomLimit
        : adjustedPosition < 0
          ? 0
          : adjustedPosition,
    );
  }

  public fire(): void {
    if (this.reloading) {
      return;
    }
    this.firedRounds[
      this.magazineCapacity - this.availableFireRounds
    ].setPosition(
      this.screenElement.getPosition().getPositionX(),
      Math.round(
        this.screenElement.getPosition().getPositionY() + this.verticalCenter,
      ),
    );
    this.availableFireRounds--;
    this.reloading = 0 === this.availableFireRounds;
  }

  protected initializeMagazine(): void {
    for (let i = 1; i <= this.magazineCapacity; i++) {
      this.firedRounds.push(new FireRoundDom(i, -1000, -1000));
    }
    this.availableFireRounds = this.magazineCapacity;
  }

  public reloadMagazine(): void {
    this.availableFireRounds = this.magazineCapacity;
    this.reloading = false;
  }

  public getAvailableFireRounds(): number {
    return this.availableFireRounds;
  }

  public getReloading(): boolean {
    return this.reloading;
  }

  public getFireRounds(): FireRoundDom[] {
    return this.firedRounds;
  }
}

import type DomUi from './DomUi';
import FireRound from './FireRound';
import GameElement, { type GameElementPosition } from './GameElement';
import { asyncDelay } from './Helpers';

export default class Airplane {
  private readonly element: GameElement;
  private readonly fireRoundsCapacity: number = 10;
  private readonly fireRoundsAvailable: FireRound[] = [];
  private readonly fireRoundsFired: FireRound[] = [];
  private readonly fireRoundSpeed: number = 24;
  private reloading: boolean = false;
  private readonly reloadTime: number = 500;

  constructor(private readonly ui: DomUi) {
    this.element = new GameElement(this.ui, 'div', 58, 92, '', 'airplane');
    this.element.move({
      topPos: Math.round(this.ui.getScreenHeight() / 2),
      leftPos:
        this.ui.getMaxLeftPosGaimingContainer() - this.element.getImgL() - 4,
    });
    this.ui.appendGameElement(this.getElement());
    this.reload();
  }

  public getElement(): GameElement {
    return this.element;
  }

  public move(): void {
    let position: GameElementPosition = {
      topPos: this.ui.getMouseTop() - Math.round(this.element.getImgH() / 2),
      leftPos:
        this.ui.getMaxLeftPosGaimingContainer() - this.element.getImgL() - 4,
    };
    position = this.ui.gameElementWithinGameContainerBoundaries(
      position,
      this.element,
    );
    this.element.move(position);
  }

  public fireRound(): void {
    const fireRound: FireRound | undefined = this.fireRoundsAvailable.pop();
    if (fireRound !== undefined) {
      this.ui.appendGameElement(fireRound.getElement());
      const position: GameElementPosition = {
        topPos:
          this.element.getPosition().topPos +
          Math.round(this.element.getImgH() / 2),
        leftPos: this.element.getPosition().leftPos,
      };
      fireRound.fire(position);
      this.fireRoundsFired.push(fireRound);
      this.ui.displayMagazineMsg(this.fireRoundsAvailable.length);
    }
    if (this.fireRoundsAvailable.length === 0 && false === this.reloading) {
      this.ui.displayReloadingMsg(this.reloadTime);
      this.reloading = true;
      asyncDelay(this.reloadTime)
        .then(() => {
          this.reload();
        })
        .catch(() => {});
    }
  }

  private reload(): void {
    for (let index: number = 0; index < this.fireRoundsCapacity; index++) {
      this.fireRoundsAvailable.push(new FireRound(this.ui));
    }
    this.reloading = false;
    this.ui.displayMagazineMsg(this.fireRoundsAvailable.length);
  }

  public moveFiredRounds(): void {
    for (let index = 0; index < this.getFireRoundsFired().length; index++) {
      const position = this.fireRoundsFired[index].getPosition();
      const newLeftPos: number = position.leftPos - this.fireRoundSpeed;
      if (newLeftPos >= 0) {
        this.fireRoundsFired[index].move({
          topPos: position.topPos,
          leftPos: newLeftPos,
        });
      } else {
        this.removeFiredRound(index);
      }
    }
  }

  public removeFiredRound(index: number): void {
    if (this.fireRoundsFired[index] !== undefined) {
      this.fireRoundsFired[index].remove();
      this.fireRoundsFired.splice(index, 1);
    }
  }

  public getFireRoundsFired(): FireRound[] {
    return this.fireRoundsFired;
  }

  public getFireRoundsAvailable(): FireRound[] {
    return this.fireRoundsAvailable;
  }

  public getFireRoundsCapacity(): number {
    return this.fireRoundsCapacity;
  }

  public getReloading(): boolean {
    return this.reloading;
  }

  public getFireRoundSpeed(): number {
    return this.fireRoundSpeed;
  }
}

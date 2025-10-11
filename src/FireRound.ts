import type DomUi from './DomUi';
import GameElement, { type GameElementPosition } from './GameElement';

export default class FireRound {
  private readonly element: GameElement;

  constructor(ui: DomUi) {
    this.element = new GameElement(ui, 'div', 10, 48, 'airplaneFireRound');
  }

  public fire(position: GameElementPosition): void {
    this.move(position);
  }

  public move(position: GameElementPosition): void {
    this.element.move(position);
  }

  public getElement(): GameElement {
    return this.element;
  }

  public getPosition(): GameElementPosition {
    return this.element.getPosition();
  }

  public remove(): void {
    this.element.remove();
  }

  public getHeight(): number {
    return this.element.getImgH();
  }
}

import type DomUi from './DomUi';

export type GameElementPosition = {
  topPos: number;
  leftPos: number;
}

export default class GameElement {
  private readonly htmlElement: HTMLElement;
  private position: GameElementPosition = {
    topPos: 0,
    leftPos: 0,
  };

  constructor(
    private readonly ui: DomUi,
    elementType: string,
    private readonly imgH: number,
    private readonly imgL: number,
    cssClassName: string,
    id?: string,
  ) {
    this.htmlElement = this.ui.createHtmlElement(elementType);
    if (id !== undefined) {
      this.ui.htmlElementAttribute(this.htmlElement, 'id', id);
    }
    this.ui
      .htmlElementAttribute(this.htmlElement, 'class', cssClassName)
      .htmlElementStyle(
        this.htmlElement,
        'height',
        this.imgH.toString().concat('px'),
      )
      .htmlElementStyle(
        this.htmlElement,
        'width',
        this.imgL.toString().concat('px'),
      )
      .htmlElementStyle(this.htmlElement, 'top', '0px')
      .htmlElementStyle(
        this.htmlElement,
        'left',
        '-'.concat(this.imgL.toString()).concat('px'),
      );
  }

  public getImgH(): number {
    return this.imgH;
  }

  public getImgL(): number {
    return this.imgL;
  }

  public getHtmlElement(): HTMLElement {
    return this.htmlElement;
  }

  public move(position: GameElementPosition): void {
    this.position = position;
    this.ui.htmlElementMove(
      this.getHtmlElement(),
      this.position.topPos,
      this.position.leftPos,
    );
  }

  public getPosition(): GameElementPosition {
    return this.position;
  }

  public remove(): void {
    this.ui.htmlElementRemove(this.getHtmlElement());
  }
}

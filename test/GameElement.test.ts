import { beforeAll, describe, expect, jest, test } from '@jest/globals';
import DomUi from '../src/DomUi';
import GameElement, { GameElementPosition } from '../src/GameElement';
import { JSDOM } from 'jsdom';
jest.mock('../src/DomUi');

let ui: DomUi;
let dom: JSDOM;
let htmlElement: HTMLElement;

beforeAll(() => {
  ui = new DomUi();
  dom = new JSDOM();
  htmlElement = dom.window.document.createElement('div');
  jest.spyOn(ui, 'createHtmlElement').mockReturnValue(htmlElement);
  jest.spyOn(ui, 'htmlElementAttribute').mockReturnValue(ui);
  jest.spyOn(ui, 'htmlElementStyle').mockReturnValue(ui);
});

describe('Game Element', () => {
  test('Propeties are defined and default values set', () => {
    const f = new GameElement(ui, 'div', 40, 80, 'class', 'id');
    expect(f.getImgH()).toBe(40);
    expect(f.getImgL()).toBe(80);
    expect(f.getHtmlElement()).toBeInstanceOf(dom.window.HTMLElement);
    expect(f.getHtmlElement()).toBe(htmlElement);
    const position: GameElementPosition = { topPos: 0, leftPos: 0 };
    expect(f.getPosition()).toMatchObject(position);
  });

  test('Move', () => {
    const htmlElementMoveMock = jest.spyOn(ui, 'htmlElementMove');
    const f = new GameElement(ui, 'div', 40, 80, 'class', 'id');
    const position: GameElementPosition = { topPos: 120, leftPos: 230 };
    f.move(position);
    expect(htmlElementMoveMock).toHaveBeenCalledTimes(1);
    expect(htmlElementMoveMock).toHaveBeenCalledWith(
      htmlElement,
      position.topPos,
      position.leftPos,
    );
    expect(f.getPosition()).toMatchObject(position);
  });

  test('Remove', () => {
    const htmlElementRemoveMock = jest.spyOn(ui, 'htmlElementRemove');
    const f = new GameElement(ui, 'div', 40, 80, 'class', 'id');
    f.remove();
    expect(htmlElementRemoveMock).toHaveBeenCalledTimes(1);
    expect(htmlElementRemoveMock).toHaveBeenCalledWith(htmlElement);
  });
});

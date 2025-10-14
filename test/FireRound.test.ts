import { beforeAll, describe, expect, jest, test } from '@jest/globals';
import DomUi from '../src/DomUi';
import FireRound from '../src/FireRound';
import GameElement, { GameElementPosition } from '../src/GameElement';
jest.mock('../src/GameElement');
jest.mock('../src/DomUi');

let ui: DomUi;

beforeAll(() => {
  ui = new DomUi();
  jest.spyOn(GameElement.prototype, 'getImgH').mockReturnValue(48);
  const position: GameElementPosition = { topPos: 0, leftPos: 0 };
  jest.spyOn(GameElement.prototype, 'getPosition').mockReturnValue(position);
});

describe('Fire Round', () => {
  test('Propeties are defined and default values set', () => {
    const f = new FireRound(ui);
    expect(f.getElement()).toBeInstanceOf(GameElement);
    expect(f.getHeight()).toBe(48);
    const position: GameElementPosition = { topPos: 0, leftPos: 0 };
    expect(f.getPosition()).toMatchObject(position);
  });

  test('Move', () => {
    const position: GameElementPosition = { topPos: 100, leftPos: 200 };
    jest.spyOn(GameElement.prototype, 'getPosition').mockReturnValue(position);
    const f = new FireRound(ui);
    f.move(position);
    expect(f.getPosition()).toMatchObject(position);
  });

  test('Fire', () => {
    const position: GameElementPosition = { topPos: 300, leftPos: 240 };
    jest.spyOn(GameElement.prototype, 'getPosition').mockReturnValue(position);
    const f = new FireRound(ui);
    f.fire(position);
    expect(f.getPosition()).toMatchObject(position);
  });

  test('Remove', () => {
    const removeMock = jest.spyOn(GameElement.prototype, 'remove');
    const f = new FireRound(ui);
    f.remove();
    expect(removeMock).toHaveBeenCalledTimes(1);
  });
});

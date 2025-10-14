import { beforeAll, describe, expect, jest, test } from '@jest/globals';
import DomUi from '../src/DomUi';
import Explosion from '../src/Explosion';
import GameElement from '../src/GameElement';
jest.mock('../src/GameElement');
jest.mock('../src/DomUi');

let ui: DomUi;

beforeAll(() => {
  ui = new DomUi();
});

describe('Explosion', () => {
  test('Propeties are defined and default values set', () => {
    const gameElementMoveMock = jest.spyOn(GameElement.prototype, 'move');
    const e = new Explosion(ui, 200, 500);
    expect(e.getElement()).toBeInstanceOf(GameElement);
    expect(gameElementMoveMock).toHaveBeenCalledTimes(1);
  });

  test('Remove', () => {
    const removeMock = jest.spyOn(GameElement.prototype, 'remove');
    const e = new Explosion(ui, 200, 500);
    e.remove();
    expect(removeMock).toHaveBeenCalledTimes(1);
  });
});

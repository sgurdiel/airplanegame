import {
  describe,
  expect,
  test,
  jest,
  afterEach,
  beforeAll,
} from '@jest/globals';
import MissileHydrogen from '../src/MissileHydrogen';
import { Missile } from '../src/Missile';
import DomUi from '../src/DomUi';
jest.mock('../src/DomUi');
jest.mock('../src/GameElement');

let ui: DomUi;
const repaintRatePerSecond: number = 50;

beforeAll(() => {
  ui = new DomUi();
  jest.spyOn(ui, 'randomTopPos').mockImplementation(() => 400);
});

afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks();
  jest.resetAllMocks();
});

describe('Missile Hydrogen', () => {
  test('Missile propeties are defined and default values set', () => {
    const m = new MissileHydrogen(ui);
    expect(m).toBeInstanceOf(Missile);
    expect(m.getDestructionScore()).toBe(100);
    expect(m.getHitsTillDestruction()).toBe(1);
  });

  test('Moves', () => {
    const m = new MissileHydrogen(ui);
    const pixelsToDisplace = Math.round(m.getSpeed() / repaintRatePerSecond);
    let leftPos = m.getLeftPos() + pixelsToDisplace;
    m.move(repaintRatePerSecond);
    expect(m.getLeftPos()).toBe(leftPos);
    leftPos += pixelsToDisplace;
    m.move(repaintRatePerSecond);
    expect(m.getLeftPos()).toBe(leftPos);
  });

  test('Takes one hit to destruction', () => {
    const m = new MissileHydrogen(ui);
    m.receiveImpact();
    expect(m.getHitsTillDestruction()).toBe(0);
  });
});

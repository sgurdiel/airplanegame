import {
  describe,
  expect,
  test,
  jest,
  beforeAll,
  afterEach,
} from '@jest/globals';
import MissileAtomic from '../src/MissileAtomic';
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

describe('Missile Atomic', () => {
  test('test missile propeties are defined and default values set', () => {
    const m = new MissileAtomic(ui);
    expect(m).toBeInstanceOf(Missile);
    expect(m.getDestructionScore()).toBe(1000);
    expect(m.getHitsTillDestruction()).toBe(3);
  });

  test('Test atomic missile moves', () => {
    const m = new MissileAtomic(ui);
    const pixelsToDisplace = Math.round(m.getSpeed() / repaintRatePerSecond);
    let leftPos = m.getLeftPos() + pixelsToDisplace;
    m.move(repaintRatePerSecond);
    expect(m.getLeftPos()).toBe(leftPos);
    leftPos += pixelsToDisplace;
    m.move(repaintRatePerSecond);
    expect(m.getLeftPos()).toBe(leftPos);
  });

  test('Takes multiple hits to destruction', () => {
    const m = new MissileAtomic(ui);
    let hitsTillDestruction = m.getHitsTillDestruction();
    for (let index = 0; index < hitsTillDestruction; index++) {
      m.receiveImpact();
      hitsTillDestruction--;
      expect(m.getHitsTillDestruction()).toBe(hitsTillDestruction);
    }
  });
});

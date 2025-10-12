import {
  describe,
  expect,
  test,
  jest,
  afterEach,
  beforeEach,
} from '@jest/globals';
import Enemy from '../src/Enemy';
import DomUi from '../src/DomUi';
import MissileHydrogen from '../src/MissileHydrogen';
import MissileAtomic from '../src/MissileAtomic';
jest.mock('../src/DomUi');
jest.mock('../src/GameElement');
jest.mock('../src/Missile');
jest.mock('../src/MissileHydrogen');
jest.mock('../src/MissileAtomic');

let ui: DomUi;
const repaintRatePerSecond: number = 50;
const millisencondSinceLastPaint: number = 20; // 1000 / repaintRatePerSecond

beforeEach(() => {
  ui = new DomUi();
  jest
    .spyOn(ui, 'getRepaintRatePerSecond')
    .mockReturnValue(repaintRatePerSecond);
});

afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks();
  jest.resetAllMocks();
});

describe('Enemy', () => {
  test('Propeties are defined and default values set', () => {
    const e = new Enemy(ui);
    expect(e.getMissilesFired().length).toBe(0);
    expect(e.getTimeTillNextMissileHydrogen()).toBe(
      e.getMissileHydrogenReloadTime(),
    );
    expect(e.getTimeTillNextMissileAtomic()).toBe(
      e.getMissileAtomicReloadTime(),
    );
  });

  test('Missiles launch countdown is reduced on every screen repaint', () => {
    const e = new Enemy(ui);
    e.attack();
    expect(e.getTimeTillNextMissileHydrogen()).toBe(
      e.getMissileHydrogenReloadTime() - millisencondSinceLastPaint,
    );
    expect(e.getTimeTillNextMissileAtomic()).toBe(
      e.getMissileAtomicReloadTime() - millisencondSinceLastPaint,
    );
    e.attack();
    expect(e.getTimeTillNextMissileHydrogen()).toBe(
      e.getMissileHydrogenReloadTime() - millisencondSinceLastPaint * 2,
    );
    expect(e.getTimeTillNextMissileAtomic()).toBe(
      e.getMissileAtomicReloadTime() - millisencondSinceLastPaint * 2,
    );
  });

  test('MissileHydrogen is launched when countdown ends', () => {
    const e = new Enemy(ui);
    expect(e.getMissilesFired().length).toBe(0);
    const loopCount =
      e.getMissileHydrogenReloadTime() / millisencondSinceLastPaint;
    for (let i = 0; i < loopCount; i++) {
      e.attack();
    }
    expect(e.getMissilesFired().length).toBe(1);
    expect(e.getMissilesFired()[0]).toBeInstanceOf(MissileHydrogen);
    expect(e.getTimeTillNextMissileHydrogen()).toBe(
      e.getMissileHydrogenReloadTime(),
    );
  });

  test('MissileAtomic is launched when countdown ends', () => {
    const e = new Enemy(ui);
    expect(
      e.getMissilesFired().filter((item) => {
        return item instanceof MissileAtomic;
      }).length,
    ).toBe(0);
    const loopCount =
      e.getMissileAtomicReloadTime() / millisencondSinceLastPaint;
    for (let i = 0; i < loopCount; i++) {
      e.attack();
    }
    expect(
      e.getMissilesFired().filter((item) => {
        return item instanceof MissileAtomic;
      }).length,
    ).toBe(1);
    expect(
      e.getMissilesFired().filter((item) => {
        return item instanceof MissileAtomic;
      })[0],
    ).toBeInstanceOf(MissileAtomic);
    expect(e.getTimeTillNextMissileAtomic()).toBe(
      e.getMissileAtomicReloadTime(),
    );
  });
});

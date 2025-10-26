import { describe, expect, jest, beforeEach, test } from '@jest/globals';
import { ExplosionDom } from '../../../../../src/Hit/Infrastructure/Dom/ExplosionDom';
import { ScreenElementDimensionDom } from '../../../../../src/IO/Infrastructure/Dom/ScreenElementDimensionDom';
import { ScreenElementPositionDom } from '../../../../../src/IO/Infrastructure/Dom/ScreenElementPositionDom';
import { ScreenElementDom } from '../../../../../src/IO/Infrastructure/Dom/ScreenElementDom';

jest.mock('../../../../../src/IO/Infrastructure/Dom/ScreenElementDom');

describe('ExplosionDom', () => {
  let explosion: ExplosionDom;
  let missileDimension: ScreenElementDimensionDom;
  let missilePosition: ScreenElementPositionDom;

  beforeEach(() => {
    missileDimension = new ScreenElementDimensionDom(10, 20);
    missilePosition = new ScreenElementPositionDom(100, 200);
    explosion = new ExplosionDom('1', missileDimension, missilePosition);
  });

  test('should create a screen element', () => {
    expect(ScreenElementDom).toHaveBeenCalledTimes(1);
  });

  test('should set the position of the screen element', () => {
    const screenElementInstance = (ScreenElementDom as jest.Mock).mock.instances[0] as ScreenElementDom;
    const expectedX = Math.round(missilePosition.getPositionX() + (missileDimension.getWidth() - 44));
    const expectedY = Math.round(missilePosition.getPositionY() - missileDimension.getHeight());
    expect(screenElementInstance.setPosition).toHaveBeenCalledTimes(1);
    expect(screenElementInstance.setPosition).toHaveBeenCalledWith(expectedX, expectedY);
  });

  test('should get the screen element', () => {
    expect(explosion.getScreenElement()).toBeInstanceOf(ScreenElementDom);
  });

  test('should decrease the time visible on animate', () => {
    const initialTimeVisible = explosion.getTimeVisible();
    explosion.animate(100);
    expect(explosion.getTimeVisible()).toBe(initialTimeVisible - 100);
  });

  test('should get the time visible', () => {
    expect(explosion.getTimeVisible()).toBe(300);
  });
});

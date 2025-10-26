import { describe, expect, jest, beforeEach, test } from '@jest/globals';
import { FireRoundDom } from '../../../../../src/Player/Infrastucture/Dom/FireRoundDom';
import { ScreenElementDom } from '../../../../../src/IO/Infrastructure/Dom/ScreenElementDom';
import { ScreenElementPositionDom } from '../../../../../src/IO/Infrastructure/Dom/ScreenElementPositionDom';
import { ScreenElementDimensionDom } from '../../../../../src/IO/Infrastructure/Dom/ScreenElementDimensionDom';

jest.mock('../../../../../src/IO/Infrastructure/Dom/ScreenElementDom');

describe('FireRoundDom', () => {
  let fireRoundDom: FireRoundDom;
  let screenElement: ScreenElementDom;
  let position: ScreenElementPositionDom;
  let dimension: ScreenElementDimensionDom;

  beforeEach(() => {
    fireRoundDom = new FireRoundDom(1, 200, 300);
    screenElement = (ScreenElementDom as jest.Mock).mock.instances[0] as ScreenElementDom;
    position = new ScreenElementPositionDom(200, 300);
    dimension = new ScreenElementDimensionDom(13, 50);
    
    jest.spyOn(screenElement, 'getPosition').mockReturnValue(position);
    jest.spyOn(screenElement, 'getDimension').mockReturnValue(dimension);
  });

  test('should create a screen element with the correct parameters', () => {
    expect(ScreenElementDom).toHaveBeenCalledWith(
      'sprite',
      'fireround1',
      13,
      50,
      0,
      72,
      'destination-over'
    );
    expect(screenElement.setPosition).toHaveBeenCalledWith(200, 300);
  });

  test('should animate the fire round by updating its position', () => {
    const repaintRatePerSecond = 60;
    const initialX = position.getPositionX();
    const speed = 800;
    const expectedX = initialX - Math.round(speed / repaintRatePerSecond);

    fireRoundDom.animate(repaintRatePerSecond);

    expect(screenElement.setPosition).toHaveBeenCalledWith(expectedX, position.getPositionY());
  });

  test('should get the screen element', () => {
    expect(fireRoundDom.getScreenElement()).toBe(screenElement);
  });

  test('should destroy the fire round by moving it off-screen', () => {
    const width = dimension.getWidth();
    const expectedX = Math.round(0 - width);

    fireRoundDom.destroy();

    expect(screenElement.setPosition).toHaveBeenCalledWith(expectedX, position.getPositionY());
  });

  test('should set the position of the screen element', () => {
    fireRoundDom.setPosition(400, 500);
    expect(screenElement.setPosition).toHaveBeenCalledWith(400, 500);
  });
});

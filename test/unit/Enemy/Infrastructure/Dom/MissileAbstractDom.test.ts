import { describe, expect, jest, beforeEach, test } from '@jest/globals';
import { ScreenElementDimensionDom } from '../../../../../src/IO/Infrastructure/Dom/ScreenElementDimensionDom';
import { ScreenElementDom } from '../../../../../src/IO/Infrastructure/Dom/ScreenElementDom';
import { ScreenElementPositionDom } from '../../../../../src/IO/Infrastructure/Dom/ScreenElementPositionDom';
import { MissileAbstractDom } from '../../../../../src/Enemy/Infrastructure/Dom/MissileAbstractDom';

// Mock dependencies
jest.mock('../../../../../src/IO/Infrastructure/Dom/ScreenElementDom');
jest.mock('../../../../../src/IO/Infrastructure/Dom/ScreenElementPositionDom');
jest.mock('../../../../../src/IO/Infrastructure/Dom/ScreenElementDimensionDom');

// Concrete class for testing the abstract class
class TestMissileDom extends MissileAbstractDom {}

describe('MissileAbstractDom', () => {
  const domId = 'missile-1';
  const elementId = 'missile-element-1';
  const missileHeight = 20;
  const missileWidth = 50;
  const spriteX = 0;
  const spriteY = 0;
  const screenHeight = 800;
  const speed = 160;
  const destructionScore = 100;
  const hitsTillDestruction = 2;

  let missile: TestMissileDom;
  let mockScreenElement: jest.Mocked<ScreenElementDom>;
  let mockPosition: jest.Mocked<ScreenElementPositionDom>;
  let mockDimension: jest.Mocked<ScreenElementDimensionDom>;

  beforeEach(() => {
    // Clear mocks before each test
    (ScreenElementDom as jest.Mock).mockClear();
    (ScreenElementPositionDom as jest.Mock).mockClear();
    (ScreenElementDimensionDom as jest.Mock).mockClear();

    // Setup mock instances and their return values
    mockPosition = new ScreenElementPositionDom(0, 0) as jest.Mocked<ScreenElementPositionDom>;
    mockDimension = new ScreenElementDimensionDom(0, 0) as jest.Mocked<ScreenElementDimensionDom>;

    // Mock methods for dimension
    mockDimension.getWidth.mockReturnValue(missileWidth);
    mockDimension.getHeight.mockReturnValue(missileHeight);

    // Mock methods for position
    mockPosition.getPositionX.mockReturnValue(100);
    mockPosition.getPositionY.mockReturnValue(200);

    // Setup the main mock for ScreenElementDom
    // We need to do this to mock the constructor and instance methods
    mockScreenElement = {
      setPosition: jest.fn(),
      getPosition: jest.fn().mockReturnValue(mockPosition),
      getDimension: jest.fn().mockReturnValue(mockDimension),
    } as any;

    (ScreenElementDom as jest.Mock).mockImplementation(() => mockScreenElement);

    missile = new TestMissileDom(
      domId,
      elementId,
      missileHeight,
      missileWidth,
      spriteX,
      spriteY,
      screenHeight,
      speed,
      destructionScore,
      hitsTillDestruction,
    );
  });

  describe('constructor', () => {
    test('should create a ScreenElementDom with correct parameters', () => {
      expect(ScreenElementDom).toHaveBeenCalledWith(
        domId,
        elementId,
        missileHeight,
        missileWidth,
        spriteX,
        spriteY,
        'destination-over',
      );
    });

    test('should set an initial random position within screen bounds', () => {
      // The constructor calls setPosition. We check that it was called.
      // The y-position is random, so we check that it's called with any number.
      expect(mockScreenElement.setPosition).toHaveBeenCalled();
      const [x, y] = (mockScreenElement.setPosition as jest.Mock).mock.calls[0];
      expect(x).toBe(0 - missileWidth);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(screenHeight - missileHeight);
    });
  });

  describe('animate', () => {
    test('should update the missile position based on speed and repaint rate', () => {
      const repaintRatePerSecond = 60;
      const initialX = 100;
      const initialY = 200;
      mockPosition.getPositionX.mockReturnValue(initialX);
      mockPosition.getPositionY.mockReturnValue(initialY);

      missile.animate(repaintRatePerSecond);

      const expectedXIncrement = Math.round(speed / repaintRatePerSecond);
      expect(mockScreenElement.setPosition).toHaveBeenCalledWith(
        initialX + expectedXIncrement,
        initialY,
      );
    });
  });

  describe('getters and setters', () => {
    test('should return the screen element', () => {
      expect(missile.getScreenElement()).toBe(mockScreenElement);
    });

    test('should set the position on the screen element', () => {
      missile.setPosition(50, 60);
      expect(mockScreenElement.setPosition).toHaveBeenCalledWith(50, 60);
    });

    test('should return the position from the screen element', () => {
      expect(missile.getPosition()).toBe(mockPosition);
    });

    test('should return the dimension from the screen element', () => {
      expect(missile.getDimension()).toBe(mockDimension);
    });

    test('should return the destruction score', () => {
      expect(missile.getDestructionScore()).toBe(destructionScore);
    });
  });

  describe('hit and destruction logic', () => {
    test('should not be destroyed initially', () => {
      expect(missile.destroyed()).toBe(false);
    });

    test('should decrement hitsTillDestruction when takeHit is called', () => {
      missile.takeHit();
      expect(missile.destroyed()).toBe(false); // hitsTillDestruction was 2
    });

    test('should be destroyed when hitsTillDestruction reaches zero', () => {
      missile.takeHit();
      missile.takeHit();
      expect(missile.destroyed()).toBe(true);
    });
  });

  describe('damageAnnounce', () => {
    test('should return true when damage is pending and missile is not destroyed', () => {
      expect(missile.damageAnnounce()).toBe(true);
    });

    test('should return false after unsetDamageAnnounce is called', () => {
      missile.unsetDamageAnnounce();
      expect(missile.damageAnnounce()).toBe(false);
    });

    test('should return false if the missile is destroyed, even if damage is pending', () => {
      // Destroy the missile
      missile.takeHit();
      missile.takeHit();

      expect(missile.destroyed()).toBe(true);
      expect(missile.damageAnnounce()).toBe(false);
    });

    test('should return false if damage is not pending and missile is not destroyed', () => {
      missile.unsetDamageAnnounce();
      expect(missile.damageAnnounce()).toBe(false);
    });
  });

  describe('unsetDamageAnnounce', () => {
    test('should set pendingDamageAnnouncement to false', () => {
      expect(missile.damageAnnounce()).toBe(true); // Initially true
      missile.unsetDamageAnnounce();
      expect(missile.damageAnnounce()).toBe(false); // Now false
    });
  });
});

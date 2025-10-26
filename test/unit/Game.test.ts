import { describe, expect, jest, beforeEach, test } from '@jest/globals';
import Game from '../../src/Game';
import { PlayerControlsDom } from '../../src/IO/Infrastructure/Dom/PlayerControlsDom';
import { ScreenDom } from '../../src/IO/Infrastructure/Dom/ScreenDom';
import { DashboardDom } from '../../src/IO/Infrastructure/Dom/Dashboard/DashboardDom';
import { EnemyDom } from '../../src/Enemy/Infrastructure/Dom/EnemyDom';
import { PlayerDom } from '../../src/Player/Infrastucture/Dom/PlayerDom';
import { MenuDom } from '../../src/IO/Infrastructure/Dom/MenuDom';
import { HitDom } from '../../src/Hit/Infrastructure/Dom/HitDom';

jest.mock('../../src/IO/Infrastructure/Dom/PlayerControlsDom');
jest.mock('../../src/IO/Infrastructure/Dom/ScreenDom');
jest.mock('../../src/IO/Infrastructure/Dom/Dashboard/DashboardDom');
jest.mock('../../src/Enemy/Infrastructure/Dom/EnemyDom');
jest.mock('../../src/Player/Infrastucture/Dom/PlayerDom');
jest.mock('../../src/IO/Infrastructure/Dom/MenuDom');
jest.mock('../../src/Hit/Infrastructure/Dom/HitDom');

describe('Game', () => {
  beforeEach(() => {
    window.requestAnimationFrame = jest.fn(() => 0);
    new Game();
  });

  test('should create instances of its dependencies', () => {
    expect(PlayerDom).toHaveBeenCalledTimes(1);
    expect(EnemyDom).toHaveBeenCalledTimes(1);
    expect(DashboardDom).toHaveBeenCalledTimes(1);
    expect(ScreenDom).toHaveBeenCalledTimes(1);
    expect(HitDom).toHaveBeenCalledTimes(1);
    expect(MenuDom).toHaveBeenCalledTimes(1);
    expect(PlayerControlsDom).toHaveBeenCalledTimes(1);
  });

  test('should call requestAnimationFrame on instantiation', () => {
    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);
  });

  test('should call animate on screen and dashboard when animation frame is called', () => {
    (PlayerControlsDom.prototype.animateScreen as jest.Mock).mockReturnValue(true);
    (MenuDom.prototype.gameOverDisplayed as jest.Mock).mockReturnValue(false);
    const animate = (window.requestAnimationFrame as jest.Mock).mock.calls[0][0] as (time: number) => void;
    animate(0);
    expect(ScreenDom.prototype.animate).toHaveBeenCalledTimes(1);
    expect(DashboardDom.prototype.animate).toHaveBeenCalledTimes(1);
    expect(MenuDom.prototype.animate).toHaveBeenCalledTimes(1);
    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(2);
  });

  test('should stop requesting animation frames when game has ended', () => {
    (MenuDom.prototype.gameOverDisplayed as jest.Mock).mockReturnValue(true);
    (PlayerControlsDom.prototype.animateScreen as jest.Mock).mockReturnValue(true);
    const animate = (window.requestAnimationFrame as jest.Mock).mock.calls[0][0] as (time: number) => void;
    animate(16);
    // Only the initial requestAnimationFrame from constructor should have been called
    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);
  });

  test('should compute timing and pass correct values to screen, dashboard and menu', () => {
    (PlayerControlsDom.prototype.animateScreen as jest.Mock).mockReturnValue(true);
    (PlayerControlsDom.prototype.getGameInitiated as jest.Mock).mockReturnValue(true);
    (DashboardDom.prototype.getPaused as jest.Mock).mockReturnValue(false);
    (PlayerDom.prototype.defeated as jest.Mock).mockReturnValue(false);

    const animate = (window.requestAnimationFrame as jest.Mock).mock.calls[0][0] as (time: number) => void;
    // timestamp 100 => msSinceLast = 100, rate = 1000 / 100 = 10
    animate(100);

    expect(ScreenDom.prototype.animate).toHaveBeenCalledWith(10, 100);
    expect(DashboardDom.prototype.animate).toHaveBeenCalledWith(true, 100);
    expect(MenuDom.prototype.animate).toHaveBeenCalledWith(100, true, true, false, false);
  });

    test('should not call screen.animate when controls.animateScreen returns false but still call dashboard.animate', () => {
      (PlayerControlsDom.prototype.animateScreen as jest.Mock).mockReturnValue(false);

      const animate = (window.requestAnimationFrame as jest.Mock).mock.calls[0][0] as (time: number) => void;
      animate(50);

      expect(ScreenDom.prototype.animate).not.toHaveBeenCalled();
      expect(DashboardDom.prototype.animate).toHaveBeenCalledWith(false, 50);
      expect(MenuDom.prototype.animate).toHaveBeenCalledTimes(1);
    });
});

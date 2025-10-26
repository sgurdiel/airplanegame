import { describe, expect, beforeEach, afterEach, test } from '@jest/globals';
import { DashboardRadarDom } from '../../../../../../src/IO/Infrastructure/Dom/Dashboard/DashboardRadarDom';
import { PlayerDom } from '../../../../../../src/Player/Infrastucture/Dom/PlayerDom';
import { EnemyDom } from '../../../../../../src/Enemy/Infrastructure/Dom/EnemyDom';
import { MissileAtomicDom } from '../../../../../../src/Enemy/Infrastructure/Dom/MissileAtomicDom';
import { Dom } from '../../../../../../src/IO/Infrastructure/Dom/Dom';
import { resetDocument } from '../../../../../DomDocumentInit';
import { BaseDom } from '../../../../../../src/Player/Infrastucture/Dom/BaseDom';

jest.mock('../../../../../../src/Player/Infrastucture/Dom/PlayerDom');
jest.mock('../../../../../../src/Enemy/Infrastructure/Dom/EnemyDom'); 

describe('DashboardRadarDom', () => {
    let dashboardRadar: DashboardRadarDom;
    let dom: Dom;
    let player: PlayerDom;
    let enemy: EnemyDom;
    let radarImg: HTMLElement;
    let radarMsg: HTMLElement;

    beforeEach(() => {        
        radarImg = document.getElementById('radarImg') as HTMLElement;
        radarMsg = document.getElementById('radarMsg') as HTMLElement;

        player = new PlayerDom() as jest.Mocked<PlayerDom>;
        enemy = new EnemyDom() as jest.Mocked<EnemyDom>;
        dom = new Dom();

        dashboardRadar = new DashboardRadarDom(player, enemy, dom);
    });

    afterEach(() => {
        resetDocument();
        jest.clearAllMocks();
    });

    test('should construct without errors when elements exist', () => {
        expect(() => new DashboardRadarDom(player, enemy, dom)).not.toThrow();
    });

    test('should throw error when radar image element is missing', () => {
        document.body.removeChild(radarImg);
        expect(() => new DashboardRadarDom(player, enemy, dom)).toThrow("Fatal: non existent element with id 'radarImg'");
    });

    test('should throw error when radar message element is missing', () => {
        document.body.removeChild(radarMsg);
        expect(() => new DashboardRadarDom(player, enemy, dom)).toThrow("Fatal: non existent element with id 'radarMsg'");
    });

    test('should detect atomic missiles when screen is animated', () => {
        const missileAtomic = new MissileAtomicDom('missileA1', 500);
        
        enemy.getLaunchedMissiles = jest.fn().mockReturnValue([missileAtomic]);

        const base = {
            radarAnnounce: jest.fn().mockReturnValue(false)
        } as unknown as BaseDom;

        player.getBase = jest.fn().mockReturnValue(base);
        
        dashboardRadar.animate(true, 10);
        
        expect(radarImg.style.getPropertyValue('visibility')).toBe('visible');
        expect(radarMsg.innerHTML).toBe('<p>ATOMIC MISILE APPROACHING</p>');
    });

    test('should handle base hit when player is defeated', () => {
        const position = '100px -100px';
        const message = 'test-message';
        const base = {
            radarAnnounce: jest.fn().mockReturnValue(true),
            unsetRadarAnnounce: jest.fn(),
            getSpritePosition: jest.fn().mockReturnValue(position),
            getRadarMessage: jest.fn().mockReturnValue(message)
        };
        
        player.defeated = jest.fn().mockReturnValue(true);
        player.getBase = jest.fn().mockReturnValue(base);
        
        radarImg.style.backgroundPosition = '0px 0px';
        dashboardRadar.animate(false, 100);
        
        expect(base.unsetRadarAnnounce).toHaveBeenCalled();
        expect(radarImg.style.visibility).toBe('visible');
        expect(radarImg.style.backgroundPosition).toBe(position);
        expect(radarMsg.innerHTML).toBe(message);
    });

    test('should clear display after timeout', () => {
        const missileAtomic = new MissileAtomicDom('missileA1', 500);
        
        enemy.getLaunchedMissiles = jest.fn().mockReturnValue([missileAtomic]);

        const base = {
            radarAnnounce: jest.fn().mockReturnValue(false)
        } as unknown as BaseDom;

        player.getBase = jest.fn().mockReturnValue(base);
        
        dashboardRadar.animate(true, 200);
        dashboardRadar.animate(true, 2000);
        
        expect(radarImg.style.getPropertyValue('visibility')).toBe('hidden');
        expect(radarMsg.innerHTML).toBe('');
    });

    test('should return correct pause state', () => {
        expect(dashboardRadar.getPaused()).toBe(false);
        
        const base = {
            radarAnnounce: jest.fn().mockReturnValue(true),
            unsetRadarAnnounce: jest.fn(),
            getSpritePosition: jest.fn(),
            getRadarMessage: jest.fn()
        };
        player.getBase = jest.fn().mockReturnValue(base);
        player.defeated = jest.fn().mockReturnValue(true);
        
        dashboardRadar.animate(false, 100);
        expect(dashboardRadar.getPaused()).toBe(true);
    });

    test('should not process base hit when screen is not animated and player is not defeated', () => {
        const base = {
            radarAnnounce: jest.fn().mockReturnValue(true),
        } as unknown as BaseDom;
        
        player.defeated = jest.fn().mockReturnValue(false);
        player.getBase = jest.fn().mockReturnValue(base);
        
        dashboardRadar.animate(false, 100);
        
        expect(base.radarAnnounce).not.toHaveBeenCalled();
    });

    test('should process base hit when screen is animated and player is not defeated', () => {
        const base = {
            radarAnnounce: jest.fn().mockReturnValue(true),
            unsetRadarAnnounce: jest.fn(),
            getSpritePosition: jest.fn(),
            getRadarMessage: jest.fn()
        } as unknown as BaseDom;
        
        player.defeated = jest.fn().mockReturnValue(false);
        player.getBase = jest.fn().mockReturnValue(base);
        enemy.getLaunchedMissiles = jest.fn().mockReturnValue([]);        
        
        dashboardRadar.animate(true, 100);
        
        expect(base.radarAnnounce).toHaveBeenCalled();
    });

    describe('displayActivationControl', () => {
        beforeEach(() => {
            const missileAtomic = new MissileAtomicDom('missileA1', 500);
            enemy.getLaunchedMissiles = jest.fn().mockReturnValue([missileAtomic]);
            const base = { radarAnnounce: jest.fn().mockReturnValue(false) } as unknown as BaseDom;
            player.getBase = jest.fn().mockReturnValue(base);
            dashboardRadar.animate(true, 0);
        });

        test('should decrease timeout when display is activated and screen is animated', () => {
            const initialTimeout = (dashboardRadar as any).displayDeactivationTimeout;
            dashboardRadar.animate(true, 100);
            expect((dashboardRadar as any).displayDeactivationTimeout).toBeLessThan(initialTimeout);
        });

        test('should not decrease timeout when display is activated, screen not animated, and not paused', () => {
            const initialTimeout = (dashboardRadar as any).displayDeactivationTimeout;
            dashboardRadar.animate(false, 100);
            expect((dashboardRadar as any).displayDeactivationTimeout).toBe(initialTimeout);
        });

        test('should decrease timeout when display is activated, screen not animated, and paused', () => {
            const base = {
                radarAnnounce: jest.fn().mockReturnValue(true),
                unsetRadarAnnounce: jest.fn(),
                getSpritePosition: jest.fn(),
                getRadarMessage: jest.fn()
            };
            player.getBase = jest.fn().mockReturnValue(base);
            player.defeated = jest.fn().mockReturnValue(true);
            const displayClearSpy = jest.spyOn(dashboardRadar as any, 'displayClear');
            const initialTimeout = (dashboardRadar as any).displayDeactivationTimeout;
            dashboardRadar.animate(false, 0);
            dashboardRadar.animate(false, initialTimeout);
            expect((dashboardRadar as any).displayDeactivationTimeout).toBe(initialTimeout);
            expect(displayClearSpy).toHaveBeenCalled();
        });

        test('should call displayClear when timeout reaches zero', () => {
            const initialTimeout = (dashboardRadar as any).displayDeactivationTimeout;
            const displayClearSpy = jest.spyOn(dashboardRadar as any, 'displayClear');
            dashboardRadar.animate(true, initialTimeout + 1);
            expect(displayClearSpy).toHaveBeenCalled();
        });
    });
});
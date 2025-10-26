import { describe, expect, beforeEach, afterEach, test, jest } from '@jest/globals';
import { DashboardDom } from '../../../../../../src/IO/Infrastructure/Dom/Dashboard/DashboardDom';
import { PlayerDom } from '../../../../../../src/Player/Infrastucture/Dom/PlayerDom';
import { EnemyDom } from '../../../../../../src/Enemy/Infrastructure/Dom/EnemyDom';
import { resetDocument } from '../../../../../DomDocumentInit';
import { DashboardMagazineDom } from '../../../../../../src/IO/Infrastructure/Dom/Dashboard/DashboardMagazineDom';
import { DashboardRadarDom } from '../../../../../../src/IO/Infrastructure/Dom/Dashboard/DashboardRadarDom';
import { DashboardScoreDom } from '../../../../../../src/IO/Infrastructure/Dom/Dashboard/DashboardScoreDom';

jest.mock('../../../../../../src/IO/Infrastructure/Dom/Dashboard/DashboardMagazineDom');
jest.mock('../../../../../../src/IO/Infrastructure/Dom/Dashboard/DashboardRadarDom');
jest.mock('../../../../../../src/IO/Infrastructure/Dom/Dashboard/DashboardScoreDom');

describe('DashboardDom', () => {
    let player: PlayerDom;
    let enemy: EnemyDom;

    beforeEach(() => {
        resetDocument();
        player = new PlayerDom() as jest.Mocked<PlayerDom>;
        enemy = new EnemyDom() as jest.Mocked<EnemyDom>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('constructor should initialize dashboard components', () => {
        new DashboardDom(player, enemy);
        expect(DashboardMagazineDom).toHaveBeenCalledWith(player, expect.any(Object));
        expect(DashboardRadarDom).toHaveBeenCalledWith(player, enemy, expect.any(Object));
        expect(DashboardScoreDom).toHaveBeenCalledWith(player, expect.any(Object));
    });

    test('animate should call animate on all dashboard components', () => {
        const dashboard = new DashboardDom(player, enemy);
        const animateScreen = true;
        const milliseconds = 16;

        dashboard.animate(animateScreen, milliseconds);

        const magazineInstance = (DashboardMagazineDom as jest.Mock).mock.instances[0] as DashboardMagazineDom;
        const radarInstance = (DashboardRadarDom as jest.Mock).mock.instances[0] as DashboardRadarDom;
        const scoreInstance = (DashboardScoreDom as jest.Mock).mock.instances[0] as DashboardScoreDom;

        expect(magazineInstance.animate).toHaveBeenCalledWith(animateScreen);
        expect(radarInstance.animate).toHaveBeenCalledWith(animateScreen, milliseconds);
        expect(scoreInstance.animate).toHaveBeenCalled();
    });

    test('getPaused should return the value from dashboardRadar', () => {
        const dashboard = new DashboardDom(player, enemy);
        const radarInstance = (DashboardRadarDom as jest.Mock).mock.instances[0] as DashboardRadarDom;
        const getPausedSpy = jest.spyOn(radarInstance, 'getPaused').mockReturnValue(true);

        const isPaused = dashboard.getPaused();

        expect(isPaused).toBe(true);
        expect(getPausedSpy).toHaveBeenCalled();
    });
});

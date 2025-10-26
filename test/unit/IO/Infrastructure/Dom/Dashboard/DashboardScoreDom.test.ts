import { describe, expect, beforeEach, afterEach, test } from '@jest/globals';
import { DashboardScoreDom } from '../../../../../../src/IO/Infrastructure/Dom/Dashboard/DashboardScoreDom';
import { PlayerDom } from '../../../../../../src/Player/Infrastucture/Dom/PlayerDom';
import { Dom } from '../../../../../../src/IO/Infrastructure/Dom/Dom';
import { resetDocument } from '../../../../../DomDocumentInit';

describe('DashboardScoreDom', () => {
    let scoreElement: HTMLElement;
    let playerMock: PlayerDom;
    let dom: Dom;

    beforeEach(() => {
        scoreElement = document.getElementById('score') as HTMLElement;

        // Mock PlayerDom
        playerMock = {
            getScrore: jest.fn()
        } as unknown as PlayerDom;

        dom = new Dom();
    });

    afterEach(() => {
        resetDocument();
        jest.clearAllMocks();
    });

    test('should update scoreElement.innerHTML when score changes', () => {
        (playerMock.getScrore as jest.Mock).mockReturnValue(42);
        scoreElement.innerHTML = '1';

        const dashboardScoreDom = new DashboardScoreDom(playerMock, dom);
        dashboardScoreDom.animate();

        expect(scoreElement.innerHTML).toBe('42');
    });

    test('should not update scoreElement.innerHTML if score is unchanged', () => {
        (playerMock.getScrore as jest.Mock).mockReturnValue(100);
        scoreElement.innerHTML = '100';

        const dashboardScoreDom = new DashboardScoreDom(playerMock, dom);
        dashboardScoreDom.animate();

        expect(scoreElement.innerHTML).toBe('100');
    });

    test('should throw error if score element is missing', () => {
        document.body.removeChild(scoreElement);

        expect(() => new DashboardScoreDom(playerMock, dom)).toThrow(
            "Fatal: non existent element with id 'score'"
        );
    });
});
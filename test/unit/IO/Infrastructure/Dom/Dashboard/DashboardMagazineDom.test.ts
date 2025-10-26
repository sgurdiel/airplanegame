import { describe, expect, beforeEach, afterEach, test } from '@jest/globals';
import { DashboardMagazineDom } from '../../../../../../src/IO/Infrastructure/Dom/Dashboard/DashboardMagazineDom';
import { AirplaneAbstractDom } from '../../../../../../src/Player/Infrastucture/Dom/AirplaneAbstractDom';
import { PlayerDom } from '../../../../../../src/Player/Infrastucture/Dom/PlayerDom';
import { Dom } from '../../../../../../src/IO/Infrastructure/Dom/Dom';

describe('DashboardMagazineDom', () => {
    let magazinesContainer: HTMLElement;
    let dom: Dom;
    let player: PlayerDom;
    let airplanes: AirplaneAbstractDom[];

    beforeEach(() => {
        // Setup DOM
        magazinesContainer = document.createElement('div');
        magazinesContainer.id = 'menuRounds';
        document.body.appendChild(magazinesContainer);

        // Mock Dom
        dom = {
            getElementById: jest.fn((id: string) => {
                if (id === 'menuRounds') return magazinesContainer;
                return null;
            }),
        } as unknown as Dom;

        // Mock AirplaneAbstractDom
        airplanes = [
            { getAvailableFireRounds: jest.fn(() => 5) } as unknown as AirplaneAbstractDom,
            { getAvailableFireRounds: jest.fn(() => 0) } as unknown as AirplaneAbstractDom,
            { getAvailableFireRounds: jest.fn(() => 2) } as unknown as AirplaneAbstractDom,
        ];

        // Mock PlayerDom
        player = {
            getAirplanes: jest.fn(() => airplanes),
        } as unknown as PlayerDom;
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('should initialize magazine displays for each airplane', () => {
        new DashboardMagazineDom(player, dom);
        expect(magazinesContainer.children.length).toBe(airplanes.length);
        for (let i = 0; i < airplanes.length; i++) {
            expect(magazinesContainer.querySelector(`#magazine${i}`)).not.toBeNull();
        }
    });

    test('should display correct fire rounds and reloading status', () => {
        const dashboard = new DashboardMagazineDom(player, dom);
        dashboard.animate(true);

        expect(magazinesContainer.children[0].innerHTML).toBe('Fire rounds: 5');
        expect(magazinesContainer.children[1].innerHTML).toBe('RELOADING...');
        expect(magazinesContainer.children[2].innerHTML).toBe('Fire rounds: 2');
    });

    test('should not update innerHTML if value is unchanged', () => {
        const dashboard = new DashboardMagazineDom(player, dom);
        dashboard.animate(true);

        // Set innerHTML to expected value
        magazinesContainer.children[0].innerHTML = 'Fire rounds: 5';
        magazinesContainer.children[1].innerHTML = 'RELOADING...';
        magazinesContainer.children[2].innerHTML = 'Fire rounds: 2';

        // Spy on innerHTML setter
        const setSpy = jest.spyOn(magazinesContainer.children[0], 'innerHTML', 'set');
        dashboard.animate(true);
        expect(setSpy).not.toHaveBeenCalled();
        setSpy.mockRestore();
    });

    test('should not call magazineDisplay if animateScreen is false', () => {
        const dashboard = new DashboardMagazineDom(player, dom);
        const spy = jest.spyOn<any, any>(dashboard as any, 'magazineDisplay');
        dashboard.animate(false);
        expect(spy).not.toHaveBeenCalled();
        spy.mockRestore();
    });
});
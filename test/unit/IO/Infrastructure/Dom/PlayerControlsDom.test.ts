import { describe, expect, beforeEach, afterEach, test } from '@jest/globals';
import { PlayerControlsDom } from '../../../../../src/IO/Infrastructure/Dom/PlayerControlsDom';
import { resetDocument } from '../../../../DomDocumentInit';

describe('PlayerControlsDom', () => {
    let canvas: HTMLCanvasElement;
    let screen: any;
    let player: any;
    let dashboard: any;
    let controls: PlayerControlsDom;
    let startBtn: HTMLElement;

    beforeEach(() => {
        canvas = document.getElementById('game') as HTMLCanvasElement;
        canvas.getBoundingClientRect = jest.fn(() => ({
            width: 300,
            height: 150,
            top: 10,
            left: 0,
            bottom: 0,
            right: 0,
            x: 0,
            y: 0,
            toJSON: () => {},
        })) as unknown as () => DOMRect;

        // mocks for screen, player, dashboard
        screen = {
            getCanvas: () => canvas,
            getPaused: jest.fn(() => false),
        };

        player = {
            fly: jest.fn(),
            fire: jest.fn(),
            defeated: jest.fn(() => false),
        };

        dashboard = {
            getPaused: jest.fn(() => false),
        };

        // attach a start button to DOM for mousedown target testing
        startBtn = document.createElement('div');
        startBtn.id = 'gameStartButton';
        document.body.appendChild(startBtn);

        controls = new PlayerControlsDom(screen, player, dashboard);
        jest.clearAllMocks(); // clear the initial constructor fly call so tests start clean where needed
    });

    afterEach(() => {
        resetDocument();
        jest.clearAllMocks();
    });

    test('constructor calls player.fly with initial canvas center', () => {
        // recreate to observe constructor call
        const canvas2 = document.createElement('canvas');
        (canvas2 as any).getBoundingClientRect = jest.fn(() => ({
            width: 300,
            height: 150,
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            x: 0,
            y: 0,
            toJSON: () => {},
        })) as unknown as () => DOMRect;
        const screen2 = { getCanvas: () => canvas2, getPaused: jest.fn(() => false) };
        const player2 = { fly: jest.fn(), fire: jest.fn(), defeated: jest.fn(() => false) };
        const dashboard2 = { getPaused: jest.fn(() => false) };

        // instantiate and assert
        new PlayerControlsDom(screen2 as any, player2 as any, dashboard2 as any);
        expect(player2.fly).toHaveBeenCalledWith(300, Math.round(150 / 2), 150);
    });

    test('mousedown on #gameStartButton sets gameInitiated', () => {
        // dispatch mousedown on the start button
        startBtn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        expect(controls.getGameInitiated()).toBe(true);
    });

    test('mousedown elsewhere calls player.fire when animateScreen is true', () => {
        // start the game
        startBtn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        // ensure animateScreen conditions satisfied (mocks already set to not paused / not defeated)
        player.fire.mockClear();
        // dispatch mousedown on body (not start button)
        document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        expect(player.fire).toHaveBeenCalled();
    });

    test('keydown "Shift" triggers player.fire when animateScreen is true', () => {
        // start the game
        startBtn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        player.fire.mockClear();
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift' }));
        expect(player.fire).toHaveBeenCalled();
    });

    test('keydown "p" toggles userRequestedPause and animateScreen respects it', () => {
        // start the game
        startBtn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        // initially should be animating
        expect(controls.animateScreen()).toBe(true);

        // press 'p' to pause
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'p' }));
        expect(controls.animateScreen()).toBe(false);

        // press 'p' again to unpause
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'p' }));
        expect(controls.animateScreen()).toBe(true);
    });

    test('mousemove on canvas calls player.fly with computed y when animateScreen is true', () => {
        // start the game
        startBtn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        player.fly.mockClear();

        // simulate mousemove: pageY = top + 42 -> y = 42
        const pageY = 10 + 42; // canvas.getBoundingClientRect().top is 10 in beforeEach
        canvas.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientY: pageY }));

        expect(player.fly).toHaveBeenCalledWith(300, 42, 150);
    });
});
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
    let helpButton: HTMLElement;

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

        startBtn = document.createElement('div');
        startBtn.id = 'gameStartButton';
        document.body.appendChild(startBtn);

        helpButton = document.getElementById('helpButton') as HTMLElement;

        controls = new PlayerControlsDom(screen, player, dashboard);
        jest.clearAllMocks();
    });

    afterEach(() => {
        resetDocument();
        jest.clearAllMocks();
    });

    test('constructor calls player.fly with initial canvas center', () => {
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

        new PlayerControlsDom(screen2 as any, player2 as any, dashboard2 as any);
        expect(player2.fly).toHaveBeenCalledWith(300, Math.round(150 / 2), 150);
    });

    test('mousedown on #gameStartButton sets gameInitiated', () => {
        startBtn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        expect(controls.getGameInitiated()).toBe(true);
    });

    test('mousedown on #helpButton pauses animation', () => {
        startBtn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

        helpButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

        expect(controls.animateScreen()).toBe(false);
    });

    test('mousedown on #helpCloseButton unpauses animation', () => {
        startBtn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        helpButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

        const helpCloseButton = document.createElement('a');
        helpCloseButton.id = 'helpCloseButton';
        document.body.appendChild(helpCloseButton);

        helpCloseButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

        expect(controls.animateScreen()).toBe(true);
    });

    test('mousedown elsewhere calls player.fire when animateScreen is true', () => {
        startBtn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        player.fire.mockClear();
        document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        expect(player.fire).toHaveBeenCalled();
    });

    test('keydown "Shift" triggers player.fire when animateScreen is true', () => {
        startBtn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        player.fire.mockClear();
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift' }));
        expect(player.fire).toHaveBeenCalled();
    });

    test('keydown "p" toggles userRequestedPause', () => {
        startBtn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        expect(controls.animateScreen()).toBe(true);

        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'p' }));
        expect(controls.animateScreen()).toBe(false);

        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'p' }));
        expect(controls.animateScreen()).toBe(true);
    });

    test('mousemove on canvas calls player.fly with computed y when animateScreen is true', () => {
        startBtn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        player.fly.mockClear();

        const pageY = 10 + 42;
        canvas.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientY: pageY }));

        expect(player.fly).toHaveBeenCalledWith(300, 42, 150);
    });
});

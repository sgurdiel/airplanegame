import { describe, expect, beforeEach, afterEach, test } from '@jest/globals';
import { MenuDom } from '../../../../../src/IO/Infrastructure/Dom/MenuDom';
import { resetDocument } from '../../../../DomDocumentInit';

describe('MenuDom', () => {
    let menu: MenuDom;
    let overlay: HTMLElement;
    let container: HTMLElement;

    beforeEach(() => {       
        overlay = document.getElementById('infoOverlay') as HTMLElement;
        container = document.getElementById('infoContainer') as HTMLElement;

        menu = new MenuDom();
    });

    afterEach(() => {
        resetDocument();
    });

    test('constructor shows welcome menu (PLAY) and makes overlay visible', () => {
        expect(container.innerHTML).toContain('PLAY');
        expect(overlay.style.visibility).toBe('visible');
    });

    test('animate with gameInitiated closes the welcome menu (hides overlay)', () => {
        // ensure welcome is open initially
        expect(overlay.style.visibility).toBe('visible');

        menu.animate(16, true, true, false, false);
        expect(overlay.style.visibility).toBe('hidden');
    });

    test('pause is shown when animateScreen is false and resumes when animateScreen becomes true', () => {
        // close welcome first to allow pause to trigger
        menu.closeMenu();
        expect(overlay.style.visibility).toBe('hidden');

        // trigger pause
        menu.animate(16, false, false, false, false);
        expect(container.innerHTML).toContain('PAUSED');
        expect(overlay.style.visibility).toBe('visible');

        // resume (animateScreen true) should close the pause menu
        menu.animate(16, false, true, false, false);
        expect(overlay.style.visibility).toBe('hidden');
    });

    test('game over menu is displayed after delay when defeated is true', () => {
        // hide any existing menu
        menu.closeMenu();
        expect(overlay.style.visibility).toBe('hidden');

        // call animate with defeated true three times using 1000ms to reach the 3000ms delay
        menu.animate(1000, false, true, false, true);
        expect(menu.gameOverDisplayed()).toBe(false);
        expect(overlay.style.visibility).toBe('hidden');

        menu.animate(1000, false, true, false, true);
        expect(menu.gameOverDisplayed()).toBe(false);
        expect(overlay.style.visibility).toBe('hidden');

        // final call should reach the threshold and show the game over menu
        menu.animate(1000, false, true, false, true);
        expect(menu.gameOverDisplayed()).toBe(true);
        expect(container.innerHTML).toContain('GAME OVER');
        expect(container.innerHTML).toContain('PLAY AGAIN');
        expect(overlay.style.visibility).toBe('visible');
    });
});
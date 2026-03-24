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
        expect(overlay.style.visibility).toBe('visible');

        menu.animate(16, true, true, false, false);
        expect(overlay.style.visibility).toBe('hidden');
    });

    test('pause menu shows updated controls table and close button', () => {
        menu.closeMenu();

        menu.animate(16, false, false, false, false);

        expect(container.innerHTML).toContain('Help Menu');
        expect(container.innerHTML).toContain('<th>Controls</th>');
        expect(container.innerHTML).toContain('<th>Description</th>');
        expect(container.innerHTML).toContain('<td>Shift key or left mouse click</td>');
        expect(container.innerHTML).toContain('<td>Fire missile</td>');
        expect(container.innerHTML).toContain('<td>P key</td>');
        expect(container.innerHTML).toContain('<td>Pause/unpause</td>');
        expect(container.innerHTML).toContain('<td>Mouse move</td>');
        expect(container.innerHTML).toContain('<td>Move airplane</td>');
        expect(container.innerHTML).not.toContain('Arrow up key');
        expect(container.innerHTML).not.toContain('Arrow down key');
        expect(container.innerHTML).toContain('helpCloseButton');
        expect(overlay.style.visibility).toBe('visible');
    });

    test('pause menu closes when animateScreen becomes true', () => {
        menu.closeMenu();
        menu.animate(16, false, false, false, false);

        menu.animate(16, false, true, false, false);

        expect(overlay.style.visibility).toBe('hidden');
    });

    test('game over menu is displayed after delay when defeated is true', () => {
        menu.closeMenu();
        expect(overlay.style.visibility).toBe('hidden');

        menu.animate(1000, false, true, false, true);
        expect(menu.gameOverDisplayed()).toBe(false);
        expect(overlay.style.visibility).toBe('hidden');

        menu.animate(1000, false, true, false, true);
        expect(menu.gameOverDisplayed()).toBe(false);
        expect(overlay.style.visibility).toBe('hidden');

        menu.animate(1000, false, true, false, true);
        expect(menu.gameOverDisplayed()).toBe(true);
        expect(container.innerHTML).toContain('GAME OVER');
        expect(container.innerHTML).toContain('PLAY AGAIN');
        expect(overlay.style.visibility).toBe('visible');
    });
});

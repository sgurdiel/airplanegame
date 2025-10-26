import { describe, expect, jest, beforeEach, afterEach, test } from '@jest/globals';
import { ScreenDom } from '../../../../../src/IO/Infrastructure/Dom/ScreenDom';
import { PlayerDom } from '../../../../../src/Player/Infrastucture/Dom/PlayerDom';
import { EnemyDom } from '../../../../../src/Enemy/Infrastructure/Dom/EnemyDom';
import { HitDom } from '../../../../../src/Hit/Infrastructure/Dom/HitDom';
import { ScreenElementDom } from '../../../../../src/IO/Infrastructure/Dom/ScreenElementDom';
import { SpriteCordsDom } from '../../../../../src/IO/Infrastructure/Dom/SpriteCordsDom';
import { ScreenElementDimensionDom } from '../../../../../src/IO/Infrastructure/Dom/ScreenElementDimensionDom';
import { ScreenElementPositionDom } from '../../../../../src/IO/Infrastructure/Dom/ScreenElementPositionDom';
import { resetDocument } from '../../../../DomDocumentInit';

jest.mock('../../../../../src/Player/Infrastucture/Dom/PlayerDom');
jest.mock('../../../../../src/Enemy/Infrastructure/Dom/EnemyDom'); 
jest.mock('../../../../../src/Hit/Infrastructure/Dom/HitDom');
jest.mock('../../../../../src/IO/Infrastructure/Dom/ScreenElementDom');

describe('ScreenDom', () => {
    let screen: ScreenDom;
    let player: jest.Mocked<PlayerDom>;
    let enemy: jest.Mocked<EnemyDom>;
    let hit: jest.Mocked<HitDom>;
    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D;

    beforeEach(() => {
        canvas = document.getElementById('game') as HTMLCanvasElement;
        context = {
            drawImage: jest.fn(),
            reset: jest.fn(),
        } as unknown as CanvasRenderingContext2D;
        jest.spyOn(canvas, 'getContext').mockReturnValue(context);

        player = new PlayerDom() as jest.Mocked<PlayerDom>;
        enemy = new EnemyDom() as jest.Mocked<EnemyDom>;
        hit = new HitDom(player, enemy) as jest.Mocked<HitDom>;

        screen = new ScreenDom(player, enemy, hit);
    });

    afterEach(() => {
        resetDocument();
        jest.clearAllMocks();
    });

    test('should initialize and return canvas', () => {
        expect(screen.getCanvas()).toBe(canvas);
    });

    test.each([
        {w: 1032, h: 759},
        {w:1031, h: 760}
    ])('should pause game when window is resized below minimum dimensions', ({w, h}) => {
        Object.defineProperty(window, 'innerHeight', { value: h });
        Object.defineProperty(window, 'innerWidth', { value: w });
        
        window.dispatchEvent(new Event('resize'));
        
        expect(screen.getPaused()).toBe(true);
    });

    test('should unpause game when window gains focus', () => {
        screen['pause'] = true;
        window.dispatchEvent(new Event('focus'));
        expect(screen.getPaused()).toBe(false);
    });

    test('should pause game when window loses focus', () => {
        screen['pause'] = false;
        window.dispatchEvent(new Event('blur'));
        expect(screen.getPaused()).toBe(true);
    });

    test('should animate screen elements', () => {
        const screenElement = new ScreenElementDom('sprite', 'screenelement', 32, 32, 0, 0);
        jest.spyOn(screenElement, 'getLoaded').mockReturnValue(true);
        jest.spyOn(screenElement, 'getSpriteCords').mockReturnValue(new SpriteCordsDom(0, 0));
        jest.spyOn(screenElement, 'getDimension').mockReturnValue(new ScreenElementDimensionDom(1, 1));
        jest.spyOn(screenElement, 'getPosition').mockReturnValue(new ScreenElementPositionDom(0, 0));

        player.animate.mockReturnValue([screenElement]);
        enemy.animate.mockReturnValue([screenElement]);

        screen.animate(60, 16);

        expect(player.animate).toHaveBeenCalledWith(60, 16);
        expect(enemy.animate).toHaveBeenCalledWith(60, 16, canvas.height, canvas.width);
        expect(context.drawImage).toHaveBeenCalledTimes(2);
        expect(hit.hasHits).toHaveBeenCalledWith(canvas.width);
    });

    test('should not draw if screen element graphic is not loaded', () => {
        const screenElement = new ScreenElementDom('sprite', 'screenelement', 32, 32, 0, 0);
        jest.spyOn(screenElement, 'getLoaded').mockReturnValue(false);

        player.animate.mockReturnValue([screenElement]);
        enemy.animate.mockReturnValue([screenElement]);

        screen.animate(60, 16);

        expect(player.animate).toHaveBeenCalledWith(60, 16);
        expect(enemy.animate).toHaveBeenCalledWith(60, 16, canvas.height, canvas.width);
        expect(context.drawImage).toHaveBeenCalledTimes(0);
        expect(hit.hasHits).toHaveBeenCalledWith(canvas.width);
    });
});
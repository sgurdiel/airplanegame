import { describe, expect, beforeEach, afterEach, test } from '@jest/globals';
import { ScreenElementDom } from '../../../../../src/IO/Infrastructure/Dom/ScreenElementDom';
import { ScreenElementPositionDom } from '../../../../../src/IO/Infrastructure/Dom/ScreenElementPositionDom';
import { ScreenElementDimensionDom } from '../../../../../src/IO/Infrastructure/Dom/ScreenElementDimensionDom';
import { SpriteCordsDom } from '../../../../../src/IO/Infrastructure/Dom/SpriteCordsDom';
import { resetDocument } from '../../../../DomDocumentInit';

describe('ScreenElementDom', () => {
    let screenElement: ScreenElementDom;

    beforeEach(() => {
        screenElement = new ScreenElementDom('sprite', 'image-name', 100, 200, 0, 0);
    });

    afterEach(() => {
        resetDocument
    });

    test('should initialize with correct values', () => {
        expect(screenElement.getLoaded()).toBe(false);
        expect(screenElement.getGraphic()).not.toBe(document.getElementById('sprite'));
        expect(screenElement.getPosition()).toBeInstanceOf(ScreenElementPositionDom);
        expect(screenElement.getDimension()).toBeInstanceOf(ScreenElementDimensionDom);
        expect(screenElement.getSpriteCords()).toBeInstanceOf(SpriteCordsDom);
        expect(screenElement.getGlobalCompositeOperation()).toBe('source-over');
    });

    test('setPosition should update x and y coordinates', () => {
        screenElement.setPosition(10, 20);
        const position = screenElement.getPosition();
        expect(position.getPositionX()).toBe(10);
        expect(position.getPositionY()).toBe(20);
    });

    test('getDimension should return correct dimensions', () => {
        const dimension = screenElement.getDimension();
        expect(dimension.getHeight()).toBe(100);
        expect(dimension.getWidth()).toBe(200);
    });

    test('getSpriteCords should return sprite coordinates', () => {
        const spriteCords = screenElement.getSpriteCords();
        expect(spriteCords.getPositionX()).toBe(0);
        expect(spriteCords.getPositionY()).toBe(0);
    });

    test('should set loaded to true when graphic loads', () => {
        expect(screenElement.getLoaded()).toBe(false);
        screenElement.getGraphic().dispatchEvent(new Event('load'));
        expect(screenElement.getLoaded()).toBe(true);
    });
});
import { describe, expect, test } from '@jest/globals';
import { ScreenElementDimensionDom } from '../../../../../src/IO/Infrastructure/Dom/ScreenElementDimensionDom';

describe('ScreenElementDimensionDom', () => {
    test.each([
        { x: 42, y:  56},
        { x: 1, y:  1},
    ])('returns position passed to the constructor ', ({x, y}) => {
        const cords = new ScreenElementDimensionDom(x, y);
        expect(cords.getHeight()).toBe(x);
        expect(cords.getWidth()).toBe(y);
    });

    test.each([
        {x: 0, y: 1.2},
        {x: 5.6, y: 0},
    ])('throws error when not interger', ({x, y}) => {
        expect(() => { 
            new ScreenElementDimensionDom(x, y);
        }).toThrow('Fatal: provided argument is not an interger');
    });

    test.each([
        {x: -1, y: 1},
        {x: 1, y: -1},
    ])('throws error when not positive', ({x, y}) => {
        expect(() => { 
            new ScreenElementDimensionDom(x, y);
        }).toThrow('Fatal: provided argument is not positive number');
    });
});
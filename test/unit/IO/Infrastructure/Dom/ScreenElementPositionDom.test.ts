import { describe, expect, test } from '@jest/globals';
import { ScreenElementPositionDom } from '../../../../../src/IO/Infrastructure/Dom/ScreenElementPositionDom';

describe('ScreenElementPosition', () => {
    test.each([
        { x: 42, y:  56},
        { x: -42, y:  56},
        { x: 0, y:  0}
    ])('returns position passed to the constructor ', ({x, y}) => {
        const pos = new ScreenElementPositionDom(x, y);
        expect(pos.getPositionX()).toBe(x);
        expect(pos.getPositionY()).toBe(y);
    });

    test.each([
        {x: 0, y: 1.2},
        {x: 5.6, y: 0},
        {x: -1.3, y: 0},
        {x: 0, y: -4.3}
    ])('throws error when not interger in constructor', ({x, y}) => {
        expect(() => { 
            new ScreenElementPositionDom(x, y);
        }).toThrow('Fatal: provided argument is not an interger');
    });

    test.each([
        {x: 33, y: 12},
        {x: -33, y: -12},
        {x: 0, y: 0}
    ])('sets position', ({x, y}) => {
        const pos = new ScreenElementPositionDom(0, 0);
        pos.setPositionX(x);
        pos.setPositionY(y);
        expect(pos.getPositionX()).toBe(x);
        expect(pos.getPositionY()).toBe(y);
    });

    test.each([
        {x: 5.6},
        {x: -1.3},
    ])('throws error when not interger setting positionX', ({x}) => {
        const pos = new ScreenElementPositionDom(0, 0)
        expect(() => { 
            pos.setPositionX(x);
        }).toThrow('Fatal: provided argument is not an interger');
    });

    test.each([
        {y: 5.6},
        {y: -1.3},
    ])('throws error when not interger setting positionX', ({y}) => {
        const pos = new ScreenElementPositionDom(0, 0)
        expect(() => { 
            pos.setPositionY(y);
        }).toThrow('Fatal: provided argument is not an interger');
    });
});
import { describe, expect, test } from '@jest/globals';
import { SpriteCordsDom } from '../../../../../src/IO/Infrastructure/Dom/SpriteCordsDom';

describe('SpriteCordsDoms', () => {
    test.each([
        { x: 42, y:  56},
        { x: -42, y:  56},
        { x: 0, y:  0}
    ])('returns position passed to the constructor ', ({x, y}) => {
        const cords = new SpriteCordsDom(x, y);
        expect(cords.getPositionX()).toBe(x);
        expect(cords.getPositionY()).toBe(y);
    });

    test.each([
        {x: 0, y: 1.2},
        {x: 5.6, y: 0},
        {x: -1.3, y: 0},
        {x: 0, y: -4.3}
    ])('throws error when not interger', ({x, y}) => {
        expect(() => { 
            new SpriteCordsDom(x, y);
        }).toThrow('Fatal: provided argument is not an interger');
    });
});
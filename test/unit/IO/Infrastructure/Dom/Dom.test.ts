import { describe, expect, jest, beforeEach, afterEach, test } from '@jest/globals';
import { Dom } from '../../../../../src/IO/Infrastructure/Dom/Dom';
import { resetDocument } from '../../../../DomDocumentInit';

describe('Dom', () => {
    let dom: Dom;
    
    beforeEach(() => {
        dom = new Dom();
    });

    afterEach(() => {
        resetDocument();
    });

    describe('getElementById', () => {
        test('should return HTMLElement when element exists', () => {
            const mockElement = document.createElement('div');
            mockElement.id = 'test-id';
            document.body.appendChild(mockElement);
            
            const result = dom.getElementById('test-id');
            
            expect(result).toBe(mockElement);
            document.body.removeChild(mockElement);
        });

        test('should throw error when element does not exist', () => {
            expect(() => {
                dom.getElementById('non-existent-id');
            }).toThrow('Fatal: non existent element with id \'non-existent-id\'');
        });
    });

    describe('getCanvasContext2d', () => {
        test('should return CanvasRenderingContext2D when context is available', () => {
            const canvas = document.createElement('canvas');
            const mockContext = {} as CanvasRenderingContext2D;
            jest.spyOn(canvas, 'getContext').mockReturnValue(mockContext);
            
            const result = dom.getCanvasContext2d(canvas);
            
            expect(result).toBe(mockContext);
        });

        test('should throw error when context is not available', () => {
            const canvas = document.createElement('canvas');
            jest.spyOn(canvas, 'getContext').mockReturnValue(null);
            
            expect(() => {
                dom.getCanvasContext2d(canvas);
            }).toThrow('Fatal: Unable to get canvas context');
        });
    });

    describe('getCanvasById', () => {
        test('should return HTMLCanvasElement when element with id is a canvas', () => {
            const canvas = document.createElement('canvas');
            canvas.id = 'canvas-id';
            document.body.appendChild(canvas);

            const result = dom.getCanvasById('canvas-id');

            expect(result).toBe(canvas);
            document.body.removeChild(canvas);
        });

        test('should throw error when element with id is not a canvas', () => {
            const div = document.createElement('div');
            div.id = 'not-a-canvas';
            document.body.appendChild(div);

            expect(() => {
            dom.getCanvasById('not-a-canvas');
            }).toThrow('Fatal: non existent canvas with id \'not-a-canvas\'');

            document.body.removeChild(div);
        });
    });

    describe('getImageById', () => {
        it('should return the HTMLImageElement when an element with the correct ID and tag is found', () => {
            const image = document.createElement('img');
            image.id = 'test-image-id';
            document.body.appendChild(image);

            const result = dom.getImageById('test-image-id');

            expect(result).toBe(image);
            expect(result.tagName).toBe('IMG');
            document.body.removeChild(image);
        });

        it('should throw an error if the element found is not an image tag', () => {
            const div = document.createElement('div');
            div.id = 'not-an-image';
            document.body.appendChild(div);

            expect(() => {
                dom.getImageById('not-an-image');
            }).toThrow('Fatal: non existent image with id \'not-an-image\'');

            document.body.removeChild(div);
        });

        it('should throw an error if no element is found with the given ID', () => {
            const image = document.createElement('img');
            image.id = 'test-image-id';
            document.body.appendChild(image);

            // Act & Assert
            expect(() => {
                dom.getImageById('bad-id');
            }).toThrow(`Fatal: non existent element with id 'bad-id'`);
        });
    });
});
import { describe, expect, jest, test } from '@jest/globals';
import Game from '../../src/Game';

jest.mock('../../src/Game', () => {
  return jest.fn().mockImplementation(() => {
    return {};
  });
});

describe('App', () => {
  test('should create a new Game', () => {
    require('../../src/App');
    expect(Game).toHaveBeenCalledTimes(1);
  });

  test('should log errors thrown by Game', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.resetModules();
    jest.doMock('../../src/Game', () => {
      return jest.fn().mockImplementation(() => {
        throw new Error('error');
      });
    });
    require('../../src/App');
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    consoleErrorSpy.mockRestore();
  });
});

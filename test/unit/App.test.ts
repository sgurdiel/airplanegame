import { beforeEach, describe, expect, jest, test } from '@jest/globals';

describe('App', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('should create a new Game when the app boots', async () => {
    const gameConstructor = jest.fn();

    jest.doMock('../../src/Game', () => ({
      __esModule: true,
      default: gameConstructor,
    }));

    await jest.isolateModulesAsync(async () => {
      await import('../../src/App');
    });

    expect(gameConstructor).toHaveBeenCalledTimes(1);
  });

  test('should log errors thrown while creating the Game', async () => {
    const error = new Error('error');
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    jest.doMock('../../src/Game', () => ({
      __esModule: true,
      default: jest.fn(() => {
        throw error;
      }),
    }));

    await jest.isolateModulesAsync(async () => {
      await import('../../src/App');
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(error);

    consoleErrorSpy.mockRestore();
  });
});

import {expect, test, jest, describe} from "@jest/globals";
import { asyncDelay } from '../src/Helpers';

describe('asyncDelay', () => {
  jest.useFakeTimers();

  test('should resolve after the specified milliseconds', async () => {
    const milliseconds = 5000;
    const promise = asyncDelay(milliseconds);

    // At this point, the promise should be pending
    const pendingSpy = jest.fn();
    promise.then(pendingSpy);
    expect(pendingSpy).not.toHaveBeenCalled();

    // Fast-forward time
    jest.advanceTimersByTime(milliseconds);

    // Now the promise should be resolved
    const result = await promise;
    expect(result).toBe(true);
    expect(pendingSpy).toHaveBeenCalledWith(true);
  });
});
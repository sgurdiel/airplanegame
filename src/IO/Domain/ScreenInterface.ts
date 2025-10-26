export interface ScreenInterface {
  animate(
    repaintRatePerSecond: number,
    millisecondsSinceLastAnimateCall: number,
  ): void;
  getPaused(): boolean;
}

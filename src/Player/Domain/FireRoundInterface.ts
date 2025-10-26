export interface FireRoundInterface {
  animate(repaintRatePerSecond: number): void;
  setPosition(x: number, y: number): void;
  destroy(): void;
}

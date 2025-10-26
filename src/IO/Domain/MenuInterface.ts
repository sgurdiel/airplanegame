export interface MenuInterface {
  animate(
    millisecondsSinceLastAnimateCall: number,
    gameInitiated: boolean,
    canAnimate: boolean,
    isDashboardPause: boolean,
    defeated: boolean,
  ): void;
  gameOverDisplayed(): boolean;
}

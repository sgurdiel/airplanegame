import { PlayerDom } from '../../../Player/Infrastucture/Dom/PlayerDom';
import { PlayerControlsInterface } from '../../Domain/PlayerControlsInterface';
import { DashboardDom } from './Dashboard/DashboardDom';
import { Dom } from './Dom';
import { ScreenDom } from './ScreenDom';

export class PlayerControlsDom implements PlayerControlsInterface {
  private readonly canvasRect: DOMRect;
  private gameInitiated: boolean = false;
  private userRequestedPause: boolean = false;
  private readonly dom: Dom;

  constructor(
    private readonly screen: ScreenDom,
    private readonly player: PlayerDom,
    private readonly dashboard: DashboardDom,
  ) {
    this.dom = new Dom();
    this.canvasRect = this.screen.getCanvas().getBoundingClientRect();
    this.dom.addEventListener(
      this.screen.getCanvas(),
      'mousemove',
      this.mouseMoveEvent.bind(this),
    );
    this.dom.addEventListener(window, 'keydown', this.keyDownEvent.bind(this));
    this.dom.addEventListener(
      window,
      'mousedown',
      this.mouseDownEvent.bind(this),
    );
    this.player.fly(
      this.canvasRect.width,
      Math.round(this.canvasRect.height / 2),
      this.canvasRect.height,
    );
  }

  private mouseDownEvent(ev: MouseEvent): void {
    if (this.dom.assertEventTarget(ev, 'gameStartButton')) {
      this.gameInitiated = true;
      return;
    }
    this.fire();
  }

  private mouseMoveEvent(ev: MouseEvent): void {
    this.fly(Math.round(ev.pageY - this.canvasRect.top));
  }

  private keyDownEvent(ev: KeyboardEvent): void {
    if ('Shift' === ev.key) {
      this.fire();
    }
    if ('p' === ev.key) {
      this.userRequestedPause = !this.userRequestedPause;
    }
  }

  private fly(y: number): void {
    if (this.animateScreen()) {
      this.player.fly(this.canvasRect.width, y, this.canvasRect.height);
    }
  }

  private fire(): void {
    if (this.animateScreen()) {
      this.player.fire();
    }
  }

  public getGameInitiated(): boolean {
    return this.gameInitiated;
  }

  public animateScreen(): boolean {
    return (
      this.gameInitiated &&
      !this.player.defeated() &&
      !this.userRequestedPause &&
      !this.screen.getPaused() &&
      !this.dashboard.getPaused()
    );
  }
}

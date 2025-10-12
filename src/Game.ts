import Airplane from './Airplane';
import DomUi from './DomUi';
import Radar, { type RadarMsg } from './Radar';
import Enemy from './Enemy';
import { asyncDelay } from './Helpers';

export default class Game {
  private readonly ui: DomUi;
  private readonly airplane: Airplane;
  private readonly radar: Radar;
  private readonly enemy: Enemy;
  private paused: boolean = false;
  private validScreen: boolean = true;
  private ended: boolean = false;
  private gameScore: number = 0;
  private lastRepaintTimestamp: number = 0;
  private millisencondSinceLastPaint: number = 0;

  constructor() {
    this.ui = new DomUi();
    this.airplane = new Airplane(this.ui);
    this.enemy = new Enemy(this.ui);
    this.radar = new Radar(this.ui, this.airplane, this.enemy);
    this.screenSizeCheck();
    this.initUiEvents();
    this.ui.repaint(this);
  }

  private screenSizeCheck(): void {
    if (true === this.ended) {
      return;
    }
    this.validScreen = this.ui.supportedScreenSize();
    this.triggerGamePause(false === this.validScreen);
  }

  private triggerGamePause(pause: boolean): void {
    if (this.paused === pause || this.ended) {
      return;
    }
    this.paused = this.validScreen ? pause : true;
    if (false === this.paused) {
      this.airplane.move();
    }
  }

  private initUiEvents(): void {
    this.ui.moveAirplaneEvent((ev) => {
      const mouseEvent = ev as MouseEvent;
      this.ui.setMouseTop(mouseEvent.clientY);
      if (!this.paused) {
        this.airplane.move();
      }
    });
    this.ui.fireAirplaneFireRoundEvent((ev) => {
      if (!this.paused) {
        this.airplane.fireRound();
        ev.stopImmediatePropagation();
      }
    });
    this.ui.windowResizeEvent(() => {
      this.screenSizeCheck();
    });
  }

  public paintFrame(timestamp: number): void {
    this.millisencondSinceLastPaint = timestamp - this.lastRepaintTimestamp;
    this.lastRepaintTimestamp = timestamp;

    if (false === this.paused) {
      this.airplane.moveFiredRounds();
      this.enemy.attack();
      this.radar.scan();
      this.gameScore += this.radar.getIncreaseScore();
      this.ui.displayScore(this.gameScore);
      this.displayRadarMessages();
      if (this.radar.towersDestroyed()) {
        this.endGame();
      }
    }
    if (false === this.ended) {
      this.ui.repaint(this);
    }
  }

  private displayRadarMessages(): void {
    const amountMessages: number = this.radar.getMsgQueue().length;
    if (amountMessages > 0) {
      this.triggerGamePause(true);
      let timeOffset: number = 0;
      this.radar.getMsgQueue().forEach((msg: RadarMsg, index: number) => {
        if (index === 0) {
          this.ui.displayRadarMsg(msg);
        } else {
          asyncDelay(timeOffset)
            .then(() => {
              this.ui.displayRadarMsg(msg);
            })
            .catch(() => {});
        }
        timeOffset += msg.displayTime;
      });
      if (this.radar.getMsgQueue()[amountMessages - 1].displayTime > 0) {
        asyncDelay(timeOffset)
          .then(() => {
            this.ui.clearRadarMsg();
            this.triggerGamePause(false);
          })
          .catch(() => {});
      }
    }
  }

  private endGame(): void {
    this.triggerGamePause(true);
    this.ended = true;
    this.ui.displayGameEnd();
  }

  public getPaused(): boolean {
    return this.paused;
  }

  public getEnded(): boolean {
    return this.ended;
  }

  public getValidScreen(): boolean {
    return this.validScreen;
  }

  public getMillisencondSinceLastPaint(): number {
    return this.millisencondSinceLastPaint;
  }
}

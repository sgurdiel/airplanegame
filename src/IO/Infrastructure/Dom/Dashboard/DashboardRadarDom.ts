import { EnemyDom } from '../../../../Enemy/Infrastructure/Dom/EnemyDom';
import { MissileAbstractDom } from '../../../../Enemy/Infrastructure/Dom/MissileAbstractDom';
import { MissileAtomicDom } from '../../../../Enemy/Infrastructure/Dom/MissileAtomicDom';
import { PlayerDom } from '../../../../Player/Infrastucture/Dom/PlayerDom';
import { DashboardRadarInterface } from '../../../Domain/Dashboard/DashboardRadarInterface';
import { Dom } from '../Dom';

export class DashboardRadarDom implements DashboardRadarInterface {
  private readonly radarImage: HTMLElement;
  private readonly radarMsg: HTMLElement;
  private displayActivated: boolean = false;
  private readonly displayeTime: number = 2000;
  private displayDeactivationTimeout: number = this.displayeTime;
  private pause: boolean = false;

  constructor(
    private readonly player: PlayerDom,
    private readonly enemy: EnemyDom,
    private readonly dom: Dom,
  ) {
    this.radarImage = this.dom.getElementById('radarImg');
    this.radarMsg = this.dom.getElementById('radarMsg');
  }

  public animate(
    animateScreen: boolean,
    millisecondsSinceLastAnimateCall: number,
  ): void {
    this.displayActivationControl(
      animateScreen,
      millisecondsSinceLastAnimateCall,
    );
    this.atomicMissileDetection(animateScreen);
    this.baseHit(animateScreen);
  }

  public getPaused(): boolean {
    return this.pause;
  }

  private baseHit(animateScreen: boolean): void {
    if (false === animateScreen && false === this.player.defeated()) {
      return;
    }

    if (this.player.getBase().radarAnnounce()) {
      this.player.getBase().unsetRadarAnnounce();
      this.displayActivate(
        this.player.getBase().getSpritePosition(),
        this.player.getBase().getRadarMessage(),
      );
      this.pause = true;
    }
  }

  private atomicMissileDetection(animateScreen: boolean): void {
    if (false === animateScreen) {
      return;
    }

    this.enemy.getLaunchedMissiles().forEach((missile: MissileAbstractDom) => {
      if (missile instanceof MissileAtomicDom && missile.radarAnnounce()) {
        missile.unsetRadarAnnounce();
        this.displayActivate('-90px -89px', '<p>ATOMIC MISILE APPROACHING</p>');
      }
    });
  }

  private displayActivate(backgroundPosition: string, message: string): void {
    this.displayActivated = true;
    this.displayDeactivationTimeout = this.displayeTime;
    this.dom
      .htmlElementStyle(this.radarImage, 'visibility', 'visible')
      .htmlElementStyle(
        this.radarImage,
        'background-position',
        backgroundPosition,
      )
      .innerHtml(this.radarMsg, message);
  }

  private displayActivationControl(
    animateScreen: boolean,
    millisecondsSinceLastAnimateCall: number,
  ): void {
    if (
      this.displayActivated &&
      (animateScreen || (false === animateScreen && this.pause))
    ) {
      this.displayDeactivationTimeout -= millisecondsSinceLastAnimateCall;
      if (0 >= this.displayDeactivationTimeout) {
        this.displayClear();
      }
    }
  }

  private displayClear(): void {
    this.pause = false;
    this.displayActivated = false;
    this.dom
      .htmlElementStyle(this.radarImage, 'visibility', 'hidden')
      .innerHtml(this.radarMsg, '');
  }
}

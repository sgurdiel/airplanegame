import { BaseInterface } from '../../Domain/BaseInterface';

export class BaseDom implements BaseInterface {
  private health: number = 3;
  private pendingRadarAnnouncement: boolean = false;

  public applyDamage(): void {
    this.pendingRadarAnnouncement = true;
    this.health--;
  }

  public radarAnnounce(): boolean {
    return this.pendingRadarAnnouncement;
  }

  public unsetRadarAnnounce(): void {
    this.pendingRadarAnnouncement = false;
  }

  public getSpritePosition(): string {
    if (1 === this.health) {
      return '-146px -140px';
    }
    if (0 === this.health) {
      return '-90x -140px';
    }
    return '-146px -89px';
  }

  public getRadarMessage(): string {
    if (1 === this.health) {
      return '<p>BASE WILL NOT WITHSTAND FURTHER DAMAGE</p>';
    }
    if (0 === this.health) {
      return '<p>BASE DESTROYED</p>';
    }
    return '<p>BASE HAS SUFFERED DAMAGE</p>';
  }

  public getHealth(): number {
    return this.health;
  }
}

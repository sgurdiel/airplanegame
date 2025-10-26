import { MissileAtomicInterface } from '../../Domain/MissileAtomicInterface';
import { MissileAbstractDom } from './MissileAbstractDom';

export class MissileAtomicDom
  extends MissileAbstractDom
  implements MissileAtomicInterface
{
  private pendingRadarAnnouncement: boolean = true;

  constructor(id: string, screenHeight: number) {
    super(
      'sprite',
      'missileA' + id,
      50,
      77,
      114,
      34,
      screenHeight,
      100,
      400,
      3,
    );
  }

  public radarAnnounce(): boolean {
    return this.pendingRadarAnnouncement;
  }

  public unsetRadarAnnounce(): void {
    this.pendingRadarAnnouncement = false;
  }
}

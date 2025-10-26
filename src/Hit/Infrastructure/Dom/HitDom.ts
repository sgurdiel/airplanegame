import { EnemyDom } from '../../../Enemy/Infrastructure/Dom/EnemyDom';
import { MissileAbstractDom } from '../../../Enemy/Infrastructure/Dom/MissileAbstractDom';
import { AirplaneAbstractDom } from '../../../Player/Infrastucture/Dom/AirplaneAbstractDom';
import { FireRoundDom } from '../../../Player/Infrastucture/Dom/FireRoundDom';
import { PlayerDom } from '../../../Player/Infrastucture/Dom/PlayerDom';
import { HitInterface } from '../../Domain/HitInterface';

export class HitDom implements HitInterface {
  constructor(
    private readonly player: PlayerDom,
    private readonly enemy: EnemyDom,
  ) {}

  public hasHits(screenWidth: number): void {
    this.enemy.getLaunchedMissiles().forEach((missile: MissileAbstractDom) => {
      this.fireRoundHit(missile);
      this.baseHit(screenWidth, missile);
    });
  }

  private baseHit(screenWidth: number, missile: MissileAbstractDom): void {
    if (
      missile.getScreenElement().getPosition().getPositionX() >= screenWidth &&
      missile.damageAnnounce()
    ) {
      this.player.getBase().applyDamage();
      missile.unsetDamageAnnounce();
    }
  }

  private fireRoundHit(missile: MissileAbstractDom): void {
    this.player.getAirplanes().forEach((airplane: AirplaneAbstractDom) => {
      airplane.getFireRounds().forEach((fireRound: FireRoundDom) => {
        if (this.checkOverlap(fireRound, missile)) {
          fireRound.destroy();
          missile.takeHit();
          if (missile.destroyed()) {
            this.player.updateScore(missile.getDestructionScore());
          }
        }
      });
    });
  }

  private checkOverlap(
    fireRound: FireRoundDom,
    missile: MissileAbstractDom,
  ): boolean {
    const fireRoundPosition = fireRound.getScreenElement().getPosition();
    const fireRoundDimension = fireRound.getScreenElement().getDimension();
    const missilePosition = missile.getScreenElement().getPosition();
    const missileDimension = missile.getScreenElement().getDimension();
    const fireRoundRect = {
      left: fireRoundPosition.getPositionX(),
      right: fireRoundPosition.getPositionX() + fireRoundDimension.getWidth(),
      top: fireRoundPosition.getPositionY(),
      bottom: fireRoundPosition.getPositionY() + fireRoundDimension.getHeight(),
    };
    const missileRect = {
      left: missilePosition.getPositionX(),
      right: missilePosition.getPositionX() + missileDimension.getWidth(),
      top: missilePosition.getPositionY(),
      bottom: missilePosition.getPositionY() + missileDimension.getHeight(),
    };

    const hit =
      fireRoundRect.right > 0 &&
      fireRoundRect.left <= missileRect.right &&
      fireRoundRect.right >= missileRect.left &&
      fireRoundRect.top <= missileRect.bottom &&
      fireRoundRect.bottom >= missileRect.top;

    return hit;
  }
}

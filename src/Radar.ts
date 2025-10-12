import type Airplane from './Airplane';
import type DomUi from './DomUi';
import type Enemy from './Enemy';
import Explosion from './Explosion';
import { asyncDelay } from './Helpers';
import MissileAtomic from './MissileAtomic';

export interface RadarMsg {
  displayTime: number;
  msg: string;
  image: string;
}

export default class Radar {
  private readonly explosionDuration: number = 500;
  private readonly displayTime: number = 4000;
  private increaseScore: number = 0;
  private towerImpacted: boolean = false;
  private towerImpacts: number = 0;
  private readonly maxTowerImpacts: number = 4;
  private msgQueue: RadarMsg[] = [];

  constructor(
    private readonly ui: DomUi,
    private readonly airplane: Airplane,
    private readonly enemy: Enemy,
  ) {}

  public scan(): void {
    this.msgQueue = [];
    this.increaseScore = 0;
    this.towerImpacted = false;
    for (let index = 0; index < this.enemy.getMissilesFired().length; index++) {
      if (
        this.enemy.getMissilesFired()[index] instanceof MissileAtomic &&
        !this.enemy.getMissilesFired()[index].getRadarDetected()
      ) {
        this.msgQueue.push({
          displayTime: this.getDisplayTime(),
          msg: 'ATOMIC MISILE APPROACHING',
          image: '/img/radaron.gif',
        });
        this.enemy.getMissilesFired()[index].setRadarDetected();
      } else if (
        !this.checkMissileDetruction(index) &&
        this.enemy.getMissilesFired()[index].move(this.ui.getRepaintRatePerSecond()) >=
          this.ui.getMaxLeftPosGaimingContainer()
      ) {
        this.towerImpact(index);
      }
    }
  }

  private checkMissileDetruction(missileIndex: number): boolean {
    for (
      let index = 0;
      index < this.airplane.getFireRoundsFired().length;
      index++
    ) {
      if (
        this.airplane.getFireRoundsFired()[index].getPosition().topPos >=
          this.enemy.getMissilesFired()[missileIndex].getTopPos() -
            this.airplane.getFireRoundsFired()[index].getHeight() &&
        this.airplane.getFireRoundsFired()[index].getPosition().topPos <
          this.enemy.getMissilesFired()[missileIndex].getTopPos() +
            this.enemy.getMissilesFired()[missileIndex].getHeight() &&
        this.airplane.getFireRoundsFired()[index].getPosition().leftPos <=
          this.enemy.getMissilesFired()[missileIndex].getLeftPos() +
            this.enemy.getMissilesFired()[missileIndex].getLength()
      ) {
        this.airplane.removeFiredRound(index);
        if (this.enemy.getMissilesFired()[missileIndex].receiveImpact() === 0) {
          this.missileExplosion(missileIndex);
          return true;
        }
        break;
      }
    }
    return false;
  }

  private towerImpact(missileIndex: number): void {
    this.removeMissile(missileIndex);
    this.towerImpacted = true;
    this.towerImpacts++;
    let radarMsg: string = '';
    let imageSrc: string = '';
    switch (this.towerImpacts) {
      case 1:
        imageSrc = '/img/M17466.jpg';
        radarMsg =
          '<span style="color:yellow">TOWERS HAVE SUFFERED DAMAGE</span>';
        break;
      case 2:
        imageSrc = '/img/M17467.jpg';
        radarMsg =
          '<span style="color:orange">TOWERS SUFFER SEVERE DAMAGE</span>';
        break;
      case 3:
        imageSrc = '/img/M17491.jpg';
        radarMsg =
          '<span style="color:lightred">TOWERS WILL NOT WITHSTAND FURTHER DAMAGE</span>';
        break;
      default:
        this.msgQueue = [];
        imageSrc = '/img/M17491.jpg';
        radarMsg =
          '<span style="color:lightred">TOWERS DESTROYED RETURN TO BASE</span>';
        break;
    }
    this.msgQueue.push({
      displayTime: this.towerImpacts !== 4 ? this.getDisplayTime() : 0,
      msg: radarMsg,
      image: imageSrc,
    });
  }

  private removeMissile(missileIndex: number): void {
    this.enemy.getMissilesFired()[missileIndex].remove();
    this.enemy.getMissilesFired().splice(missileIndex, 1);
  }

  private missileExplosion(missileIndex: number): void {
    const explosion = new Explosion(
      this.ui,
      this.enemy.getMissilesFired()[missileIndex].getTopPos(),
      this.enemy.getMissilesFired()[missileIndex].getLeftPos() +
        Math.round(this.enemy.getMissilesFired()[missileIndex].getLength() / 2),
    );
    this.ui.appendGameElement(explosion.getElement());
    this.increaseScore += this.enemy
      .getMissilesFired()
      [missileIndex].getDestructionScore();
    this.removeMissile(missileIndex);
    asyncDelay(this.explosionDuration)
      .then(() => {
        explosion.remove();
      })
      .catch(() => {});
  }

  public getDisplayTime(): number {
    return this.displayTime;
  }

  public getIncreaseScore(): number {
    return this.increaseScore;
  }

  public getMsgQueue(): RadarMsg[] {
    return this.msgQueue;
  }

  public towersDestroyed(): boolean {
    return this.towerImpacted && this.towerImpacts === this.maxTowerImpacts;
  }
}

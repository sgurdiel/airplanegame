import type DomUi from './DomUi';
import { type Missile } from './Missile';
import MissileAtomic from './MissileAtomic';
import MissileHydrogen from './MissileHydrogen';

export default class Enemy {
  private readonly missilesFired: Missile[] = [];
  private readonly missileHydrogenReloadTime: number = 1500;
  private readonly missileAtomicReloadTime: number = 15000;
  private timeTillNextMissileHydrogen: number = this.missileHydrogenReloadTime;
  private timeTillNextMissileAtomic: number = this.missileAtomicReloadTime;

  constructor(private readonly ui: DomUi) {}

  public attack(): void {
    this.timeTillNextMissileHydrogen -= Math.round(
      1000 / this.ui.getRepaintRatePerSecond(),
    );
    this.timeTillNextMissileAtomic -= Math.round(
      1000 / this.ui.getRepaintRatePerSecond(),
    );
    if (this.timeTillNextMissileHydrogen <= 0) this.fireMissileHydrogen();
    if (this.timeTillNextMissileAtomic <= 0) this.fireMissileAtomic();
  }

  private fireMissileHydrogen(): void {
    const missileHydrogen = new MissileHydrogen(this.ui);
    this.getMissilesFired().push(missileHydrogen);
    this.ui.appendGameElement(missileHydrogen.getElement());
    this.timeTillNextMissileHydrogen = this.missileHydrogenReloadTime;
  }

  private fireMissileAtomic(): void {
    const missileAtomic = new MissileAtomic(this.ui);
    this.getMissilesFired().push(missileAtomic);
    this.ui.appendGameElement(missileAtomic.getElement());
    this.timeTillNextMissileAtomic = this.missileAtomicReloadTime;
  }

  public getMissilesFired(): Missile[] {
    return this.missilesFired;
  }

  public getTimeTillNextMissileHydrogen(): number {
    return this.timeTillNextMissileHydrogen;
  }

  public getTimeTillNextMissileAtomic(): number {
    return this.timeTillNextMissileAtomic;
  }

  public getMissileHydrogenReloadTime(): number {
    return this.missileHydrogenReloadTime;
  }

  public getMissileAtomicReloadTime(): number {
    return this.missileAtomicReloadTime;
  }
}

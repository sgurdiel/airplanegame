import DomUi from "./DomUi"
import { Missile } from "./Missile"
import MissileAtomic from "./MissileAtomic"
import MissileHydrogen from "./MissileHydrogen"

export default class Enemy {
    private missilesFired: Missile[] = []
    private readonly missileHydrogenReloadTime = 1500
    private readonly missileAtomicReloadTime = 15000
    private timeTillNextMissileHydrogen: number = this.missileHydrogenReloadTime
    private timeTillNextMissileAtomic: number = this.missileAtomicReloadTime

    constructor(private ui: DomUi, private renderTimeRate: number) {
    }

    public attack(): void {
        if (this.timeTillNextMissileHydrogen <= 0) this.fireMissileHydrogen()
        if (this.timeTillNextMissileAtomic <= 0) this.fireMissileAtomic()
        this.timeTillNextMissileHydrogen -= this.renderTimeRate
        this.timeTillNextMissileAtomic -= this.renderTimeRate    
    }

    private fireMissileHydrogen(): void {
        let missileHydrogen = new MissileHydrogen(this.ui)
        this.getMissilesFired().push(missileHydrogen)
        this.ui.appendGameElement(missileHydrogen.getElement())
        this.timeTillNextMissileHydrogen = this.missileHydrogenReloadTime
    }

    private fireMissileAtomic(): void {
        let missileAtomic = new MissileAtomic(this.ui)
        this.getMissilesFired().push(missileAtomic)
        this.ui.appendGameElement(missileAtomic.getElement())
        this.timeTillNextMissileAtomic = this.missileAtomicReloadTime
    }

    public getMissilesFired(): Missile[] {
        return this.missilesFired
    }

    public getTimeTillNextMissileHydrogen(): number {
        return this.timeTillNextMissileHydrogen
    }

    public getTimeTillNextMissileAtomic(): number {
        return this.timeTillNextMissileAtomic
    }

    public getMissileHydrogenReloadTime(): number {
        return this.missileHydrogenReloadTime
    }

    public getMissileAtomicReloadTime(): number {
        return this.missileAtomicReloadTime
    }
}

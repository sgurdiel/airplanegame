import {describe, expect, test, jest, afterEach, beforeAll} from "@jest/globals";
import Enemy from "../src/Enemy"
import DomUi from "../src/DomUi"
import MissileHydrogen from "../src/MissileHydrogen"
import MissileAtomic from "../src/MissileAtomic"
jest.mock("../src/DomUi")
jest.mock("../src/GameElement")
jest.mock("../src/Missile")
jest.mock("../src/MissileHydrogen")
jest.mock("../src/MissileAtomic")

let ui: DomUi

beforeAll(() => {
    ui = new DomUi()
})

afterEach(() => {
    // restore the spy created with spyOn
    jest.restoreAllMocks()
    jest.resetAllMocks()
})

describe("Enemy", () => {
    test("Propeties are defined and default values set", () => {
        const e = new Enemy(ui, 50)
        expect(e.getMissilesFired().length).toBe(0)
        expect(e.getTimeTillNextMissileHydrogen()).toBe(e.getMissileHydrogenReloadTime())
        expect(e.getTimeTillNextMissileAtomic()).toBe(e.getMissileAtomicReloadTime())
    })

    test("Missiles launch countdown is reduced on every call to attach", () => {
        const renderTimeRate = 50
        const e = new Enemy(ui, renderTimeRate)
        e.attack()
        expect(e.getTimeTillNextMissileHydrogen()).toBe(e.getMissileHydrogenReloadTime() - renderTimeRate)
        expect(e.getTimeTillNextMissileAtomic()).toBe(e.getMissileAtomicReloadTime() - renderTimeRate)
        e.attack()
        expect(e.getTimeTillNextMissileHydrogen()).toBe(e.getMissileHydrogenReloadTime() - (renderTimeRate*2))
        expect(e.getTimeTillNextMissileAtomic()).toBe(e.getMissileAtomicReloadTime() - (renderTimeRate*2))
    })

    test("MissileHydrogen is launched when countdown ends", () => {
        const e = new Enemy(ui, 1500)
        e.attack()
        e.attack()
        expect(e.getMissilesFired().length).toBe(1)
        expect(e.getMissilesFired()[0]).toBeInstanceOf(MissileHydrogen)
        expect(e.getTimeTillNextMissileHydrogen()).toBe(e.getMissileHydrogenReloadTime() - 1500)
    })

    test("MissileAtomic is launched when countdown ends", () => {
        const e = new Enemy(ui, 15000)
        e.attack()
        e.attack()
        expect(e.getMissilesFired().filter((item) => { return item instanceof MissileAtomic }).length).toBe(1)
        expect(e.getTimeTillNextMissileAtomic()).toBe(e.getMissileAtomicReloadTime() - 15000)
    })
})

import {describe, expect, test, jest, beforeEach, afterEach, beforeAll} from "@jest/globals";
import DomUi from "../src/DomUi"
import Airplane from "../src/Airplane"
import Enemy from "../src/Enemy"
import Radar from "../src/Radar"
import MissileAtomic from "../src/MissileAtomic"
import FireRound from "../src/FireRound"
import GameElement from "../src/GameElement"
import MissileHydrogen from "../src/MissileHydrogen"
import * as Helpers from "../src/Helpers"
import { Missile } from "../src/Missile";
jest.mock("../src/DomUi")
jest.mock("../src/Airplane")
jest.mock("../src/Enemy")
jest.mock("../src/GameElement")
jest.mock("../src/Missile")
jest.mock("../src/MissileAtomic")
jest.mock("../src/MissileHydrogen")
jest.mock("../src/Explosion")
jest.mock("../src/FireRound")

let ui: DomUi
let a: Airplane
let e: Enemy

beforeEach(() => {
    ui = new DomUi()
    Object.defineProperties(ui, {
        screenHeight: { value: 800},
        maxLeftPosGaimingContainer: { value: 800}
    })
    jest.spyOn(ui, "getMaxLeftPosGaimingContainer").mockReturnValue(800)
    a = new Airplane(ui)
    e = new Enemy(ui, 50)
    //jest.spyOn(GameElement.prototype, "getPosition").mockReturnValue({topPos: 400, leftPos: 604})
})

afterEach(() => {
    // restore the spy created with spyOn
    jest.restoreAllMocks()
    jest.resetAllMocks()
})

describe("Radar", () => {
    test("Scan when no missiles", () => {
        const r = new Radar(ui, a, e)
        expect(r.getIncreaseScore()).toBe(0)
        expect(r.getMsgQueue().length).toBe(0)
        expect(r.towersDestroyed()).toBe(false)
    })

    test("Scan when MissileAtomic first detected will set game pause flag", () => {
        const ma: MissileAtomic = new MissileAtomic(ui)
        jest.spyOn(ma, "getRadarDetected").mockReturnValue(false)
        jest.spyOn(a, "getFireRoundsFired").mockReturnValue([])
        jest.spyOn(e, "getMissilesFired").mockReturnValue([ma])
        const r = new Radar(ui, a, e)
        r.scan()
        expect(r.getIncreaseScore()).toBe(0)
        expect(r.towersDestroyed()).toBe(false)
        expect(r.getMsgQueue().length).toBe(1)
    })

    test("Check MissileAtomic destruction", async () => {
        const ma = new MissileAtomic(ui)
        jest.spyOn(ma, "getRadarDetected").mockReturnValue(true)
        jest.spyOn(ma, "getTopPos").mockReturnValue(400)
        jest.spyOn(ma, "getLeftPos").mockReturnValue(400)
        jest.spyOn(ma, "getHeight").mockReturnValue(40)
        jest.spyOn(ma, "getLength").mockReturnValue(80)
        jest.spyOn(ma, "getDestructionScore").mockReturnValue(1000)
        const fr = new FireRound(ui)
        jest.spyOn(fr, "getPosition").mockReturnValue({topPos: 400, leftPos: 400})
        jest.spyOn(fr, "getHeight").mockReturnValue(10)
        jest.spyOn(a, "getFireRoundsFired").mockReturnValue([fr])
        jest.spyOn(e, "getMissilesFired").mockReturnValue([ma])
        const asyncDelayFunctionMock = jest.spyOn(Helpers, "asyncDelay").mockImplementation(() => {
            return new Promise<boolean>(resolve => { resolve(true) })
        })
        const r = new Radar(ui, a, e)
        jest.spyOn(ma, "receiveImpact").mockReturnValue(2)
        r.scan()
        expect(r.getIncreaseScore()).toBe(0)
        jest.spyOn(ma, "receiveImpact").mockReturnValue(1)
        r.scan()
        expect(r.getIncreaseScore()).toBe(0)
        await new Promise<boolean>(done => {
            jest.spyOn(ma, "receiveImpact").mockReturnValue(0)
            r.scan()
            done(true)
        })
        expect(r.getIncreaseScore()).toBe(ma.getDestructionScore())
        expect(asyncDelayFunctionMock).toHaveBeenCalledTimes(1)
    })

    test("Tower impact", () => {
        const mh = new MissileHydrogen(ui)
        jest.spyOn(mh, "move").mockReturnValue(800)
        jest.spyOn(a, "getFireRoundsFired").mockReturnValue([])
        jest.spyOn(e, "getMissilesFired").mockReturnValue([mh])
        const r = new Radar(ui, a, e)
        r.scan()
        expect(r.towersDestroyed()).toBe(false)
        expect(r.getMsgQueue().length).toBe(1)
        expect(e.getMissilesFired().length).toBe(0)
    })

    test("When towers destroyed only the tower destroy message should be present in the queue", () => {
        const ma = new MissileAtomic(ui)
        const mh = new MissileHydrogen(ui)
        jest.spyOn(mh, "move").mockReturnValue(800)
        jest.spyOn(a, "getFireRoundsFired").mockReturnValue([])
        const r = new Radar(ui, a, e)
        for (let index = 0; index < 4; index++) {
            if (index < 3) {
                jest.spyOn(e, "getMissilesFired").mockReturnValue([mh])
                r.scan()
                expect(r.getMsgQueue().length).toBe(1)
            } else {
                jest.spyOn(e, "getMissilesFired").mockReturnValue([ma, mh])
                r.scan()
                expect(r.getMsgQueue().length).toBe(1)
                expect(r.getMsgQueue()[0]).toMatchObject({displayTime: 0, msg: '<span style="color:lightred">TOWERS DESTROYED RETURN TO BASE</span>', image: "/img/M17491.jpg"})
            }
        }
    })
})

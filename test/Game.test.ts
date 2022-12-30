import {describe, expect, test, jest, afterEach, beforeAll, beforeEach} from "@jest/globals";
import Game from "../src/Game"
import DomUi from "../src/DomUi"
import Airplane from "../src/Airplane"
import { JSDOM } from "jsdom"
import Radar from "../src/Radar"
import * as Helpers from "../src/Helpers"
jest.mock("../src/DomUi")
jest.mock("../src/Airplane")
jest.mock("../src/Enemy")
jest.mock("../src/Radar")
jest.mock("../src/GameElement")
jest.spyOn(global, 'setTimeout')

let dom: JSDOM

beforeEach(() => {
    dom = new JSDOM()
    jest.spyOn(DomUi.prototype, "supportedScreenSize").mockReturnValue(true)
    jest.spyOn(Radar.prototype, "getMsgQueue").mockReturnValue([])
    jest.spyOn(Helpers, "asyncDelay").mockImplementation(() => {
        return new Promise<boolean>(done => { done(true) })
    })
})

afterEach(() => {
    // restore the spy created with spyOn
    jest.restoreAllMocks()
    jest.resetAllMocks()
})

describe("Game", () => {
    test("Propeties are defined and default values set", () => {
        const airplaneMoveMock = jest.spyOn(Airplane.prototype, "move")
        const g = new Game()
        expect(airplaneMoveMock).toHaveBeenCalledTimes(0)
        expect(g.getPaused()).toBe(false)
        expect(g.getEnded()).toBe(false)
        expect(setTimeout).toHaveBeenCalledTimes(1)
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), g.getRenderTimeRate())
    })

    test("Invalid screen size pauses game", () => {
        jest.spyOn(DomUi.prototype, "supportedScreenSize").mockReturnValue(false)
        const airplaneMoveMock = jest.spyOn(Airplane.prototype, "move")
        const g = new Game()
        expect(g.getValidScreen()).toBe(false)
        expect(g.getPaused()).toBe(true)
        expect(g.getEnded()).toBe(false)
        expect(airplaneMoveMock).toHaveBeenCalledTimes(0)
    })

    test("Correcting screen size unpauses", () => {
        let supportedScreenSizeMock = jest.spyOn(DomUi.prototype, "supportedScreenSize").mockReturnValue(false)
        jest.spyOn(DomUi.prototype, "getGameContainer").mockImplementation(() => document.createElement("div") )
        const windowResizeEventMock = jest.spyOn(DomUi.prototype, "windowResizeEvent").mockImplementation((listener) => {
            dom.window.addEventListener("resize", listener)
        })
        const airplaneMoveMock = jest.spyOn(Airplane.prototype, "move")
        const g = new Game()
        expect(supportedScreenSizeMock).toHaveBeenCalledTimes(1)
        expect(windowResizeEventMock).toHaveBeenCalledTimes(1)
        supportedScreenSizeMock = jest.spyOn(DomUi.prototype, "supportedScreenSize").mockReturnValue(true)
        dom.window.dispatchEvent(new dom.window.Event("resize"))
        expect(supportedScreenSizeMock).toHaveBeenCalledTimes(2)
        expect(g.getPaused()).toBe(false)
        expect(g.getEnded()).toBe(false)
    })

    test("No screen size validation when game has ended", () => {
        jest.spyOn(Radar.prototype, "towersDestroyed").mockReturnValue(true)
        const supportedScreenSizeMock = jest.spyOn(DomUi.prototype, "supportedScreenSize").mockReturnValue(true)
        jest.spyOn(DomUi.prototype, "getGameContainer").mockImplementation(() => document.createElement("div") )
        jest.spyOn(DomUi.prototype, "windowResizeEvent").mockImplementation((listener) => {
            dom.window.addEventListener("resize", listener)
        })
        const g = new Game()
        expect(supportedScreenSizeMock).toHaveBeenCalledTimes(1)
        dom.window.dispatchEvent(new dom.window.Event("resize"))
        expect(supportedScreenSizeMock).toHaveBeenCalledTimes(1)
    })

    test("Mouse move", () => {
        const div = dom.window.document.createElement("div")
        jest.spyOn(DomUi.prototype, "moveAirplaneEvent").mockImplementation((listener) => {
            div.addEventListener("mousemove", listener)
        })
        const airplaneMoveMock = jest.spyOn(Airplane.prototype, "move")
        const g = new Game()
        expect(g.getPaused()).toBe(false)
        div.dispatchEvent(new dom.window.Event("mousemove"))
        expect(airplaneMoveMock).toBeCalledTimes(1)
    })

    test("Mouse click", () => {
        const subscribeEventMock = jest.spyOn(DomUi.prototype, "fireAirplaneFireRoundEvent").mockImplementation((listener) => {
            dom.window.document.addEventListener("mousedown", listener)
        })
        const airplaneFireRoundMock = jest.spyOn(Airplane.prototype, "fireRound")
        const g = new Game()
        dom.window.document.dispatchEvent(new dom.window.Event("mousedown"))
        expect(airplaneFireRoundMock).toBeCalledTimes(1)
    })

    test("End game", () => {
        jest.spyOn(Radar.prototype, "towersDestroyed").mockReturnValue(true)
        const displayGameEndMock = jest.spyOn(DomUi.prototype, "displayGameEnd")
        const g = new Game()
        expect(g.getPaused()).toBe(true)
        expect(g.getEnded()).toBe(true)
        expect(displayGameEndMock).toHaveBeenCalledTimes(1)
    })

    test("Several consecutive radar messages are displayed", async () => {
        jest.spyOn(Radar.prototype, "getMsgQueue").mockReturnValue([
            {displayTime: 3000, msg: "Message 1", image: "image1"},
            {displayTime: 3000, msg: "Message 2", image: "image2"},
            {displayTime: 3000, msg: "Message 3", image: "image3"},
        ])
        const displayRadarMsgMock = jest.spyOn(DomUi.prototype, "displayRadarMsg")
        const clearRadarMsgMock = jest.spyOn(DomUi.prototype, "clearRadarMsg")
        let g: Game
        await new Promise(done => {
            g = new Game()
            done(true)
        }).then(() => {
            expect(g.getPaused()).toBe(false)
            expect(displayRadarMsgMock).toHaveBeenCalledTimes(3)
            expect(clearRadarMsgMock).toHaveBeenCalledTimes(1)
        })
    })

    // test("Cycle rendering", () => {
    //     const supportedScreenSizeMock = jest.spyOn(DomUi.prototype, "supportedScreenSize").mockReturnValue(true)
    //     const moveFiredRoundsMock = jest.spyOn(Airplane.prototype, "moveFiredRounds")
    //     const attackMock = jest.spyOn(Enemy.prototype, "attack")
    //     let scanMock = jest.spyOn(Radar.prototype, "scan").mockReturnValue(false)
    //     Object.defineProperty(Radar.prototype, "towerImpacted", { 
    //         get: jest.fn(() => false),
    //         configurable: true
    //     })
    //     let towerImpactedMock = jest.spyOn(Radar.prototype, "towerImpacted", "get").mockReturnValue(false)
    //     Object.defineProperty(Radar.prototype, "towerImpacts", { 
    //         get: jest.fn(() => 0),
    //         configurable: true
    //     })
    //     let towerImpactsMock = jest.spyOn(Radar.prototype, "towerImpacts", "get").mockReturnValue(0)
    //     Object.defineProperty(Radar.prototype, "maxTowerImpacts", { 
    //         get: jest.fn(() => 4),
    //         configurable: true
    //     })
    //     let maxTowerImpactsMock = jest.spyOn(Radar.prototype, "maxTowerImpacts", "get").mockReturnValue(4)
    //     const displayScoreMock = jest.spyOn(DomUi.prototype, "displayScore")
    //     const g = new Game()
    //     expect(g.getPaused()).toBe(false)
    //     expect(moveFiredRoundsMock).toHaveBeenCalledTimes(1)
    //     expect(attackMock).toHaveBeenCalledTimes(1)
    //     expect(scanMock).toHaveBeenCalledTimes(1)
    //     expect(displayScoreMock).toHaveBeenCalledTimes(1)
    //     expect(towerImpactedMock).toHaveBeenCalledTimes(1)

    //     scanMock = jest.spyOn(Radar.prototype, "scan").mockReturnValue(true)
    //     towerImpactedMock = jest.spyOn(Radar.prototype, "towerImpacted", "get").mockReturnValue(true)
    //     await new Promise<boolean>(resolve: (() => {
    //         g.cycleRendering()
    //     })
    //     expect(g.paused).toBe(true)
    //     expect(moveFiredRoundsMock).toHaveBeenCalledTimes(2)
    //     expect(attackMock).toHaveBeenCalledTimes(2)
    //     expect(scanMock).toHaveBeenCalledTimes(2)
    //     expect(displayScoreMock).toHaveBeenCalledTimes(2)
    //     expect(towerImpactedMock).toHaveBeenCalledTimes(2)

    //     towerImpactedMock = jest.spyOn(Radar.prototype, "towerImpacted", "get").mockReturnValue(true)
    //     towerImpactsMock = jest.spyOn(Radar.prototype, "towerImpacts", "get").mockReturnValue(4)
    //     g.cycleRendering()
    //     expect(g.getPaused()).toBe(true)
    //     expect(moveFiredRoundsMock).toHaveBeenCalledTimes(3)
    //     expect(attackMock).toHaveBeenCalledTimes(3)
    //     expect(scanMock).toHaveBeenCalledTimes(3)
    //     expect(displayScoreMock).toHaveBeenCalledTimes(3)
    //     expect(towerImpactedMock).toHaveBeenCalledTimes(3)
    //     expect(g.getEnded()).toBe(true)
    // })
})

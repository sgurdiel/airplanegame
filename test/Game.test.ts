import {describe, expect, test, jest, afterEach, beforeEach} from "@jest/globals";
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
        expect(g.getMillisencondSinceLastPaint()).toBe(0)
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
        let framePainted = false
        const paintFrameMock = jest.spyOn(DomUi.prototype, "repaint").mockImplementation((g) => { if (false === framePainted) { framePainted = true; g.paintFrame(0) } })
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
        let framePainted = false
        const paintFrameMock = jest.spyOn(DomUi.prototype, "repaint").mockImplementation((g) => { if (false === framePainted) { framePainted = true; g.paintFrame(0) } })
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
        let framePainted = false
        const paintFrameMock = jest.spyOn(DomUi.prototype, "repaint").mockImplementation((g) => { if (false === framePainted) { framePainted = true; g.paintFrame(0) } })
        
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
})

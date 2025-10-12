/**
 * @jest-environment jsdom
 */
import {describe, expect, test, jest, beforeEach} from "@jest/globals";
import DomUi from "../src/DomUi"
import { readFileSync } from "fs";
import GameElement from "../src/GameElement";
import * as Helpers from "../src/Helpers"
import Game from "../src/Game";
jest.mock("../src/GameElement")
jest.mock("../src/Game")

beforeEach(() => {
    jest.spyOn(Helpers, "asyncDelay").mockImplementation(() => {
        return new Promise<boolean>(done => { done(true) })
    })
})

describe("DomUi", () => {
    
    let html: string = ""
    const indexHtml: string = readFileSync("public/index.html").toString()

    test.each([
        {id: "game"},
        {id: "reloadingMsg"},
        {id: "score"},
        {id: "gameend"},
        {id: "magazineMsg"},
        {id: "infoOverlay"},
        {id: "error"},
        {id: "radarImg"},
        {id: "radarMsg"},
    ])("DOM HTMLElement with $id present", ({id}) => {
        const t = ()  => { const ui = new DomUi() }
        expect(t).toThrowError("Fatal: Missing HTML Element with id '"+id+"'")
        html += '<div id="'+id+'"></div>'
        window.document.body.innerHTML = html
    })

    test("Unsupported screen resolution", () => {
        window.document.body.innerHTML = indexHtml
        window.innerHeight = 500
        new DomUi()
        expect(window.document.getElementById("errorContainer")?.style.visibility === "visible")
        expect(window.document.getElementById("errorContainer")?.innerHTML === "<p>Minimum screen resolution not meet (w:1024px h:768px</p>")
        window.innerHeight = 768
        window.innerWidth = 400
        new DomUi()
        expect(window.document.getElementById("errorContainer")?.style.visibility === "visible")
        expect(window.document.getElementById("errorContainer")?.innerHTML === "<p>Minimum screen resolution not meet (w:1024px h:768px</p>")
        window.innerHeight = 768
        window.innerWidth = 1024
        new DomUi()
        expect(window.document.getElementById("errorContainer")?.style.visibility === "hidden")
    })

    test("Propeties are defined and default values set", () => {
        window.document.body.innerHTML = indexHtml
        window.innerHeight = 768
        const ui = new DomUi()
        ui.setMouseTop(400)
        expect(ui.getMouseTop()).toBe(400)
        expect(ui.getMaxLeftPosGaimingContainer()).toBe(ui.getGameContainer().getBoundingClientRect().left + ui.getGameContainerWith())
        expect(ui.getScreenHeight()).toBe(768)
        expect(ui.getRepaintRatePerSecond()).toBe(0)
    })

    test.each([
        {t: -50, e: 0},
        {t: 100, e: 100},
        {t: 658, e: 608},
    ])("GameElement within GameContainer boundaries", ({t, e}) => {
        window.document.body.innerHTML = indexHtml
        const ui = new DomUi()
        const ge = new GameElement(ui, "div", 50, 100, "")
        jest.spyOn(ge, "getImgH").mockImplementation(() => { return 50 })
        expect(ui.gameElementWithinGameContainerBoundaries({topPos: t, leftPos: 0}, ge).topPos).toBe(e)
    })

    test("Append GameElement", () => {
        window.document.body.innerHTML = indexHtml
        const ui = new DomUi()
        expect(window.document.getElementById("game")?.innerHTML).toBe("")
        const ge = new GameElement(ui, "div", 50, 100, "")
        const div = document.createElement("div")
        jest.spyOn(ge, "getHtmlElement").mockImplementation(() => { return div })
        ui.appendGameElement(ge)
        expect(window.document.getElementById("game")?.childNodes.length).toBe(1)
        expect(window.document.getElementById("game")?.firstChild).toBe(div)
    })

    test("Random vertical position", () => {
        window.document.body.innerHTML = indexHtml
        const ui = new DomUi()
        const ge = new GameElement(ui, "div", 50, 100, "")
        jest.spyOn(ge, "getImgH").mockImplementation(() => { return 50 })
        expect(ui.randomTopPos(ge)).toBeGreaterThanOrEqual(0)
        expect(ui.randomTopPos(ge)).toBeLessThanOrEqual(608)
    })

    test("Display score", () => {
        window.document.body.innerHTML = indexHtml
        const ui = new DomUi()
        ui.displayScore(564)
        expect(window.document.getElementById("score")?.innerHTML).toBe("564")
    })

    test("Display game end", () => {
        window.document.body.innerHTML = indexHtml
        const ui = new DomUi()
        ui.displayGameEnd()
        expect(window.document.getElementById("gameend")?.style.visibility).toBe("visible")
    })

    test("Display magazine message", () => {
        window.document.body.innerHTML = indexHtml
        const ui = new DomUi()
        ui.displayMagazineMsg(5)
        expect(window.document.getElementById("reloadingMsg")?.style.display).toBe("none")
        expect(window.document.getElementById("magazineMsg")?.style.display).toBe("block")
        expect(window.document.getElementById("magazineMsg")?.innerHTML).toBe("Fire rounds: 5")
    })

    test("Display reloading", () => {
        window.document.body.innerHTML = indexHtml
        const ui = new DomUi()
        ui.displayReloadingMsg(0.1)
        expect(window.document.getElementById("reloadingMsg")?.style.display).toBe("block")
        expect(window.document.getElementById("magazineMsg")?.style.display).toBe("none")
    })

    test("Await display reloading", async () => {
        window.document.body.innerHTML = indexHtml
        const ui = new DomUi()
        await new Promise(done => {
            ui.displayReloadingMsg(1000)
            done(true)
        }).then(() => {
            expect(window.document.getElementById("reloadingMsg")?.style.display).toBe("none")
            expect(window.document.getElementById("magazineMsg")?.style.display).toBe("block")
        })
    })

    test("Radar message", () => {
        window.document.body.innerHTML = indexHtml
        const ui = new DomUi()
        ui.displayRadarMsg({displayTime: 0, msg: "Test message", image: "/image.png"})
        expect(window.document.getElementById("radarMsg")?.innerHTML).toBe("Test message")
        expect(window.document.getElementById("radarImg")?.childNodes.length).toBe(1)
        expect(window.document.getElementById("radarImg")?.firstChild).toBeInstanceOf(HTMLImageElement)
        const image = window.document.getElementById("radarImg")?.firstChild as HTMLImageElement
        expect(image.src).toBe("http://localhost/image.png")
    })

    test("Clear radar message", () => {
        window.document.body.innerHTML = indexHtml
        const ui = new DomUi()
        ui.clearRadarMsg()
        expect(window.document.getElementById("radarMsg")?.innerHTML).toBe("")
        expect(window.document.getElementById("radarImg")?.innerHTML).toBe("")
    })

    test("DOM event subscriber", () => {
        window.document.body.innerHTML = indexHtml
        const ui = new DomUi()
        let eventOutput = ""
        ui.windowResizeEvent(() => { eventOutput = "windowResize" })
        ui.fireAirplaneFireRoundEvent(() => { eventOutput = "documentMousedown" })
        ui.moveAirplaneEvent(() => { eventOutput = "divMousemove" })
        window.dispatchEvent(new Event("resize"))
        expect(eventOutput).toBe("windowResize")
        document.dispatchEvent(new Event("mousedown"))
        expect(eventOutput).toBe("documentMousedown")
        ui.getGameContainer().dispatchEvent(new Event("mousemove"))
        expect(eventOutput).toBe("divMousemove")
    })

    test("Create and configure HTMLElement", () => {
        const ui = new DomUi()
        const div = ui.createHtmlElement("div")
        expect(div).toBeInstanceOf(HTMLDivElement)
        expect(ui.htmlElementAttribute(div, "class", "test")).toBe(ui)
        expect(ui.htmlElementMove(div, 0, 0)).toBe(ui)
        expect(ui.htmlElementStyle(div, "height", "10px")).toBe(ui)
    })

    test("Remove", () => {
        const removeMock = jest.spyOn(HTMLElement.prototype, "remove")
        const ui = new DomUi()
        const div = ui.createHtmlElement("div")
        ui.htmlElementRemove(div)
        expect(removeMock).toHaveBeenCalledTimes(1)
    })

    test("Repaint", () => {
        jest.useFakeTimers()
        const ui = new DomUi()
        const game = new Game()
        const paintFrameMock = jest.spyOn(game, "paintFrame")
        ui.repaint(game)
        // At this point in time, the callback should not have been called yet
        expect(paintFrameMock).not.toBeCalled()
        // Fast-forward until all timers have been executed
        jest.runAllTimers()
        // Now our callback should have been called!
        expect(paintFrameMock).toBeCalled()
        expect(paintFrameMock).toHaveBeenCalledTimes(1)
    })
})

import {expect, test, jest, afterEach, describe, beforeEach} from "@jest/globals";
import DomUi from "../src/DomUi";
import GameElement from "../src/GameElement"
import { Missile } from "../src/Missile"
jest.mock("../src/DomUi")
jest.mock("../src/GameElement")

const ui = new DomUi()
let gameElement: GameElement
const repaintRatePerSecond: number = 50;

beforeEach(() => {
    gameElement = new GameElement(ui, "div", 40, 80, "")
    jest.spyOn(gameElement, "getImgH").mockImplementation(() => 40)
    jest.spyOn(gameElement, "getImgL").mockImplementation(() => 80)
})

afterEach(() => {
    // restore the spy created with spyOn
    jest.restoreAllMocks()
    jest.resetAllMocks()
})

describe("Missile", () => {
    test("Propeties are defined and default values set", () => {
        class Missile1 extends Missile {}
        const m = new Missile1(gameElement, 500)
        expect(m.getElement()).toBe(gameElement)
        expect(m.getRadarDetected()).toBe(false)
        expect(m.getDestructionScore()).toBe(0)
        expect(m.getHitsTillDestruction()).toBe(1)
        expect(m.getLeftPos()).toBe(0)
        expect(m.getTopPos()).toBe(500)   
        expect(m.getSpeed()).toBe(0)     
        expect(m.getHeight()).toBe(40)
        expect(m.getLength()).toBe(80)
    })
    
    test("Receive impact", () => {
        class Missile1 extends Missile {}
        const m = new Missile1(gameElement, 500)
        const hits = m.getHitsTillDestruction()
        m.receiveImpact()
        expect(m.getHitsTillDestruction()).toBe(hits-1)
    })

    test("Move", () => {
        const moveMock = jest.spyOn(gameElement, "move")
        class Missile1 extends Missile {}
        const m = new Missile1(gameElement, 500)
        const leftPos = m.getLeftPos()
        m.move(repaintRatePerSecond)
        const pixelsToDisplace = Math.round(m.getSpeed() / repaintRatePerSecond);
        expect(m.getLeftPos()).toBe(leftPos + pixelsToDisplace)
        expect(moveMock).toHaveBeenCalledTimes(1)
        expect(moveMock).toHaveBeenCalledWith({topPos: m.getTopPos(), leftPos: m.getLeftPos()})
    })

    test("Radar detected", () => { 
        class Missile1 extends Missile {}
        const m = new Missile1(gameElement, 500)
        expect(m.getRadarDetected()).toBe(false)
        m.setRadarDetected()
        expect(m.getRadarDetected()).toBe(true)  
    })

    test("Remove", () => {
        const removeMock = jest.spyOn(gameElement, "remove")
        class Missile1 extends Missile {}
        const m = new Missile1(gameElement, 500)
        m.remove()
        expect(removeMock).toHaveBeenCalledTimes(1)
    })
})

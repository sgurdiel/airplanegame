import {describe, expect, test, jest, afterEach, beforeAll, beforeEach} from "@jest/globals";
import Airplane from "../src/Airplane"
import DomUi from "../src/DomUi"
import FireRound from "../src/FireRound";
import GameElement from "../src/GameElement"
import * as Helpers from "../src/Helpers";
jest.mock("../src/DomUi")
jest.mock("../src/GameElement")
jest.mock("../src/FireRound")

let ui: DomUi

beforeEach(() => {
    ui = new DomUi()
    Object.defineProperties(ui, {
        screenHeight: { value: 800},
        verticalPositionOffset: {value: 100},
        maxVerticalPosition: {value: 700},
        maxLeftPosGaimingContainer: {value: 800}
    })
    jest.spyOn(ui, "getScreenHeight").mockReturnValue(800)
    jest.spyOn(ui, "getMaxLeftPosGaimingContainer").mockReturnValue(800)
    jest.spyOn(ui, "getMouseTop").mockReturnValue(450)
    jest.spyOn(GameElement.prototype, "getImgH").mockReturnValue(58)
    jest.spyOn(GameElement.prototype, "getImgL").mockReturnValue(92)
    jest.spyOn(GameElement.prototype, "getPosition").mockReturnValue({topPos: 400, leftPos: 604})
    jest.spyOn(FireRound.prototype, "getElement").mockReturnValue(new GameElement(ui, "div", 58, 92, ""))
})

afterEach(() => {
    // restore the spy created with spyOn
    jest.restoreAllMocks()
    jest.resetAllMocks()
})

describe("Airplane", () => {
    test("Propeties are defined and default values set", () => {
        const gameElementMoveMock = jest.spyOn(GameElement.prototype, "move")
        let a = new Airplane(ui)
        expect(a.getFireRoundsAvailable().length).toBe(a.getFireRoundsCapacity())
        expect(a.getFireRoundsFired().length).toBe(0)
        expect(gameElementMoveMock).toHaveBeenCalledWith({topPos: 400, leftPos: 800 - a.getElement().getImgL() - 4})
    })

    test("Move", () => {
        let a = new Airplane(ui)
        const gameElementWithinGameContainerBoundariesMock = jest.spyOn(ui, "gameElementWithinGameContainerBoundaries")
        a.move()
        expect(gameElementWithinGameContainerBoundariesMock.mock.calls[0][0]).toMatchObject({topPos: 450 - Math.round(a.getElement().getImgH()/2), leftPos: 800 - a.getElement().getImgL() - 4})
    })

    test("Removing non existent fireround should not error", () => {
        let a = new Airplane(ui)
        a.removeFiredRound(3)
    })

    test("Fire round", () => {
        const fireRoundFireMethodMock = jest.spyOn(FireRound.prototype, "fire")
        let a = new Airplane(ui)
        let fireRoundsFired = a.getFireRoundsFired().length
        let fireRoundsAvailable = a.getFireRoundsAvailable().length
        a.fireRound()
        expect(a.getFireRoundsFired().length).toBe(fireRoundsFired+1)
        expect(a.getFireRoundsAvailable().length).toBe(fireRoundsAvailable-1)
        expect(a.getReloading()).toBe(false)
        expect(fireRoundFireMethodMock.mock.calls.length).toBe(1)
        expect(fireRoundFireMethodMock.mock.calls[0][0]).toMatchObject({topPos: 429, leftPos: 604})
    })

    test("Fire round moves", () => {
        const position = {topPos: 429, leftPos: 604}
        const fireRoundFireMethodMock = jest.spyOn(FireRound.prototype, "fire")
        const fireRoundMoveMethodMock = jest.spyOn(FireRound.prototype, "move")
        const fireRoundGetPositionMock = jest.spyOn(FireRound.prototype, "getPosition").mockReturnValue(position)
        let a = new Airplane(ui)
        a.fireRound()
        expect(fireRoundFireMethodMock.mock.calls.length).toBe(1)
        expect(fireRoundFireMethodMock.mock.calls[0][0]).toMatchObject(position)
        a.moveFiredRounds()
        expect(fireRoundGetPositionMock.mock.calls.length).toBe(1)
        expect(fireRoundMoveMethodMock.mock.calls.length).toBe(1)
        expect(fireRoundMoveMethodMock.mock.calls[0][0]).toMatchObject({topPos: 429, leftPos: 604 - a.getFireRoundSpeed()})
    })

    test("Fire round gets removed when screen limit reached", () => {
        const position = {topPos: 429, leftPos: 0}
        const fireRoundMoveMock = jest.spyOn(FireRound.prototype, "move")
        const fireRoundGetPositionMock = jest.spyOn(FireRound.prototype, "getPosition").mockReturnValue(position)
        let a = new Airplane(ui)
        a.fireRound()
        a.moveFiredRounds()
        expect(a.getFireRoundsFired()[0]).toBeUndefined()
    })

    test("Fire round removal", () => {
        let a = new Airplane(ui)
        a.fireRound()
        a.fireRound()
        a.fireRound()
        const index = 1
        const removedFireRound = a.getFireRoundsFired()[index]
        let found = false
        a.removeFiredRound(index)
        a.getFireRoundsFired().forEach(element => {
            found = (element === removedFireRound ? true : found)
        })
        expect(found).toBe(false)
    })

    test("Firing last fire round will reload", async () => {
        const asyncDelayFunctionMock = jest.spyOn(Helpers, "asyncDelay").mockImplementation(() => {
            return new Promise<boolean>(resolve => { resolve(true) })
        })
        let a = new Airplane(ui)
        let fireRoundsAvailable = a.getFireRoundsCapacity()
        expect(a.getFireRoundsAvailable().length).toBe(fireRoundsAvailable)
        for (let index = 0; index < 10; index++) {
            if (index < 9) {
                a.fireRound()
                fireRoundsAvailable--
                expect(a.getFireRoundsAvailable().length).toBe(fireRoundsAvailable)
            } else {
                await new Promise<boolean>(done => {
                    a.fireRound()
                    done(true)
                })
            }
        }
        expect(a.getReloading()).toBe(false)
        expect(asyncDelayFunctionMock).toHaveBeenCalledTimes(1)
        expect(a.getFireRoundsAvailable().length).toBe(a.getFireRoundsCapacity())
    })
})

import { type GameElementPosition } from './GameElement'
import type GameElement from './GameElement'
import { asyncDelay } from './Helpers'
import { type RadarMsg } from './Radar'

export default class DomUi {
    private screenHeight: number = 0
    private screenWidth: number = 0
    private verticalPositionOffset: number = 0
    private maxVerticalPosition: number = 0
    private maxLeftPosGaimingContainer: number = 0
    private mouseTop: number = 0
    private readonly gameContainer: HTMLElement
    private readonly gameContainerWith: number = 1024
    private readonly gameContainerHeight: number = 658
    private readonly reloadingMsg: HTMLElement
    private readonly scoreElement: HTMLElement
    private readonly gameendContainer: HTMLElement
    private readonly magazineContainer: HTMLElement
    private readonly infoOverlay: HTMLElement
    private readonly errorContainer: HTMLElement
    private readonly radarScreen: HTMLElement
    private readonly radarMsg: HTMLElement

    constructor() {
        const gamingElement = document.getElementById('game')
        if (gamingElement == null) throw new Error("Fatal: Missing HTML Element with id 'game'")
        this.gameContainer = gamingElement
        const reloadingElement = document.getElementById('reloadingMsg')
        if (reloadingElement == null) throw new Error("Fatal: Missing HTML Element with id 'reloadingMsg'")
        this.reloadingMsg = reloadingElement
        const scoreElement = document.getElementById('score')
        if (scoreElement == null) throw new Error("Fatal: Missing HTML Element with id 'score'")
        this.scoreElement = scoreElement
        const gameendContainer = document.getElementById('gameend')
        if (gameendContainer == null) throw new Error("Fatal: Missing HTML Element with id 'gameend'")
        this.gameendContainer = gameendContainer
        const magazineContainer = document.getElementById('magazineMsg')
        if (magazineContainer == null) throw new Error("Fatal: Missing HTML Element with id 'magazineMsg'")
        this.magazineContainer = magazineContainer
        const infoOverlay = document.getElementById('infoOverlay')
        if (infoOverlay == null) throw new Error("Fatal: Missing HTML Element with id 'infoOverlay'")
        this.infoOverlay = infoOverlay
        const errorContainer = document.getElementById('error')
        if (errorContainer == null) throw new Error("Fatal: Missing HTML Element with id 'error'")
        this.errorContainer = errorContainer
        const radarScreen = document.getElementById('radarImg')
        if (radarScreen === null) throw new Error("Fatal: Missing HTML Element with id 'radarImg'")
        this.radarScreen = radarScreen
        const radarMsg = document.getElementById('radarMsg')
        if (radarMsg === null) throw new Error("Fatal: Missing HTML Element with id 'radarMsg'")
        this.radarMsg = radarMsg
        this.supportedScreenSize()
    }

    public supportedScreenSize(): boolean {
        this.screenHeight = window.innerHeight
        this.screenWidth = window.innerWidth
        this.verticalPositionOffset = this.getGameContainer().getBoundingClientRect().top
        this.maxLeftPosGaimingContainer = this.getGameContainer().getBoundingClientRect().left + this.gameContainerWith
        this.maxVerticalPosition = this.verticalPositionOffset + this.gameContainerHeight
        const supportedScreenSize = (this.screenHeight >= 768 && this.screenWidth >= 1024)
        this.displayError(!supportedScreenSize, 'Minimum screen resolution not meet (w:1024px h:768px')
        return supportedScreenSize
    }

    public gameElementWithinGameContainerBoundaries(position: GameElementPosition, element: GameElement): GameElementPosition {
        if (position.topPos < this.verticalPositionOffset) {
            position.topPos = this.verticalPositionOffset
        } else if (position.topPos > this.maxVerticalPosition - element.getImgH()) {
            position.topPos = this.maxVerticalPosition - element.getImgH()
        }
        return position
    }

    private subscribeEvent(element: Document | Window | Element, eventName: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | undefined): void {
        element.addEventListener(eventName, listener, options)
    }

    public fireAirplaneFireRoundEvent(listener: EventListenerOrEventListenerObject): void {
        this.subscribeEvent(document, 'mousedown', listener)
    }

    public moveAirplaneEvent(listener: EventListenerOrEventListenerObject): void {
        this.subscribeEvent(this.gameContainer, 'mousemove', listener)
    }

    public windowResizeEvent(listener: EventListenerOrEventListenerObject): void {
        this.subscribeEvent(window, 'resize', listener)
    }

    public appendGameElement(gameElement: GameElement): void {
        this.getGameContainer().appendChild(gameElement.getHtmlElement())
    }

    public randomTopPos(element: GameElement): number {
        return Math.round(this.verticalPositionOffset + (Math.random() * (this.gameContainerHeight - element.getImgH())))
    }

    public displayReloadingMsg(time: number): void {
        this.htmlElementStyle(this.reloadingMsg, 'display', 'block')
        this.htmlElementStyle(this.magazineContainer, 'display', 'none')
        asyncDelay(time).then(() => {
            this.htmlElementStyle(this.reloadingMsg, 'display', 'none')
            this.htmlElementStyle(this.magazineContainer, 'display', 'block')
        }).catch(() => {})
    }

    public displayMagazineMsg(available: number): void {
        this.htmlElementStyle(this.reloadingMsg, 'display', 'none')
        this.htmlElementStyle(this.magazineContainer, 'display', 'block')
        const str1: string = 'Fire rounds: '
        this.magazineContainer.innerHTML = str1.concat(available.toString())
    }

    public displayScore(score: number): void {
        this.scoreElement.innerHTML = score.toString()
    }

    public displayGameEnd(): void {
        this.popupInfo(true)
        this.htmlElementStyle(this.gameendContainer, 'visibility', 'visible')
    }

    public displayError(display: boolean, msg?: string): void {
        this.popupInfo(display)
        this.htmlElementStyle(this.errorContainer, 'visibility', (display ? 'visible' : 'hidden'))
        if (msg !== undefined) { this.errorContainer.innerHTML = '<p>' + msg + '</p>' }
    }

    private popupInfo(display: boolean): void {
        this.htmlElementStyle(this.infoOverlay, 'visibility', (display ? 'visible' : 'hidden'))
    }

    public displayRadarMsg(msg: RadarMsg): void {
        this.radarMsg.innerHTML = msg.msg
        const radarImg = document.createElement('img')
        radarImg.src = msg.image
        this.radarScreen.innerHTML = radarImg.outerHTML
    }

    public clearRadarMsg(): void {
        this.radarMsg.innerHTML = ''
        this.radarScreen.innerHTML = ''
    }

    public createHtmlElement(type: string): HTMLElement {
        return document.createElement(type)
    }

    public htmlElementAttribute(element: HTMLElement, name: string, value: string): this {
        element.setAttribute(name, value)
        return this
    }

    public htmlElementStyle(element: HTMLElement, name: string, value: string): this {
        element.style.setProperty(name, value)
        return this
    }

    public htmlElementMove(element: HTMLElement, topPos: number, leftPos: number): this {
        this.htmlElementStyle(element, 'top', topPos.toString().concat('px'))
        this.htmlElementStyle(element, 'left', leftPos.toString().concat('px'))
        return this
    }

    public htmlElementRemove(element: HTMLElement): void {
        element.remove()
    }

    public getScreenHeight(): number {
        return this.screenHeight
    }

    public getMaxLeftPosGaimingContainer(): number {
        return this.maxLeftPosGaimingContainer
    }

    public getMouseTop(): number {
        return this.mouseTop
    }

    public setMouseTop(value: number): void {
        this.mouseTop = value
    }

    public getGameContainer(): HTMLElement {
        return this.gameContainer
    }

    public getGameContainerWith(): number {
        return this.gameContainerWith
    }
}

import Airplane from './Airplane'
import DomUi from './DomUi'
import Radar, { radarMsg } from './Radar'
import Enemy from './Enemy'
import { asyncDelay } from './Helpers'

export default class Game {
    private ui: DomUi
    private airplane: Airplane
    private radar: Radar
    private enemy: Enemy 
    private paused: boolean = false
    private validScreen: boolean = true
    private renderTimeRate: number = 30
    private ended: boolean = false
    private gameScore: number = 0
    
    constructor() {
        this.ui = new DomUi()
        this.airplane = new Airplane(this.ui)
        this.enemy = new Enemy(this.ui, this.renderTimeRate)
        this.radar = new Radar(this.ui, this.airplane, this.enemy)
        this.screenSizeCheck()
        this.initUiEvents()
        this.cycleRendering()
    }

    private screenSizeCheck(): void {
        if (this.ended) {
            return
        }
        this.validScreen = this.ui.supportedScreenSize()
        this.triggerGamePause(!this.validScreen)
    }

    private triggerGamePause(pause: boolean): void {
        if (this.paused === pause || this.ended) {
            return
        }
        this.paused = this.validScreen ? pause : true
        if (this.paused === false) {
            this.airplane.move()
        }
    }

    private initUiEvents() {
        this.ui.moveAirplaneEvent((ev) => {
            const mouseEvent = ev as MouseEvent
            this.ui.setMouseTop(mouseEvent.clientY)
            if (this.paused === false) {
                this.airplane.move()
            }
        })
        this.ui.fireAirplaneFireRoundEvent((ev) => {
            if (this.paused === false) {
                this.airplane.fireRound()
                ev.stopImmediatePropagation()
            }
        })
        this.ui.windowResizeEvent(() => {
            this.screenSizeCheck()
        })
    }

    private cycleRendering(): void {
        if (this.paused === false) {
            this.airplane.moveFiredRounds()
            this.enemy.attack()
            this.radar.scan()
            this.gameScore += this.radar.getIncreaseScore()
            this.ui.displayScore(this.gameScore)
            this.displayRadarMessages()
            if (this.radar.towersDestroyed() === true) {
                this.endGame()
            }
        }
        if (this.ended === false) {
            setTimeout(() => { this.cycleRendering() }, this.renderTimeRate)
        }
    }

    private displayRadarMessages(): void {
        const amountMessages: number = this.radar.getMsgQueue().length
        if (amountMessages > 0) {
            this.triggerGamePause(true)
            let timeOffset: number = 0
            this.radar.getMsgQueue().forEach((msg: radarMsg, index: number) => {
                if (index === 0) {
                    this.ui.displayRadarMsg(msg)
                } else {
                    asyncDelay(timeOffset)
                        .then(() => {
                            this.ui.displayRadarMsg(msg)
                        })
                }
                timeOffset += msg.displayTime
            })
            if (this.radar.getMsgQueue()[amountMessages-1].displayTime > 0) {
                asyncDelay(timeOffset)
                    .then(() => {
                        this.ui.clearRadarMsg()
                        this.triggerGamePause(false)
                    })
            }
        }
    }

    private endGame(): void {
        this.triggerGamePause(true)
        this.ended = true
        this.ui.displayGameEnd()
    }

    public getPaused(): boolean {
        return this.paused
    }

    public getEnded(): boolean {
        return this.ended
    }

    public getValidScreen(): boolean {
        return this.validScreen
    }

    public getRenderTimeRate(): number {
        return this.renderTimeRate
    }
}

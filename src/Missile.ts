import GameElement from "./GameElement"

export abstract class Missile {
    protected destructionScore: number = 0
    protected speed: number = 0
    private leftPos: number
    private radarDetected: boolean = false
    protected hitsTillDestruction: number = 1

    constructor(private element: GameElement, private topPos: number) {
        this.leftPos = -this.element.getImgL()
    }

    public getElement(): GameElement {
        return this.element
    }

    public move(): number {
        this.leftPos += this.speed
        this.element.move({topPos: this.topPos, leftPos: this.leftPos})
        return this.leftPos
    }

    public getRadarDetected(): boolean {
        return this.radarDetected
    }
    
    public setRadarDetected() {
        this.radarDetected = true
    }

    public getHitsTillDestruction(): number {
        return this.hitsTillDestruction
    }

    public receiveImpact(): number {
        this.hitsTillDestruction--
        return this.hitsTillDestruction
    }

    public getDestructionScore(): number {
        return this.destructionScore
    }

    public getTopPos(): number {
        return this.topPos
    }
    
    public getLeftPos(): number {
        return this.leftPos
    }

    public getSpeed(): number {
        return this.speed
    }

    public getHeight(): number {
        return this.element.getImgH()
    }

    public getLength(): number {
        return this.element.getImgL()
    }

    public remove(): void {
        this.element.remove()
    }
}

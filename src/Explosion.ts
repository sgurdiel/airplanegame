import type DomUi from './DomUi'
import GameElement from './GameElement'

export default class Explosion {
    private readonly element: GameElement

    constructor(private readonly ui: DomUi, topPos: number, leftPos: number) {
        this.element = new GameElement(this.ui, 'img', 80, 80, 'explosion')
        this.element.move({ topPos, leftPos })
        this.ui.htmlElementAttribute(this.element.getHtmlElement(), 'src', '/img/explosion.gif')
    }

    public getElement(): GameElement {
        return this.element
    }

    public remove(): void {
        this.element.remove()
    }
}

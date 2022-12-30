import DomUi from "./DomUi"
import GameElement from "./GameElement"

export default class Explosion {
    private element: GameElement

    constructor(private ui: DomUi, topPos: number, leftPos: number) {
        this.element = new GameElement(this.ui, "img", 80, 80, "explosion")
        this.element.move({topPos: topPos, leftPos: leftPos})
        ui.htmlElementAttribute(this.element.getHtmlElement(), "src", "/img/explosion.gif")
    }

    public getElement(): GameElement {
        return this.element
    }

    public remove(): void {
        this.element.remove()
    }
}

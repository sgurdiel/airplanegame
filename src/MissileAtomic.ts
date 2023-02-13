import type DomUi from './DomUi'
import GameElement from './GameElement'
import { Missile } from './Missile'

export default class MissileAtomic extends Missile {
    protected hitsTillDestruction: number = 3
    protected destructionScore: number = 1000
    protected speed: number = 6

    constructor(ui: DomUi) {
        const element = new GameElement(ui, 'div', 40, 80, 'missileAtomic')
        super(element, ui.randomTopPos(element))
    }
}

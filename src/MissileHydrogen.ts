import type DomUi from './DomUi';
import GameElement from './GameElement';
import { Missile } from './Missile';

export default class MissileHydrogen extends Missile {
  protected hitsTillDestruction: number = 1;
  protected destructionScore: number = 100;
  protected speed: number = 10;

  constructor(ui: DomUi) {
    const element = new GameElement(ui, 'div', 40, 120, 'missileHydrogen');
    super(element, ui.randomTopPos(element));
  }
}

import { PlayerDom } from '../../../../Player/Infrastucture/Dom/PlayerDom';
import { DashboardScoreInterface } from '../../../Domain/Dashboard/DashboardScoreInterface';
import { Dom } from '../Dom';

export class DashboardScoreDom implements DashboardScoreInterface {
  private readonly scoreElement: HTMLElement;

  constructor(
    private readonly player: PlayerDom,
    dom: Dom,
  ) {
    this.scoreElement = dom.getElementById('score');
  }

  public animate(): void {
    if (this.scoreElement.innerHTML !== this.player.getScrore().toString()) {
      this.scoreElement.innerHTML = this.player.getScrore().toString();
    }
  }
}

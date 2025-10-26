import { AirplaneAbstractDom } from '../../../../Player/Infrastucture/Dom/AirplaneAbstractDom';
import { PlayerDom } from '../../../../Player/Infrastucture/Dom/PlayerDom';
import { DashboardMagazineInterface } from '../../../Domain/Dashboard/DashboardMagazineInterface';
import { Dom } from '../Dom';

export class DashboardMagazineDom implements DashboardMagazineInterface {
  private magazinesDisplays: HTMLElement[] = [];
  private readonly magazinesContainer: HTMLElement;

  constructor(
    private readonly player: PlayerDom,
    dom: Dom,
  ) {
    this.magazinesContainer = dom.getElementById('menuRounds');
    this.initializaMagazineDisplay();
  }

  private initializaMagazineDisplay(): void {
    for (let i = 0; i < this.player.getAirplanes().length; i++) {
      const span = document.createElement('span');
      span.id = 'magazine' + i;
      this.magazinesContainer.appendChild(span);
      this.magazinesDisplays.push(span);
    }
  }

  public animate(animateScreen: boolean): void {
    if (animateScreen) {
      this.magazineDisplay();
    }
  }

  private magazineDisplay(): void {
    this.player
      .getAirplanes()
      .forEach((airplane: AirplaneAbstractDom, index: number) => {
        if (0 === airplane.getAvailableFireRounds()) {
          const str1 = 'RELOADING...';
          if (this.magazinesDisplays[index].innerHTML !== str1) {
            this.magazinesDisplays[index].innerHTML = str1;
          }
          return;
        }
        const str1: string =
          'Fire rounds: ' + airplane.getAvailableFireRounds().toString();
        if (this.magazinesDisplays[index].innerHTML !== str1) {
          this.magazinesDisplays[index].innerHTML = str1;
        }
      });
  }
}

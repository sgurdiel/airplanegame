import { MissileAbstractDom } from './MissileAbstractDom';

export class MissileHydrogenDom extends MissileAbstractDom {
  constructor(id: string, screenHeight: number) {
    super('sprite', 'missileH' + id, 33, 100, 114, 0, screenHeight);
  }
}

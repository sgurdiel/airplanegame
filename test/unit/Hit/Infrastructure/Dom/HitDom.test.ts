import { describe, expect, jest, beforeEach, test } from '@jest/globals';
import { HitDom } from '../../../../../src/Hit/Infrastructure/Dom/HitDom';
import { PlayerDom } from '../../../../../src/Player/Infrastucture/Dom/PlayerDom';
import { EnemyDom } from '../../../../../src/Enemy/Infrastructure/Dom/EnemyDom';
import { MissileAbstractDom } from '../../../../../src/Enemy/Infrastructure/Dom/MissileAbstractDom';
import { AirplaneAbstractDom } from '../../../../../src/Player/Infrastucture/Dom/AirplaneAbstractDom';
import { FireRoundDom } from '../../../../../src/Player/Infrastucture/Dom/FireRoundDom';
import { ScreenElementDom } from '../../../../../src/IO/Infrastructure/Dom/ScreenElementDom';
import { ScreenElementPositionDom } from '../../../../../src/IO/Infrastructure/Dom/ScreenElementPositionDom';
import { ScreenElementDimensionDom } from '../../../../../src/IO/Infrastructure/Dom/ScreenElementDimensionDom';
import { BaseDom } from '../../../../../src/Player/Infrastucture/Dom/BaseDom';
import { MissileHydrogenDom } from '../../../../../src/Enemy/Infrastructure/Dom/MissileHydrogenDom';
import { AirplaneType1Dom } from '../../../../../src/Player/Infrastucture/Dom/AirplaneType1Dom';

jest.mock('../../../../../src/Player/Infrastucture/Dom/PlayerDom');
jest.mock('../../../../../src/Enemy/Infrastructure/Dom/EnemyDom');
jest.mock('../../../../../src/Enemy/Infrastructure/Dom/MissileAbstractDom');
jest.mock('../../../../../src/Player/Infrastucture/Dom/AirplaneAbstractDom');
jest.mock('../../../../../src/Player/Infrastucture/Dom/FireRoundDom');
jest.mock('../../../../../src/IO/Infrastructure/Dom/ScreenElementDom');
jest.mock('../../../../../src/Player/Infrastucture/Dom/BaseDom');

describe('HitDom', () => {
  let hitDom: HitDom;
  let playerDom: PlayerDom;
  let enemyDom: EnemyDom;
  let missile: MissileAbstractDom;
  let airplane: AirplaneAbstractDom;
  let fireRound: FireRoundDom;
  let baseDom: BaseDom;

  beforeEach(() => {
    playerDom = new PlayerDom();
    enemyDom = new EnemyDom();
    hitDom = new HitDom(playerDom, enemyDom);

    missile = new MissileHydrogenDom({} as any, {} as any);
    airplane = new AirplaneType1Dom({} as any);
    fireRound = new FireRoundDom({} as any, {} as any, {} as any);
    baseDom = new BaseDom();

    const missileScreenElement = new ScreenElementDom({} as any, {} as any, {} as any,{} as any, {} as any, {} as any);
    const missilePosition = new ScreenElementPositionDom(100, 100);
    const missileDimension = new ScreenElementDimensionDom(10, 10);
    jest.spyOn(missileScreenElement, 'getPosition').mockReturnValue(missilePosition);
    jest.spyOn(missileScreenElement, 'getDimension').mockReturnValue(missileDimension);
    jest.spyOn(missile, 'getScreenElement').mockReturnValue(missileScreenElement);

    const fireRoundScreenElement = new ScreenElementDom({} as any, {} as any, {} as any,{} as any, {} as any, {} as any);
    const fireRoundPosition = new ScreenElementPositionDom(100, 100);
    const fireRoundDimension = new ScreenElementDimensionDom(10, 10);
    jest.spyOn(fireRoundScreenElement, 'getPosition').mockReturnValue(fireRoundPosition);
    jest.spyOn(fireRoundScreenElement, 'getDimension').mockReturnValue(fireRoundDimension);
    jest.spyOn(fireRound, 'getScreenElement').mockReturnValue(fireRoundScreenElement);

    jest.spyOn(enemyDom, 'getLaunchedMissiles').mockReturnValue([missile]);
    jest.spyOn(playerDom, 'getAirplanes').mockReturnValue([airplane]);
    jest.spyOn(airplane, 'getFireRounds').mockReturnValue([fireRound]);
    jest.spyOn(playerDom, 'getBase').mockReturnValue(baseDom);
  });

  test('should detect a hit between a fire round and a missile', () => {
    jest.spyOn(missile, 'destroyed').mockReturnValue(false);

    hitDom.hasHits(1024);

    expect(fireRound.destroy).toHaveBeenCalledTimes(1);
    expect(missile.takeHit).toHaveBeenCalledTimes(1);
    expect(playerDom.updateScore).not.toHaveBeenCalled();
  });

  test('should update score when a missile is destroyed', () => {
    jest.spyOn(missile, 'destroyed').mockReturnValue(true);
    jest.spyOn(missile, 'getDestructionScore').mockReturnValue(100);

    hitDom.hasHits(1024);

    expect(fireRound.destroy).toHaveBeenCalledTimes(1);
    expect(missile.takeHit).toHaveBeenCalledTimes(1);
    expect(playerDom.updateScore).toHaveBeenCalledWith(100);
  });

  test('should detect a hit on the base', () => {
    const missileScreenElement = missile.getScreenElement();
    const missilePosition = missileScreenElement.getPosition();
    missilePosition.setPositionX(1024);
    jest.spyOn(missile, 'damageAnnounce').mockReturnValue(true);

    hitDom.hasHits(1024);

    expect(playerDom.getBase().applyDamage).toHaveBeenCalledTimes(1);
    expect(missile.unsetDamageAnnounce).toHaveBeenCalledTimes(1);
  });

  test('should not detect a hit when there is no overlap', () => {
    const fireRoundScreenElement = fireRound.getScreenElement();
    const fireRoundPosition = fireRoundScreenElement.getPosition();
    fireRoundPosition.setPositionX(200);

    hitDom.hasHits(1024);

    expect(fireRound.destroy).not.toHaveBeenCalled();
    expect(missile.takeHit).not.toHaveBeenCalled();
    expect(playerDom.updateScore).not.toHaveBeenCalled();
    expect(playerDom.getBase().applyDamage).not.toHaveBeenCalled();
  });
});

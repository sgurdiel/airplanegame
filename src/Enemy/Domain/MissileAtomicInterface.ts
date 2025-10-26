import { MissileInterface } from './MissileInterface';

export interface MissileAtomicInterface extends MissileInterface {
  radarAnnounce(): boolean;
  unsetRadarAnnounce(): void;
}

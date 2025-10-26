export interface BaseInterface {
  applyDamage(): void;
  radarAnnounce(): boolean;
  unsetRadarAnnounce(): void;
  getSpritePosition(): string;
  getRadarMessage(): string;
  getHealth(): number;
}

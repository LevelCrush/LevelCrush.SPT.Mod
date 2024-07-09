import { Info as BaseInfo, IAkiProfile as BaseProfile } from '@spt-aki/models/eft/profile/IAkiProfile';

export const ZONE_HARDCORE = 'hardcore';
export const ZONE_PVP = 'pvp';

export type LevelCrushZone = 'hardcore' | 'pve' | 'pvp';
export type LevelCrushZones = {
    [zone in LevelCrushZone]?: number;
};

export interface LevelCrushData {
    zones: LevelCrushZones;
    discord: string;
    attempts: number;
}

export interface IAkiProfile extends BaseProfile {
    levelcrush?: LevelCrushData;
}

export interface IAkiLevelCrushProfile extends IAkiProfile {
    levelcrush: LevelCrushData;
}

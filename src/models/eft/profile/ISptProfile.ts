import {Info as BaseInfo, ISptProfile as BaseProfile} from "@spt/models/eft/profile/ISptProfile";

export const ZONE_HARDCORE = "hardcore";
export const ZONE_PVP = "pvp";

export type LevelCrushZone = "hardcore" | "pve" | "pvp";
export type LevelCrushZones = {
    [zone in LevelCrushZone]?: number;
};

export interface LevelCrushData {
    zones: LevelCrushZones;
    discord: string;
    attempts: number;
}

export interface ISptProfile extends BaseProfile {
    levelcrush?: LevelCrushData;
}

export interface ISptLevelCrushProfile extends ISptProfile {
    levelcrush: LevelCrushData;
}

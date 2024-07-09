import { IQuest as BaseQuest } from '@spt-aki/models/eft/common/tables/IQuest';

export interface LevelCrushQuestConfig {
    hardcore?: boolean;
}

export interface IQuest extends BaseQuest {
    levelcrush?: LevelCrushQuestConfig;
}

export default IQuest;

import { IQuest as BaseQuest } from '@spt/models/eft/common/tables/IQuest';

export interface LevelCrushQuestConfig {
    hardcore?: boolean;
}

export interface IQuest extends BaseQuest {
    levelcrush?: LevelCrushQuestConfig;
}

export interface IQuestLevelCrush extends IQuest {
    levelcrush: LevelCrushQuestConfig
}

export default IQuest;

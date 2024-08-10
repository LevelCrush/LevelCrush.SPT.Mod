export interface ILevelCrushWikIQuest {
    id: string;
    title: string;
    slug: string;
    description: string;
    leads_to: string[];
    conditions_start: string[];
    conditions_complete: string[];
    trader: string;
    rewards: string[];
    tags: string[];
    locales: string[];
    image: string;
}

export type ILevelCrushWikiQuestMap = {
    [quest_id: string]: ILevelCrushWikIQuest;
};

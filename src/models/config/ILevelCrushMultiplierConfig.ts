export interface ILevelCrushMultiplierConfig {
    crafting: {
        time: number;
        amount: number;
    };
    loot: {
        global: {
            loose: number;
            static: number;
        };
    };
}

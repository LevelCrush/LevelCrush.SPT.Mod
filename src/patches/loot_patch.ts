import ILevelCrushPatch, { LevelCrushPatchTarget } from './patch';
import { DependencyContainer } from 'tsyringe';
import { ILogger } from '@spt/models/spt/utils/ILogger';
import { DatabaseServer } from '@spt/servers/DatabaseServer';
import { ConfigServer } from '@spt/servers/ConfigServer';
import { ConfigTypes } from '@spt/models/enums/ConfigTypes';
import { ILocationConfig } from '@spt/models/spt/config/ILocationConfig';
import { LevelCrushCoreConfig } from '../configs/LevelCrushCoreConfig';
import { LevelCrushMultiplierConfig } from '../configs/LevelCrushMultiplierConfig';

export class LootPatch implements ILevelCrushPatch {
    public patch_name(): string {
        return 'LootPatch';
    }

    public patch_target(): LevelCrushPatchTarget {
        return LevelCrushPatchTarget.PreSptLoadMod;
    }

    public async patch_run(container: DependencyContainer, logger: ILogger) {
        // Run patch logic here=
        const lcMultipliers = container.resolve<LevelCrushMultiplierConfig>('LevelCrushMultiplierConfig');
        const lootMultipliers = lcMultipliers.getLoot();
        const database = container.resolve<DatabaseServer>('DatabaseServer');
        const tables = database.getTables();
        const config = container.resolve<ConfigServer>('ConfigServer');
        const location_config = config.getConfig<ILocationConfig>(ConfigTypes.LOCATION);

        // increase loose loot
        for (const location in location_config.looseLootMultiplier) {
            const new_multiplier = location_config.looseLootMultiplier[location] * (lootMultipliers.global.loose || 1);
            logger.info(
                `Adjusting ${location} loose loot multiplier from: ${location_config.looseLootMultiplier[location]} to ${new_multiplier}`,
            );
            location_config.looseLootMultiplier[location] = new_multiplier;
        }

        for (const location in location_config.staticLootMultiplier) {
            const new_multiplier =
                location_config.staticLootMultiplier[location] * (lootMultipliers.global.static || 1);
            logger.info(
                `Adjusting ${location} loose loot multiplier from: ${location_config.staticLootMultiplier[location]} to ${new_multiplier}`,
            );
            location_config.staticLootMultiplier[location] = new_multiplier;
        }
    }
}

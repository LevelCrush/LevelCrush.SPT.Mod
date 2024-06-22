import ILevelCrushPatch, { LevelCrushPatchTarget } from './patch';
import CustomCoreConfig from '../custom_config';
import { DependencyContainer } from 'tsyringe';
import { ILogger } from '@spt-aki/models/spt/utils/ILogger';
import { DatabaseServer } from '@spt-aki/servers/DatabaseServer';
import { ConfigServer } from '@spt-aki/servers/ConfigServer';
import { ConfigTypes } from '@spt-aki/models/enums/ConfigTypes';
import { ILocationConfig } from '@spt-aki/models/spt/config/ILocationConfig';

export class LootPatch implements ILevelCrushPatch {
    public patch_name(): string {
        return 'LootPatch';
    }

    public patch_target(): LevelCrushPatchTarget {
        return LevelCrushPatchTarget.PreAki;
    }

    public async patch_run(lcConfig: CustomCoreConfig, container: DependencyContainer, logger: ILogger) {
        // Run patch logic here=
        const database = container.resolve<DatabaseServer>('DatabaseServer');
        const tables = database.getTables();
        const config = container.resolve<ConfigServer>('ConfigServer');
        const location_config = config.getConfig<ILocationConfig>(ConfigTypes.LOCATION);

        // increase loose loot
        for (const location in location_config.looseLootMultiplier) {
            const new_multiplier =
                location_config.looseLootMultiplier[location] * (lcConfig.global_loose_loot_multiplier || 1);
            logger.info(
                `Adjusting ${location} loose loot multiplier from: ${location_config.looseLootMultiplier[location]} to ${new_multiplier}`,
            );
            location_config.looseLootMultiplier[location] = new_multiplier;
        }

        for (const location in location_config.staticLootMultiplier) {
            const new_multiplier =
                location_config.staticLootMultiplier[location] * (lcConfig.global_static_loot_multiplier || 1);
            logger.info(
                `Adjusting ${location} loose loot multiplier from: ${location_config.staticLootMultiplier[location]} to ${new_multiplier}`,
            );
            location_config.staticLootMultiplier[location] = new_multiplier;
        }
    }
}

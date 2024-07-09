import ILevelCrushPatch, { LevelCrushPatchTarget } from './patch';
import CustomCoreConfig from '../custom_config';
import { DependencyContainer } from 'tsyringe';
import { ILogger } from '@spt-aki/models/spt/utils/ILogger';
import { DatabaseServer } from '@spt-aki/servers/DatabaseServer';
import * as path from 'path';
import fs from 'fs';

interface ConfigMultiplier {
    crafting_time: number;
    amount: number;
}

interface Config {
    global: ConfigMultiplier;
}

export class QOLRecipePatch implements ILevelCrushPatch {
    public patch_name(): string {
        return 'QOLRecipePatch';
    }

    public patch_target(): LevelCrushPatchTarget {
        return LevelCrushPatchTarget.PostDB;
    }

    public async patch_run(lcConfig: CustomCoreConfig, container: DependencyContainer, logger: ILogger): Promise<void> {
        const database = container.resolve<DatabaseServer>('DatabaseServer');
        const tables = database.getTables();

        // set a minimum time
        // at a glance this does not seem needed
        // but the server only TICKS every X seconds for crafts
        // so if the user has something that says its done. They wont be able to pick it up until the next tick when the server says its completed
        const minimum_craft_time = 11;

        // using require works to simplfy loading the json
        logger.info('Scaling hideout recipes');
        const raw = await fs.promises.readFile(path.join(lcConfig.modPath, 'config', 'crafting_multipliers.json'), {
            encoding: 'utf-8',
        });
        const multipliers = JSON.parse(raw) as Config;
        for (let i = 0; i < tables.hideout.production.length; i++) {
            const production_time = tables.hideout.production[i].productionTime;
            const scaled_production_time = Math.ceil(
                Math.max(minimum_craft_time, production_time * multipliers.global.crafting_time),
            );

            const production_amount = tables.hideout.production[i].count;
            const scaled_production_amount = Math.ceil(Math.max(1, production_amount * multipliers.global.amount));
            tables.hideout.production[i].productionTime = scaled_production_time;
            tables.hideout.production[i].count = scaled_production_amount;
        }
    }
}

export default QOLRecipePatch;

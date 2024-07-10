import ILevelCrushPatch, { LevelCrushPatchTarget } from './patch';
import { DependencyContainer } from 'tsyringe';
import { ILogger } from '@spt/models/spt/utils/ILogger';
import { DatabaseServer } from '@spt/servers/DatabaseServer';
import path from 'path';
import fs from 'fs';
import { IHideoutProduction } from '@spt/models/eft/hideout/IHideoutProduction';
import { LevelCrushCoreConfig } from '../configs/LevelCrushCoreConfig';
import { LevelCrushMultiplierConfig } from '../configs/LevelCrushMultiplierConfig';

export class RecipeLoaderPatch implements ILevelCrushPatch {
    public patch_name(): string {
        return 'RecipeLoaderPatch';
    }

    public patch_target(): LevelCrushPatchTarget {
        return LevelCrushPatchTarget.PostDB;
    }

    public async patch_run(container: DependencyContainer, logger: ILogger): Promise<void> {
        const database = container.resolve<DatabaseServer>('DatabaseServer');
        const tables = database.getTables();
        const lcConfig = container.resolve<LevelCrushCoreConfig>('LevelCrushCoreConfig');
        const recipes_to_add = [] as IHideoutProduction[];
        if (tables.hideout && tables.hideout.production) {
            // scan for recipes
            const db_path = path.join(lcConfig.modPath, 'db', 'recipes', 'new');
            const entries = await fs.promises.readdir(db_path, { encoding: 'utf-8' });
            for (const entry of entries) {
                const file_path = path.join(db_path, entry);
                const stat = await fs.promises.stat(file_path);
                if (stat.isFile()) {
                    try {
                        const raw = await fs.promises.readFile(file_path, { encoding: 'utf-8' });
                        const json = JSON.parse(raw) as IHideoutProduction[];
                        for (const production of json) {
                            recipes_to_add.push(production);
                        }
                    } catch {
                        logger.error(`Failed to parse: ${file_path}`);
                    }
                }
            }
        }

        logger.info(`Going to add ${recipes_to_add.length} total recipes`);

        // concat the base production reecipes with our new ones
        tables.hideout.production = tables.hideout.production.concat(recipes_to_add);
    }
}

export default RecipeLoaderPatch;

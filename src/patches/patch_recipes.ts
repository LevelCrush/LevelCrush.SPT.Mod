import ILevelCrushPatch, { LevelCrushPatchTarget } from './patch';
import CustomCoreConfig from '../custom_config';
import { DependencyContainer } from 'tsyringe';
import { ILogger } from '@spt-aki/models/spt/utils/ILogger';
import { DatabaseServer } from '@spt-aki/servers/DatabaseServer';
import path from 'path';
import fs from 'fs';
import * as utils from '../utils';
import { ITemplateItem } from '@spt-aki/models/eft/common/tables/ITemplateItem';
import { IHideoutProduction } from '@spt-aki/models/eft/hideout/IHideoutProduction';

export class RecipePatch implements ILevelCrushPatch {
    public patch_name(): string {
        return 'RecipePatch';
    }

    public patch_target(): LevelCrushPatchTarget {
        return LevelCrushPatchTarget.PostDB;
    }

    public async patch_run(lcConfig: CustomCoreConfig, container: DependencyContainer, logger: ILogger): Promise<void> {
        const database = container.resolve<DatabaseServer>('DatabaseServer');
        const tables = database.getTables();

        const recipes_to_override = {} as {
            [id: string]: Partial<IHideoutProduction>;
        };
        if (tables.hideout && tables.hideout.production) {
            // scan for recipes
            const db_path = path.join(lcConfig.modPath, 'db', 'recipes', 'current');
            const entries = await fs.promises.readdir(db_path, { encoding: 'utf-8' });
            for (const entry of entries) {
                const file_path = path.join(db_path, entry);
                const stat = await fs.promises.stat(file_path);
                if (stat.isFile()) {
                    try {
                        const raw = await fs.promises.readFile(file_path, { encoding: 'utf-8' });
                        const json = JSON.parse(raw) as Partial<IHideoutProduction>[];
                        for (const production of json) {
                            if (production._id) {
                                recipes_to_override[production._id] = production;
                            }
                        }
                    } catch {
                        logger.error(`Failed to parse: ${file_path}`);
                    }
                }
            }

            // now patch
            for (const production_id in recipes_to_override) {
                for (let i = 0; i < tables.hideout.production.length; i++) {
                    const production_id = tables.hideout.production[i]._id;
                    if (typeof recipes_to_override[production_id] !== 'undefined') {
                        /// production recipes are only have 1 depth. So we can just spread safely to overwrite anything twith the new production
                        tables.hideout.production[i] = {
                            ...tables.hideout.production[i],
                            ...recipes_to_override[production_id],
                        };
                    }
                }
            }
        }
    }
}

export default RecipePatch;

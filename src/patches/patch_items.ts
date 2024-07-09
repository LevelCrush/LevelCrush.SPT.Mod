import ILevelCrushPatch, { LevelCrushPatchTarget } from './patch';
import CustomCoreConfig from '../custom_config';
import { DependencyContainer } from 'tsyringe';
import { ILogger } from '@spt-aki/models/spt/utils/ILogger';
import { DatabaseServer } from '@spt-aki/servers/DatabaseServer';
import path from 'path';
import fs from 'fs';
import * as utils from '../utils';
import { ITemplateItem } from '@spt-aki/models/eft/common/tables/ITemplateItem';

export class ItemPatch implements ILevelCrushPatch {
    public patch_name(): string {
        return 'ItemPatch';
    }

    public patch_target(): LevelCrushPatchTarget {
        return LevelCrushPatchTarget.PostDB;
    }

    public async patch_run(lcConfig: CustomCoreConfig, container: DependencyContainer, logger: ILogger): Promise<void> {
        const database = container.resolve<DatabaseServer>('DatabaseServer');
        const tables = database.getTables();

        // scan
        const files = await fs.promises.readdir(path.join(lcConfig.modPath, 'db', 'items'));
        for (const entry of files) {
            const filepath = path.join(lcConfig.modPath, 'db', "items", entry);
            logger.info(`Found Item Patch at: ${filepath}`);
            const is_json = entry.endsWith('.json');
            if (is_json) {
                logger.info(`Scanning Item Patch at: ${filepath}`);
                const raw = await fs.promises.readFile(filepath, { encoding: 'utf-8' });
                const templates = JSON.parse(raw) as Record<string, Partial<ITemplateItem>>[];
                for (const template_id in templates) {
                    const template = templates[template_id];
                    logger.info(`Checkking for item template ${template_id}`);
                    if (typeof tables.templates.items[template_id] === 'undefined') {
                        // skip
                        continue;
                    }

                    logger.info(`Patching item ${template_id}`);
                    utils.merge_objs(tables.templates.items[template_id], template);
                }
            }
        }
    }
}

export default ItemPatch;

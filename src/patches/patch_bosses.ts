import ILevelCrushPatch, { LevelCrushPatchTarget } from './patch';
import CustomCoreConfig from '../custom_config';
import { DependencyContainer } from 'tsyringe';
import { ILogger } from '@spt-aki/models/spt/utils/ILogger';
import { DatabaseServer } from '@spt-aki/servers/DatabaseServer';
import path from 'path';
import fs from 'fs';
import * as utils from '../utils';
import { IBotType } from '@spt-aki/models/eft/common/tables/IBotType';

type BotMap = { [bossid: string]: Partial<IBotType> };

export class BossPatch implements ILevelCrushPatch {
    public patch_name(): string {
        return 'BossPatch';
    }

    public patch_target(): LevelCrushPatchTarget {
        return LevelCrushPatchTarget.PostDB;
    }

    public async patch_run(lcConfig: CustomCoreConfig, container: DependencyContainer, logger: ILogger): Promise<void> {
        const database = container.resolve<DatabaseServer>('DatabaseServer');
        const tables = database.getTables();

        if (tables.templates && tables.templates.quests) {
            const db_path = path.join(lcConfig.modPath, 'db', 'bosses');
            const files = fs.readdirSync(db_path, {
                encoding: 'utf-8',
            });

            // quest to patch
            let global_map = {} as BotMap;

            for (const file of files) {
                let raw = '';
                let bot = {} as Partial<IBotType>;
                // big assumption but for now it works
                const bossid = file.split('.json')[0];
                logger.info(`LC Boss Patch is trying to load override for ${bossid}`);
                try {
                    const raw = await fs.promises.readFile(path.join(db_path, file), { encoding: 'utf-8' });
                    bot = JSON.parse(raw) as IBotType;
                    console.log('Found boss: ' + bossid);
                    global_map[bossid] = bot;
                } catch {
                    logger.error('LC Patch Boss cannot parse: ' + file);
                }
            }

            for (const boss_id in global_map) {
                // make sure quest exist in database for us to modify
                if (typeof tables.bots.types[boss_id] === 'undefined') {
                    logger.warning(`Boss ${boss_id} does not exist in the database`);
                    continue;
                }
                utils.merge_objs(tables.bots.types[boss_id], global_map[boss_id]);
                logger.info(`Boss ${boss_id} has been patched, null, 2)}`);
            }
        }
    }
}

export default BossPatch;

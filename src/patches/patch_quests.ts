import ILevelCrushPatch, { LevelCrushPatchTarget } from './patch';
import CustomCoreConfig from '../custom_config';
import { DependencyContainer } from 'tsyringe';
import { ILogger } from '@spt-aki/models/spt/utils/ILogger';
import { DatabaseServer } from '@spt-aki/servers/DatabaseServer';
import * as path from 'path';
import fs from 'fs';
import * as utils from '../utils';
import { IQuest } from '@spt-aki/models/eft/common/tables/IQuest';

type QuestMap = { [quest_id: string]: Partial<IQuest> };

export class QuestPatch implements ILevelCrushPatch {
    public patch_name(): string {
        return 'QuestPatch';
    }

    public patch_target(): LevelCrushPatchTarget {
        return LevelCrushPatchTarget.PostDB;
    }

    public async patch_run(lcConfig: CustomCoreConfig, container: DependencyContainer, logger: ILogger): Promise<void> {
        const database = container.resolve<DatabaseServer>('DatabaseServer');
        const tables = database.getTables();

        // patch quest
        if (tables.templates && tables.templates.quests) {
            const db_path = path.join(lcConfig.modPath, 'db', 'quests');
            const files = await fs.promises.readdir(db_path, {
                encoding: 'utf-8',
            });

            // quest to patch
            let global_quest_map = {} as QuestMap;
            for (const file of files) {
                const raw = await fs.promises.readFile(path.join(db_path, file), { encoding: 'utf-8' });
                const quest_map = JSON.parse(raw) as QuestMap;
                console.log('Found quest map: ', quest_map);
                global_quest_map = { ...global_quest_map, ...quest_map };
            }

            for (const quest_id in global_quest_map) {
                // make sure quest exist in database for us to modify
                if (typeof tables.templates.quests[quest_id] === 'undefined') {
                    logger.warning(`Quest ${quest_id} does not exist in the database`);
                    continue;
                }

                logger.info(
                    `Trying to merge ${quest_id} ${JSON.stringify(
                        global_quest_map[quest_id],
                        null,
                        2,
                    )} into ${tables.templates.quests[quest_id].QuestName}`,
                );

                this.merge_objs(tables.templates.quests[quest_id], global_quest_map[quest_id], logger);

                logger.info(`Patched ${quest_id} is now ${JSON.stringify(tables.templates.quests[quest_id], null, 2)}`);
            }
        }

        // patch localization
        if (tables.locales && tables.locales.global) {
            const db_path = path.join(lcConfig.modPath, 'db', 'locales');
            const files = await fs.promises.readdir(db_path, {
                encoding: 'utf-8',
            });

            // localizations to patch
            const custom_locales = {} as {
                [language: string]: { [id: string]: string }[];
            };
            for (const file of files) {
                const stat = await fs.promises.stat(path.join(lcConfig.modPath, 'db', 'locales', file));
                if (stat.isDirectory()) {
                    custom_locales[file] = [];
                }
            }

            for (const locale in custom_locales) {
                const locale_files = await fs.promises.readdir(path.join(lcConfig.modPath, 'db', 'locales', locale));
                for (const file of locale_files) {
                    const fpath = path.join(lcConfig.modPath, 'db', 'locales', locale, file);
                    const stat = await fs.promises.stat(fpath);
                    if (stat.isFile()) {
                        const raw = await fs.promises.readFile(fpath, { encoding: 'utf-8' });
                        custom_locales[locale].push(JSON.parse(raw));
                    }
                }
            }

            // now merge them in
            for (const locale in custom_locales) {
                for (const map of custom_locales[locale]) {
                    for (const locale_id in map) {
                        logger.info(
                            `Patching locale ${locale} at ${locale_id} (${tables.locales.global[locale][locale_id]}) with ${map[locale_id]}`,
                        );
                        tables.locales.global[locale][locale_id] = map[locale_id];
                    }
                }
            }
        }
    }

    // recursive functiont to merge object properties

    private merge_objs(target: Record<any, any>, new_input: Record<any, any>, logger: ILogger) {
        for (const prop in target) {
            if (typeof new_input[prop] === 'undefined') {
                // we dont have a matching property in our new input. Skip over it
                //   logger.info(`No override prop for: ${prop}`);
                continue;
            }
            const current_v = target[prop];
            const is_array = Array.isArray(current_v);
            if (is_array) {
                // anything else we have to assume its a new value
                // this includes arrays since those inner values may be entirely new
                //  logger.info(`Overriding ${prop} as an array`);
                target[prop] = new_input[prop];
            } else if (typeof current_v === 'object') {
                // we need to merge these objects
                // since the two properties should be the same between the two overrides we can  assume
                // that it exist and is t he same type. if not, weird things will happen
                // probably for the best for things to break since we need them to match up
                //  logger.info(`Overriding ${prop} as an object`);
                this.merge_objs(target[prop] as Record<any, any>, new_input[prop] as Record<any, any>, logger);
            } else {
                // anything else we have to assume its a new value
                // this includes arrays since those inner values may be entirely new
                // logger.info(`Overriding ${prop} as a normal value`);
                target[prop] = new_input[prop];
            }
        }
    }
}

export default QuestPatch;

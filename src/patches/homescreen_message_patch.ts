import ILevelCrushPatch, { LevelCrushPatchTarget } from './patch';
import { DependencyContainer } from 'tsyringe';
import { ILogger } from '@spt-aki/models/spt/utils/ILogger';
import { DatabaseServer } from '@spt-aki/servers/DatabaseServer';
import { ConfigServer } from '@spt-aki/servers/ConfigServer';
import { ICoreConfig } from '@spt-aki/models/spt/config/ICoreConfig';
import { ConfigTypes } from '@spt-aki/models/enums/ConfigTypes';
import CustomCoreConfig from '../custom_config';

const LOCALE_ATTENTION_ID = 'Attention! This is a Beta version of Escape from Tarkov for testing purposes.';
const LOCALE_NDA_ID = 'NDA free warning';

export class HomeScreenMessagePatch implements ILevelCrushPatch {
    public patch_name(): string {
        return 'HomeScreenMessagePatch';
    }

    /**
     * Run this patch Post AKI DB load
     */
    public patch_target(): LevelCrushPatchTarget {
        return LevelCrushPatchTarget.PostDB;
    }

    /**
     * Run whatever our patch needs to do
     * @param lcConfig
     * @param container
     * @param logger
     */
    public async patch_run(lcConfig: CustomCoreConfig, container: DependencyContainer, logger: ILogger) {
        // Run patch logic here

        const database = container.resolve<DatabaseServer>('DatabaseServer');
        const tables = database.getTables();

        for (const lang in tables.locales.global) {
            tables.locales.global[lang][LOCALE_ATTENTION_ID] = lcConfig.serverName;
            tables.locales.global[lang][LOCALE_NDA_ID] = lcConfig.home_submessage;
        }

        return true;
    }
}

export default HomeScreenMessagePatch;

import ILevelCrushPatch, { LevelCrushPatchTarget } from './patch';
import { DependencyContainer } from 'tsyringe';
import { ILogger } from '@spt/models/spt/utils/ILogger';
import { DatabaseServer } from '@spt/servers/DatabaseServer';
import { ConfigServer } from '@spt/servers/ConfigServer';
import { ICoreConfig } from '@spt/models/spt/config/ICoreConfig';
import { ConfigTypes } from '@spt/models/enums/ConfigTypes';
import CustomCoreConfig from '../custom_config';
import LevelCrushCoreConfig from '../configs/LevelCrushCoreConfig';

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
    public async patch_run(container: DependencyContainer, logger: ILogger) {
        // Run patch logic here

        const lcConfig = container.resolve<LevelCrushCoreConfig>('LevelCrushCoreConfig').getConfig();
        const database = container.resolve<DatabaseServer>('DatabaseServer');
        const tables = database.getTables();

        for (const lang in tables.locales.global) {
            tables.locales.global[lang][LOCALE_ATTENTION_ID] = lcConfig.serverName;
            tables.locales.global[lang][LOCALE_NDA_ID] = lcConfig.motd;
        }

        return true;
    }
}

export default HomeScreenMessagePatch;

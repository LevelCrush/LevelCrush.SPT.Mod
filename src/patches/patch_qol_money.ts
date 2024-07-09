import ILevelCrushPatch, { LevelCrushPatchTarget } from './patch';
import CustomCoreConfig from '../custom_config';
import { DependencyContainer } from 'tsyringe';
import { ILogger } from '@spt-aki/models/spt/utils/ILogger';
import { DatabaseServer } from '@spt-aki/servers/DatabaseServer';
import { ConfigServer } from '@spt-aki/servers/ConfigServer';
import { IRagfairConfig } from '@spt-aki/models/spt/config/IRagfairConfig';
import { ConfigTypes } from '@spt-aki/models/enums/ConfigTypes';
import { IDatabaseTables } from '@spt-aki/models/spt/server/IDatabaseTables';

export class QOLMoneyPatch implements ILevelCrushPatch {
    public patch_name(): string {
        return 'QOLMoneyPatch';
    }

    public patch_target(): LevelCrushPatchTarget {
        return LevelCrushPatchTarget.PostDB;
    }

    public async patch_run(lcConfig: CustomCoreConfig, container: DependencyContainer, logger: ILogger): Promise<void> {
        const database = container.resolve<DatabaseServer>('DatabaseServer');
        const tables = database.getTables();

        // 5449016a4bdc2d6f028b456f = Rubles
        // 5696686a4bdc2da3298b456a = USD
        // 569668774bdc2da2298b4568 = EUROS
        const target_templates = ['5449016a4bdc2d6f028b456f', '5696686a4bdc2da3298b456a', '569668774bdc2da2298b4568'];
        // 100 million rouble
        const stack_limit = 100000000;
        if (tables.globals && tables.templates.items) {
            logger.debug('Applying QOL money fixes');
            for (const template_id of target_templates) {
                tables.templates.items[template_id]._props.StackMaxSize = stack_limit;
                tables.templates.items[template_id]._props.DiscardLimit = stack_limit;
            }
            logger.debug('Done applying QOL money fixes');
        }
    }
}

export default QOLMoneyPatch;

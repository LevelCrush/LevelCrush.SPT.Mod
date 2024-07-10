import ILevelCrushPatch, { LevelCrushPatchTarget } from './patch';
import { DependencyContainer } from 'tsyringe';
import { ILogger } from '@spt/models/spt/utils/ILogger';
import { DatabaseServer } from '@spt/servers/DatabaseServer';
import { ConfigServer } from '@spt/servers/ConfigServer';
import { IRagfairConfig } from '@spt/models/spt/config/IRagfairConfig';
import { ConfigTypes } from '@spt/models/enums/ConfigTypes';
import { IDatabaseTables } from '@spt/models/spt/server/IDatabaseTables';

export class QOLNoRestrictionsPatch implements ILevelCrushPatch {
    public patch_name(): string {
        return 'QOLNoRestrictionsPatch';
    }

    public patch_target(): LevelCrushPatchTarget {
        return LevelCrushPatchTarget.PreSptLoadModAndPostDB;
    }

    public async patch_preaki(container: DependencyContainer, logger: ILogger) {
        // Get SPT code/data we need later
        const configServer = container.resolve<ConfigServer>('ConfigServer');
        const ragfairConfig = configServer.getConfig<IRagfairConfig>(ConfigTypes.RAGFAIR);

        // disable bsg blacklist
        logger.info('No restrictions is removing the bsg blacklist');
        ragfairConfig.dynamic.blacklist.enableBsgList = false;

        // allowing armor class 6 plates
        // disable euros from being generated on the flea market
        logger.info('Removing EUROS from being listable');
        ragfairConfig.dynamic.currencies['569668774bdc2da2298b4568'] = 0;

        logger.info('Max Armor Plates allowed are armor class 99');
        ragfairConfig.dynamic.blacklist.armorPlate.maxProtectionLevel = 99;
    }

    public async patch_postdb(container: DependencyContainer, logger: ILogger) {
        // Resolve SPT classes we'll use
        const databaseServer: DatabaseServer = container.resolve<DatabaseServer>('DatabaseServer');
        const configServer = container.resolve<ConfigServer>('ConfigServer');
        const ragfairConfig = configServer.getConfig<IRagfairConfig>(ConfigTypes.RAGFAIR);

        // Get a reference to the database tables
        const tables = databaseServer.getTables();

        const handbook_searches = [];
        if (tables.globals) {
            logger.debug('Lifting Restrictions on all items');
            for (const restriction of tables.globals.config.RestrictionsInRaid) {
                restriction['MaxInLobby'] = 999999;
                restriction['MaxInRaid'] = 999999;

                const template_id = restriction.TemplateId;
                tables.templates.items[template_id]._props.DiscardLimit = -1;
                tables.templates.items[template_id]._props.CanSellOnRagfair = true;
            }

            ammo_flea_market(logger, tables);
        }

        // enable not found in raid
        if (tables.globals) {
            logger.info('Enabling Not Found In Raid Flea Market');
            tables.globals.config.RagFair.isOnlyFoundInRaidAllowed = false;
        }
    }

    public async patch_run(
        container: DependencyContainer,
        logger: ILogger,
        target: LevelCrushPatchTarget,
    ): Promise<void> {
        const database = container.resolve<DatabaseServer>('DatabaseServer');
        const tables = database.getTables();

        switch (target) {
            case LevelCrushPatchTarget.PreSptLoadMod:
                await this.patch_preaki(container, logger);
                break;
            case LevelCrushPatchTarget.PostDB:
                await this.patch_postdb(container, logger);
                break;
            default:
                logger.info('Unsupported method');
                break;
        }
    }
}

export function ammo_flea_market(logger: ILogger, tables: IDatabaseTables) {
    const handbook_searches = [];
    logger.info('Scanning item database for ammunition');
    for (const template_id in tables.templates.items) {
        if (
            tables.templates.items[template_id]._props.ammoType &&
            tables.templates.items[template_id]._props.ammoType === 'bullet'
        ) {
            handbook_searches.push(template_id);
        }
    }

    logger.info(`Adjusting pricing for ammo on ${handbook_searches.length} items`);
    for (let i = 0; i < tables.templates.handbook.Items.length; i++) {
        if (handbook_searches.includes(tables.templates.handbook.Items[i].Id)) {
            const template_id = tables.templates.handbook.Items[i].Id;
            logger.info(
                `Adjusting base flea market price for ${tables.templates.items[template_id]._name} to be 6x normal rate`,
            );
            tables.templates.prices[template_id] = tables.templates.handbook.Items[i].Price * 12;
        }
    }
    logger.debug('Done Lifting Restrictions on all items');
}

export default QOLNoRestrictionsPatch;

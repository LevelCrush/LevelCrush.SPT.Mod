import {DependencyContainer} from 'tsyringe';

// SPT types
import {IPreAkiLoadMod} from '@spt-aki/models/external/IPreAkiLoadMod';
import {IPostDBLoadMod} from '@spt-aki/models/external/IPostDBLoadMod';
import {ILogger} from '@spt-aki/models/spt/utils/ILogger';
import {PreAkiModLoader} from '@spt-aki/loaders/PreAkiModLoader';
import {DatabaseServer} from '@spt-aki/servers/DatabaseServer';
import {ImageRouter} from '@spt-aki/routers/ImageRouter';
import {ConfigServer} from '@spt-aki/servers/ConfigServer';
import {ConfigTypes} from '@spt-aki/models/enums/ConfigTypes';
import {ITraderConfig} from '@spt-aki/models/spt/config/ITraderConfig';
import {IRagfairConfig} from '@spt-aki/models/spt/config/IRagfairConfig';
import {JsonUtil} from '@spt-aki/utils/JsonUtil';
import {HashUtil} from '@spt-aki/utils/HashUtil';
import {IDatabaseTables} from '@spt-aki/models/spt/server/IDatabaseTables';

export class LC_QOL_NoRestrictions implements IPreAkiLoadMod, IPostDBLoadMod {
    private mod: string;
    private logger: ILogger;

    constructor() {
        this.mod = 'LevelCrush-QOL-NoRestrictions'; // Set name of mod so we can log it to console later
    }

    /**
     * Some work needs to be done prior to SPT code being loaded, registering the profile image + setting trader update time inside the trader config json
     * @param container Dependency container
     */
    public preAkiLoad(container: DependencyContainer): void {
        // Get a logger
        this.logger = container.resolve<ILogger>('WinstonLogger');
        this.logger.debug(`[${this.mod}] preAki Loading... `);

        // Get SPT code/data we need later
        const configServer = container.resolve<ConfigServer>('ConfigServer');
        const ragfairConfig = configServer.getConfig<IRagfairConfig>(ConfigTypes.RAGFAIR);

        // disable bsg blacklist
        this.logger.info('No restrictions is removing the bsg blacklist');
        ragfairConfig.dynamic.blacklist.enableBsgList = false;

        // allowing armor class 6 plates
        // disable euros from being generated on the flea market
        this.logger.info('Removing EUROS from being listable');
        ragfairConfig.dynamic.currencies['569668774bdc2da2298b4568'] = 0;

        this.logger.info('Max Armor Plates allowed are armor class 99');
        ragfairConfig.dynamic.blacklist.armorPlate.maxProtectionLevel = 99;

        this.logger.debug(`[${this.mod}] preAki Loaded`);
    }

    /**
     * Majority of trader-related work occurs after the aki database has been loaded but prior to SPT code being run
     * @param container Dependency container
     */
    public postDBLoad(container: DependencyContainer): void {
        this.logger.debug(`[${this.mod}] postDb Loading... `);

        // Resolve SPT classes we'll use
        const databaseServer: DatabaseServer = container.resolve<DatabaseServer>('DatabaseServer');
        const configServer = container.resolve<ConfigServer>('ConfigServer');
        const ragfairConfig = configServer.getConfig<IRagfairConfig>(ConfigTypes.RAGFAIR);

        // Get a reference to the database tables
        const tables = databaseServer.getTables();

        const handbook_searches = [];
        if (tables.globals) {
            this.logger.debug('Lifting Restrictions on all items');
            for (const restriction of tables.globals.config.RestrictionsInRaid) {
                restriction['MaxInLobby'] = 999999;
                restriction['MaxInRaid'] = 999999;

                const template_id = restriction.TemplateId;
                tables.templates.items[template_id]._props.DiscardLimit = -1;
                tables.templates.items[template_id]._props.CanSellOnRagfair = true;
            }

            ammo_flea_market(this.logger, tables);
        }

        // enable not found in raid
        if (tables.globals) {
            this.logger.info("Enabling Not Found In Raid Flea Market");
            tables.globals.config.RagFair.isOnlyFoundInRaidAllowed = false;
        }

        this.logger.debug(`[${this.mod}] postDb Loaded`);
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

//module.exports = { mod: new LC_QOL_NoRestrictions() };

export const mod = new LC_QOL_NoRestrictions();
export default LC_QOL_NoRestrictions;

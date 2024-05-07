import { DependencyContainer } from 'tsyringe';

// SPT types
import { IPreAkiLoadMod } from '@spt-aki/models/external/IPreAkiLoadMod';
import { IPostDBLoadMod } from '@spt-aki/models/external/IPostDBLoadMod';
import { ILogger } from '@spt-aki/models/spt/utils/ILogger';
import { PreAkiModLoader } from '@spt-aki/loaders/PreAkiModLoader';
import { DatabaseServer } from '@spt-aki/servers/DatabaseServer';
import { ImageRouter } from '@spt-aki/routers/ImageRouter';
import { ConfigServer } from '@spt-aki/servers/ConfigServer';
import { ConfigTypes } from '@spt-aki/models/enums/ConfigTypes';
import { ITraderConfig } from '@spt-aki/models/spt/config/ITraderConfig';
import { IRagfairConfig } from '@spt-aki/models/spt/config/IRagfairConfig';
import { JsonUtil } from '@spt-aki/utils/JsonUtil';

// New trader settings
import * as baseJson from '../db/base.json';
import { TraderHelper } from './traderHelpers';
import { FluentAssortConstructor } from './fluentTraderAssortCreator';
import { Money } from '@spt-aki/models/enums/Money';
import { Traders } from '@spt-aki/models/enums/Traders';
import { HashUtil } from '@spt-aki/utils/HashUtil';
import Scanner from './scanner';
import { IDatabaseTables } from '@spt-aki/models/spt/server/IDatabaseTables';

class BlacksmithTrader implements IPreAkiLoadMod, IPostDBLoadMod {
    private mod: string;
    private logger: ILogger;
    private traderHelper: TraderHelper;
    private fluentTraderAssortHeper: FluentAssortConstructor;

    constructor() {
        this.mod = 'LevelCrush-Trader-Blacksmith'; // Set name of mod so we can log it to console later
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
        const preAkiModLoader: PreAkiModLoader = container.resolve<PreAkiModLoader>('PreAkiModLoader');
        const imageRouter: ImageRouter = container.resolve<ImageRouter>('ImageRouter');
        const hashUtil: HashUtil = container.resolve<HashUtil>('HashUtil');
        const configServer = container.resolve<ConfigServer>('ConfigServer');
        const traderConfig: ITraderConfig = configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER);
        const ragfairConfig = configServer.getConfig<IRagfairConfig>(ConfigTypes.RAGFAIR);

        // Create helper class and use it to register our traders image/icon + set its stock refresh time
        this.traderHelper = new TraderHelper();
        this.fluentTraderAssortHeper = new FluentAssortConstructor(hashUtil, this.logger);
        this.traderHelper.registerProfileImage(baseJson, this.mod, preAkiModLoader, imageRouter, 'blacksmith.jpg');
        this.traderHelper.setTraderUpdateTime(traderConfig, baseJson, 3600, 4000);

        // Add trader to trader enum
        Traders[baseJson._id] = baseJson._id;

        // Add trader to flea market
        ragfairConfig.traders[baseJson._id] = true;

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
        const configServer: ConfigServer = container.resolve<ConfigServer>('ConfigServer');
        const jsonUtil: JsonUtil = container.resolve<JsonUtil>('JsonUtil');

        // Get a reference to the database tables
        const tables = databaseServer.getTables();

        this.logger.info('Creating blacksmith');
        // Add new trader to the trader dictionary in DatabaseServer - has no assorts (items) yet
        this.traderHelper.addTraderToDb(baseJson, tables, jsonUtil);

        const items = tables.templates.items;
        const hideout = tables.hideout;
        const prices_flat = tables.templates.handbook.Items;

        this.logger.info('Generating Price map from handook');
        const prices = {} as {
            [tpl: string]: IDatabaseTables['templates']['handbook']['Items'][0]['Price'];
        };

        for (const price_obj of prices_flat) {
            prices[price_obj.Id] = price_obj.Price;
        }

        if (items && hideout && prices) {
            this.logger.debug('Blacksmith has started to scan');

            let scanner = new Scanner();
            let trader_map = scanner.required_items_for_crafts(items, prices, hideout);

            //console.log(trader_map);

            for (const trader_level in trader_map) {
                const trader_level_parsed = parseInt(trader_level);
                for (const item_id in trader_map[trader_level]) {
                    const price = trader_map[trader_level][item_id];
                    if (
                        tables.templates.items[item_id]._props.ammoType &&
                        tables.templates.items[item_id]._props.ammoType === 'bullet'
                    ) {
                        this.fluentTraderAssortHeper
                            .createSingleAssortItem(item_id)
                            .addUnlimitedStackCount()
                            .addBuyRestriction(200)
                            .addMoneyCost(Money.ROUBLES, price)
                            .addLoyaltyLevel(trader_level_parsed)
                            .export(tables.traders[baseJson._id]);
                    } else {
                        this.fluentTraderAssortHeper
                            .createSingleAssortItem(item_id)
                            .addUnlimitedStackCount()
                            .addMoneyCost(Money.ROUBLES, price)
                            .addLoyaltyLevel(trader_level_parsed)
                            .export(tables.traders[baseJson._id]);
                    }
                }
            }

            this.logger.debug('Blacksmith has stopped scanning');
        } else {
            this.logger.debug('Blacksmith is skipping on scanning');
        }

        // Add trader to locale file, ensures trader text shows properly on screen
        // WARNING: adds the same text to ALL locales (e.g. chinese/french/english)
        this.traderHelper.addTraderToLocales(
            baseJson,
            tables,
            baseJson.name,
            'Blacksmith',
            baseJson.nickname,
            baseJson.location,
            '[REDACTED]',
        );

        this.logger.debug(`[${this.mod}] postDb Loaded`);
    }
}

module.exports = { mod: new BlacksmithTrader() };

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
import { HashUtil } from '@spt-aki/utils/HashUtil';

import * as fs from 'fs';
import path from 'path';
import { IQuest } from '@spt-aki/models/eft/common/tables/IQuest';
import { IHideoutProduction } from '@spt-aki/models/eft/hideout/IHideoutProduction';

interface ConfigMultiplier {
    crafting_time: number;
    amount: number;
}

interface Config {
    global: ConfigMultiplier;
}

class LC_Qol_Recipes implements IPreAkiLoadMod, IPostDBLoadMod {
    private mod: string;
    private logger: ILogger;
    private modPath: string;

    constructor() {
        this.mod = 'LevelCrush-QOL-Recipes'; // Set name of mod so we can log it to console later
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

        this.modPath = preAkiModLoader.getModPath(this.mod);

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

        // Get a reference to the database tables
        const tables = databaseServer.getTables();

        //  this.logger.info("Force set on the database tables");
        // databaseServer.setTables(tables);

        // set a minimum time
        // at a glance this does not seem needed
        // but the server only TICKS every X seconds for crafts
        // so if the user has something that says its done. They wont be able to pick it up until the next tick when the server says its completed
        const minimum_craft_time = 11;

        // using require works to simplfy loading the json
        this.logger.info('Scaling hideout recipes');
        const multipliers = require('../config/multipliers.json') as Config;
        for (let i = 0; i < tables.hideout.production.length; i++) {
            const production_time = tables.hideout.production[i].productionTime;
            const scaled_production_time = Math.ceil(
                Math.max(minimum_craft_time, production_time * multipliers.global.crafting_time),
            );

            const production_amount = tables.hideout.production[i].count;
            const scaled_production_amount = Math.ceil(Math.max(1, production_amount * multipliers.global.amount));
            tables.hideout.production[i].productionTime = scaled_production_time;
            tables.hideout.production[i].count = scaled_production_amount;
        }

        this.logger.debug(`[${this.mod}] postDb Loaded`);
    }
}

module.exports = { mod: new LC_Qol_Recipes() };

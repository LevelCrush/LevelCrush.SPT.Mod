import { DependencyContainer } from 'tsyringe';

// SPT types
import { IPreAkiLoadMod } from '@spt-aki/models/external/IPreAkiLoadMod';
import { IPostDBLoadMod } from '@spt-aki/models/external/IPostDBLoadMod';
import { ILogger } from '@spt-aki/models/spt/utils/ILogger';
import { PreAkiModLoader } from '@spt-aki/loaders/PreAkiModLoader';
import { DatabaseServer } from '@spt-aki/servers/DatabaseServer';
import { ImageRouter } from '@spt-aki/routers/ImageRouter';
import { ConfigServer } from '@spt-aki/servers/ConfigServer';
import { HashUtil } from '@spt-aki/utils/HashUtil';
import { IPreAkiLoadModAsync } from '@spt-aki/models/external/IPreAkiLoadModAsync';
import { IPostDBLoadModAsync } from '@spt-aki/models/external/IPostDBLoadModAsync';
import { ConfigTypes } from '@spt-aki/models/enums/ConfigTypes';
import { ICoreConfig } from '@spt-aki/models/spt/config/ICoreConfig';
import * as fs from 'fs';
import * as path from 'path';

interface CustomCoreConfig extends ICoreConfig {
    dev: boolean;
}

class LevelCrushServerInformation implements IPreAkiLoadModAsync, IPostDBLoadModAsync {
    private mod: string;
    private logger: ILogger;
    private modPath: string;

    constructor() {
        this.mod = 'LevelCrush-Server-Information'; // Set name of mod so we can log it to console later
    }

    private async load_config() : Promise<CustomCoreConfig|null> {

        try {
            const stat = await fs.promises.stat(path.join(this.modPath,"..","config","core.json"));
            if(stat.isFile()) {
                return require('../config/core.json');
            } else {
                return null;
            }
        } catch {
            return null;
        }


    }

    /**
     * Some work needs to be done prior to SPT code being loaded, registering the profile image + setting trader update time inside the trader config json
     * @param container Dependency container
     */
    public async preAkiLoadAsync(container: DependencyContainer): Promise<void> {
        // Get a logger
        this.logger = container.resolve<ILogger>('WinstonLogger');
        this.logger.debug(`[${this.mod}] preAki Loading... `);

        // Get SPT code/data we need later
        const preAkiModLoader: PreAkiModLoader = container.resolve<PreAkiModLoader>('PreAkiModLoader');
        this.modPath = preAkiModLoader.getModPath(this.mod);


        const configServer = container.resolve<ConfigServer>('ConfigServer');
        const core_config = configServer.getConfig<ICoreConfig>(ConfigTypes.CORE);

        this.logger.info("LC Server Info is attempting to load configuration");
        let config = await this.load_config();
        if(config === null) {
            // clone the config
            const base_config = JSON.parse(JSON.stringify(core_config));

            // set any custom options here
            base_config['dev'] = true;

            this.logger.info("LC Server Info is creating a custom core.json");
            await fs.promises.writeFile(path.join(this.modPath,"..","config","core.json"), JSON.stringify(base_config), 'utf8');
            config = await this.load_config() as CustomCoreConfig;
        }

        this.logger.info("LC Server Info is loading package.json");
        const package_json = require('../package.json');

        this.logger.info("LC Server Info is overriding server name");
        core_config.serverName = (config.dev ? '[Dev]' : '') + config.serverName + ' ' + package_json['version'];



        this.logger.debug(`[${this.mod}] preAki Loaded`);
    }

    /**
     * POST DB code
     * @param container Dependency container
     */
    public async postDBLoadAsync(container: DependencyContainer): Promise<void> {
        this.logger.debug(`[${this.mod}] postDb Loading... `);

        // Resolve SPT classes we'll use
        const databaseServer: DatabaseServer = container.resolve<DatabaseServer>('DatabaseServer');
        const configServer: ConfigServer = container.resolve<ConfigServer>('ConfigServer');

        this.logger.debug(`[${this.mod}] postDb Loaded`);
    }
}

module.exports = { mod: new LevelCrushServerInformation() };

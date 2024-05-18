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

        const configServer = container.resolve<ConfigServer>('ConfigServer');
        const core_config = configServer.getConfig<ICoreConfig>(ConfigTypes.CORE);

        const stat = await fs.promises.stat('../config/core.json');

        core_config.serverName = 'Level Crush EXP v1.6.0';

        this.modPath = preAkiModLoader.getModPath(this.mod);

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

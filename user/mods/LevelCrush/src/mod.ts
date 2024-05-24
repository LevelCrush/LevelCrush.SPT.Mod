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
import CustomCoreConfig from './custom_config';
import ILevelCrushPatch, { LevelCrushPatchTarget } from './patches/patch';
import HomeScreenMessagePatch from './patches/homescreen_message_patch';
import { ProfilePatch } from './patches/profile_patch';
import PocketPatch from './patches/pocket_patch';

class LevelCrushServerInformation implements IPreAkiLoadModAsync, IPostDBLoadModAsync {
    private readonly mod: string;
    private logger: ILogger;
    private modPath: string;

    private patch_results: Record<string, any>;
    private patches: ILevelCrushPatch[];
    private lc_core_config: CustomCoreConfig;

    constructor() {
        this.mod = 'LevelCrush-Server-Information'; // Set name of mod so we can log it to console later
        this.patch_results = {};
        this.patches = [];
    }

    private async load_config(): Promise<CustomCoreConfig | null> {
        try {
            const config_path = path.join(this.modPath, 'config', 'core.json');
            this.logger.info(`Config path: ${config_path}`);
            const stat = await fs.promises.stat(config_path);
            if (stat.isFile()) {
                this.logger.info('Loading core.json via require');
                return require('../config/core.json');
            } else {
                this.logger.info('core.json was not a file');
                return null;
            }
        } catch (err) {
            this.logger.info(`Something went wrong while trying to get core.json: ${err}`);
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

        this.logger.info('LC Server Info is attempting to load configuration');
        let config = await this.load_config();
        if (config === null) {
            // clone the config
            const base_config = JSON.parse(JSON.stringify(core_config));

            // set any custom options here
            base_config['dev'] = true;
            base_config['home_submessage'] = 'Enjoy your stay in tarkov.';

            this.logger.info('LC Server Info is creating a custom core.json');
            await fs.promises.writeFile(
                path.join(this.modPath, 'config', 'core.json'),
                JSON.stringify(base_config),
                'utf8',
            );
            config = (await this.load_config()) as CustomCoreConfig;
        }

        this.logger.info('LC Server Info is loading package.json');
        const package_json = require('../package.json');

        this.logger.info('LC Server Info is overriding server name');
        core_config.serverName = (config.dev ? '[Dev] ' : '') + config.serverName + ' ' + package_json['version'];

        // now merge new properties in
        this.logger.info('LC Server Info is merging other custom core config properties');
        for (const new_prop in config) {
            if (new_prop === 'serverName') {
                // we have already applied logic to this property in the core config
                continue;
            }
            core_config[new_prop] = config[new_prop];
        }

        this.lc_core_config = core_config as CustomCoreConfig;

        // add the patches
        this.patches = [new HomeScreenMessagePatch(), new ProfilePatch(), new PocketPatch()] as ILevelCrushPatch[];

        // let anything that has a patch target of PreAki run now
        this.logger.info(`Total Custom Patches: ${this.patches.length}`);
        for (let i = 0; i < this.patches.length; i++) {
            if (this.patches[i].patch_target() === LevelCrushPatchTarget.PreAki) {
                this.logger.debug(`Executing ${this.patches[i].patch_name()} inside PreAki`);
                this.patch_results[this.patches[i].patch_name()] = this.patches[i].patch_run(
                    this.lc_core_config,
                    container,
                    this.logger,
                );
                this.logger.debug(`Finished ${this.patches[i].patch_name()} inside  PreAki`);
            }
        }

        this.logger.debug(`[${this.mod}] preAki Loaded`);
    }

    /**
     * POST DB code
     * @param container Dependency container
     */
    public async postDBLoadAsync(container: DependencyContainer): Promise<void> {
        this.logger.debug(`[${this.mod}] postDb Loading... `);

        // let anything that has a patch target of PreAki run now
        for (let i = 0; i < this.patches.length; i++) {
            if (this.patches[i].patch_target() === LevelCrushPatchTarget.PostDB) {
                this.logger.debug(`Executing ${this.patches[i].patch_name()} inside PostDB`);
                this.patch_results[this.patches[i].patch_name()] = this.patches[i].patch_run(
                    this.lc_core_config,
                    container,
                    this.logger,
                );
                this.logger.debug(`Finished ${this.patches[i].patch_name()} inside PostDB`);
            }
        }

        this.logger.debug(`[${this.mod}] postDb Loaded`);
    }
}

module.exports = { mod: new LevelCrushServerInformation() };

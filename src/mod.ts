import { DependencyContainer } from 'tsyringe';

// SPT types
import { ILogger } from '@spt-aki/models/spt/utils/ILogger';
import { PreAkiModLoader } from '@spt-aki/loaders/PreAkiModLoader';
import { ConfigServer } from '@spt-aki/servers/ConfigServer';
import { IPreAkiLoadModAsync } from '@spt-aki/models/external/IPreAkiLoadModAsync';
import { IPostDBLoadModAsync } from '@spt-aki/models/external/IPostDBLoadModAsync';
import { ConfigTypes } from '@spt-aki/models/enums/ConfigTypes';
import { ICoreConfig } from '@spt-aki/models/spt/config/ICoreConfig';
import * as fs from 'fs';
import * as path from 'path';
import CustomCoreConfig from './custom_config';
import ILevelCrushPatch, { LevelCrushPatchTarget } from './patches/patch';
import HomeScreenMessagePatch from './patches/homescreen_message_patch';
import ProfilePatch from './patches/profile_patch';
import PocketPatch from './patches/pocket_patch';
import { LootPatch } from './patches/loot_patch';
import BossPatch from './patches/patch_bosses';
import ItemPatch from './patches/patch_items';
import RecipePatch from './patches/patch_recipes';
import RecipeLoaderPatch from './patches/patch_recipe_loader';
import QOLNoRestrictionsPatch from './patches/patch_qol_norestrictions';
import QOLMoneyPatch from './patches/patch_qol_money';
import QOLRecipePatch from './patches/patch_qol_recipes';
import QuestPatch from './patches/patch_quests';
import HardcoreZonePatch from './patches/patch_hardcore_zone';

class LevelCrushServerInformation implements IPreAkiLoadModAsync, IPostDBLoadModAsync {
    private readonly mod: string;
    private logger: ILogger;
    private modPath: string;

    private patch_results: Record<string, any>;
    private patches: ILevelCrushPatch[];
    private lc_core_config: CustomCoreConfig;

    constructor() {
        this.mod = 'LevelCrush'; // Set name of mod so we can log it to console later
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
            base_config['global_loose_loot_multiplier'] = 1;
            base_config['global_static_loot_multiplier'] = 1;
            base_config['modPath'] = this.modPath;

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
        this.lc_core_config['modPath'] = this.modPath;

        // add the patches
        this.patches = [
            new HomeScreenMessagePatch(),
            new PocketPatch(),
            new ProfilePatch(),
            new LootPatch(),
            new ItemPatch(),
            new BossPatch(),
            new RecipePatch(),
            new QuestPatch(),
            new RecipeLoaderPatch(),
            new QOLNoRestrictionsPatch(),
            new QOLMoneyPatch(),
            new QOLRecipePatch(),
            new HardcoreZonePatch(),
        ] as ILevelCrushPatch[];

        // let anything that has a patch target of PreAki run now
        this.logger.info(`Total Custom Patches: ${this.patches.length}`);
        let patch_types_allowed = [LevelCrushPatchTarget.PreAkiAndPostDB, LevelCrushPatchTarget.PreAki];
        for (let i = 0; i < this.patches.length; i++) {
            if (patch_types_allowed.includes(this.patches[i].patch_target())) {
                this.logger.debug(`Executing ${this.patches[i].patch_name()} inside PreAki`);
                this.patch_results[this.patches[i].patch_name()] = await this.patches[i].patch_run(
                    this.lc_core_config,
                    container,
                    this.logger,
                    LevelCrushPatchTarget.PreAki,
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
        let patch_types_allowed = [LevelCrushPatchTarget.PreAkiAndPostDB, LevelCrushPatchTarget.PostDB];
        for (let i = 0; i < this.patches.length; i++) {
            if (patch_types_allowed.includes(this.patches[i].patch_target())) {
                this.logger.debug(`Executing ${this.patches[i].patch_name()} inside PostDB`);
                this.patch_results[this.patches[i].patch_name()] = await this.patches[i].patch_run(
                    this.lc_core_config,
                    container,
                    this.logger,
                    LevelCrushPatchTarget.PostDB,
                );
                this.logger.debug(`Finished ${this.patches[i].patch_name()} inside PostDB`);
            }
        }

        this.logger.debug(`[${this.mod}] postDb Loaded`);
    }
}

module.exports = { mod: new LevelCrushServerInformation() };

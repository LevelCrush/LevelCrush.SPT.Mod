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
import { ITemplateItem } from '@spt-aki/models/eft/common/tables/ITemplateItem';
import { IPreAkiLoadModAsync } from '@spt-aki/models/external/IPreAkiLoadModAsync';
import { IPostAkiLoadModAsync } from '@spt-aki/models/external/IPostAkiLoadModAsync';
import { IPostDBLoadModAsync } from '@spt-aki/models/external/IPostDBLoadModAsync';
import { HttpFileUtil } from '@spt-aki/utils/HttpFileUtil';
import DiscordWebhook, { DiscordWebhookColors } from './webhook';

class LC_Discord_Webhooks implements IPreAkiLoadModAsync, IPostAkiLoadModAsync, IPostDBLoadModAsync {
    private mod: string;
    private logger: ILogger;
    private modPath: string;

    constructor() {
        this.mod = 'LevelCrush-Discord-Webhooks'; // Set name of mod so we can log it to console later
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

        this.logger.debug(`[${this.mod}] preAki Loaded`);
        this.logger.debug('Setting up sigterm and sigint handlers');

        process.once('SIGKILL', async (code) => {
            const webhook = new DiscordWebhook(this.logger);
            await webhook.send('Server was killed', 'The server has been forced kill', DiscordWebhookColors.Red);
            process.exit();
        });

        process.once('SIGINT', async (code) => {
            const webhook = new DiscordWebhook(this.logger);
            await webhook.send(
                'Server has been interrupted',
                'The server has been interrupted and is shutting down',
                DiscordWebhookColors.Red,
            );
            process.exit();
        });

        process.once('beforeExit', async () => {
            const webhook = new DiscordWebhook(this.logger);
            await webhook.send(
                'Server has started to shutdown',
                'The server has been signaled to shutdown',
                DiscordWebhookColors.Red,
            );
            process.exit();
        });

        process.once('exit', async () => {
            const webhook = new DiscordWebhook(this.logger);
            await webhook.send('Server has exited', 'The server should now be shutdown', DiscordWebhookColors.Red);
            process.exit();
        });
    }

    /**
     * Majority of trader-related work occurs after the aki database has been loaded but prior to SPT code being run*/
    public async postDBLoadAsync(container: DependencyContainer): Promise<void> {
        this.logger.debug(`[${this.mod}] postDb Loading... `);

        // databaseServer.setTables(tables);

        this.logger.debug(`[${this.mod}] postDb Loaded`);
    }

    public async postAkiLoadAsync(container: DependencyContainer): Promise<void> {
        this.logger.info('AKI Done loading');

        const webhook = new DiscordWebhook(this.logger);
        await webhook.send(
            'Server Started',
            'The server has started and can now be connected to',
            DiscordWebhookColors.Green,
        );
    }
}

module.exports = { mod: new LC_Discord_Webhooks() };

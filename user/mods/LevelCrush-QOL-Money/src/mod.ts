import { DependencyContainer } from 'tsyringe';

// SPT types
import { ILogger } from '@spt-aki/models/spt/utils/ILogger';
import { DatabaseServer } from '@spt-aki/servers/DatabaseServer';
import { IPreAkiLoadModAsync } from '@spt-aki/models/external/IPreAkiLoadModAsync';
import { IPostDBLoadModAsync } from '@spt-aki/models/external/IPostDBLoadModAsync';

class LC_QOL_Money implements IPreAkiLoadModAsync, IPostDBLoadModAsync {
    private mod: string;
    private logger: ILogger;

    constructor() {
        this.mod = 'LevelCrush-QOL-Money'; // Set name of mod so we can log it to console later
    }

    /**
     * Some work needs to be done prior to SPT code being loaded, registering the profile image + setting trader update time inside the trader config json
     * @param container Dependency container
     */
    public async preAkiLoadAsync(container: DependencyContainer): Promise<void> {
        // Get a logger
        this.logger = container.resolve<ILogger>('WinstonLogger');
        this.logger.debug(`[${this.mod}] preAki Loading... `);
        this.logger.debug(`[${this.mod}] preAki Loaded`);
    }

    /**
     * Majority of trader-related work occurs after the aki database has been loaded but prior to SPT code being run
     * @param container Dependency container
     */
    public async postDBLoadAsync(container: DependencyContainer): Promise<void> {
        this.logger.debug(`[${this.mod}] postDb Loading... `);

        // Resolve SPT classes we'll use
        const databaseServer: DatabaseServer = container.resolve<DatabaseServer>('DatabaseServer');

        // Get a reference to the database tables
        const tables = databaseServer.getTables();

        // 5449016a4bdc2d6f028b456f = Rubles
        // 5696686a4bdc2da3298b456a = USD
        // 569668774bdc2da2298b4568 = EUROS
        const target_templates = ['5449016a4bdc2d6f028b456f', '5696686a4bdc2da3298b456a', '569668774bdc2da2298b4568'];

        if (tables.globals && tables.templates.items) {
            this.logger.debug('Applying QOL money fixes');
            for (const template_id of target_templates) {
                // 100 million rouble
                const stack_limit = 10000000;
                tables.templates.items[template_id]._props.StackMaxSize = stack_limit;
                tables.templates.items[template_id]._props.DiscardLimit = stack_limit;
            }
            this.logger.debug('Done applying QOL money fixes');
        }

        this.logger.debug(`[${this.mod}] postDb Loaded`);
    }
}

module.exports = { mod: new LC_QOL_Money() };

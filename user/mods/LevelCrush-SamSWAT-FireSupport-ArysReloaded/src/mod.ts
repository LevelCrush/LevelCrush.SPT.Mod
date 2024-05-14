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

class LCSamSwatFireSupportArysReloaded implements IPreAkiLoadMod, IPostDBLoadMod {
    private mod: string;
    private logger: ILogger;
    private modPath: string;

    constructor() {
        this.mod = 'LevelCrush-SamSwat-FireSupport-ArysReloaded'; // Set name of mod so we can log it to console later
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

        const tables = databaseServer.getTables();

        // the mod references these mongoids
        // but the jsons have a completetley different ID
        const weapon_tpl = '660b2d05cec10101410e7d7b';
        const ammo_tpl = '660b2d05cec10101410e7d7a';

        tables.templates.items[weapon_tpl] = require('../database/weapon_ge_gau8_avenger_30x173.json');
        tables.templates.items[ammo_tpl] = require('../database/ammo_30x173_gau8_avenger.json');

        // which set do i use? maybe both lol
        //tables.templates.items['8c8c7dbd75e1820a76059d6b'] = require('../database/weapon_ge_gau8_avenger_30x173.json');
        //tables.templates.items['3780800a0e292ab0c6417e98'] = require('../database/ammo_30x173_gau8_avenger.json');

        // localization
        tables.locales.global['en'][`${ammo_tpl} Name`] = 'PGU-13/B HEI High Explosive Incendiary';
        tables.locales.global['en'][`${ammo_tpl} ShortName`] = 'PGU-13/B HEI';
        tables.locales.global['en'][`${ammo_tpl} Description`] =
            'The PGU-13/B HEI High Explosive Incendiary round employs a standard M505 fuze and explosive mixture with a body of naturally fragmenting material that is effective against lighter vehicle and material targets.';

        tables.locales.global['en'][`${weapon_tpl} Name`] = 'Fairchild Republic A-10 Thunderbolt II';
        tables.locales.global['en'][`${weapon_tpl} ShortName`] = 'A-10 Thunderbolt II';
        tables.locales.global['en'][`${weapon_tpl} Description`] =
            'Close air support attack aircraft developed by Fairchild Republic for the USAF with mounted GAU-8/A Avenger 30mm autocannon.';

        this.logger.debug(`[${this.mod}] postDb Loaded`);
    }
}

module.exports = { mod: new LCSamSwatFireSupportArysReloaded() };

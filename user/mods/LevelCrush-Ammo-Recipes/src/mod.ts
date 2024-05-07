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

type AmmoTierWeighting = { [tpl: string]: number };
type AmmoTierMap = Map<number, AmmoTierWeighting>;

class LC_Event_Ammo implements IPreAkiLoadMod, IPostDBLoadMod {
    private mod: string;
    private logger: ILogger;
    private modPath: string;

    constructor() {
        this.mod = 'LevelCrush-Ammo-Recipes'; // Set name of mod so we can log it to console later
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

        const ammo_templates = {} as { [tpl: string]: ITemplateItem };
        const AMMO_PEN_THRESHOLD = 20;

        // scan for ammo over our threshold
        this.logger.info('Scanning item database for ammo that meets certain conditions');
        for (const tpl in tables.templates.items) {
            const template = tables.templates.items[tpl];
            if (template._props.ammoType === 'bullet' && template._props.PenetrationPower > AMMO_PEN_THRESHOLD) {
                ammo_templates[tpl] = template;
            }
        }

        this.logger.info('Tiering ammo');
        const ammo_workbench_map = new Map() as AmmoTierMap;
        for (const tpl in ammo_templates) {
            let workbench_level = 1;
            const template = ammo_templates[tpl];
            const pen_power = template._props.PenetrationPower || 0;
            if (pen_power > 45) {
                workbench_level = 3;
            } else if (pen_power > 35 && pen_power <= 45) {
                workbench_level = 2;
            } else if (pen_power > 20 && pen_power <= 35) {
                workbench_level = 1;
            }

            // create the workbench level if its not created yet
            if (!ammo_workbench_map.has(workbench_level)) {
                ammo_workbench_map.set(workbench_level, {});
            }

            // now in that workbench level, make soure our item is being tracked
            // use our pen power as the weight
            ammo_workbench_map.get(workbench_level)[tpl] = pen_power;
        }

        // now flatten into an array
        const ammo_sortings = new Map<number, { [caliber: string]: { tpl: string; weight: number; name: string }[] }>();
        ammo_workbench_map.forEach((tier_map, workbench_level) => {
            if (!ammo_sortings.has(workbench_level)) {
                ammo_sortings.set(workbench_level, {});
            }

            for (const tpl in tier_map) {
                const ammo_caliber = ammo_templates[tpl]._props.Caliber;

                if (typeof ammo_sortings.get(workbench_level)[ammo_caliber] === 'undefined') {
                    ammo_sortings.get(workbench_level)[ammo_caliber] = [];
                }
                ammo_sortings.get(workbench_level)[ammo_caliber].push({
                    tpl: tpl,
                    weight: tier_map[tpl],
                    name: tables.locales.global['en'][tpl + ' Name'],
                });
            }
        });

        // now sort
        //example: developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
        ammo_sortings.forEach((weightings, workbench_level) => {
            for (const caliber in weightings) {
                weightings[caliber].sort((a, b) => {
                    // sort ascending
                    return a.weight - b.weight;
                });
            }
        });

        // now output those
        ammo_sortings.forEach((calibers, workbench_level) => {
            this.logger.info(
                `Sorted workbench ${workbench_level} ammo recipes like so\r\n${JSON.stringify(calibers, null, 2)}`,
            );
        });

        this.logger.info('Generating ammo recipes');
        // track previous best calibers
        const template_kite = tables.templates.items['590c5a7286f7747884343aea'];
        const template_eagle = tables.templates.items['5d6fc78386f77449d825f9dc'];
        const template_hawk = tables.templates.items['5d6fc87386f77449db3db94e'];
        const template_screw = tables.templates.items['57347c77245977448d35f6e2'];
        const template_nut = tables.templates.items['57347c77245977448d35f6e2'];
        const template_machine_part = tables.templates.items['61bf7b6302b3924be92fa8c3'];

        const previous_calibers = {} as { [caliber: string]: string };
        ammo_sortings.forEach((caliber_weightings, workbench_level) => {
            for (const caliber in caliber_weightings) {
                for (const ammo_desc of caliber_weightings[caliber]) {
                    const template = ammo_templates[ammo_desc.tpl];

                    const requirements = [
                        {
                            areaType: 10,
                            requiredLevel: workbench_level,
                            type: 'Area',
                        },
                    ] as IHideoutProduction['requirements'];

                    if (workbench_level >= 1) {
                        requirements.push({
                            templateId: template_kite._id,
                            count: 1,
                            isFunctional: false,
                            isEncoded: false,
                            type: 'Item',
                        });
                    }

                    if (workbench_level >= 2) {
                        requirements.push({
                            templateId: template_hawk._id,
                            count: 1,
                            isEncoded: false,
                            isFunctional: false,
                            type: 'Item',
                        });
                    }

                    if (workbench_level >= 3) {
                        requirements.push({
                            templateId: template_eagle._id,
                            count: 1,
                            isEncoded: false,
                            isFunctional: false,
                            type: 'Item',
                        });
                    }

                    // add nuts to every ammo craft requirement
                    requirements.push({
                        templateId: template_nut._id,
                        count: workbench_level,
                        isEncoded: false,
                        isFunctional: false,
                        type: 'Item',
                    });

                    if (workbench_level >= 2) {
                        requirements.push({
                            templateId: template_screw._id,
                            count: workbench_level,
                            isEncoded: false,
                            isFunctional: false,
                            type: 'Item',
                        });
                    }

                    if (workbench_level >= 3) {
                        requirements.push({
                            templateId: template_machine_part._id,
                            count: 1,
                            isEncoded: false,
                            isFunctional: false,
                            type: 'Item',
                        });
                    }

                    const recipe = {
                        _id: `LevelCrush-${caliber}-${ammo_desc.name}`,
                        areaType: 10, // always assign to workbench,
                        requirements: requirements,
                        productionTime: 3600,
                        count: Math.ceil((workbench_level * 400) / Math.max(1, workbench_level - 1)),
                        isEncoded: false,
                        continuous: false,
                        locked: false,
                        productionLimitCount: 0,
                        endProduct: ammo_desc.tpl,
                        needFuelForAllProductionTime: false,
                    } as IHideoutProduction;

                    this.logger.info(`Adding recipe:\r\n${JSON.stringify(recipe, null, 2)}`);
                    tables.hideout.production.push(recipe);

                    if (typeof previous_calibers[caliber] === 'undefined') {
                        previous_calibers[caliber] = ammo_desc.tpl;
                    }
                }
            }
        });

        // databaseServer.setTables(tables);

        this.logger.debug(`[${this.mod}] postDb Loaded`);
    }
}

module.exports = { mod: new LC_Event_Ammo() };

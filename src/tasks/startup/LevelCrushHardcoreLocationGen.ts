import { DependencyContainer, inject, injectable } from "tsyringe";
import { ScheduledTask } from "../../di/ScheduledTask";
import { LevelCrushCoreConfig } from "../../configs/LevelCrushCoreConfig";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import path from "node:path";
import fs from "node:fs";
import { ILocation, IStaticAmmoDetails } from "@spt/models/eft/common/ILocation";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { ItemTpl } from "@spt/models/enums/ItemTpl";
import { ILooseLoot } from "@spt/models/eft/common/ILooseLoot";
import { ILocationBase } from "@spt/models/eft/common/ILocationBase";
import { ConfigServer } from "@spt/servers/ConfigServer";
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { IBotConfig } from "@spt/models/spt/config/IBotConfig";
import { IPmcConfig } from "@spt/models/spt/config/IPmcConfig";

const HARDCORE_MAP_IDS = {
    "56f40101d2720b2a4d8b45d6": "66c0e2e8766f6a9cfb4e9124", // customs hardcore
    "65b8d6f5cdde2479cb2a3125": "66c0e6cd5e1f9336b987a57e", // sandbox high ( ground zero level20+)
    "653e6760052c01c1c805532f": "66c0e6e116f016d970385b6c", // sandbox ( ground zero)
    "5704e5fad2720bc05b8b4567": "66c0e70964da4b2df02e07d1", // rezervbase (Reserve)
    "5704e4dad2720bb55b8b4567": "66c0e7287cfba538bfc0a9f2", // light house
    "5b0fc42d86f7744a585f9105": "66c0e78b0fd19073ada377eb", // labs
    "5714dbc024597771384a510d": "66c0e791b1bf4120d7f29530", // interchange
    "59fc81d786f774390775787e": "66c0e7b226f22fdf9c4792db", // factory4_night
    "55f2d3fd4bdc2d5f408b4567": "66c0e7d34f1920666557ec94", // factory4_day,
    "5704e554d2720bac5b8b456e": "66c0e80eb46a11a8674eeb17", // shoreline
    "5714dc692459777137212e12": "66c0e82aecce0da3e58472ee", // streets
    "5704e3c2d2720bac5b8b4567": "66c0e8430a48e69ccdd8b849", // woods
};

@injectable()
export class LevelCrushHardcoreLocationGen extends ScheduledTask {
    constructor(
        @inject("PrimaryLogger") protected logger: ILogger,
        @inject("LevelCrushCoreConfig") protected lcConfig: LevelCrushCoreConfig,
        @inject("DatabaseServer") protected databaseServer: DatabaseServer,
        @inject("ConfigServer") protected configSever: ConfigServer,
    ) {
        super();
    }

    public async execute(_container: DependencyContainer): Promise<void> {
        // this will never execute
    }

    public frequency(): number | string {
        return 0; // this task will only run at startup
    }

    public async execute_immediate(_container: DependencyContainer): Promise<void> {
        this.logger.info("Starting to run Hardcore Static + Loot Generation");
        const tables = this.databaseServer.getTables();

        const botConfig = this.configSever.getConfig<IBotConfig>(ConfigTypes.BOT);
        const pmcConfig = this.configSever.getConfig<IPmcConfig>(ConfigTypes.PMC);

        const locales = tables.locales.global["en"];

        // item generation

        const items = tables.templates.items;
        // const locales = tables.locales.global["en"];

        const MINIMUM_PEN = 36; //this executes before realism, so our pen is based off of normal tarkov values

        const boosted_items = [
            ItemTpl.CONTAINER_AMMUNITION_CASE,
            ItemTpl.REPAIRKITS_BODY_ARMOR_REPAIR_KIT,
            ItemTpl.REPAIRKITS_WEAPON_REPAIR_KIT,
            ItemTpl.BARTER_VIRTEX_PROGRAMMABLE_PROCESSOR,
            ItemTpl.BARTER_GRAPHICS_CARD,
            ItemTpl.BARTER_METAL_FUEL_TANK,
            ItemTpl.BARTER_MILITARY_CABLE,
            ItemTpl.BARTER_MILITARY_POWER_FILTER,
            ItemTpl.BARTER_TETRIZ_PORTABLE_GAME_CONSOLE,
            ItemTpl.BARTER_LEDX_SKIN_TRANSILLUMINATOR,
            ItemTpl.BARTER_ELECTRIC_MOTOR,
            ItemTpl.BARTER_WATER_FILTER,
        ] as string[];

        const always_spawn_swaps = [ItemTpl.SECURE_CONTAINER_GAMMA, ItemTpl.SECURE_CONTAINER_GAMMA_TUE];

        for (const location_id in tables.locations) {
            this.logger.info(`${location_id} is being checked for ammo`);
            if (location_id !== "base" && typeof tables.locations[location_id]["staticAmmo"] !== "undefined") {
                // clone the original location
                const originalLocation = tables.locations[location_id] as ILocation;
                this.logger.info(`${JSON.stringify(Object.keys(originalLocation))}`);

                const location = JSON.parse(JSON.stringify(tables.locations[location_id])) as ILocation;

                const loose_loot = JSON.parse(JSON.stringify(originalLocation.looseLoot)) as ILooseLoot;
                const ammo_map = {} as Record<string, IStaticAmmoDetails[]>;
                for (const caliber in originalLocation.staticAmmo) {
                    if (typeof ammo_map[caliber] === "undefined") {
                        ammo_map[caliber] = [];
                    }

                    for (const ammo of originalLocation.staticAmmo[caliber]) {
                        //   this.logger.info(`${location_id} | ${caliber} | ${ammo.tpl}`);
                        const template = items[ammo.tpl];
                        ammo_map[caliber].push({
                            relativeProbability: template._props.PenetrationPower > MINIMUM_PEN ? ammo.relativeProbability : 0,
                            tpl: ammo.tpl,
                        });
                    }
                }
                location.staticAmmo = ammo_map;

                const ids = [];
                for (let i = 0; i < loose_loot.spawnpoints.length; i++) {
                    // boosted loose loot if found
                    const avgRel = {} as Record<string, number>;
                    for (let j = 0; j < loose_loot.spawnpoints[i].template.Items.length; j++) {
                        if (boosted_items.includes(loose_loot.spawnpoints[i].template.Items[j]._tpl)) {
                            loose_loot.spawnpoints[i].template.IsAlwaysSpawn = true;

                            // if we have not cached this id , scan the relative probabilities
                            // and find the average
                            if (typeof avgRel[loose_loot.spawnpoints[i].template.Id] === "undefined") {
                                let rel_sum = 0;
                                for (const item of loose_loot.spawnpoints[i].itemDistribution) {
                                    rel_sum += item.relativeProbability;
                                }
                                avgRel[loose_loot.spawnpoints[i].template.Id] = Math.ceil(rel_sum / loose_loot.spawnpoints[i].itemDistribution.length);
                            }

                            const target_key = loose_loot.spawnpoints[i].template.Items[j]._id;
                            const target_avg = avgRel[loose_loot.spawnpoints[i].template.Id];
                            for (let k = 0; k < loose_loot.spawnpoints[i].itemDistribution.length; k++) {
                                if (loose_loot.spawnpoints[i].itemDistribution[k].composedKey.key === target_key) {
                                    loose_loot.spawnpoints[i].itemDistribution[k].relativeProbability = Math.min(loose_loot.spawnpoints[i].itemDistribution[k].relativeProbability * 1.25, target_avg * 2);
                                }
                            }
                        }
                    }

                    if (loose_loot.spawnpoints[i].template.IsAlwaysSpawn) {
                        for (const swap_tpl of always_spawn_swaps) {
                            for (let x = 0; x < loose_loot.spawnpoints[i].template.Items.length; x++) {
                                loose_loot.spawnpoints[i].template.Items[x]._tpl = swap_tpl;
                            }
                        }
                    }
                }
                location.looseLoot = loose_loot;

                if (true) {
                    let base = JSON.parse(JSON.stringify(location.base)) as ILocationBase;

                    // boss spawn chances
                    for (let x = 0; x < base.BossLocationSpawn.length; x++) {
                        base.BossLocationSpawn[x].BossChance = 100;

                        // nerf normal boss location

                        if (location_id.includes("rezervbase") && base.BossLocationSpawn[x].BossName.toLowerCase().includes("pmcbot")) {
                            base.BossLocationSpawn[x].BossChance = 100;
                        }

                        if (location_id.includes("lab") || location_id.includes("light")) {
                            this.logger.info(`On ${location_id} for ${location.base.BossLocationSpawn[x].BossName} has been set to ${base.BossLocationSpawn[x].BossChance}% on Hardcore`);
                        } else {
                            (tables.locations[location_id] as ILocation).base.BossLocationSpawn[x].BossChance = Math.max(5, Math.ceil((tables.locations[location_id] as ILocation).base.BossLocationSpawn[x].BossChance / 3));
                            this.logger.info(`On ${location_id} for ${location.base.BossLocationSpawn[x].BossName} has been set to ${base.BossLocationSpawn[x].BossChance}% on Hardcore and ${(tables.locations[location_id] as ILocation).base.BossLocationSpawn[x].BossChance}% on normal maps`);
                        }
                    }

                    const original_id = base._Id;
                    if (typeof HARDCORE_MAP_IDS[original_id] !== "undefined") {
                        base._Id = HARDCORE_MAP_IDS[original_id] || base._Id;
                        this.logger.info(`Mapping ${original_id} to ${base._Id}`);
                        // copy locales
                        locales[base._Id + " Name"] = `${locales[original_id + " Name"]} (Hardcore)`;
                        locales[base._Id + " Description"] = `${locales[original_id + " Description"]} (Hardcore)`;
                    }

                    this.logger.info(`Modifying ${base.Id} to ${base.Id + "_hardcore"}`);
                    const original_map_id = base.Id;
                    base.Id = base.Id + "_hardcore";

                    botConfig.maxBotCap[base.Id.toLowerCase()] = botConfig.maxBotCap[original_map_id.toLowerCase()];

                    location.base = base;
                }

                // add our own levelcrus property to this
                // just  another way we can tell when we are generating loot / stuff if we are indeed a hardcore varient
                (location as Record<string, any>)["levelcrush"] = {
                    hardcore: true,
                    timestamp: Date.now() / 1000,
                    location: location_id,
                };

                this.logger.info(`${location_id} is storing a hardcore varient of location information`);
                tables.locations[location_id + "_hardcore"] = location;
            }
        }

        this.logger.info(`Locations: ${JSON.stringify(Object.keys(tables.locations), null, 4)}`);
    }
}

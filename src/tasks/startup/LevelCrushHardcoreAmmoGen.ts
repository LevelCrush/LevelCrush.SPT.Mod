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

@injectable()
export class LevelCrushHardcoreAmmoGen extends ScheduledTask {
    constructor(
        @inject("PrimaryLogger") protected logger: ILogger,
        @inject("LevelCrushCoreConfig") protected lcConfig: LevelCrushCoreConfig,
        @inject("DatabaseServer") protected databaseServer: DatabaseServer,
    ) {
        super();
    }

    public async execute(container: DependencyContainer): Promise<void> {
        // this will never execute
    }

    public frequency(): number | string {
        return 0; // this task will only run at startup
    }

    public async execute_immediate(container: DependencyContainer): Promise<void> {
        this.logger.info("Starting to run Hardcore Static + Loot Generation");
        const tables = this.databaseServer.getTables();
        const items = tables.templates.items;
        const locales = tables.locales.global["en"];

        const MINIMUM_PEN = 36; //for realism anything over 60 is considered a rifle round

        const boosted_items = [
            ItemTpl.CONTAINER_AMMUNITION_CASE,
            ItemTpl.REPAIRKITS_BODY_ARMOR_REPAIR_KIT,
            ItemTpl.REPAIRKITS_WEAPON_REPAIR_KIT,
            ItemTpl.BARTER_VIRTEX_PROGRAMMABLE_PROCESSOR,
            ItemTpl.BARTER_GRAPHICS_CARD,
            ItemTpl.BARTER_METAL_FUEL_TANK,
            ItemTpl.BARTER_MILITARY_CABLE,
            ItemTpl.BARTER_MILITARY_POWER_FILTER,
            ItemTpl.BARTER_LEDX_SKIN_TRANSILLUMINATOR,
            ItemTpl.BARTER_ELECTRIC_MOTOR,
        ];

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
                    if (loose_loot.spawnpoints[i].template.IsAlwaysSpawn) {
                        for (const swap_tpl of always_spawn_swaps) {
                            const starting_id = Math.ceil(Date.now() / 1000);
                            let new_id = starting_id;
                            let attempt = 1;
                            while (ids.includes(new_id)) {
                                new_id = `${starting_id}_${attempt}`;
                                attempt++;
                            }
                            ids.push(new_id);

                            loose_loot.spawnpoints[i].template.Items.push({
                                _id: new_id,
                                _tpl: swap_tpl,
                                upd: {
                                    StackObjectsCount: 1,
                                },
                            });

                            loose_loot.spawnpoints[i].itemDistribution.push({
                                composedKey: { key: new_id },
                                relativeProbability: loose_loot.spawnpoints[i].itemDistribution[0].relativeProbability, // make it the same as the first tiems probability, so make the odds even(?)
                            });
                        }
                    }
                }
                location.looseLoot = loose_loot;

                this.logger.info(`${location_id} is storing a hardcore varient of location information`);
                tables.locations[location_id + "_hardcore"] = location;
            }
        }
    }
}

import { DependencyContainer, inject, injectable } from "tsyringe";
import { ScheduledTask } from "../../di/ScheduledTask";
import { LevelCrushCoreConfig } from "../../configs/LevelCrushCoreConfig";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import path from "node:path";
import fs from "node:fs";
import { LevelCrushCacheHelper } from "../../helpers/LevelCrushCacheHelper";
import { ILocaleBase } from "@spt/models/spt/server/ILocaleBase";
import { ILocation } from "@spt/models/eft/common/ILocation";
import { HashUtil } from "@spt/utils/HashUtil";

@injectable()
export class LevelCrushPickHardcoreMaps extends ScheduledTask {
    constructor(
        @inject("PrimaryLogger") protected logger: ILogger,
        @inject("LevelCrushCoreConfig") protected lcConfig: LevelCrushCoreConfig,
        @inject("DatabaseServer") protected databaseServer: DatabaseServer,
        @inject("LevelCrushCacheHelper") protected cacheHelper: LevelCrushCacheHelper,
        @inject("HashUtil") protected hashUtil: HashUtil,
    ) {
        super();
    }

    /** Basic random generator function. Any simple google can get you a function similiar to this */
    private gen_ran(min: number, max: number) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    public async execute(_container: DependencyContainer): Promise<void> {
        this.logger.logWithColor("Choosing Hardcore Zones", LogTextColor.YELLOW);
        const map_location_ids = [];
        const tables = this.databaseServer.getTables();
        const locations = tables.locations;
        for (const location_id in locations) {
            if (location_id.includes("_hardcore")) {
                // skip hardcore maps as they do not count
                continue;
            }

            if (location_id.includes("_high")) {
                // skip high level varients
                continue;
            }

            if (location_id.includes("factory")) {
                // dont allow factory
                continue;
            }

            const location = locations[location_id] as ILocation;
            if (location.base && location.staticAmmo) {
                map_location_ids.push(location_id.toLowerCase());
            }
        }

        // yes it will be possible for all maps to be marked hardcore
        const random_max_maps = 5;
        const random_min_maps = 0;
        const random_total_maps = this.gen_ran(random_min_maps, random_max_maps);

        this.logger.logWithColor(`Hardcore is choosing ${random_total_maps} to generate`, LogTextColor.YELLOW);

        const chosen_maps = [] as string[];
        while (chosen_maps.length < random_total_maps) {
            const target_index = this.gen_ran(0, map_location_ids.length);
            chosen_maps.push(map_location_ids[target_index]);
            map_location_ids.splice(target_index, 1);
        }
        const data = JSON.stringify(chosen_maps);
        this.logger.logWithColor(`The following maps are now marked as hardcore: ${data}`, LogTextColor.YELLOW);
        this.cacheHelper.write("hardcore-maps", {
            hash: this.hashUtil.generateMd5ForData(data),
            timestamp: Date.now() / 1000,
            data: chosen_maps,
        });
    }

    public frequency(): number | string {
        return "*/20 * * * *"; // this task will run every 20 minutes
    }

    public async execute_immediate(_: DependencyContainer): Promise<void> {
        return;
    }
}

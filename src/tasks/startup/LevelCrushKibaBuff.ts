import { DependencyContainer, inject, injectable } from "tsyringe";
import { ScheduledTask } from "../../di/ScheduledTask";
import { LevelCrushCoreConfig } from "../../configs/LevelCrushCoreConfig";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import path from "node:path";
import fs from "node:fs";

@injectable()
export class LevelCrushKibaBuff extends ScheduledTask {
    constructor(
        @inject("PrimaryLogger") protected logger: ILogger,
        @inject("LevelCrushCoreConfig") protected lcConfig: LevelCrushCoreConfig,
        @inject("DatabaseServer") protected databaseServer: DatabaseServer,
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
        this.logger.info("Buffing Kiba Spawns");

        const tables = this.databaseServer.getTables();
        const location = tables.locations.interchange;

        const buff_ids = ["kiba", "gun"];
        const regex = new RegExp(buff_ids.join("|"), "gi");
        let did_buff = 0;
        for (let i = 0; i < location.looseLoot.spawnpoints.length; i++) {
            // note: this buffs all kiba related spawns
            // all guns that spawn loose. Will now **always** spawn. Kiba should be chocked full
            const spawn_id = location.looseLoot.spawnpoints[i].template.Id.toLowerCase();
            if (spawn_id.match(regex) !== null) {
                // enforce always spawn
                location.looseLoot.spawnpoints[i].template.IsAlwaysSpawn = true;
                location.looseLoot.spawnpoints[i].probability = 100.0;
                did_buff++;
            }
        }

        this.logger.info(`Done Buffing Interchange Gun Spawns | Adjusted ${did_buff} spawns`);
    }
}

import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { IBotConfig } from "@spt/models/spt/config/IBotConfig";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { ConfigServer } from "@spt/servers/ConfigServer";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { JsonUtil } from "@spt/utils/JsonUtil";
import { VFS } from "@spt/utils/VFS";
import { DependencyContainer, inject, injectable } from "tsyringe";
import { LevelCrushCoreConfig } from "../configs/LevelCrushCoreConfig";
import { Loader } from "../di/Loader";

import fs from "node:fs";
import path from "node:path";
import { ILocation } from "@spt/models/eft/common/ILocation";
import { IBotType } from "@spt/models/eft/common/tables/IBotType";
import { BotSettings } from "@spt/models/eft/match/IRaidSettings";

@injectable()
export class LevelCrushBossLoader extends Loader {
    constructor(
        @inject("PrimaryLogger") protected logger: ILogger,
        @inject("JsonUtil") protected jsonUtil: JsonUtil,
        @inject("DatabaseServer") protected databaseServer: DatabaseServer,
        @inject("LevelCrushCoreConfig") protected lcConfigh: LevelCrushCoreConfig,
        @inject("ConfigServer") protected configServer: ConfigServer,
        @inject("VFS") protected vfs: VFS,
    ) {
        super();
    }

    /// responsible for loading bosskidman,followerprimal,followermagpie
    private async load_goobersquad(botConfig: IBotConfig, tables: IDatabaseTables) {
        const bossKidManData = await fs.promises.readFile(path.join(this.lcConfigh.getModPath(), "db", "bosses", "custom", "bosskidman.json5"), { encoding: "utf-8" });
        const followerPrimalData = await fs.promises.readFile(path.join(this.lcConfigh.getModPath(), "db", "bosses", "custom", "followerprimal.json5"), { encoding: "utf-8" });
        const followerMagpie = await fs.promises.readFile(path.join(this.lcConfigh.getModPath(), "db", "bosses", "custom", "followermagpie.json5"), { encoding: "utf-8" });

        const bosskidman = this.jsonUtil.deserializeJson5<IBotType>(bossKidManData);
        const followerprimal = this.jsonUtil.deserializeJson5<IBotType>(followerPrimalData);
        const followermagpie = this.jsonUtil.deserializeJson5<IBotType>(followerMagpie);

        botConfig.presetBatch["bosskidman"] = 1;
        botConfig.presetBatch["followerprimal"] = 1;
        botConfig.presetBatch["followermagpie"] = 1;

        const botSettings = {
            nvgIsActiveChanceDayPercent: 10,
            nvgIsActiveChanceNightPercent: 90,
            faceShieldIsActiveChancePercent: 100,
            lightIsActiveDayChancePercent: 25,
            lightIsActiveNightChancePercent: 90,
            weaponSightWhitelist: {},
            laserIsActiveChancePercent: 85,
            randomisation: [],
            blacklist: [],
            whitelist: [],
            weightingAdjustmentsByPlayerLevel: [],
            weightingAdjustmentsByBotLevel: [],
            forceStock: false,
            weaponModLimits: {
                scopeLimit: 1,
                lightLaserLimit: 1,
            },
        };

        botConfig.equipment["bosskidman"] = botSettings;
        botConfig.equipment["followerprimal"] = botSettings;
        botConfig.equipment["followermagpie"] = botSettings;

        botConfig.itemSpawnLimits["bosskidman"] = {};
        botConfig.itemSpawnLimits["followerprimal"] = {};
        botConfig.itemSpawnLimits["followermagpie"] = {};

        botConfig.revenge["bosskidman"] = ["gifter", "followerprimal", "followermagpie"];
        botConfig.revenge["followerprimal"] = ["gifter", "followermagpie", "bosskidman"];
        botConfig.revenge["followermagpie"] = ["gifter", "followerprimal", "bosskidman"];

        botConfig.bosses.push("bosskidman");

        tables.bots.types["bosskidman"] = bosskidman;
        tables.bots.types["followerprimal"] = followerprimal;
        tables.bots.types["followermagpie"] = followermagpie;

        tables.locales.global["en"]["bosskidman"] = "DatKidMan";
        tables.locales.global["en"]["followerprimal"] = "Primal-13";
        tables.locales.global["en"]["followermagpie"] = "Magpie";

        for (const location_id in tables.locations) {
            const location = tables.locations[location_id] as ILocation;
            if (location.base && location.staticAmmo) {
                /*
                    BossChance: number
                    BossDifficult: string
                    BossEscortAmount: string
                    BossEscortDifficult: string
                    BossEscortType: string
                    BossName: string
                    BossPlayer: boolean
                    BossZone: string
                     RandomTimeSpawn: boolean
                     Time: number
                     TriggerId: string
                     TriggerName: string
                     Delay?: number
                     ForceSpawn?: boolean
                     IgnoreMaxBots?: boolean
                     Supports?: BossSupport[]
                     sptId?: string
                     spawnMode: string[
                 */

                const zones = location.base.OpenZones.split(",");
                const targetZones = [];

                for (const zone of zones) {
                    if (!zone.toLowerCase().includes("sniper")) {
                        targetZones.push(zone);
                    }
                }
                this.logger.info(`Added bosskidman to ${location_id} to ${targetZones.join(",")}`);
                location.base.BossLocationSpawn.push({
                    BossChance: 30,
                    BossDifficult: "normal",
                    BossEscortAmount: "2",
                    BossEscortDifficult: "normal",
                    BossEscortType: "exUsec",
                    BossName: "bosskidman",
                    BossPlayer: false,
                    BossZone: targetZones.join(","),
                    RandomTimeSpawn: false,
                    Time: -1,
                    TriggerId: "",
                    TriggerName: "",
                    spawnMode: ["regular", "pve"],
                    IgnoreMaxBots: true,
                    Supports: [
                        {
                            BossEscortAmount: "1",
                            BossEscortDifficult: ["normal"],
                            BossEscortType: "followerprimal",
                        },
                        {
                            BossEscortAmount: "1",
                            BossEscortDifficult: ["normal"],
                            BossEscortType: "followermagpie",
                        },
                    ],
                });
            }
        }
    }

    public async execute(_: DependencyContainer) {
        this.logger.info("LevelCrush is loading bosses");
        this.logger.info("LevelCrush is done loading bosses");
        return;
        // for now dont run any of this
        const botConfig = this.configServer.getConfig<IBotConfig>(ConfigTypes.BOT);
        const tables = this.databaseServer.getTables();

        // load custom bosses
        await this.load_goobersquad(botConfig, tables);

        this.logger.info("LevelCrush is done loading bosses");
    }
}

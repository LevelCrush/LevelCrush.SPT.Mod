import { ILogger } from "@spt/models/spt/utils/ILogger";
import { DependencyContainer, inject, injectAll, injectable } from "tsyringe";
import { LevelCrushCoreConfig } from "./configs/LevelCrushCoreConfig";
import { LevelCrushMultiplierConfig } from "./configs/LevelCrushMultiplierConfig";
import { ILevelCrushPatch, LevelCrushPatchTarget } from "./legacy_patches/patch";

import { ConfigServer } from "@spt/servers/ConfigServer";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { HashUtil } from "@spt/utils/HashUtil";
import * as cron from "node-cron";
import { Loader } from "./di/Loader";
import { Override } from "./di/Override";
import { ScheduledTask } from "./di/ScheduledTask";
import HomeScreenMessagePatch from "./legacy_patches/homescreen_message_patch";
import { LootPatch } from "./legacy_patches/loot_patch";
import BossPatch from "./legacy_patches/patch_bosses";
import ItemPatch from "./legacy_patches/patch_items";
import QOLMoneyPatch from "./legacy_patches/patch_qol_money";
import QOLNoRestrictionsPatch from "./legacy_patches/patch_qol_norestrictions";
import QOLRecipePatch from "./legacy_patches/patch_qol_recipes";
import QuestPatch from "./legacy_patches/patch_quests";
import RecipeLoaderPatch from "./legacy_patches/patch_recipe_loader";
import RecipePatch from "./legacy_patches/patch_recipes";
import PocketPatch from "./legacy_patches/pocket_patch";
import ProfilePatch from "./legacy_patches/profile_patch";

import fs from "node:fs";
import path from "node:path";
import { DatabasePatch } from "./di/DatabasePatch";

@injectable()
export class LevelCrush {
    private patches: ILevelCrushPatch[] = [];
    private patch_results: Record<string, any>;
    private logger: ILogger;

    constructor(
        @inject("LevelCrushCoreConfig") protected lcConfig: LevelCrushCoreConfig,
        @inject("LevelCrushMultiplierConfig") protected lcMultipliers: LevelCrushMultiplierConfig,
        @inject("DatabaseServer") protected databaseServer: DatabaseServer,
        @inject("HashUtil") protected hashUtil: HashUtil,
        @injectAll("LevelCrushScheduledTasks") protected scheduledTasks: ScheduledTask[],
        @injectAll("LevelCrushOverrides") protected overrides: Override[],
        @injectAll("LevelCrushLoaders") protected loaders: Loader[],
        @injectAll("LevelCrushDatabasePatches") protected dbPatches: DatabasePatch[],
    ) {
        this.patch_results = {};
        this.patches = [];
    }

    public async preSptLoad(container: DependencyContainer): Promise<void> {
        // pre spt load

        this.patches = [
            new HomeScreenMessagePatch(),
            //  new ProfilePatch(),
            // new PocketPatch(),
            new QOLMoneyPatch(),
            new LootPatch(),
            //  new ItemPatch(),
            //  new RecipeLoaderPatch(),
            //  new RecipePatch(),
            //  new QOLRecipePatch(),
            //  new QuestPatch(),
            //  new BossPatch(),
            new QOLNoRestrictionsPatch(),
        ];

        this.logger = container.resolve<ILogger>("WinstonLogger");

        // let anything that has a patch target of PreSpt run now
        this.logger.info(`Total Custom Patches: ${this.patches.length}`);
        let patch_types_allowed = [LevelCrushPatchTarget.PreSptLoadModAndPostDB, LevelCrushPatchTarget.PreSptLoadMod];
        for (let i = 0; i < this.patches.length; i++) {
            if (patch_types_allowed.includes(this.patches[i].patch_target())) {
                this.logger.info(`Executing ${this.patches[i].patch_name()} inside PreSpt`);
                this.patch_results[this.patches[i].patch_name()] = await this.patches[i].patch_run(container, this.logger, LevelCrushPatchTarget.PreSptLoadMod);
                this.logger.info(`Finished ${this.patches[i].patch_name()} inside  PreSpt`);
            }
        }

        this.logger.info("Executing LevelCrush overrides");
        for (let i = 0; i < this.overrides.length; i++) {
            await this.overrides[i].execute(container);
        }
        this.logger.info("Done executing LevelCrush overrides");
    }

    public async postSptLoad(container: DependencyContainer): Promise<void> {
        // post spt load trigger scheduled task

        const promises = [];
        this.logger.info("Setting up LevelCrush specific task");
        for (let i = 0; i < this.scheduledTasks.length; i++) {
            // since this related to startup. Don't wrap in try cratch

            try {
                await this.scheduledTasks[i].execute_immediate(container);
            } catch (err) {
                this.logger.error(`Immediate Scheduled Task Error: ${err}`);
            }

            // startup an interval for each task that has a number frequency
            if (typeof this.scheduledTasks[i].frequency() === "number" && (this.scheduledTasks[i].frequency() as number) > 1000) {
                ((depContainer, task) => {
                    setInterval(
                        async () => {
                            try {
                                await task.execute(depContainer);
                            } catch (err) {
                                this.logger.error(`Scheduled Task Error: ${err}`);
                            }
                        },
                        (task.frequency() as number) * 1000,
                    );
                })(container, this.scheduledTasks[i]);
            } else if (typeof this.scheduledTasks[i].frequency() === "string" && cron.validate(this.scheduledTasks[i].frequency() as string)) {
                // otherwise cron it if it has a valid cron schedule
                ((depContainer, task) => {
                    cron.schedule(this.scheduledTasks[i].frequency() as string, async () => {
                        try {
                            await task.execute(depContainer);
                        } catch (err) {
                            this.logger.error(`Scheduled Task Error: ${err}`);
                        }
                    });
                })(container, this.scheduledTasks[i]);
            }
        }

        this.logger.info("Done executing all LevelCrush specific task");
    }

    public async postDBLoad(container: DependencyContainer): Promise<void> {
        // run our loaders before running our patches
        for (let i = 0; i < this.loaders.length; i++) {
            await this.loaders[i].execute(container);
        }

        // run any database patches **after** our loaders
        for (let i = 0; i < this.dbPatches.length; i++) {
            await this.dbPatches[i].execute(container);
        }

        // DEPRECATED do not use this anymore
        // post db load
        // let anything that has a patch target of PreSpt run now
        let patch_types_allowed = [LevelCrushPatchTarget.PreSptLoadModAndPostDB, LevelCrushPatchTarget.PostDB];
        for (let i = 0; i < this.patches.length; i++) {
            if (patch_types_allowed.includes(this.patches[i].patch_target())) {
                this.logger.info(`Executing ${this.patches[i].patch_name()} inside PostDB`);
                this.patch_results[this.patches[i].patch_name()] = await this.patches[i].patch_run(container, this.logger, LevelCrushPatchTarget.PostDB);
                this.logger.info(`Finished ${this.patches[i].patch_name()} inside PostDB`);
            }
        }
    }
}

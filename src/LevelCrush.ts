import {DependencyContainer, inject, injectable, injectAll} from "tsyringe";
import {LevelCrushPatchTarget, ILevelCrushPatch} from "./patches/patch";
import {LevelCrushCoreConfig} from "./configs/LevelCrushCoreConfig";
import {ILogger} from "@spt/models/spt/utils/ILogger";
import {LevelCrushMultiplierConfig} from "./configs/LevelCrushMultiplierConfig";

import {ConfigServer} from "@spt/servers/ConfigServer";
import HomeScreenMessagePatch from "./patches/homescreen_message_patch";
import ProfilePatch from "./patches/profile_patch";
import PocketPatch from "./patches/pocket_patch";
import QOLMoneyPatch from "./patches/patch_qol_money";
import {LootPatch} from "./patches/loot_patch";
import ItemPatch from "./patches/patch_items";
import RecipePatch from "./patches/patch_recipes";
import RecipeLoaderPatch from "./patches/patch_recipe_loader";
import QuestPatch from "./patches/patch_quests";
import BossPatch from "./patches/patch_bosses";
import QOLNoRestrictionsPatch from "./patches/patch_qol_norestrictions";
import QOLRecipePatch from "./patches/patch_qol_recipes";
import {ScheduledTask} from "./di/ScheduledTask";
import * as cron from 'node-cron';
import {Override} from "./di/Override";


@injectable()
export class LevelCrush {
    private patches: ILevelCrushPatch[] = [];
    private patch_results: Record<string, any>;
    private logger: ILogger;

    constructor(
        @inject("LevelCrushCoreConfig") protected lcConfig: LevelCrushCoreConfig,
        @inject("LevelCrushMultiplierConfig") protected lcMultipliers: LevelCrushMultiplierConfig,
        @injectAll("LevelCrushScheduledTasks") protected scheduledTasks: ScheduledTask[],
        @injectAll("LevelCrushOverrides") protected overrides: Override[]
    ) {
        this.patch_results = {};
        this.patches = [];
    }

    public async preSptLoad(container: DependencyContainer): Promise<void> {
        // pre spt load

        this.patches = [
            new HomeScreenMessagePatch(),
            new ProfilePatch(),
            // new PocketPatch(),
            new QOLMoneyPatch(),
            new LootPatch(),
            //  new ItemPatch(),
            //  new RecipeLoaderPatch(),
            //  new RecipePatch(),
            //  new QOLRecipePatch(),
            //  new QuestPatch(),
            //  new BossPatch(),
            //new QOLNoRestrictionsPatch(),
        ];
        this.logger = container.resolve<ILogger>("WinstonLogger");

        // let anything that has a patch target of PreSpt run now
        this.logger.info(`Total Custom Patches: ${this.patches.length}`);
        let patch_types_allowed = [LevelCrushPatchTarget.PreSptLoadModAndPostDB, LevelCrushPatchTarget.PreSptLoadMod];
        for (let i = 0; i < this.patches.length; i++) {
            if (patch_types_allowed.includes(this.patches[i].patch_target())) {
                this.logger.info(`Executing ${this.patches[i].patch_name()} inside PreSpt`);
                this.patch_results[this.patches[i].patch_name()] = await this.patches[i].patch_run(
                    container,
                    this.logger,
                    LevelCrushPatchTarget.PreSptLoadMod,
                );
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
            promises.push(this.scheduledTasks[i].execute_immediate(container));

            // startup an interval for each task that has a number frequency
            if (typeof this.scheduledTasks[i].frequency() === 'number') {
                ((depContainer, task) => {
                    setInterval(async () => {
                        try {
                            await task.execute(depContainer);
                        } catch (err) {
                            this.logger.error(`Scheduled Task Error: ${err}`);
                        }
                    }, task.frequency() as number * 1000);
                })(container, this.scheduledTasks[i]);
            } else if (cron.validate(this.scheduledTasks[i].frequency() as string)) { // otherwise cron it if it has a valid cron schedule
                ((depContainer, task) => {
                    cron.schedule(this.scheduledTasks[i].frequency() as string, async () => {
                        try {
                            await task.execute(depContainer);
                        } catch (err) {
                            this.logger.error(`Scheduled Task Error: ${err}`);
                        }
                    });
                })(container, this.scheduledTasks[i]);
            } else {
                this.logger.error(`Task frequency of ${this.scheduledTasks[i].frequency()} is not usable`);
            }
        }


        this.logger.info("Done up LevelCrush specific task");
        this.logger.info("Executing all  LevelCrush specific task");

        await Promise.allSettled(promises);

        this.logger.info("Done executing all LevelCrush specific task");

    }

    public async postDBLoad(container: DependencyContainer): Promise<void> {
        // post db load
        // let anything that has a patch target of PreSpt run now
        let patch_types_allowed = [LevelCrushPatchTarget.PreSptLoadModAndPostDB, LevelCrushPatchTarget.PostDB];
        for (let i = 0; i < this.patches.length; i++) {
            if (patch_types_allowed.includes(this.patches[i].patch_target())) {
                this.logger.info(`Executing ${this.patches[i].patch_name()} inside PostDB`);
                this.patch_results[this.patches[i].patch_name()] = await this.patches[i].patch_run(
                    container,
                    this.logger,
                    LevelCrushPatchTarget.PostDB,
                );
                this.logger.info(`Finished ${this.patches[i].patch_name()} inside PostDB`);
            }
        }
    }
}

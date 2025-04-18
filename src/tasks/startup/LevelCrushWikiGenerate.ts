import { DependencyContainer, inject, injectable } from "tsyringe";
import { ScheduledTask } from "../../di/ScheduledTask";
import { LevelCrushCoreConfig } from "../../configs/LevelCrushCoreConfig";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import path from "node:path";
import fs from "node:fs";
import { ILeveLCrushWikiConfig } from "../../models/config/ILevelCrushWikiConfig";
import { QuestHelper } from "@spt/helpers/QuestHelper";
import { QuestConditionHelper } from "@spt/helpers/QuestConditionHelper";
import { ILevelCrushWikIQuest, ILevelCrushWikiQuestMap } from "../../models/wiki/ILevelCrushWikiQuest";
import { VFS } from "@spt/utils/VFS";
import { ITrader } from "@spt/models/eft/common/tables/ITrader";
import { ImageRouteService } from "@spt/services/mod/image/ImageRouteService";
import { QuestConditionType } from "../../models/enums/QuestConditionType";
import { QuestStatus } from "@spt/models/enums/QuestStatus";
import { QuestRewardType } from "@spt/models/enums/QuestRewardType";

@injectable()
export class LevelCrushWikiGenerate extends ScheduledTask {
    constructor(
        @inject("PrimaryLogger") protected logger: ILogger,
        @inject("LevelCrushCoreConfig") protected lcConfig: LevelCrushCoreConfig,
        @inject("DatabaseServer") protected databaseServer: DatabaseServer,
        @inject("QuestHelper") protected questHelper: QuestHelper,
        @inject("QuestConditionHelper") protected questConditionHelper: QuestConditionHelper,
        @inject("VFS") protected vfs: VFS,
        @inject("ImageRouteService") protected imageRouterService: ImageRouteService,
    ) {
        super();
    }

    public async execute(_container: DependencyContainer): Promise<void> {
        // this will never execute
    }

    public frequency(): number | string {
        return 0; // this task will only run at startup
    }

    private make_slug(input: string) {
        let output = input;
        output = output.replaceAll(/[\-]/g, " "); // replace all - with whitespace
        output = output.replaceAll(/\s\s{1,}/g, " "); // only allow one whitespace between each word
        output = output.trim().replaceAll(/\W/g, "-"); // replace all nonword with -
        output = output.trim().replaceAll(/-{2,}/g, "-"); //  replace excess - trails
        output = output.trim().replaceAll(/-{1,}$/g, ""); // trim - at the end of the string trials
        output = output.trim().replaceAll(/^-{1,}/g, ""); // trim - at the beginning of the string
        return output.toLowerCase();
    }

    private get_trader_path(locales: Record<string, string>, wiki_config: ILeveLCrushWikiConfig, trader_id: string) {
        // make suere trader folder is created
        const trader_name = locales[trader_id + " Nickname"] || "Unknown " + trader_id;
        const trader_path = path.join(wiki_config.output_dir, "trader", this.make_slug(trader_name));
        return trader_path;
    }

    private async output_trader(locales: Record<string, string>, wiki_config: ILeveLCrushWikiConfig, trader_id: string, trader: ITrader) {
        // make suere trader folder is created
        const trader_name = locales[trader_id + " Nickname"] || "Unknown " + trader_id;
        const trader_path = this.get_trader_path(locales, wiki_config, trader_id);
        await fs.promises.mkdir(trader_path, { recursive: true });

        const trader_quest_path = path.join(trader_path, "quests");
        const trader_quest_items = path.join(trader_path, "items");
        const trader_asset_folder = path.join(wiki_config.output_dir, "assets", "traders");
        await fs.promises.mkdir(trader_quest_path, { recursive: true });
        await fs.promises.mkdir(trader_quest_items, { recursive: true });
        await fs.promises.mkdir(trader_asset_folder, { recursive: true });

        const path_ext = path.extname(trader.base.avatar);
        const new_trader_avatar_path = path.join(trader_asset_folder, trader_id + path_ext);
        const trader_avatar_url = this.vfs.stripExtension(trader.base.avatar);

        this.logger.info(`Copying (${trader.base.avatar} | ${this.imageRouterService.getByKey(trader_avatar_url)} to ${new_trader_avatar_path}`);
        await this.vfs.copyAsync(this.imageRouterService.getByKey(trader_avatar_url), new_trader_avatar_path);

        const md = [] as string[];
        const trader_description = locales[trader_id + " Description"] || "Description";

        md.push(`---\r\ntitle: ${trader_name}\r\n---`);
        md.push(`![${trader_name}](/spt/assets/traders/${trader_id}${path_ext})\r\n`);
        md.push(`# ${trader_name}\r\n`);
        md.push(`## Description\r\n${trader_description}\r\n`);

        this.logger.info(`Creating Wiki File at: ${path.join(trader_path, "index.md")}`);
        await fs.promises.writeFile(path.join(trader_path, "index.md"), md.join("\r\n"), { encoding: "utf-8" });
    }

    private async output_quests(wiki_config: ILeveLCrushWikiConfig) {
        this.logger.info("Parsing Quest");
        const tables = this.databaseServer.getTables();
        const locales = tables.locales.global["en"];

        //const output_folder = path.join(wiki_config.output_dir, "quests");
        //this.logger.info(`Creating ${output_folder} is being created`);
        //await fs.promises.mkdir(output_folder, { recursive: true });

        const quests = this.questHelper.getQuestsFromDb();
        const wiki_quest = {} as ILevelCrushWikiQuestMap;
        const trader_quest = {} as {
            [trader_id: string]: ILevelCrushWikiQuestMap;
        };

        for (const quest of quests) {
            const quest_name = typeof locales[quest.name] !== "undefined" ? locales[quest.name] : quest.QuestName || quest._id;
            const quest_description = typeof locales[quest.description] !== "undefined" ? locales[quest.description] : "No quest description found";
            const quest_image = quest.image && quest.image.trim().length > 0 ? quest.image.trim() : "";

            const trader = typeof locales[quest.traderId] !== "undefined" ? locales[quest.traderId] : "Unknown Trader";
            if (typeof trader_quest[quest.traderId] === "undefined") {
                trader_quest[quest.traderId] = {};
            }

            // parse quest conditions
            const finish_conditions = [] as string[];
            for (const condition of quest.conditions.AvailableForFinish) {
                const locale = locales[condition.id] || "Unknown " + condition.id;
                finish_conditions.push(locale);
            }

            const rewards_success = [] as string[];
            if (quest.rewards.Success) {
                for (const reward of quest.rewards.Success) {
                    switch (reward.type) {
                        case QuestRewardType.EXPERIENCE:
                            rewards_success.push(`\`${Math.ceil(parseFloat(reward.value as string)).toLocaleString("en")}\` XP`);
                            break;
                        case QuestRewardType.ITEM:
                            for (const item of reward.items) {
                                const is_stacked = item.upd && item.upd.StackObjectsCount > 1;
                                let qty = is_stacked ? item.upd.StackObjectsCount : 1;
                                var item_tpl = item._tpl;
                                const is_child = item.parentId === undefined ? false : true;
                                if (!is_child) {
                                    rewards_success.push(`\`${locales[item_tpl + " Name"]}\` x ${qty.toLocaleString("en")}`);
                                }
                            }
                            break;
                        case QuestRewardType.TRADER_STANDING:
                            var target_trader = reward.target;
                            var target_trader_name = locales[target_trader + " Nickname"] || "Unknown " + target_trader;
                            rewards_success.push(`Trader standing with ${target_trader_name} modified by ${reward.value}`);
                            break;
                        case QuestRewardType.ASSORTMENT_UNLOCK:
                            var target_tpl = reward.target;
                            var target_item = reward.items.find((v) => v._id === target_tpl);
                            if (target_item !== undefined) {
                                var item_tpl = target_item._tpl;
                                var target_trader = reward.traderId;
                                var target_trader_name = locales[target_trader + " Nickname"] || "Unknown " + target_trader;
                                var item_name = locales[item_tpl + " Name"];
                                rewards_success.push(`Unlocks purchase of \`${item_name}\` at \`LL${reward.loyaltyLevel}\` \`${target_trader_name}\``);
                            }
                            break;
                        default:
                            rewards_success.push(`Unknown reward \`${reward.id}\` | \`${reward.type}\` | \`${reward.value}\``);
                            break;
                    }
                }
            }

            // parse quest conditions
            const start_conditions = [] as string[];
            for (const condition of quest.conditions.AvailableForStart) {
                switch (condition.conditionType) {
                    case QuestConditionType.TraderLoyalty:
                        var target_trader = condition.target;
                        var target_trader_name = locales[target_trader + " Nickname"] || "Unknown " + target_trader;
                        start_conditions.push(`${target_trader_name} loyalty must be ${condition.compareMethod}  LL${condition.value}`);
                        break;
                    case QuestConditionType.TraderStanding:
                        var target_trader = condition.target;
                        var target_trader_name = locales[target_trader + " Nickname"] || "Unknown " + target_trader;
                        start_conditions.push(`${target_trader_name} standing must be ${condition.compareMethod}  ${condition.value}`);
                        break;
                    case QuestConditionType.Level:
                        start_conditions.push(`Level must be ${condition.compareMethod} ${condition.value}`);
                        break;
                    case QuestConditionType.Quest:
                        const target_quest_id = condition.target;
                        const target_quest = this.questHelper.getQuestFromDb(target_quest_id as string, undefined);
                        const quest_name = locales[target_quest_id + " name"] || target_quest.QuestName;
                        /*
                            Locked = 0,
                            AvailableForStart = 1,
                            Started = 2,
                            AvailableForFinish = 3,
                            Success = 4,
                            Fail = 5,
                            FailRestartable = 6,
                            MarkedAsFailed = 7,
                            Expired = 8,
                            AvailableAfter = 9
                        */

                        const accepted_states = [] as string[];
                        for (const state of condition.status) {
                            switch (state) {
                                case QuestStatus.Locked:
                                    accepted_states.push("`Locked`");
                                    break;
                                case QuestStatus.AvailableForStart:
                                    accepted_states.push("`Ready to Start`");
                                    break;
                                case QuestStatus.Started:
                                    accepted_states.push("`Started`");
                                    break;
                                case QuestStatus.AvailableForFinish:
                                    accepted_states.push("`Can Turn In`");
                                    break;
                                case QuestStatus.Success:
                                    accepted_states.push("`Completed`");
                                    break;
                                case QuestStatus.Fail:
                                    accepted_states.push("`Failed`");
                                    break;
                                case QuestStatus.FailRestartable:
                                    accepted_states.push("`Failed, but can restart`");
                                    break;
                                case QuestStatus.MarkedAsFailed:
                                    accepted_states.push("`Marked as Failed`");
                                    break;
                                case QuestStatus.Expired:
                                    accepted_states.push("`Expired`");
                                    break;
                                case QuestStatus.AvailableAfter:
                                    accepted_states.push("`Available After`");
                                    break;
                            }
                        }
                        start_conditions.push(`Quest \`${quest_name}\` must be in one of the following states: ${accepted_states.join(" or ")}`);
                        break;
                    default:
                        const locale = locales[condition.id] || "Unknown " + condition.id;
                        start_conditions.push(locale);
                        break;
                }
            }

            const wq = {
                id: quest._id,
                title: quest_name,
                slug: this.make_slug(quest_name),
                description: quest_description,
                leads_to: [],
                conditions_start: start_conditions,
                conditions_complete: finish_conditions,
                rewards: rewards_success,
                tags: [],
                locales: [],
                trader: trader,
                image: quest_image,
            } as ILevelCrushWikIQuest;

            wiki_quest[quest._id] = JSON.parse(JSON.stringify(wq)); // clone and store
            trader_quest[quest.traderId][quest._id] = JSON.parse(JSON.stringify(wq)); // clone and store
        }

        for (const quest_id in wiki_quest) {
            const quest = wiki_quest[quest_id];

            const md = [] as string[];

            let quest_image_path = "";
            let did_copy_quest_image = false;
            if (quest.image) {
                const quest_image_folder = path.join(wiki_config.output_dir, "assets", "quests");
                await fs.promises.mkdir(quest_image_folder, { recursive: true });

                const path_ext = path.extname(quest.image);
                quest_image_path = path.join(quest_image_folder, quest.id + path_ext);
                const quest_image_path_url = this.vfs.stripExtension(quest.image);

                const quest_img_src = this.imageRouterService.getByKey(quest_image_path_url);
                if (quest_img_src && (await this.vfs.existsAsync(quest_img_src))) {
                    this.logger.info(`Copying ${quest.image} | ${quest_img_src} to ${quest_image_path}`);
                    await this.vfs.copyAsync(quest_img_src, quest_image_path);
                    did_copy_quest_image = true;
                }
            }

            md.push(`---\r\ntitle: ${quest.title}\r\n---`);

            if (did_copy_quest_image) {
                const ext = path.extname(quest_image_path);
                md.push(`![${quest.title}](/spt/assets/quests/${quest.id}${ext})`);
            }

            md.push(`# ${quest.title}\r\n`);
            md.push(`## Description\r\n${quest.description}`);

            let counter = 0;
            if (quest.conditions_start.length > 0) {
                counter = 0;
                md.push(`## Starting Conditions`);
                for (const condition_start of quest.conditions_start) {
                    md.push(`${++counter}. ${condition_start}`);
                }
            }

            if (quest.conditions_complete.length > 0) {
                counter = 0;
                md.push(`## Objectives`);
                for (const condition_finish of quest.conditions_complete) {
                    md.push(`${++counter}. ${condition_finish}`);
                }
            }

            if (quest.rewards.length > 0) {
                counter = 0;
                md.push(`## Rewards`);
                for (const reward of quest.rewards) {
                    md.push(`${++counter}. ${reward}`);
                }
            }

            //const file_path = path.join(output_folder, quest.slug + ".md");
            //this.logger.info(`Creating Wiki File at: ${file_path}`);
            //await fs.promises.writeFile(file_path, md.join("\r\n"), { encoding: "utf-8" });

            // now loop through each trader and see if we have a match for this quest
            // not efficient. But works
            for (const trader_id in trader_quest) {
                const has_quest = typeof trader_quest[trader_id][quest_id] !== "undefined";
                if (has_quest) {
                    // make suere trader folder is created
                    const trader_path = this.get_trader_path(locales, wiki_config, trader_id);
                    const trader_quest_path = path.join(trader_path, "quests");
                    await fs.promises.mkdir(trader_quest_path, { recursive: true });

                    const trader_quest_file_path = path.join(trader_quest_path, quest.slug + ".md");
                    this.logger.info(`Creating Wiki File at: ${trader_quest_file_path}`);
                    await fs.promises.writeFile(trader_quest_file_path, md.join("\r\n"), { encoding: "utf-8" });
                }
            }
        }
    }

    private async output_items(wiki_config: ILeveLCrushWikiConfig) {
        this.logger.info("Parsing items");
        const output_folder = path.join(wiki_config.output_dir, "items");

        this.logger.info(`Creating ${output_folder} is being created`);
        await fs.promises.mkdir(output_folder, { recursive: true });
    }

    public async execute_immediate(_: DependencyContainer): Promise<void> {
        if (!this.lcConfig.isDev()) {
            this.logger.info("Dev mode is not enabled. Not generating Wiki documentation");
            return;
        }

        this.logger.info("Getting Wiki configuration");
        const wiki_path = path.join(this.lcConfig.getModPath(), "config", "wiki.json");
        const wiki_config = fs.existsSync(wiki_path)
            ? (JSON.parse(await fs.promises.readFile(wiki_path, { encoding: "utf-8" })) as ILeveLCrushWikiConfig)
            : ({
                  output_dir: "",
              } as ILeveLCrushWikiConfig);

        const promises = [];

        // traders are a must to output each time no matter what
        // output traders
        const tables = this.databaseServer.getTables();
        const traders = tables.traders;
        const locales = tables.locales.global["en"];
        const trader_promises = [];
        for (const trader_id in traders) {
            trader_promises.push(this.output_trader(locales, wiki_config, trader_id, traders[trader_id]));
        }
        await Promise.allSettled(trader_promises);

        promises.push(this.output_quests(wiki_config));
        promises.push(this.output_items(wiki_config));

        await Promise.allSettled(promises);

        this.logger.info("Done generating wiki documentation");
    }
}

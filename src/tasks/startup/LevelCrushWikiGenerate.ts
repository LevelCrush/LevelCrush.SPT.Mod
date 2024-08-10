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

@injectable()
export class LevelCrushWikiGenerate extends ScheduledTask {
    constructor(
        @inject("PrimaryLogger") protected logger: ILogger,
        @inject("LevelCrushCoreConfig") protected lcConfig: LevelCrushCoreConfig,
        @inject("DatabaseServer") protected databaseServer: DatabaseServer,
        @inject("QuestHelper") protected questHelper: QuestHelper,
        @inject("QuestConditionHelper") protected questConditionHelper: QuestConditionHelper,
        @inject("VFS") protected vfs: VFS,
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

        await fs.promises.mkdir(trader_quest_path, { recursive: true });
        await fs.promises.mkdir(trader_quest_items, { recursive: true });

        const md = [] as string[];

        const trader_description = locales[trader_id + " Description"] || "Description";

        md.push(`# ${trader_name}\r\n`);
        md.push(`## Description\r\n${trader_description}\r\n`);

        this.logger.info(`Creating Wiki File at: ${path.join(trader_path, "index.md")}`);
        await fs.promises.writeFile(path.join(trader_path, "index.md"), md.join("\r\n"), { encoding: "utf-8" });
    }

    private async output_quests(wiki_config: ILeveLCrushWikiConfig) {
        this.logger.info("Parsing Quest");
        const tables = this.databaseServer.getTables();
        const locales = tables.locales.global["en"];

        const output_folder = path.join(wiki_config.output_dir, "quests");
        this.logger.info(`Creating ${output_folder} is being created`);
        await fs.promises.mkdir(output_folder, { recursive: true });

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

            const wq = {
                id: quest._id,
                title: quest_name,
                slug: this.make_slug(quest_name),
                description: quest_description,
                leads_to: [],
                conditions: [],
                rewards: [],
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
            md.push(`# ${quest.title}\r\n`);
            md.push(`## Description\r\n${quest.description}`);

            const file_path = path.join(output_folder, quest.slug + ".md");
            this.logger.info(`Creating Wiki File at: ${file_path}`);
            await fs.promises.writeFile(file_path, md.join("\r\n"), { encoding: "utf-8" });

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

        if (wiki_config.quests) {
            promises.push(this.output_quests(wiki_config));
        }

        if (wiki_config.items) {
            promises.push(this.output_items(wiki_config));
        }

        await Promise.allSettled(promises);

        this.logger.info("Done generating wiki documentation");
    }
}

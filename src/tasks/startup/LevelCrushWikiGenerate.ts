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
import { ILevelCrushWikiQuestMap } from "../../models/wiki/ILevelCrushWikiQuest";
import { VFS } from "@spt/utils/VFS";

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

    private async output_quests(wiki_config: ILeveLCrushWikiConfig) {
        this.logger.info("Parsing Quest");
        const tables = this.databaseServer.getTables();
        const locales = tables.locales.global["en"];

        const output_folder = path.join(wiki_config.output_dir, "quests");

        const quests = this.questHelper.getQuestsFromDb();
        const wiki_quest = {} as ILevelCrushWikiQuestMap;
        for (const quest of quests) {
            const quest_name = typeof locales[quest.name] !== "undefined" ? locales[quest.name] : quest.QuestName || quest._id;
            const quest_description = typeof locales[quest.description] !== "undefined" ? locales[quest.description] : "No quest description found";
            const quest_image = quest.image && quest.image.trim().length > 0 ? quest.image.trim() : "";

            wiki_quest[quest._id] = {
                id: quest._id,
                title: quest_name,
                slug: this.make_slug(quest_name),
                description: quest_description,
                leads_to: [],
                conditions: [],
                rewards: [],
                tags: [],
                locales: [],
                trader: "",
                image: quest_image,
            };
        }

        for (const quest_id in wiki_quest) {
            const quest = wiki_quest[quest_id];

            const md = [] as string[];

            md.push(`#${quest.title}\r\n`);
            md.push(`##Description\r\n${quest.description}`);

            const file_path = path.join(output_folder, quest.slug + ".md");
            this.logger.info(`Creating Wiki File at: ${file_path}`);
            await fs.promises.writeFile(file_path, md.join("\r\n"));
        }

        this.logger.info(`Creating ${output_folder} is being created`);
        await fs.promises.mkdir(output_folder, { recursive: true });
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

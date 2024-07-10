import {ILevelCrushPatch, LevelCrushPatchTarget} from "./patch";
import {DependencyContainer} from "tsyringe";
import {ILogger} from "@spt/models/spt/utils/ILogger";
import {DatabaseServer} from "@spt/servers/DatabaseServer";
import path from "path";
import fs from "fs";
import * as utils from "../utils";
import {ITemplateItem} from "@spt/models/eft/common/tables/ITemplateItem";
import {LevelCrushCoreConfig} from "../configs/LevelCrushCoreConfig";
import {LevelCrushMultiplierConfig} from "../configs/LevelCrushMultiplierConfig";

export class ItemPatch implements ILevelCrushPatch {
    public patch_name(): string {
        return "ItemPatch";
    }

    public patch_target(): LevelCrushPatchTarget {
        return LevelCrushPatchTarget.PostDB;
    }

    public async patch_run(container: DependencyContainer, logger: ILogger): Promise<void> {
        const database = container.resolve<DatabaseServer>("DatabaseServer");
        const tables = database.getTables();
        const lcConfig = container.resolve<LevelCrushCoreConfig>("LevelCrushCoreConfig");

        // scan
        const files = await fs.promises.readdir(path.join(lcConfig.getModPath(), "db", "items"));
        for (const entry of files) {
            const filepath = path.join(lcConfig.getModPath(), "db", "items", entry);
            logger.info(`Found Item Patch at: ${filepath}`);
            const is_json = entry.endsWith(".json");
            if (is_json) {
                logger.info(`Scanning Item Patch at: ${filepath}`);
                const raw = await fs.promises.readFile(filepath, {encoding: "utf-8"});
                const templates = JSON.parse(raw) as Record<string, Partial<ITemplateItem>>[];
                for (const template_id in templates) {
                    const template = templates[template_id];
                    logger.info(`Checking for item template ${template_id}`);
                    if (typeof tables.templates.items[template_id] === "undefined") {
                        // skip
                        continue;
                    }

                    logger.info(`Patching item ${template_id}`);
                    utils.merge_objs(tables.templates.items[template_id], template);
                }
            }
        }
    }
}

export default ItemPatch;

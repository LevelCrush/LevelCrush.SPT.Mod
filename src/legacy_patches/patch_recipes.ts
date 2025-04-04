import { ILevelCrushPatch, LevelCrushPatchTarget } from "./patch";
import { DependencyContainer } from "tsyringe";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import path from "path";
import fs from "fs";
import * as utils from "../utils";
import { ITemplateItem } from "@spt/models/eft/common/tables/ITemplateItem";
import { IHideoutProduction } from "@spt/models/eft/hideout/IHideoutProduction";
import { LevelCrushCoreConfig } from "../configs/LevelCrushCoreConfig";
import { LevelCrushMultiplierConfig } from "../configs/LevelCrushMultiplierConfig";

export class RecipePatch implements ILevelCrushPatch {
    public patch_name(): string {
        return "RecipePatch";
    }

    public patch_target(): LevelCrushPatchTarget {
        return LevelCrushPatchTarget.PostDB;
    }

    public async patch_run(container: DependencyContainer, logger: ILogger): Promise<void> {
        const database = container.resolve<DatabaseServer>("DatabaseServer");
        const tables = database.getTables();
        const lcConfig = container.resolve<LevelCrushCoreConfig>("LevelCrushCoreConfig");

        const recipes_to_override = {} as {
            [id: string]: Partial<IHideoutProduction>;
        };
        if (tables.hideout && tables.hideout.production) {
            // scan for recipes
            const db_path = path.join(lcConfig.getModPath(), "db", "recipes", "current");
            const entries = await fs.promises.readdir(db_path, { encoding: "utf-8" });
            for (const entry of entries) {
                const file_path = path.join(db_path, entry);
                const stat = await fs.promises.stat(file_path);
                if (stat.isFile()) {
                    try {
                        const raw = await fs.promises.readFile(file_path, { encoding: "utf-8" });
                        const json = JSON.parse(raw) as Partial<IHideoutProduction>[];
                        for (const production of json) {
                            if (production._id) {
                                recipes_to_override[production._id] = production;
                            }
                        }
                    } catch {
                        logger.error(`Failed to parse: ${file_path}`);
                    }
                }
            }

            // now patch
            for (const production_id in recipes_to_override) {
                for (let i = 0; i < tables.hideout.production.length; i++) {
                    const production_id = tables.hideout.production[i]._id;
                    if (typeof recipes_to_override[production_id] !== "undefined") {
                        /// production recipes are only have 1 depth. So we can just spread safely to overwrite anything twith the new production
                        tables.hideout.production[i] = {
                            ...tables.hideout.production[i],
                            ...recipes_to_override[production_id],
                        };
                    }
                }
            }
        }
    }
}

export default RecipePatch;

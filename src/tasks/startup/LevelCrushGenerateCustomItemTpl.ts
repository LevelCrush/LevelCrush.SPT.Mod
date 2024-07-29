import { DependencyContainer, inject, injectable } from "tsyringe";
import { ScheduledTask } from "../../di/ScheduledTask";
import { LevelCrushCoreConfig } from "../../configs/LevelCrushCoreConfig";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import path from "node:path";
import fs from "node:fs";

@injectable()
export class LevelCrushGenerateCustomItemTpl extends ScheduledTask {
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

    public async execute_immediate(container: DependencyContainer): Promise<void> {
        this.logger.info("Generating and updating enum information based off custom items loaded");

        this.logger.info("Loading base items");
        const base = require("../../../../../../SPT_Data/Server/database/templates/items.json");
        this.logger.info("Done loading base items");

        const tables = this.databaseServer.getTables();
        const items = tables.templates.items;
        const locales = tables.locales.global["en"];

        const do_scan = true;

        if (do_scan) {
            // for now this will always be true

            // build table
            this.logger.info("Starting to scan database for modded items");
            const enum_names = [];
            const taken = {};
            for (const tpl in items) {
                if (typeof base[tpl] === "undefined") {
                    // only process non base items
                    let prop_name: string = locales[tpl + " Name"] || items[tpl]._props.Name || items[tpl]._name;
                    const prop_name_c1 = prop_name.charAt(0);
                    // some javascript black magic to check if the first character is in the range of ASCII characters.
                    if ((prop_name_c1 >= "0" && prop_name_c1 <= "9") || prop_name_c1 === ".") {
                        prop_name = "Item_" + prop_name;
                    }

                    const spaced_name = (prop_name as string)
                        .replaceAll("-", " ")
                        .replaceAll("<b>", "")
                        .replaceAll("</b>", "")
                        .replaceAll(/\W+/g, "")
                        .replaceAll(".", "")
                        .replaceAll(/color(?:[0-9a-zAZ]){6}(.*)color/gi, "$1");

                    const spaced_name_split = spaced_name.split(" ");
                    const normalized_name = [] as string[];
                    for (const word of spaced_name_split) {
                        normalized_name.push(word.charAt(0).toUpperCase() + word.slice(1));
                    }

                    // if there are duplicates with the name...just append the tpl
                    // better then nothing.
                    let flatten = normalized_name.join("");
                    if (typeof taken[flatten] !== "undefined") {
                        flatten = flatten + "_" + tpl;
                    }

                    taken[flatten] = tpl;
                    //   this.logger.info(`Name: ${prop_name}, ${flatten} | ${locales[tpl + " Name"]}`);
                    enum_names.push(`${flatten} = "${tpl}",`);
                }
            }
            const enum_string = `export enum CustomItemTpl {
    ${enum_names.join("\r\n    ")}
}`;

            const mod_path = this.lcConfig.getModPath();
            const src_path = path.join(mod_path, "src", "models", "enums", "CustomItemTpl.ts");

            this.logger.info(`Writing to: ${src_path} and updating`);
            await fs.promises.writeFile(src_path, enum_string, { encoding: "utf-8" });

            // this.logger.info(enum_string);
        }

        this.logger.info("Done generating custom item tpls");
    }
}

import { ILevelCrushPatch, LevelCrushPatchTarget } from "./patch";
import { DependencyContainer } from "tsyringe";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";

export class PocketPatch implements ILevelCrushPatch {
    public patch_name(): string {
        return "PocketPatch";
    }

    public patch_target(): LevelCrushPatchTarget {
        return LevelCrushPatchTarget.PostDB;
    }

    /**
     * Run whatever our patch needs to do
     * @param lcConfig
     * @param container
     * @param logger
     */
    public async patch_run(container: DependencyContainer, logger: ILogger) {
        // Run patch logic here

        const database = container.resolve<DatabaseServer>("DatabaseServer");
        const tables = database.getTables();

        logger.info("Adjusting pockets");
        // const pocket_tpl = "627a4e6b255f7527fb05a0f8";
        const pocket_tpl = "627a4e6b255f7527fb05a0f6";
        const pocket_height = 2;
        const pocket_width = 1;
        // tpl 627a4e6b255f7527fb05a0f8

        if (tables.templates.items[pocket_tpl]._props.Grids) {
            const supported_grids = ["pocket1", "pocket2", "pocket3", "pocket4"];
            for (let i = 0; i < tables.templates.items[pocket_tpl]._props.Grids.length; i++) {
                const grid = tables.templates.items[pocket_tpl]._props.Grids[i];
                if (supported_grids.includes(grid._name)) {
                    tables.templates.items[pocket_tpl]._props.Grids[i]._props.cellsV = pocket_height;
                    tables.templates.items[pocket_tpl]._props.Grids[i]._props.cellsH = pocket_width;

                    logger.info(`Modifying pocket: ${grid._name} to support ${pocket_width} x ${pocket_height}`);
                }
            }
        }

        return true;
    }
}

export default PocketPatch;

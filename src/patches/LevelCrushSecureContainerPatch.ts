import { BaseClasses } from "@spt/models/enums/BaseClasses";
import { ItemTpl } from "@spt/models/enums/ItemTpl";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { DependencyContainer, inject, injectable } from "tsyringe";
import { DatabasePatch } from "../di/DatabasePatch";
import { CustomItemTpl } from "../models/enums/CustomItemTpl";

@injectable()
export class LevelCrushSecureContainerPatch extends DatabasePatch {
    constructor(
        @inject("PrimaryLogger") protected logger: ILogger,
        @inject("DatabaseServer") protected databaseServer: DatabaseServer,
    ) {
        super();
    }

    public fix_container(tables: IDatabaseTables, tpl: string) {
        this.logger.info(`Patching ${tpl} oto not have a discarding block and to be able to removed in raid`);
        tables.templates.items[tpl]._props.DiscardingBlock = false;
        tables.templates.items[tpl]._props.CantRemoveFromSlotsDuringRaid = [];
    }

    public async execute(_: DependencyContainer): Promise<void> {
        this.logger.info("Patching Secure Containers");

        const tables = this.databaseServer.getTables();

        const targets = [
            CustomItemTpl.OmnicronSecureContainer,
            ItemTpl.SECURE_CONTAINER_ALPHA,
            ItemTpl.SECURE_CONTAINER_BETA,
            ItemTpl.SECURE_CONTAINER_GAMMA,
            ItemTpl.SECURE_CONTAINER_GAMMA_TUE,
            ItemTpl.SECURE_CONTAINER_EPSILON,
            ItemTpl.SECURE_CONTAINER_BOSS,
            ItemTpl.SECURE_THETA_SECURE_CONTAINER,
            ItemTpl.SECURE_TOURNAMENT_SECURED_CONTAINER,
        ];

        for (const target of targets) {
            this.fix_container(tables, target);
        }

        this.logger.info("removing exclusions");
        if (false) {
            for (const item_id in tables.templates.items) {
                if (tables.templates.items[item_id]._props.Grids) {
                    for (let i = 0; i < tables.templates.items[item_id]._props.Grids.length; i++) {
                        if (tables.templates.items[item_id]._props.Grids[i]._props.filters) {
                            for (let j = 0; j < tables.templates.items[item_id]._props.Grids[i]._props.filters.length; j++) {
                                tables.templates.items[item_id]._props.Grids[i]._props.filters[j].Filter.push(BaseClasses.MOB_CONTAINER);
                                tables.templates.items[item_id]._props.Grids[i]._props.filters[j].ExcludedFilter = [];
                            }
                        }
                    }
                }
            }
        }

        this.logger.info("Done Patching Secure Containers");
    }
}

import { injectable, inject, DependencyContainer } from "tsyringe";
import { Loader } from "../di/Loader";
import { LevelCrushItemBuilder } from "../builders/LevelCrushItemBuilder";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { VFS } from "@spt/utils/VFS";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { LevelCrushLocaleBuilder } from "../builders/LevelCrushLocaleBuilder";
import { LevelCrushBuffBuilder } from "../builders/LevelCrushBuffBuilder";

@injectable()
export class LevelCrushItemLoader extends Loader {
    constructor(
        @inject("LevelCrushItemBuilder") protected itemBuilder: LevelCrushItemBuilder,
        @inject("LevelCrushLocaleBuilder") protected localeBuilder: LevelCrushLocaleBuilder,
        @inject("LevelCrushBuffBuilder") protected buffBuilder: LevelCrushBuffBuilder,
        @inject("PrimaryLogger") protected logger: ILogger,
        @inject("DatabaseServer") protected databaseServer: DatabaseServer,
        @inject("VFS") protected vfs: VFS,
    ) {
        super();
    }

    private createOmnicron(tables: IDatabaseTables) {
        const omnicron_tpl = "66a0a1de6a3a9d80d65db3a9";
        const omnicron_grid_id = "66a0a3270b9f578fdfd57b55";

        // create buffs first
        this.buffBuilder
            .start("BUFFS_Omnicron")
            .add({
                AbsoluteValue: false,
                BuffType: "WeightLimit",
                Chance: 1,
                Delay: 1,
                Duration: 31536000,
                SkillName: "",
                Value: 10.0,
            })
            .add({
                AbsoluteValue: true,
                BuffType: "Antidote",
                Chance: 1,
                Delay: 1,
                Duration: 31536000,
                SkillName: "",
                Value: 0,
            })
            .add({
                AbsoluteValue: true,
                BuffType: "HealthRate",
                Chance: 1,
                Delay: 1,
                Duration: 31536000,
                SkillName: "",
                Value: 1,
            });

        // insert into our database tables
        this.itemBuilder
            .clone("664a55d84a90fc2c8a6305c9", omnicron_tpl)
            .name("Omnicron_Container")
            .prop("Name", "Omnicron Secure Container")
            .prop("ShortName", "Omnicron")
            .prop("Description", "Can survive a nuke...some say it also has other worldly powers")
            .prop("Weight", 0.0)
            .prop("Width", 2)
            .prop("Height", 2)
            .prop("sizeWidth", 2)
            .prop("sizeHeight", 2)
            .prop("isSecured", true)
            .prop("GridLayoutName", "Omnicron")
            .prop("CanSellOnRagfair", true)
            .prop("Grids", [
                {
                    _name: "main",
                    _id: omnicron_grid_id,
                    _parent: omnicron_tpl,
                    _props: {
                        filters: [],
                        cellsH: 6,
                        cellsV: 6,
                        minCount: 0,
                        maxCount: 0,
                        maxWeight: 0,
                        isSortingTable: false,
                    },
                    _proto: "55d329c24bdc2d892f8b4567", // idk all the other secure containers have this
                },
            ])
            .output_to_table(tables);

        this.localeBuilder.start("item", tables.templates.items[omnicron_tpl]).auto().output_to_table(tables);
    }

    public async execute(container: DependencyContainer) {
        const tables = this.databaseServer.getTables();

        this.createOmnicron(tables);

        this.logger.logWithColor("Done loading all levelcrush items", LogTextColor.MAGENTA);
    }
}

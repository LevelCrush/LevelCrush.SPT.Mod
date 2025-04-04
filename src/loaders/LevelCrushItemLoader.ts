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
import { CustomItemTpl } from "../models/enums/CustomItemTpl";
import { ItemTpl } from "@spt/models/enums/ItemTpl";

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
        //const omnicron_tpl = CustomItemTpl.Omnicron;

        const omnicron_grid_id = "66a0a3270b9f578fdfd57b55";
        const omnicron_buff = "BUFFS_Omnicron";

        // create buffs first
        this.buffBuilder
            .start(omnicron_buff)
            .add({
                // increase weight limit x10
                AbsoluteValue: false,
                BuffType: "WeightLimit",
                Chance: 1,
                Delay: 1,
                Duration: 31536000,
                SkillName: "",
                Value: 2.0,
            })
            .add({
                // fuck toxin
                AbsoluteValue: true,
                BuffType: "Antidote",
                Chance: 1,
                Delay: 1,
                Duration: 31536000,
                SkillName: "",
                Value: 0,
            })
            .add({
                // kinda like a propital
                AbsoluteValue: true,
                BuffType: "HealthRate",
                Chance: 1,
                Delay: 1,
                Duration: 31536000,
                SkillName: "",
                Value: 3, // in betwen a propital ( value of 1, and a etg, value of 6 )
            })
            .add({
                AbsoluteValue: true,
                BuffType: "RemoveAllBloodLosses",
                Chance: 1,
                Delay: 0,
                Duration: 300,
                SkillName: "",
                Value: 0,
            })
            .add({
                // sj6
                AbsoluteValue: true,
                BuffType: "MaxStamina",
                Chance: 1,
                Delay: 1,
                Duration: 31536000,
                SkillName: "",
                Value: 30,
            })
            .add({
                // sj6
                AbsoluteValue: true,
                BuffType: "StaminaRate",
                Chance: 1,
                Delay: 1,
                Duration: 31536000,
                SkillName: "",
                Value: 2,
            })
            .output_to_tables(tables);

        // insert into our database tables
        this.itemBuilder
            .clone(ItemTpl.SECURE_THETA_SECURE_CONTAINER, omnicron_tpl)
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
            .prop("StimulatorBuffs", omnicron_buff)
            .prop("medEffectType", "duringUse")
            .prop("MaxHpResource", 10)
            .prop("hpResourceRate", 0)
            .prop("effects_health", {
                Energy: {
                    value: 100,
                },
                Hydration: {
                    value: 100,
                },
            })
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
